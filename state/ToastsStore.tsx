// state
import { RootStore } from "./RootStore";

// utils
import cuid from "cuid";
import { makeAutoObservable } from "mobx";

type ToastConfig = {
  id?: string;
  type?: "success" | "error" | "info" | "warning";
  data?: any;
  content?: any;
  message?: string;
  timeout?: any;
  expireIn?: number;
};

export default class ToastsStore {
  //

  store: RootStore;

  map = new Map();
  activeIds = new Set();

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  show = (config: ToastConfig) => {
    if (!config.id) {
      config.id = cuid();
    }

    const existingConfig = this.map.get(config.id);
    if (existingConfig) {
      clearTimeout(existingConfig.timeout);
    }

    clearTimeout(config.timeout);

    config.timeout = setTimeout(() => {
      this.activeIds.delete(config.id);
    }, config.expireIn || 12 * 1000);

    this.map.set(config.id, config);
    this.activeIds.add(config.id);
  };

  showPermanent = (config: ToastConfig) => {
    if (!config.id) {
      config.id = cuid();
    }

    clearTimeout(config.timeout);

    this.map.set(config.id, config);
    this.activeIds.add(config.id);
  };

  hide = (id: string) => {
    this.activeIds.delete(id);
    this.map.delete(id);
  };

  get activeArr() {
    return Array.from(this.activeIds).map((id: any) => this.map.get(id));
  }
}
