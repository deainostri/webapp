// utils
import { request } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";
import AppConfigs from "@/utils/AppConfigs";

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
      data: [],
    });
  }

  let tokenTicker = AppConfigs.token.nftTokenId;
  if (!tokenTicker || !tokenTicker.includes("-")) {
    tokenTicker = "IONT-869083";
  }

  const nfts = await request.get(
    `${AppConfigs.network.apiAddress}/accounts/${address}/nfts?size=200&collections=${tokenTicker}`
  );

  const myNfts = (nfts?.data || []).filter(
    (nft: any) => nft?.collection === tokenTicker
  );

  res.status(200).json({ data: myNfts });
};

export default handler;
