import Head from "next/head";
import { NextPage } from "next";
import MintPage from "@/components/MintPage";

const PresalePage: NextPage = () => {
    //

    return (
        <>
            <Head>
                <title>Mint @ deainostri</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MintPage skipTimeLeft={false} />
        </>
    );
};

export default PresalePage;
