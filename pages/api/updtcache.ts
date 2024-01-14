// utils
import { client, set as dbset } from "@/utils/redis";
import AppConfigs from "@/utils/AppConfigs";
import { payload, request } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import ElrondSmartContractStore from "@/aragorn/stores/ElrondSmartContractStore";
import { Address } from "@elrondnetwork/erdjs/out";

const sc = new ElrondSmartContractStore(null, AppConfigs.contracts.dns);

type ResponseData = {
  data?: string;
  error?: string;
};

interface GetLatestTransactionsType {
  apiAddress?: string;
  address: string;
  contractAddress: string;
  timeout?: number;
  page?: number;
  url?: string;
}

const _fetchTransactions = async (
  url: string,
  { address, contractAddress }: GetLatestTransactionsType
) => {
  try {
    const apiAddress = AppConfigs.network.apiAddress;
    const res = await request.get(`${apiAddress}${url}`, {
      params: {
        // sender: address,
        receiver: contractAddress,
        condition: "must",
        size: 100,
      },
      timeout: 10000,
    });

    const data = res?.data;

    return {
      data: data,
      success: data !== undefined,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
};

const _getAll = ({ address, contractAddress }: GetLatestTransactionsType) =>
  _fetchTransactions("/transactions", { address, contractAddress });

const _getCount = ({ address, contractAddress }: GetLatestTransactionsType) =>
  _fetchTransactions("/transactions/count", {
    address,
    contractAddress,
  });

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }

  const { auth } = req.body;
  if (auth !== "elrondxaxa") {
    res.status(401).json({ error: "Unauthorized" });
  }

  const txRes = await _getAll({
    address: "",
    contractAddress: AppConfigs.contracts.dns,
  });

  const actions = new Set();
  let lastTimestamp: any = (await client.get("update-last-timestamp")) || 0;
  const whitelistAddresses: any[] = [];

  if (txRes && txRes.data) {
    let txs = _.orderBy(txRes.data, "timestamp");

    txs.forEach((tx: any) => {
      if (!tx || Number(tx.timestamp) <= Number(lastTimestamp)) {
        return;
      }

      if (tx?.action?.category === "scCall") {
        const action = tx?.action?.name;
        actions.add(action);

        if (action === "approveWhitelist") {
          const hexAddress = payload.decode(
            payload.decode64(tx.data)[0].string
          )[1].raw;
          const bech32 = Address.fromHex(hexAddress).bech32();
          whitelistAddresses.push(bech32);
        }
      }

      lastTimestamp = Number(tx.timestamp);
    });

    // console.log(Array.from(actions.values()));

    if (actions.has("pause_minting") || actions.has("resume_minting")) {
      client.del("getIsPaused");
    }

    if (actions.has("pause_presale") || actions.has("resume_presale")) {
      client.del("getPresaleIsOpen");
    }

    // if (actions.has("set_price")) {
    //     client.del("price");
    // }

    // if (actions.has("set_presale_price")) {
    //     client.del("presale-price");
    // }

    // if (actions.has("set_royalties")) {
    //     client.del("end-time");
    //     client.del("start-time");
    // }

    if (
      actions.has("mint_presale") ||
      actions.has("giveaway") ||
      actions.has("mint")
    ) {
      client.del("tokens-left");
    }

    whitelistAddresses.forEach((address: string) => {
      client.del(`getIsWhitelisted-${address}`);
    });
  }

  dbset("update-last-timestamp", lastTimestamp);

  res.status(200).json({ data: "good" });
};

export default handler;
