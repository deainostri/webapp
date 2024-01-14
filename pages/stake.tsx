// components
import { Button } from "@/components";

// utils
import Head from "next/head";
import { NextPage } from "next";
import { observer } from "mobx-react";
import { useRootStore } from "@/state/RootStore";
import { NftData } from "@/state/StakingStore";

import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import useSCSWR from "@/utils/useSCSWR";
import { IoFlashSharp } from "react-icons/io5";
import { defaults } from "lodash";
import TrimmedAddress from "@/aragorn/components/TrimmedAddress";
import { decimal } from "@/utils";

dayjs.extend(relativeTimePlugin);

const IndexPage: NextPage = observer(() => {
  //
  const store = useRootStore();

  return (
    <>
      <Head>
        <title>deainostri</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div
        className="container flex flex-col items-center justify-center text-2xl font-bold text-center"
        style={{ height: "50vh" }}
      >
        Aceasta pagina nu mai este disponibila
      </div>
    </>
  );
});

const Header = observer(() => {
  const store = useRootStore();

  return (
    <div className="py-4 container flex flex-row justify-between items-center">
      <div className="text-lg text-app-textheader font-bold">deainostri</div>
      {store.elrond.isConnected ? (
        <div className="flex flex-row items-center space-x-2">
          <div
            className="text-xs border-2 rounded-lg p-2 bg-white hover:bg-gray-50 cursor-pointer border-yellow-400"
            onClick={() => store.ui.setAccountModalOpen(true)}
          >
            <TrimmedAddress size={5} address={store.elrond.address} />
          </div>
        </div>
      ) : (
        <Button
          className="py-2 flex items-center"
          size="sm"
          onClick={() => store.elrond.setConnectModalOpen(true)}
        >
          <IoFlashSharp className="mr-2 w-4 h-4" /> Conecteaza-te
        </Button>
      )}
    </div>
  );
});

const LoggedInContent = observer(() => {
  const store = useRootStore();

  return (
    <>
      <StatsHeader />

      {store.staking.stakedNfts.length ? (
        <div className="container my-4 font-bold flex items-center justify-between">
          <h1>Staked NFTs</h1>
          <div
            className="flex flex-row items-center cursor-pointer font-semibold text-pallete-primary"
            onClick={() => store.staking.unstakeAll()}
          >
            Unstake All
          </div>
        </div>
      ) : null}

      <div className="container my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4">
        {store.staking.stakedNfts.map((nft) => {
          // return card with nft image, title, description, and button to buy
          return <NftCard key={nft.name} nft={nft} />;
        })}
      </div>

      {store.staking.nfts.length ? (
        <div className="container my-4 font-bold flex items-center justify-between">
          <h1>Unstaked NFTs</h1>
          <div
            className="flex flex-row items-center cursor-pointer font-semibold text-pallete-primary"
            onClick={() => store.staking.stakeAll()}
          >
            Stake All
          </div>
        </div>
      ) : null}

      <div className="container my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4">
        {store.staking.nfts.map((nft) => {
          // return card with nft image, title, description, and button to buy
          return <NftCard key={nft.name} nft={nft} />;
        })}
      </div>
    </>
  );
});

const StatsHeader = observer(() => {
  const store = useRootStore();
  const address = store.elrond.address;
  let { data: stats } = useSCSWR(`/api/stake/stats/${address}`);

  stats = defaults(stats, {
    claimed: 0,
    claimable: 0,
    points: 0,
  });

  const claimed = new decimal(stats.claimed).div(1e18).toNumber();
  const claimable = new decimal(stats.claimable).div(1e18).toNumber();

  return (
    <dl className="container my-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 text-lg text-center bg-white rounded-lg shadow-sm shadow-indigo-100 py-4">
        <div className="flex justify-center items-center">
          <div className="mt-1.5 sm:mt-0">
            <dt className="text-gray-500">Claimed</dt>

            <dd className="font-medium">{claimed} EGLD</dd>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mt-1.5 sm:mt-0">
            <dt className="text-gray-500">Claimable</dt>

            <dd className="font-medium">{claimable} EGLD</dd>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mt-1.5 sm:mt-0">
            <dt className="text-gray-500">Stake Points</dt>

            <dd className="font-medium">{stats.points} Points</dd>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mt-1.5 sm:mt-0">
            <dt className="text-gray-500">Staked NFTs</dt>

            <dd className="font-medium">{store.staking.stakedNonces.length}</dd>
          </div>
        </div>
      </div>

      {claimable > 0 ? (
        <Button
          label="Claim"
          className="mt-4 w-full"
          onClick={() => store.staking.claim()}
        />
      ) : null}
    </dl>
  );
});

const NftCard = observer(({ nft }: { nft: NftData }) => {
  //
  const store = useRootStore();
  const isStaked = store.staking.isNftStaked(nft.nonce);

  const stakedDate = new Date();
  const stakedAt = isStaked ? dayjs().from(stakedDate) : "Not Staked";

  const renderStakeButton = () => {
    if (!isStaked) {
      return (
        <Button
          label="Stake"
          variant="cta"
          className="w-full mt-4"
          onClick={() => store.staking.stakeNft(nft.nonce)}
        />
      );
    }

    return (
      <Button
        label="Unstake"
        variant="third"
        className="w-full mt-4"
        onClick={() => store.staking.unstakeNft(nft.nonce)}
      />
    );
  };

  return (
    <div className="block p-4 rounded-lg shadow-sm shadow-indigo-100 bg-white">
      <img
        src={nft.media[0].thumbnailUrl}
        className="object-cover w-full h-56 rounded-md"
      />

      <div className="mt-2">
        <dl>
          <div>
            <dd className="text-sm text-gray-500">
              {isStaked ? "Staked" : "Not Staked"}
            </dd>
          </div>

          <div>
            <dd className="font-medium">{nft.name}</dd>
          </div>
        </dl>

        {renderStakeButton()}
      </div>
    </div>
  );
});

export default IndexPage;
