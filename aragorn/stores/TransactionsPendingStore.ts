import { TransactionOnNetwork } from "@elrondnetwork/erdjs-network-providers/out";
import ElrondTransactionsStore from "./ElrondTransactionsStore";

//
export default class TransactionsPendingStore {
  //
  timersMap: any = {};
  countMap: any = {};

  retryInterval = 5000;
  maxRetry = 10;

  txStore: ElrondTransactionsStore;

  constructor(txStore: ElrondTransactionsStore) {
    this.txStore = txStore;
    this.maxRetry = (90 * 1000) / this.retryInterval;
  }

  execute = async (tx: any): Promise<TransactionOnNetwork | undefined> => {
    if (this.timersMap[tx.hash]) {
      clearTimeout(this.timersMap);
    }

    if (this.countMap[tx.hash] >= this.maxRetry) {
      return;
    }

    console.log(`de-pending ${tx.hash}...`);

    try {
      const res = await this.get_transaction(tx);
      const txStatus = res?.status.toString();

      if (txStatus === "pending") {
        this.countMap[tx.hash] = this.countMap[tx.hash] + 1;

        return new Promise((resolve, reject) => {
          this.clear_timer(tx.hash);
          this.set_timer(
            tx.hash,
            setTimeout(() => this.execute(tx).then((res) => resolve(res)), 5000)
          );
        });
      }

      return res;
    } catch (e) {
      this.countMap[tx.hash] = this.countMap[tx.hash] + 1;

      return new Promise((resolve, reject) => {
        this.clear_timer(tx.hash);
        this.set_timer(
          tx.hash,
          setTimeout(() => this.execute(tx).then((res) => resolve(res)), 5000)
        );
      });
    }
  };

  clear_timer = (txHash: string) => {
    clearTimeout(this.timersMap[txHash]);
  };

  set_timer = (txHash: string, timer: any) => {
    this.timersMap[txHash] = timer;
  };

  get_transaction = (tx: any) => this.txStore._fetchTx(tx.hash);
}
