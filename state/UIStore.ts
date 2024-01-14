// state
import { RootStore } from "./RootStore";

// utils
import { isServer } from "utils/isServer";
import { makeAutoObservable } from "mobx";

export default class CartStore {
  //

  store: RootStore;

  menuIsOpen = false;
  accountModalOpen = false;

  tvIndex = 1;
  tvStatic = false;
  tvTimer: any = null;

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  setIsMenuOpen = (value?: any) =>
    (this.menuIsOpen = typeof value == "undefined" ? !this.menuIsOpen : value);

  start_tv = () => {
    if (isServer) {
      return;
    }

    // turn on tv static
    if (!this.tvStatic) {
      this.tvStatic = true;
    }

    requestAnimationFrame(() => this.increase_tv_index());

    setTimeout(() => {
      this.set_tv_static(false);
    }, 1500);

    clearTimeout(this.tvTimer);
    this.tvTimer = setTimeout(() => this.start_tv(), 3500);
  };

  increase_tv_index = () => {
    this.tvIndex = (this.tvIndex % 23) + 1;
  };

  set_tv_static = (value: boolean) => {
    this.tvStatic = value;
  };

  setAccountModalOpen = (value?: any) =>
    (this.accountModalOpen =
      typeof value == "undefined" ? !this.accountModalOpen : value);
}
