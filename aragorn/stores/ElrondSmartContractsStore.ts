// state
import { RootStore } from "@/state/RootStore";
import ElrondSmartContractStore from "./ElrondSmartContractStore";

// utils
import { makeAutoObservable } from "mobx";
import AppConfigs from "@/utils/AppConfigs";

// configs

export default class ElrondSmartContractsStore {
  //

  store: RootStore | null;

  contracts = new Map();

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  init = () => {
    const store = this.store;
    const contracts = AppConfigs.contracts;

    this.set("dns", new ElrondSmartContractStore(store, contracts.dns));
    this.set("staking", new ElrondSmartContractStore(store, contracts.staking));
  };

  // -----------------------
  //
  // -----------------------

  get = (contractName: string) => {
    return this.contracts.get(contractName);
  };

  set = (contractName: string, contract: any) => {
    this.contracts.set(contractName, contract);
  };
}
