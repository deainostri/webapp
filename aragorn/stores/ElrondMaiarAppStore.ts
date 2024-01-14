// state
import { RootStore } from "@/state/RootStore";

// utils
import moment from "moment";
import storage from "@/utils/storage";
import { makeAutoObservable } from "mobx";
import { WalletConnectProvider } from "@elrondnetwork/erdjs-wallet-connect-provider";
import ElrondStore from "./ElrondStore";

const in1hour = moment().add(1, "hour").unix();

const in1day = moment().add(1, "day").unix();

const HEARTBEAT_INTERVAL_MS = 15000;

export default class ElrondMaiarAppStore {
  //

  store: RootStore;
  parent: ElrondStore;

  interval: any = null;
  disconnectInterval: any = null;
  walletConnect: any = null;

  constructor(store: RootStore, parent: ElrondStore) {
    this.store = store;
    this.parent = parent;

    makeAutoObservable(this);
  }

  init = () => {};

  start = async () => {
    //
    this.stop();

    console.log(`[maiar-app] creating provider...`);

    const callbacks = {
      onClientLogin: this.handleOnLogin,
      onClientLogout: this.handleOnLogout,
    };

    const walletConnect = new WalletConnectProvider(
      this.store.elrond.walletConnectBridge!,
      callbacks
    );

    this.store.elrond.setProvider(walletConnect);
    this.walletConnect = walletConnect;
    await walletConnect.init();

    this.heartbeat();
    this.interval = setInterval(() => {
      this.heartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    window.addEventListener("storage", (e) => {
      if (e.key === "walletconnect") {
        this.handleOnLogout();
      }
    });

    // setWalletConnect(elrondStore.provider as any);
  };

  stop = () => {
    clearInterval(this.interval);
    clearInterval(this.disconnectInterval);
  };

  attachHeartbeatHandler = () => {
    const provider: any = this.walletConnect;

    provider.walletConnector.on("heartbeat", () => {
      clearInterval(this.disconnectInterval);

      this.disconnectInterval = setInterval(() => {
        console.log("Maiar Wallet Connection Lost");

        this.handleOnLogout();
        clearInterval(this.disconnectInterval);
      }, 150000);
    });
  };

  handleOnLogin = async () => {
    console.log("[maiar-app] handle login...");
    const provider: any = this.walletConnect;

    try {
      const address = await provider.getAddress();
      const loggedIn = !!storage.local.getItem("loginMethod");

      // if no walletConnect is present in loginMethod
      // or no address has been received from provider
      if (!loggedIn || !address) {
        this.store.refreshPage_withoutQuery();
      }

      const signature = await provider.getSignature();
      console.log(`[maiar-app] signature: ${signature}`);

      if (signature) {
        this.loginWithSignature(address, signature);
      } else {
        this.loginWithoutSignature(address);
      }

      this.parent.login_app(address);
      this.attachHeartbeatHandler();
    } catch (error) {
      console.log(error);
    }
  };

  loginWithSignature = (address: string, signature: any) => {
    const tokenLogin = storage.session.getItem("tokenLogin");
    const loginToken =
      tokenLogin && "loginToken" in tokenLogin ? tokenLogin.loginToken : "";

    this.parent.setTokenLogin({
      loginToken,
      signature,
    });

    storage.session.setItem({
      key: "walletConnectLogin",
      data: {
        loginType: "walletConnect",
        callbackRoute: `${window.location.pathname}`,
        logoutRoute: "/",
      },
      expires: in1hour,
    });

    storage.local.setItem({
      key: "address",
      data: address,
      expires: in1day,
    });

    storage.local.setItem({
      key: "loginMethod",
      data: "walletconnect",
      expires: in1day,
    });
  };

  loginWithoutSignature = (address: string) => {
    storage.session.setItem({
      key: "walletConnectLogin",
      data: {
        loginType: "walletConnect",
        callbackRoute: `${window.location.pathname}`,
        logoutRoute: "/",
      },
      expires: in1hour,
    });

    storage.local.setItem({
      key: "address",
      data: address,
      expires: in1day,
    });

    storage.local.setItem({
      key: "loginMethod",
      data: "walletconnect",
      expires: in1day,
    });
  };

  handleOnLogout = () => {
    console.log("[maiar-app] handle logout...");

    this.stop();

    // is logged in?
    // if (!!storage.local.getItem("loginMethod")) {
    //     // router.push(logoutRoute);
    //     this.store.router!.push(this.store.currentPathname);
    // }

    console.log(`trying to log out...`);
    this.parent.logout({
      callbackUrl: this.store.currentUrl,
    });
  };

  heartbeat = async () => {
    const provider: any = this.walletConnect;

    if (
      !provider ||
      !("walletConnector" in provider) ||
      !provider.walletConnector.connected
    ) {
      return;
    }

    // if (
    //     provider.walletConnector.peerMeta.description.match(
    //         /(iPad|iPhone|iPod)/g
    //     )
    // ) {
    //     return;
    // }

    console.log(`[maiar-app] beeping...`);

    try {
      const status = await provider.sendCustomMessage({
        method: "heartbeat",
        params: {},
      });

      console.log(`[maiar-app] sent beep...`);
    } catch (error) {
      console.error("Connection lost", error);
      this.handleOnLogout();
    }
  };
}
