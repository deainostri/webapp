// utils
import { request } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  data?: string;
  error?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }

  const { discord_id, wallet_address, force } = req.body;

  if (!discord_id || !wallet_address) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await request.post(
    `${process.env.DEAINOSTRI_DISCORD_BOT_ADDRESS}/register_wallet`,
    {
      discord_user_id: discord_id,
      wallet_address: wallet_address,
      force: force ? "yes" : "",
    }
  );

  res.status(200).json({ data: "good" });
};

export default handler;
