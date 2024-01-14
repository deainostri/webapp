// stores
import ElrondSmartContractStore from "@/aragorn/stores/ElrondSmartContractStore";
import { decimal } from "@/utils";

// utils
import AppConfigs from "@/utils/AppConfigs";
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

  const resolveDecimalReturn = (returnData: any) => {
    if (!returnData.length) {
      return new decimal(0);
    }

    let returnValue = returnData[0];

    return returnValue?.decimal || new decimal(0);
  };

  const pointsReturnData = resolveDecimalReturn(
    await sc.queryMethod("getPointsByAddress", [
      new AddressValue(new Address(address as string)),
    ])
  );

  const claimableReturnData = resolveDecimalReturn(
    await sc.queryMethod("getClaimableByAddress", [
      new AddressValue(new Address(address as string)),
    ])
  );

  const claimedReturnData = resolveDecimalReturn(
    await sc.queryMethod("getClaimedByAddress", [
      new AddressValue(new Address(address as string)),
    ])
  );

  const newPointsReturnData = resolveDecimalReturn(
    await sc.queryMethod("getNewPointsByAddress", [
      new AddressValue(new Address(address as string)),
    ])
  );

  // let nonces = returnData?.map((nonceInBase64) => {
  //     return hex_to_number(
  //         new Buffer(nonceInBase64 as any, "base64").toString("hex")
  //     );
  // });

  res.status(200).json({
    data: {
      points: pointsReturnData.add(newPointsReturnData),
      claimable: claimableReturnData || 0,
      claimed: claimedReturnData || 0,
    },
  });
};

export default handler;
