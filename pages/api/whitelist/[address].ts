// utils
import whitelistAddresses from "@/whitelist.json";
import { NextApiRequest, NextApiResponse } from "next";

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

  if ((whitelistAddresses as any)[address as string]) {
    return res.status(200).json({ data: "success" });
  }

  return res.status(200).json({ data: "invalid" });
};

export default handler;
