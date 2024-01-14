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
  let data = await dbget("getTokensDrop");

  if (!data) {
    console.log(`invalidating /sc/tokensLeft...`);
    const returnData = await sc.queryMethod("getDropTokens", []);

    if (!returnData) {
      return res.status(500).json({
        error: "unable to get tokens left",
      });
    }

    const newTokensLeft = new decimal((returnData[0] as any).decimal || 0);
    dbset("getTokensDrop", newTokensLeft.toString());

    data = newTokensLeft.toString();
  }

  res.status(200).json({ data });
};

export default handler;
