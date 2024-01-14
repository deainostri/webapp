// state
import { RootStore } from "./RootStore";

// utils
import { decimal, payload } from "@/utils";
import { makeAutoObservable } from "mobx";
import AppConfigs from "@/utils/AppConfigs";
import { request } from "@/utils";
import cuid from "cuid";

export default class PresaleStore {
  //

  store: RootStore;

  howMany: number = 1;

  maxLimit = 10;
  nftPrice = 1;
  showConfetti = false;

  isSendingMint = false;

  confettiTimer: any = null;
  sendingMintTimer: any = null;

  myNfts = [];

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  init = () => {
    // this.getTransactionFromCallback();
    this.refresh_nfts();
  };

  setShowConfetti = (value: any) => {
    this.showConfetti = value;
  };

  setIsSendingMint = (value: any) => {
    clearTimeout(this.sendingMintTimer);
    this.isSendingMint = value;
  };

  setMyNfts = (value: any) => {
    this.myNfts = value;
  };

  setHowMany = (value: number) => {
    this.howMany = Math.min(Math.max(value, 1), this.maxLimit);
  };

  updateMyNfts = () => {
    //
  };

  try_sign_buy_tx = async () => {
    // this.store.elrond.transaction.create_and_sign({
    //     value: this.howMany * this.nftPrice,
    //     sender: this.store.elrond.account,
    //     gasLimit: 40 * this.howMany * 10 ** 6,
    //     receiver: this.store.elrond.dns.address,
    //     data: payload.encode(
    //         ["mintPresale", "raw"],
    //         [new decimal(this.howMany), "decimal"]
    //     ),
    // });

    await this.store.elrond.fetchAccount();

    if (!this.hasEnoughBalance) {
      return this.store.toasts.show({
        id: cuid(),
        type: "error",
        message: "You don't have enough EGLD!",
        data: { isTransaction: false },
      });
    }

    this.setIsSendingMint(true);

    this.store.elrond.transaction.create_and_sign({
      value: new decimal(this.nftPrice)
        .mul(this.howMany)
        .mul(new decimal(10).pow(18))
        .toString(),
      sender: this.store.elrond.account,
      gasLimit: 80 * this.howMany * 10 ** 6,
      receiver: this.store.elrond.contracts.get("dns").address,
      data: payload.encode(
        ["mint", "raw"],
        [new decimal(this.howMany), "decimal"]
      ),
      chainID: this.store.elrond.chainId,
    });

    this.sendingMintTimer = setTimeout(() => {
      this.setIsSendingMint(false);
    }, 10 * 1000);
  };

  confirm_success = (toast: any) => {
    clearTimeout(this.confettiTimer);

    this.setShowConfetti(true);
    this.store.toasts.show(toast);

    this.confettiTimer = setTimeout(() => {
      this.setShowConfetti(false);
    }, 6000);

    setTimeout(() => this.refresh_nfts(), 8000);
  };

  refresh_nfts = async () => {
    const address = this.store.elrond.address;
    const tokenTicker = AppConfigs.token.nftTokenId;
    console.log("refreshing", tokenTicker);

    if (!tokenTicker || !address) {
      return;
    }

    const nfts = await request.get(
      `${AppConfigs.network.apiAddress}/accounts/${address}/nfts?size=200&collections=${tokenTicker}`
    );

    const myNfts = (nfts?.data || []).filter(
      (nft: any) => nft?.collection === tokenTicker
    );

    this.setMyNfts(myNfts);
  };

  getHasEnoughBalance = (howMany: number) => {
    return new decimal(this.nftPrice)
      .mul(howMany)
      .lessThan(new decimal(this.store.elrond.balance));
  };

  get hasEnoughBalance() {
    // console.log(
    //     new decimal(this.nftPrice).mul(this.howMany).toString(),
    //     new decimal(this.store.elrond.balance).toString()
    // );
    return new decimal(this.nftPrice)
      .mul(this.howMany)
      .lessThan(new decimal(this.store.elrond.balance));
  }
}
