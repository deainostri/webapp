// utils
import { get as dbget, set as dbset } from "@/utils/redis";
import AppConfigs from "@/utils/AppConfigs";
import { decimal } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";
import ElrondSmartContractStore from "@/aragorn/stores/ElrondSmartContractStore";

const sc = new ElrondSmartContractStore(null, AppConfigs.contracts.dns);

type ResponseData = {
  data?: string;
  error?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  let data = await dbget("getTokensLimitPerPresaleTransaction");

  if (!data) {
    console.log(`invalidating /sc/tokensLeft...`);
    const returnData = await sc.queryMethod(
      "getTokensLimitPerPresaleTransaction",
      []
    );

    if (!returnData) {
      return res.status(500).json({
        error: "unable to get drop tokens left",
      });
    }

    const newTokensLimit = new decimal((returnData[0] as any).decimal || 0);
    dbset("getTokensLimitPerPresaleTransaction", newTokensLimit.toString());

    data = newTokensLimit.toString();
  }

  res.status(200).json({ data });
};

export default handler;
