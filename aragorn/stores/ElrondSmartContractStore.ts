// state
import { RootStore } from "@/state/RootStore";

// utils
import { payload } from "@/utils";
import { makeAutoObservable } from "mobx";
import { Address, Query, ContractFunction } from "@elrondnetwork/erdjs/out";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";

// configs
import AppConfigs from "@/utils/AppConfigs";

export default class ElrondSmartContractStore {
  //

  store: RootStore | null;

  address: string;
  methods = new Map();

  constructor(store: RootStore | null, contractAddress: string) {
    this.store = store;
    this.address = contractAddress;
    this.methods = new Map();

    makeAutoObservable(this);
  }

  init = () => {};

  // -----------------------
  // query methods
  // -----------------------

  // addMethod = (methodName: string, params: any[]) => {};

  queryMethod = async (methodName: string, args: any[], options?: any) => {
    const query = new Query({
      address: new Address(this.address),
      func: new ContractFunction(methodName),
      args: args,
    });

    options = options || {};

    // new AddressValue(new Address(this.elrond.address))

    try {
      const res = await this.getProxyProvider().queryContract(query);
      // console.log(res, this.address);
      const returnData = res?.returnData || [];

      if (options.skipDecode) {
        return returnData;
      }

      const [encoded] = returnData;

      // console.log(`encoded:`, encoded);

      if (encoded || encoded === "") {
        const decoded = Buffer.from(encoded, "base64").toString("hex");
        return payload.decode64(encoded);
      }
    } catch (e) {
      console.error("Unable to call VM query", e);
    }

    return null;
  };

  // -----------------------
  // util methods
  // -----------------------

  getProxyProvider = () => {
    if (this.elrond && this.elrond.proxy) {
      return this.elrond.proxy;
    }

    return new ProxyNetworkProvider(AppConfigs.network.urls.GATEWAY, {
      timeout: 30 * 1000,
    });
  };

  // -----------------------
  // shorthands
  // -----------------------

  get elrond() {
    return this.store?.elrond;
  }
}
