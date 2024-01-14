// stores
import ElrondSmartContractStore from "@/aragorn/stores/ElrondSmartContractStore";

// utils
import AppConfigs from "@/utils/AppConfigs";
import { hex_to_number } from "@/utils/conversions";
import { Address, AddressValue } from "@elrondnetwork/erdjs/out";
import { NextApiRequest, NextApiResponse } from "next";

const sc = new ElrondSmartContractStore(null, AppConfigs.contracts.staking);

type ResponseData = {
  data?: any;
  error?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  let { address } = req.query;

  if (!address) {
    return res.status(500).json({
      error: "no address specified",
    });
  }

  const returnData = await sc.queryMethod(
    "getStakedNfts",
    [new AddressValue(new Address(address as string))],
    { skipDecode: true }
  );

  let nonces = returnData?.map((nonceInBase64) => {
    return hex_to_number(
      new Buffer(nonceInBase64 as any, "base64").toString("hex")
    );
  });

  res.status(200).json({ data: nonces });
};

export default handler;
