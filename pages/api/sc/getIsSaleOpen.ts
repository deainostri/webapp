// utils
import { get as dbget, set as dbset } from "@/utils/redis";
import { NextApiRequest, NextApiResponse } from "next";
import ElrondSmartContractStore from "@/aragorn/stores/ElrondSmartContractStore";
import AppConfigs from "@/utils/AppConfigs";

const sc = new ElrondSmartContractStore(null, AppConfigs.contracts.dns);

type ResponseData = {
  data?: string;
  error?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  let data = await dbget("getIsSaleOpen");

  if (!data) {
    console.log(`invalidating /sc/getIsSaleOpen...`);
    const returnData = await sc.queryMethod("getIsPaused", []);

    if (!returnData) {
      return res.status(500).json({
        error: "unable to get paused status",
      });
    }

    const status = (returnData[0] as any).string;

    if (status === "") {
      data = "open";
    } else {
      data = "closed";
    }

    dbset("getIsSaleOpen", data);
  }

  res.status(200).json({ data });
};

export default handler;
