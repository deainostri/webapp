// state
import { RootStore } from "@/state/RootStore";

// utils
import storage from "@/utils/storage";
import { isServer } from "utils/isServer";
import { ExtensionProvider } from "@elrondnetwork/erdjs-extension-provider";
import { makeAutoObservable } from "mobx";

export default class ElrondExtensionProvider {
  //

  store: RootStore;

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  init = () => {};

  login_or_download_extension = () => {
    if (isServer) {
      return;
    }

    if (!window.elrondWallet) {
      const isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

      const url = isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/maiar-defi-wallet/"
        : "https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en";

      return window.open(url, "_blank");
    }

    this.login();
  };

  login = async () => {
    this.login_store.setLoading(true);

    const provider: ExtensionProvider = ExtensionProvider.getInstance();

    try {
      const isSuccessfullyInitialized: boolean = await provider.init();

      if (!isSuccessfullyInitialized) {
        return console.warn(
          "Something went wrong trying to redirect to wallet login.."
        );
      }

      const callbackUrl: string = encodeURIComponent(this.store.currentUrl);
      //todo: add token if needed
      const providerLoginData = {
        callbackUrl,
      };

      await provider.login(providerLoginData);

      this.store.elrond.setProvider(provider);

      const { signature, address } = provider.account;

      if (signature) {
        const tokenLogin = storage.session.getItem("tokenLogin");
        const loginToken =
          tokenLogin && "loginToken" in tokenLogin ? tokenLogin.loginToken : "";

        this.elrond.setTokenLogin({
          loginToken,
          signature,
        });
      }

      // save login info
      this.login_store.onSuccessLogin({
        address,
        loginMethod: "extension",
      });
    } catch (error) {
      console.error("error loging in", error);
    } finally {
      this.login_store.setLoading(false);
    }
  };

  login_silent = async (address: string) => {
    //
    const provider: ExtensionProvider = ExtensionProvider.getInstance();
    const isSuccessfullyInitialized: boolean = await provider.init();

    if (!isSuccessfullyInitialized) {
      return console.warn(
        "Something went wrong trying to redirect to wallet login.."
      );
    }

    provider.setAddress(address);
    this.store.elrond.setProvider(provider);
    this.store.elrond.setAddress(address);
  };

  // -----------------------
  // shorthands
  // -----------------------

  get elrond() {
    return this.store.elrond;
  }

  get login_store() {
    return this.elrond.login;
  }
}
