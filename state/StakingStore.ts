// state
import { RootStore } from "./RootStore";

// utils
import { makeAutoObservable } from "mobx";
import { decimal, payload, request } from "@/utils";
import AppConfigs from "@/utils/AppConfigs";
import { Address } from "@elrondnetwork/erdjs/out";
import { decimal_to_hex } from "@/utils/conversions";
import { SavedTransactionData } from "@/aragorn/stores/ElrondTransactionsStore";

export type NftData = {
  attributes: string;
  collection: string;
  creator: string;
  identifier: string;
  media: {
    url: string;
    fileSize: number;
    originalUrl: string;
    thumbnailUrl: string;
  }[];
  metadata: {
    dna: string;
    name: string;
    rarity: { value: string; trait_type: string }[];
    edition: number;
  };
  name: string;
  nonce: number;
  royalties: number;
  ticker: string;
  uris: string[]; // in base64
  url: string;
};

export default class StakingStore {
  //

  store: RootStore;

  nfts: NftData[] = [];
  stakedNfts: NftData[] = [];
  stakedNonces: (string | number)[] = [];

  constructor(store: RootStore) {
    this.store = store;

    makeAutoObservable(this);
  }

  init = () => {
    this.store.elrond.events.on("accountChange", this.onAccountChange);
    this.store.elrond.transaction.events.on(
      "transaction_success",
      (x: SavedTransactionData) => {
        const decodedData = payload.decode(
          x.tx_on_network?.data.toString() || ""
        );

        if (
          decodedData[0].raw === "unstake" ||
          decodedData[0].raw === "ESDTNFTTransfer"
        ) {
          this.refreshAll();
        }
      }
    );
  };

  // -----------------------
  // events handlers
  // -----------------------

  onAccountChange = () => {
    this.refreshAll();
  };

  // -----------------------
  // core methods
  // -----------------------
  refreshAll = () => {
    this.refreshNfts();
    this.refreshStakedNonces();
  };

  refreshNfts = async () => {
    if (!this.store.elrond.isLoggedIn) {
      return null;
    }

    const results = await request.get(
      `${AppConfigs.network.urls.API}/accounts/${this.store.elrond.address}/nfts/?collection=${this.nftTokenId}`
    );

    console.log(results?.data);
    this.setNfts(results?.data);

    // this.setNFTTOFIX(ressss?.data || []);
    // this.setTriedFindNFTsToFix();
  };

  refreshStakedNonces = async () => {
    if (!this.store.elrond.isLoggedIn) {
      return null;
    }

    const results = await request.get(
      `/api/stake/stakedNfts/${this.store.elrond.address}`
    );

    this.setStakedNonces(results?.data?.data || []);
  };

  refreshStakedNfts = async () => {
    //
    let newNfts = [];

    for (let nonce of this.stakedNonces) {
      // nonce in hex
      const nonceHex = decimal_to_hex(new decimal(nonce));
      const nft_data_res = await request.get(
        `${AppConfigs.network.urls.API}/nfts/${this.nftTokenId}-${nonceHex}`
      );

      if (nft_data_res?.data) {
        newNfts.push(nft_data_res.data);
      }
    }

    this.stakedNfts = newNfts;
  };

  setNfts = (nfts: any[]) => {
    this.nfts = nfts;
  };

  setStakedNonces = (stakedNonces: (string | number)[]) => {
    this.stakedNonces = Array.isArray(stakedNonces) ? stakedNonces : [];
    this.refreshStakedNfts();
  };

  stakeAll = async () => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    this.store.elrond.transaction.create_more_and_sign(
      this.nfts.map((nft) => ({
        value: 0,
        sender: this.store.elrond.account,
        gasLimit: 15 * 10 ** 6,
        receiver: this.store.elrond.account?.address.bech32(),
        data: payload.encode(
          ["ESDTNFTTransfer", "raw"],
          [this.nftTokenId, "string"],
          [new decimal(nft.nonce), "decimal"],
          [new decimal(1), "decimal"],
          [
            new Address(
              this.store.elrond.contracts.get("staking").address
            ).hex(),
            "raw",
          ],
          ["stake", "string"]
        ),
        chainID: this.store.elrond.chainId,
      }))
    );
  };

  unstakeAll = async () => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    this.store.elrond.transaction.create_more_and_sign(
      this.stakedNonces.map((nonce) => ({
        value: 0,
        sender: this.store.elrond.account,
        gasLimit: 15 * 10 ** 6,
        receiver: this.store.elrond.contracts.get("staking").address,
        data: payload.encode(
          ["unstake", "raw"],
          [new decimal(nonce), "decimal"]
        ),
        chainID: this.store.elrond.chainId,
      }))
    );
  };

  stakeNft = async (nonce: string | number) => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    this.store.elrond.transaction.create_and_sign({
      value: 0,
      sender: this.store.elrond.account,
      gasLimit: 15 * 10 ** 6,
      receiver: this.store.elrond.account?.address.bech32(),
      data: payload.encode(
        ["ESDTNFTTransfer", "raw"],
        [this.nftTokenId, "string"],
        [new decimal(nonce), "decimal"],
        [new decimal(1), "decimal"],
        [
          new Address(this.store.elrond.contracts.get("staking").address).hex(),
          "raw",
        ],
        ["stake", "string"]
      ),
      chainID: this.store.elrond.chainId,
    });
  };

  unstakeNft = async (nonce: string | number) => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    this.store.elrond.transaction.create_and_sign({
      value: 0,
      sender: this.store.elrond.account,
      gasLimit: 15 * 10 ** 6,
      receiver: this.store.elrond.contracts.get("staking").address,
      data: payload.encode(["unstake", "raw"], [new decimal(nonce), "decimal"]),
      chainID: this.store.elrond.chainId,
    });
  };

  claim = async () => {
    //
    await this.store.elrond.fetchAccount();
    await this.store.elrond.loadDefaultChainId();

    this.store.elrond.transaction.create_and_sign({
      value: 0,
      sender: this.store.elrond.account,
      gasLimit: 15 * 10 ** 6,
      receiver: this.store.elrond.contracts.get("staking").address,
      data: payload.encode(["claim", "raw"]),
      chainID: this.store.elrond.chainId,
    });
  };

  // -----------------------
  // util methods
  // -----------------------

  isNftStaked = (nonce: string | number) => {
    return (
      this.stakedNonces.includes(nonce) ||
      this.stakedNonces.includes(nonce.toString())
    );
  };

  // -----------------------
  // computed data
  // -----------------------

  get nftTokenId() {
    return this.store.elrond.appConfig?.token.nftTokenId;
  }
}
