import Head from "next/head";
import cn from "classnames";
import { NextPage } from "next";
import { useRootStore } from "@/state/RootStore";
import { useRouter } from "next/router";
import { Button } from "@/components";
import { IoFlashSharp } from "react-icons/io5";
import { request } from "@/utils";
import { useEffect } from "react";
import { observer } from "mobx-react";

const RegisterDiscordWalletPage: NextPage = (props: any) => {
  //

  return (
    <>
      <Head>
        <title>Register Wallet @ deainostri</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReigsterDiscordWalletContent />
    </>
  );
};

const ReigsterDiscordWalletContent = observer(() => {
  const store = useRootStore();
  const isLoggedIn = store.elrond.isLoggedIn;
  const router = useRouter();
  const { discordid } = router.query;

  useEffect(() => {
    if (discordid && store.elrond.address) {
      request.post("/api/discord/sign", {
        discord_id: discordid,
        wallet_address: store.elrond.address,
      });
    }
  }, [store.elrond.address, discordid, isLoggedIn]);

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col overflow-auto">
      {isLoggedIn ? (
        <div className={cn("", "center-me")}>
          <div className={""} />
          <div className={cn("flex flex-col items-center text-center")}>
            <div className="text-2xl text-pallete-primary uppercase font-header text-center">
              Register your erd address to your discord user
            </div>

            <div>
              Your wallet address has been assigned to your discord account.
            </div>
            <div className="text-xs">You can close this window.</div>
          </div>
        </div>
      ) : (
        <div className={cn("", "center-me")}>
          <div className={""} />
          <div className={cn("flex flex-col items-center text-center")}>
            <div className="text-2xl text-pallete-primary uppercase font-header text-center">
              Register your erd address to your discord user
            </div>

            <Button
              className="py-2 flex items-center"
              onClick={() => store.elrond.setConnectModalOpen(true)}
            >
              <IoFlashSharp className="mr-2 w-4 h-4" /> Connect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default RegisterDiscordWalletPage;
