import Head from "next/head";
import cn from "classnames";
import { NextPage } from "next";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";

const LELOLOL: NextPage = (props: any) => {
  //

  return (
    <>
      <Head>
        <title>Register Wallet @ deainostri</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DFEIOQWNDFNIOQW />
    </>
  );
};

const DFEIOQWNDFNIOQW = observer(() => {
  const store = useRootStore();

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col overflow-auto">
      <div className={cn("", "center-me")}>
        <div className={""} />
        <div className={cn("flex flex-col items-center text-center")}>
          <div className="text-2xl text-pallete-primary uppercase font-header text-center">
            the page is minting itself...
          </div>
        </div>
      </div>
    </div>
  );
});

export default LELOLOL;
