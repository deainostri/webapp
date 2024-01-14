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
  let data = await dbget("getTotalTokensLeft");

  if (!data) {
    console.log(`invalidating /sc/getTotalTokensLeft...`);
    const returnData = await sc.queryMethod("getTotalTokensLeft", []);

    if (!returnData) {
      return res.status(500).json({
        error: "unable to get getTotalTokensLeft",
      });
    }

    const newTokensLeft = new decimal((returnData[0] as any).decimal || 0);
    dbset("getTotalTokensLeft", newTokensLeft.toString());

    data = newTokensLeft.toString();
  }

  res.status(200).json({ data });
};

export default handler;
