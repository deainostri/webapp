// state
import { RootStore } from "@/state/RootStore";
import ElrondExtensionProvider from "./ElrondExtensionProvider";

// utils
import moment from "moment";
import storage from "@/utils/storage";
import { makeAutoObservable } from "mobx";

const in1hour = moment().add(1, "hour").unix();

const in1day = moment().add(1, "day").unix();

export default class ElrondLoginStore {
  //

  store: RootStore;
  extension: ElrondExtensionProvider;

  loading = false;

  constructor(store: RootStore) {
    this.store = store;
    this.extension = new ElrondExtensionProvider(store);

    makeAutoObservable(this);
  }

  // -----------------------
  // general methods
  // -----------------------

  setLoading = (loading: boolean) => (this.loading = loading);

  // -----------------------
  // login callbacks
  // -----------------------

  onSuccessLogin = ({
    address,
    loginMethod,
  }: {
    address: string;
    loginMethod: "extension";
  }) => {
    //
    storage.local.setItem({
      key: "address",
      data: address,
      expires: in1day,
    });

    //
    storage.local.setItem({
      key: "loginMethod",
      data: loginMethod,
      expires: in1day,
    });

    //
    this.elrond.setAddress(address);
  };

  // -----------------------
  // shorthands
  // -----------------------

  get elrond() {
    return this.store.elrond;
  }
}
