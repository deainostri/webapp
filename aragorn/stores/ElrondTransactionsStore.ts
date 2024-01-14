// state
import { RootStore } from "@/state/RootStore";

// utils
import moment from "moment";
import storage from "@/utils/storage";
import { makeAutoObservable, reaction } from "mobx";
import ElrondStore from "./ElrondStore";
import { request } from "@/utils";
import TransactionsPendingStore from "./TransactionsPendingStore";
import cuid from "cuid";
import logger from "@/utils/logger";
import EventEmitter from "events";

import {
  Address,
  TransactionPayload,
  Transaction,
  TransactionWatcher,
} from "@elrondnetwork/erdjs/out";
import {
  AccountOnNetwork,
  TransactionOnNetwork,
} from "@elrondnetwork/erdjs-network-providers/out";
import { WalletProvider } from "@elrondnetwork/erdjs-web-wallet-provider/out";
import { Signature } from "@/utils/Signature";
import { ExtensionProvider } from "@elrondnetwork/erdjs-extension-provider";
import { WalletConnectProvider } from "@elrondnetwork/erdjs-wallet-connect-provider";

interface GetLatestTransactionsType {
  apiAddress?: string;
  address: string;
  contractAddress: string;
  timeout?: number;
  page?: number;
  url?: string;
}

interface CreateTransactionConfig {
  sender: AccountOnNetwork;
  receiver: string | Address;
  value: number;
  data: any;
  gasLimit: any;
}

export type SavedTransactionData = {
  hash: string;
  status: string;
  unresolved: boolean | string;

  data?: undefined | string[];
  message?: undefined | string;
  tx_on_network?: undefined | TransactionOnNetwork;
};

/**
 * saved - set/map of transactions (show them ordered by date)
 *
 * onTransactionSend: [
 *    1. add transaction hash in `saved`
 *    2. update session cache
 *    3. start depender to update the status of the transaction
 * ]
 *
 * onTransactionUpdate: [
 *   1. set transaction in `saved`
 *   2. update session cache
 * ]
 *
 * onInit: [
 *   1. set transactions in `saved`
 *   2. start depender to update the status of the transactions
 * ]
 *
 */

export default class ElrondTransactionsStore {
  //

  store: RootStore;
  parent: ElrondStore;
  depender: TransactionsPendingStore;
  events: EventEmitter;

  saved_transactions = new Map();

  constructor(store: RootStore, parent: ElrondStore) {
    this.store = store;
    this.parent = parent;
    this.events = new EventEmitter();
    this.depender = new TransactionsPendingStore(this);

    makeAutoObservable(this);

    reaction(() => this.savedTransactionsArr, this.onSavedTransactionsChange);
  }

  // -----------------------
  // init
  // -----------------------

  init = () => {
    // xxx
    this.load_from_storage();

    // when
    this.store.elrond.onReady(this._pickup_signed_transactions_from_query);

    // set listeners
    this.set_listeners();

    // const query = Object.fromEntries(
    //     new URLSearchParams(window.location.search)
    // );
    // if (query.txHash) {
    //     this.setSavedTransaction(query.txHash, {
    //         hash: query.txHash,
    //         unresolved: true,
    //     });

    //     this.save_to_storage();
    // }
  };

  set_listeners = () => {
    this.events.on("transaction_start_update", this.onTransactionStartUpdate);

    this.events.on("transaction_update", this.onTransactionUpdate);

    this.events.on("not_logged_in", this.onNotLoggedInError);

    this.events.on("transaction_sent", this.onTransactionSent);
  };

  // -----------------------
  // listeners
  // -----------------------

  onSavedTransactionsChange = async () => {
    const txs = this.savedTransactionsArr.slice();
    // console.log("gogo", txs);

    await Promise.all(txs.map((tx) => this.process_transaction(tx)));

    this.save_to_storage();
  };

  onTransactionStartUpdate = (tx: SavedTransactionData) => {
    console.log(`salut`);
    this.store.toasts.showPermanent({
      id: tx.hash,
      type: "info",
      data: {
        isTransaction: true,
      },
      message: "Pending transaction...",
    });
  };

  onTransactionUpdate = (tx: SavedTransactionData) => {
    //
    const txOnNetwork = tx.tx_on_network;

    if (!txOnNetwork) {
      return;
    }

    if (txOnNetwork.status.isFailed()) {
      this.store.toasts.show({
        id: tx.hash,
        type: "error",
        message: tx.message || "Transaction failed!",
        data: { isTransaction: true, txHash: tx.hash },
      });

      this.events.emit("transaction_failed", tx);
    } else if (txOnNetwork.status.isSuccessful()) {
      this.store.toasts.show({
        id: tx.hash,
        type: "success",
        message: tx.message || "Transaction succesful!",
        data: { isTransaction: true, txHash: tx.hash },
      });

      this.events.emit("transaction_success", tx);
    }

    // update balance
    this.store.elrond.fetchAccount();
  };

  onTransactionSent = () => {
    setTimeout(() => this.store.elrond.fetchAccount(), 1000);
  };

  onNotLoggedInError = () => {
    this.store.toasts.show({
      id: `not-logged-in`,
      type: "error",
      message: "Wallet-ul tau nu este conectat.",
      data: {},
    });
  };

  // -----------------------
  // local storage communication
  // -----------------------

  load_from_storage = () => {
    // clear current saved transactions
    this.saved_transactions.clear();

    // get saved transactions from local storage
    const transactions: SavedTransactionData[] =
      storage.local.getItem("sentTransactions");

    // quit if no transactions found
    if (!transactions) {
      return;
    }

    for (const txData of transactions) {
      this.setSavedTransaction(txData.hash, txData);
    }
  };

  save_to_storage = () => {
    const transactions = Array.from(this.saved_transactions.values()).slice();

    for (let index in transactions) {
      transactions[index] = {
        ...transactions[index],
        tx_on_network: undefined,
      };
    }

    storage.local.setItem({
      key: "sentTransactions",
      data: transactions,
      expires: moment().add(7, "day").unix(),
    });
  };

  // -----------------------
  // saved transactions manipulation methods
  // -----------------------

  get savedTransactionsArr() {
    return Array.from(this.saved_transactions.values());
  }

  setSavedTransaction = (hash: any, tx?: any) => {
    if (!tx) {
      this.saved_transactions.set(hash.hash, hash);
    } else {
      this.saved_transactions.set(hash, tx);
    }
  };

  pushSavedTransaction = (transaction: Transaction) => {
    this.saved_transactions.set(transaction.getHash().toString(), {
      hash: transaction.getHash().toString(),
      unresolved: true,
    });

    this.save_to_storage();
  };

  // -----------------------
  // transactions processing methods
  // -----------------------

  process_transaction = async (tx: any) => {
    // quit if transaction is already resolved
    if (!tx || !tx.unresolved) {
      return false;
    }

    // welp
    this.events.emit("transaction_start_update", tx);

    try {
      const resolvedTx = await this.depender.execute(tx);

      if (!resolvedTx) {
        console.warn(`coulnd't resolve transaction`);
        return false;
      }

      const txStatus = resolvedTx.status.toString();

      console.log(tx.hash, resolvedTx.hash);

      let to_store: any = {
        hash: tx.hash,
        data: resolvedTx.data,
        status: txStatus,
        unresolved: false,
        tx_on_network: resolvedTx,
      };

      if (resolvedTx.status.isFailed()) {
        let errorMessage;

        const results = resolvedTx.contractResults.items;

        for (let result of results) {
          if (result.returnMessage) {
            errorMessage = result.returnMessage;
          }
        }

        to_store = {
          ...to_store,
          error: true,
          success: false,
          message: errorMessage,
        };
      } else if (resolvedTx.status.isSuccessful()) {
        to_store = {
          ...to_store,
          error: false,
          success: true,
        };
      }

      this.events.emit("transaction_update", to_store);
      this.setSavedTransaction(tx.hash, to_store);
    } catch (error) {}

    return false;
  };

  _pickup_signed_transactions_from_query = async () => {
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    if (
      query &&
      query.walletProviderStatus &&
      query.walletProviderStatus !== "transactionsSigned"
    ) {
      if (this.store.router) {
        this.store.router?.push(
          `${window.location.origin}${window.location.pathname}`
        );
      }

      return;
    }

    if (!query || query.walletProviderStatus !== "transactionsSigned") {
      return;
    }

    let index = 0;

    while (true) {
      // ensure chainId is loaded
      await this.store.elrond.loadDefaultChainId();

      if (!query[`sender[${index}]`]) {
        break;
      }

      // create transaction
      const transaction = new Transaction({
        sender: new Address(query[`sender[${index}]`]),
        nonce: Number(query[`nonce[${index}]`]),
        receiver: new Address(query[`receiver[${index}]`]),
        value: query[`value[${index}]`],
        data: new TransactionPayload(query[`data[${index}]`]),
        gasLimit: Number(query[`gasLimit[${index}]`]),
        chainID: this.store.elrond.chainId!,
      });

      // apply signature
      transaction.applySignature(
        // new Signature(query[`signature[${index}]`]),
        new Signature(query[`signature[${index}]`]),
        new Address(query[`sender[${index}]`])
      );

      //
      if (this.store.elrond.provider) {
        try {
          logger.info(
            "Sending transaction...",
            transaction.getHash().toString()
          );

          // send transaction
          await this.store.elrond.proxy?.sendTransaction(transaction);

          this.events.emit("transaction_sent", transaction);

          // lelolel
          this.pushSavedTransaction(transaction);
        } catch (e) {
          if (!e) {
            logger.error(transaction.toPlainObject());
          } else {
            logger.error((e as any).toString(), transaction.toPlainObject());
          }

          this.store.toasts.show({
            id: transaction.getHash().toString(),
            type: "error",
            message: "Couldn't send the transaction, try again!",
            data: { isTransaction: true },
          });
        }
      }

      index++;
    }

    if (this.store.router) {
      this.store.router?.push(
        `${window.location.origin}${window.location.pathname}`
      );
    }
  };

  _saveTransactionsToLocalStorage = () => {
    const transactions = Array.from(this.saved_transactions.values());

    storage.local.setItem({
      key: "sentTransactions",
      data: transactions,
      expires: moment().add(5, "minute").unix(),
    });
  };

  // _addSavedTransaction = (transaction: Transaction) => {
  //     this.saved_transactions.set(transaction.getHash().toString(), {
  //         hash: transaction.getHash().toString(),
  //         unresolved: true,
  //     });
  // }

  // -----------------------
  // misc stuff
  // -----------------------

  emitNotLoggedIn = () => {
    this.events.emit("not_logged_in");
  };

  // -----------------------
  // read data methods
  // -----------------------

  _fetchTx = async (txHash: string) => {
    const res = await this.store.elrond.apiProvider?.getTransaction(txHash);

    return res;
  };

  _fetchTransactions = async (
    url: string,
    { address, contractAddress }: GetLatestTransactionsType
  ) => {
    try {
      const apiAddress = this.store.elrond.apiAddress;
      const res = await request.get(`${apiAddress}${url}`, {
        params: {
          sender: address,
          receiver: contractAddress,
          condition: "must",
          size: 25,
        },
        timeout: 10000,
      });

      const data = res?.data;

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  _getAll = ({ address, contractAddress }: GetLatestTransactionsType) => {
    this._fetchTransactions("/transactions", { address, contractAddress });
  };

  _getCount = ({ address, contractAddress }: GetLatestTransactionsType) => {
    this._fetchTransactions("/transactions/count", {
      address,
      contractAddress,
    });
  };

  getTransaction = async (transactionHash: string) => {
    try {
      const apiAddress = this.store.elrond.apiAddress;
      const res = await request.get(
        `${apiAddress}/transactions/${transactionHash}`
      );
      const data = res?.data;

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  // -----------------------
  // transaction methods
  // -----------------------

  create = async (txConfig: any, shouldIncrementNonce = true) =>
    await this._create(txConfig);

  wait = async (tx: Transaction) => this._wait(tx, this.parent.provider);

  create_and_sign = async (
    txConfig: any,
    shouldIncrementNonce = true,
    shouldWait = false
  ) => {
    if (!this.store.elrond.address) {
      return this.emitNotLoggedIn();
    }

    //
    await this.store.elrond.loadDefaultChainId();

    const tx = await this._create(txConfig);
    const x: any = await this._sign(tx, shouldWait);
    // console.log(x);

    return [tx, ...x];
  };

  create_more_and_sign = async (
    txConfigs: any,
    shouldIncrementNonce = true,
    shouldWait = false
  ) => {
    if (!this.store.elrond.address) {
      return this.emitNotLoggedIn();
    }

    //
    await this.store.elrond.loadDefaultChainId();

    let txs = [];

    for (const txConfig of txConfigs) {
      const tx = await this._create(txConfig);

      txs.push(tx);
    }

    const x: any = await this._signMore(txs, shouldWait);
    // console.log(x);

    return [txs, ...x];
  };

  // -----------------------
  // transaction utils methods
  // -----------------------

  report = (tx: Transaction, urls: any) => {
    // console.log(tx);
    const txhash = tx.getHash().toString();
    logger.info(`transaction has been sent...`);
    logger.info(`tx-hash: ${txhash}`);

    // if (!urls) {
    //     urls = info.get_urls("devnet");
    // }

    urls = {
      GATEWAY: "https://devnet-gateway.elrond.com",
      API: "https://devnet-api.elrond.com",
      GRAPHQL: "https://devnet-exchange-graph.elrond.com/graphql",
      EXPLORER: "https://devnet-explorer.elrond.com",
    };

    logger.info(`explorer: ${urls.EXPLORER}/transactions/${txhash}`);
    logger.info(`api: ${urls.API}/transactions/${txhash}`);
  };

  // -----------------------
  // transactions private methods
  // -----------------------

  _create = async ({
    sender,
    receiver,
    value,
    data,
    gasLimit,
  }: CreateTransactionConfig) => {
    //
    const nonce = sender.nonce;

    //
    console.log(`[${nonce.valueOf()}] increasing nonce`);
    sender.nonce = sender.nonce + 1;

    data = new TransactionPayload(data);
    const egldValue = value;
    receiver = new Address(receiver);
    gasLimit = gasLimit || 50 * 1000;

    const transaction = await new Transaction({
      sender: sender.address,
      nonce: nonce,
      receiver: receiver,
      value: egldValue,
      data: data,
      gasLimit: gasLimit,
      chainID: this.store.elrond.chainId!,
    });

    // console.log(
    //     Buffer.from(transaction.getData().encoded(), "base64").toString()
    // );
    // console.log(transaction.toPlainObject());

    return transaction;
  };

  _signMore = async (txs: Transaction[], shouldWait: boolean = false) => {
    logger.info(`[_sign] singing transactions...`);
    const provider = this.store.elrond.provider;

    if (!provider) {
      console.warn(`no provider found in order to send tx`);
      return;
    }

    let sameTxs: any = null;

    try {
      sameTxs = (await provider.signTransactions(txs)) || [];

      for (let sameTx of sameTxs) {
        if (this.store.elrond.provider instanceof WalletConnectProvider) {
          // send transaction
          await this.store.elrond.proxy?.sendTransaction(sameTx);

          this.events.emit("transaction_sent", sameTx);

          // lelolel
          this.pushSavedTransaction(sameTx);
        } else if (this.store.elrond.provider instanceof ExtensionProvider) {
          // send transaction
          await this.store.elrond.proxy?.sendTransaction(sameTx);

          this.events.emit("transaction_sent", sameTx);

          // lelolel
          this.pushSavedTransaction(sameTx);
        }
      }
    } catch (e) {
      logger.error(e);
      this.store.toasts.show({
        id: cuid(),
        type: "error",
        message: "Transaction has not been sent! (canceled or error)",
        data: { isTransaction: false },
      });
    }

    return [sameTxs, null];
  };

  _sign = async (tx: Transaction, shouldWait: boolean = false) => {
    logger.info(`[_sign] singing transaction...`);
    const provider = this.store.elrond.provider;

    if (!provider) {
      console.warn(`no provider found in order to send tx`);
      return;
    }

    let sameTx: any = null;

    try {
      sameTx = await provider.signTransaction(tx);

      if (this.store.elrond.provider instanceof WalletConnectProvider) {
        // send transaction
        await this.store.elrond.proxy?.sendTransaction(sameTx);

        this.events.emit("transaction_sent", sameTx);

        // lelolel
        this.pushSavedTransaction(sameTx);
      } else if (this.store.elrond.provider instanceof ExtensionProvider) {
        console.log("sending through extension connector...");

        // send transaction
        await this.store.elrond.proxy?.sendTransaction(sameTx);

        this.events.emit("transaction_sent", sameTx);

        // lelolel
        this.pushSavedTransaction(sameTx);
      }
    } catch (e) {
      logger.error(e);
      this.store.toasts.show({
        id: cuid(),
        type: "error",
        message: "Transaction has not been sent! (canceled or error)",
        data: { isTransaction: false },
      });
    }

    return [sameTx, null];
  };

  _wait = async (tx: Transaction, provider: any) => {
    const watcher = new TransactionWatcher(provider, 6000);
    const tx_on_network = await watcher.awaitCompleted(tx);

    logger.info(`[_wait] waiting for transaction to be mined...`);
    logger.info(tx_on_network);

    return tx_on_network;
  };
}

class TransactionResolver {
  //
  store: RootStore;
  txData: SavedTransactionData;

  constructor(txData: SavedTransactionData, store: RootStore) {
    this.store = store;
    this.txData = txData;

    this.start();
  }

  start = async () => {};
}
