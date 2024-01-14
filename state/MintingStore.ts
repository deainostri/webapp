// state
import { RootStore } from "./RootStore";

// utils
import { decimal, payload } from "@/utils";
import { makeAutoObservable } from "mobx";
import { hex_to_decimal, hex_to_string } from "@/utils/conversions";
import cuid from "cuid";
import { uniqueId } from "lodash";

export default class MintingStore {
  //

  store: RootStore;

  isSendingTransaction = false;
  waitingResult = false;
  showingResult = false;

  hasWon = false;

  sendingTxTimer: any = null;

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  get contract_address() {
    return this.store.elrond.contracts.get("dns").address;
  }

  init = () => {
    this.store.elrond.transaction.events.on("transaction_start_update", (x) => {
      console.log(`start update`);
      console.log(x);
    });

    this.store.elrond.transaction.events.on("transaction_failed", (x) => {
      const tx_on_network = x.tx_on_network;
      const receiverAddress = tx_on_network.receiver.bech32();

      if (x.data[0] === "mint" && receiverAddress === this.contract_address) {
        this.setWaitingResult(false);
      }
    });

    this.store.elrond.transaction.events.on("transaction_success", (x) => {
      // try {
      //     this.store.swcMutate &&
      //         this.store.swcMutate(
      //             `/api/coinflip/wallet/${this.store.elrond.address}`
      //         );
      // } catch (error) {}

      try {
        //
        const tx_on_network = x.tx_on_network;
        const receiverAddress = tx_on_network.receiver.bech32();

        if (x.data[0] !== "mint" || receiverAddress !== this.contract_address) {
          return;
        }

        const receipt = tx_on_network.getReceipt();
        const results = tx_on_network.getSmartContractResults().getAllResults();

        let collection_id;
        let nft_index;
        let nft_indices = [];

        for (let result of results) {
          const dataInHex = atob(result.data);
          const dataArgs = (dataInHex || "").split("@");

          if (dataArgs[0] !== "ESDTNFTTransfer") {
            continue;
          }

          collection_id = hex_to_string(dataArgs[1]);
          nft_index = hex_to_decimal(dataArgs[2])?.toString();

          if (nft_index) {
            nft_indices.push(nft_index);
          }
        }

        this.store.toasts.show({
          id: uniqueId("mint_success"),
          data: {
            nft_index,
            nft_indices,
            collection_id,
            successMint: true,
          },
          message: `Ai mintat: ${nft_indices
            .map((x) => `deainostri #${x}`)
            .join(", ")}`,
          type: "success",
          content: "mint_success",
        });
      } catch (e) {
        console.warn(e);
      }
    });

    this.store.elrond.transaction.events.on("transaction_sent", (x) => {
      const receiverAddress = x.getReceiver().bech32();
      const dataArgs = x.getData().getEncodedArguments();

      if (dataArgs[0] === "mint" && receiverAddress === this.contract_address) {
        this.setWaitingResult(true);
      }
    });
  };

  // -----------------------
  // set props methods
  // -----------------------

  setIsSendingTransaction = (value: any) => {
    clearTimeout(this.sendingTxTimer);
    this.isSendingTransaction = value;
  };

  setWaitingResult = (value: any) => (this.waitingResult = value);
  setShowingResult = (value: any) => (this.showingResult = value);

  try_sign_buy_tx = async () => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    if (!this.hasEnoughBalance) {
      return this.store.toasts.show({
        id: cuid(),
        type: "error",
        message: "You don't have enough EGLD!",
        data: { isTransaction: false },
      });
    }

    this.setIsSendingTransaction(true);

    this.store.elrond.transaction.create_and_sign({
      value: new decimal(1).mul(new decimal(10).pow(18)).toString(),
      sender: this.store.elrond.account,
      gasLimit: 80 * 10 ** 6,
      receiver: this.contract_address,
      data: payload.encode(["mint", "raw"], [new decimal(1), "decimal"]),
      chainID: this.store.elrond.chainId,
    });

    this.sendingTxTimer = setTimeout(() => {
      this.setIsSendingTransaction(false);
    }, 10 * 1000);
  };

  // -----------------------
  // computed states
  // -----------------------

  get hasEnoughBalance() {
    console.log(this.store.elrond.balance);
    return new decimal(1).lessThan(new decimal(this.store.elrond.balance));
  }

  get isWaitingForResults() {
    return this.waitingResult && this.store.elrond.isLoggedIn;
  }
}
