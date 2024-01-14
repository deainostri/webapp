// state
import { RootStore } from "@/state/RootStore";
import ElrondLoginStore from "./ElrondLoginStore";
import ElrondMaiarAppStore from "./ElrondMaiarAppStore";
import ElrondTransactionsStore from "./ElrondTransactionsStore";
import ElrondSmartContractsStore from "./ElrondSmartContractsStore";

// connection providers
import { WalletConnectProvider } from "@elrondnetwork/erdjs-wallet-connect-provider";
import { WalletProvider as WebWalletProvider } from "@elrondnetwork/erdjs-web-wallet-provider";

// utils
import moment from "moment";
import storage from "@/utils/storage";
import { decimal } from "@/utils";
import { makeAutoObservable, reaction, when } from "mobx";

// elrond utils
import addressIsValid from "@/utils/addressIsValid";
import { Address } from "@elrondnetwork/erdjs/out";
import {
  AccountOnNetwork,
  ApiNetworkProvider,
  ProxyNetworkProvider,
} from "@elrondnetwork/erdjs-network-providers/out";

// configs
import AppConfigs from "@/utils/AppConfigs";
import EventEmitter from "events";

const in1hour = moment().add(1, "hour").unix();
const in1day = moment().add(1, "day").unix();

export default class ElrondStore {
  //

  store: RootStore;
  login: ElrondLoginStore;
  maiarApp: ElrondMaiarAppStore;
  contracts: ElrondSmartContractsStore;
  transaction: ElrondTransactionsStore;
  events: EventEmitter;

  appConfig?: typeof AppConfigs;

  proxy?: ProxyNetworkProvider | null = null;
  provider?: WebWalletProvider | WalletConnectProvider | undefined = undefined;
  apiProvider?: ApiNetworkProvider | null = null;

  account: AccountOnNetwork | null = null;
  address: string = "";
  chainId?: string | undefined = undefined;

  tokenLogin: any = "";

  connectModalOpen: boolean = false;
  maiarAppModalOpen: boolean = false;

  ready: boolean = false;

  constructor(store: RootStore) {
    this.store = store;
    this.login = new ElrondLoginStore(store);
    this.maiarApp = new ElrondMaiarAppStore(store, this);
    this.contracts = new ElrondSmartContractsStore(store);
    this.transaction = new ElrondTransactionsStore(store, this);

    this.events = new EventEmitter();

    makeAutoObservable(this);
  }

  setAccount = (account: any) => {
    this.account = account;
  };

  setAddress = (address: string) => {
    this.address = address;
  };

  // -----------------------
  // setup
  // -----------------------

  init = () => {
    this.maiarApp.init();
    this.transaction.init();
    this.contracts.init();
  };

  loadAppConfigs = (appConfig: typeof AppConfigs) => {
    this.appConfig = appConfig;

    this.proxy = new ProxyNetworkProvider(appConfig.network.gatewayAddress, {
      timeout: 5 * 60 * 1000,
    });

    this.apiProvider = new ApiNetworkProvider(appConfig.network.apiAddress, {
      timeout: 10000,
    });

    this.loadDefaultChainId();

    reaction(() => this.address, this._onAddressChange);
  };

  onReady = (cb: any) => {
    if (this.ready) {
      return cb();
    }

    when(
      () => this.ready,
      () => cb()
    );
  };

  loadDefaultChainId = async () => {
    const networkConfig = await this.proxy?.getNetworkConfig();
    this.chainId = networkConfig?.ChainID;

    this.ready = true;
  };

  setProvider = (provider: any) => {
    this.provider = provider;
    return provider;
  };

  fetchFromStorage = () => {
    if (typeof window == "undefined") {
      return;
    }

    this.try_login_callback();
  };

  _onAddressChange = () => {
    this.events.emit("accountChange");

    if (!this.address) {
      this.account = null;
      return;
    }

    this.fetchAccount(this.address);
  };

  try_login_callback = async () => {
    if (!this.isReady) {
      return;
    }

    // first callbacks
    if (storage.session.getItem("walletLogin")) {
      return this.try_login_wallet_callback();
    }

    // then restores
    const restored = await this.try_restore_login();

    // if (restored) {
    //     return console.log(`restored as ${this.address}`);
    // }
  };

  try_restore_login = async () => {
    const address = storage.local.getItem("address");
    const loginMethod = storage.local.getItem("loginMethod");

    if (!address || !loginMethod) {
      return false;
    }

    switch (loginMethod) {
      case "wallet": {
        this.setProvider(
          new WebWalletProvider("https://wallet.elrond.com/dapp/init")
        );
        this.address = address;
        return true;
      }

      case "extension": {
        // TODO: internal popup to manual trigger login
        // this.login.extension.login();
        this.login.extension.login_silent(address);
        return true;
      }

      case "walletConnect":
      case "walletconnect": {
        console.log(`[elrond] trying to restore login from MaiarApp`);
        return this.maiarApp.start();
      }
    }
  };

  try_login_wallet_callback = async () => {
    this.setProvider(
      new WebWalletProvider("https://wallet.elrond.com/dapp/init")
    );

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams as any);

    // delete callback registration
    storage.session.removeItem("walletLogin");

    if (
      params &&
      typeof params.address === "string" &&
      addressIsValid(params.address)
    ) {
      // -----------------------
      // do the login
      // -----------------------

      this.address = params.address;
      console.log(`Connected as ${params.address}`);

      // -----------------------
      // save in local for restore lokgin
      // -----------------------

      storage.local.setItem({
        key: "loginMethod",
        data: "wallet",
        expires: in1day,
      });

      storage.local.setItem({
        key: "address",
        data: this.address,
        expires: in1day,
      });

      if (this.store.router) {
        this.store.router.push(
          `${window.location.origin}${window.location.pathname}`
        );
      }

      return;
    }
  };

  // -----------------------
  // fetch methods
  // -----------------------

  fetchAccount = async (address = this.address) => {
    const addr = new Address(address);
    const account = await this.proxy!.getAccount(addr);

    this.account = account || null;

    return account;
  };

  // -----------------------
  // login methods
  // -----------------------

  login_wallet = (options?: { token?: string; callbackRoute?: string }) => {
    const { token, callbackRoute } = options || {};

    if (!this.isReady) {
      return null;
    }

    const provider = new WebWalletProvider(
      "https://wallet.elrond.com/dapp/init"
    );

    storage.session.setItem({
      key: "walletLogin",
      data: {},
      expires: moment().add(10, "minutes").unix(),
    });

    provider.login({
      callbackUrl: encodeURIComponent(`${window.location.href}`),
      ...(token ? { token } : {}),
    });

    // provider.login({
    //     callbackUrl: encodeURIComponent(
    //         `${window.location.origin}${callbackRoute || "/"}`
    //     ),
    //     ...(token ? { token } : {}),
    // });
  };

  login_app = (address: any) => {
    this.setAddress(address);

    if (this.maiarAppModalOpen) {
      this.toggleMaiarAppModal();
    }
  };

  setTokenLogin = (tokenLogin: any) => {
    this.tokenLogin = tokenLogin;

    storage.session.setItem({
      key: "tokenLogin",
      data: tokenLogin,
      expires: in1hour,
    });
  };

  logout = (options?: { callbackUrl?: string; callbackRoute?: string }) => {
    const { callbackUrl, callbackRoute } = options || {};
    const provider = this.provider;

    this.address = "";
    this.account = null;
    this.provider = undefined;

    storage.session.clear();
    storage.local.removeItem("nonce");
    storage.local.removeItem("address");
    storage.local.removeItem("loginMethod");
    storage.local.removeItem("ledgerLogin");

    const url = callbackRoute
      ? `${window.location.origin}${callbackRoute}`
      : callbackUrl;

    if (provider) {
      console.log(`[elrond] found provider, calling logout...`);
      (provider as any).logout({ callbackUrl: url });
    }
  };

  getProviderType = (
    provider: WebWalletProvider | WalletConnectProvider | undefined
  ): string => {
    let providerType: string = "";

    providerType =
      provider && provider.constructor === WebWalletProvider
        ? "wallet"
        : providerType;

    providerType =
      provider && provider.constructor === WalletConnectProvider
        ? "walletconnect"
        : providerType;

    // providerType =
    //   provider && provider.constructor === HWProvider ? "ledger" : providerType;

    // providerType =
    //   provider && provider.constructor === ExtensionProvider
    //     ? "extension"
    //     : providerType;

    return providerType;
  };

  // -----------------------
  // ui methods
  // -----------------------

  setConnectModalOpen = (value: boolean) => (this.connectModalOpen = value);

  toggleMaiarAppModal = () => {
    this.maiarAppModalOpen = !this.maiarAppModalOpen;

    if (this.maiarAppModalOpen) {
      this.setConnectModalOpen(false);
    }
  };

  // -----------------------
  // shorthands
  // -----------------------

  get walletConnectDeepLink() {
    return this.appConfig?.walletConnectDeepLink;
  }

  get walletConnectBridge() {
    return this.appConfig?.walletConnectBridge;
  }

  get apiAddress() {
    return this.appConfig?.network.apiAddress;
  }

  // -----------------------
  // computed states
  // -----------------------

  get isReady() {
    return Boolean(this.proxy);
  }

  get isConnected() {
    return this.isReady && this.address;
  }

  get isLoggedIn() {
    return this.isReady && this.address;
  }

  get balance() {
    return Number(this.account?.balance.dividedBy(10 ** 18).toString() || 0);
  }

  get balanceDecimal() {
    return new decimal(
      this.account?.balance.dividedBy(10 ** 18).toString() || 0
    );
  }
}
