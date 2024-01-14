// stores
import UIStore from "./UIStore";
import ElrondStore from "@/aragorn/stores/ElrondStore";
import ToastsStore from "./ToastsStore";
import MintingStore from "./MintingStore";
import PresaleStore from "./PresaleStore";
import StakingStore from "./StakingStore";

// utils
import { isServer } from "@/utils/isServer";
import { NextRouter } from "next/router";
import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { createContext, useStore } from "@/utils/store";

// configs
import AppConfigs from "@/utils/AppConfigs";

//
enableStaticRendering(isServer);

export class RootStore {
  //

  initialized = false;
  acceptedCookies = true;

  ui: UIStore;
  elrond: ElrondStore;
  router?: NextRouter;
  swcMutate?: any;

  staking: StakingStore;
  minting: MintingStore;
  presale: PresaleStore;
  toasts: ToastsStore;

  constructor() {
    //

    this.elrond = new ElrondStore(this);
    this.ui = new UIStore(this);
    this.presale = new PresaleStore(this);
    this.toasts = new ToastsStore(this);
    this.minting = new MintingStore(this);
    this.staking = new StakingStore(this);

    this.elrond.loadAppConfigs(AppConfigs);

    makeAutoObservable(this);
  }

  hydrateIfNeeded(serializedStore?: any, router?: NextRouter, swcMutate?: any) {
    if (!this.initialized) {
      this.hydrate(serializedStore, router, swcMutate);
    }
  }

  hydrate(serializedStore: any, router?: NextRouter, swcMutate?: any) {
    this.router = router;
    this.swcMutate = swcMutate;

    this.elrond.loadAppConfigs(AppConfigs);
    this.elrond.fetchFromStorage();

    this.elrond.init();
    this.minting.init();
    this.staking.init();

    this.initialized = true;
  }

  refreshPage_withoutQuery = () => {
    this.router && this.router!.push(this.currentUrl);
  };

  get currentUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  get currentPathname() {
    return `${window.location.pathname}`;
  }

  get currentOrigin() {
    return `${window.location.origin}`;
  }
}

export const rootStore = new RootStore();
const rootStoreCtx = createContext(rootStore);
export const useRootStore = () =>
  useStore(RootStore, rootStoreCtx) as RootStore;
export async function fetchInitialStoreState(ctx: any) {
  //
  return {};
}

if (!isServer) {
  // @ts-ignore
  window.rootStore = rootStore;
}
