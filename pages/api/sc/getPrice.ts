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
  let data = await dbget("getPrice");

  if (!data) {
    console.log(`getting new price...`);
    const returnData = await sc.queryMethod("getNftPrice", []);

    if (!returnData) {
      return res.status(500).json({
        error: "unable to get price",
      });
    }

    const newPrice = (returnData[0] as any).decimal;
    const newPriceDeno = new decimal(newPrice!).dividedBy(
      new decimal(10).pow(18)
    );

    dbset("getPrice", newPriceDeno.toString());

    data = newPriceDeno.toString();
  }

  res.status(200).json({ data });
};

export default handler;
