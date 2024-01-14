// components
import { Button } from "@/components";

// icons
import { IoFlashSharp, IoLogOut } from "react-icons/io5";
import EgldIcon from "@/aragorn/icons/EgldIcon";

// utils
import cn from "classnames";
import useSCSWR from "@/utils/useSCSWR";
import { observer } from "mobx-react";
import { useRootStore } from "@/state/RootStore";

// styles
import s from "./NewPresalePage.module.scss";
import Image from "next/image";
import { uniqBy } from "lodash";
import { hex_to_decimal } from "@/utils/conversions";
import useCountDown from "@/utils/useCountDown";

const NewPresalePageLoggedIn = observer((props: any) => {
  //
  const store = useRootStore();

  const { skipTimeLeft } = props;
  const { data: isWhitelisted }: any = useSCSWR(
    `/api/sc/getIsWhitelisted/${store.elrond.address}`
  );

  const WalletLogOutSection = () => {
    return (
      <div className="flex flex-row items-center flex-1 space-x-2 mb-4">
        <div className="text-xs border-2 rounded-lg p-2 hover:bg-gray-800 cursor-pointer">
          {store.elrond.address?.substring(0, 7)}...
          {store.elrond.address?.substring(store.elrond.address?.length - 5)}
        </div>
        <div
          className="text-xs border-2 rounded-lg p-2 hover:bg-gray-800 cursor-pointer"
          onClick={() => store.elrond.logout()}
        >
          <IoLogOut className="w-4 h-4" />
        </div>
      </div>
    );
  };

  if (!isWhitelisted || isWhitelisted === "declined") {
    return (
      <>
        <WalletLogOutSection />
        <PresaleNotWhitelisted />
      </>
    );
  }

  return (
    <>
      <WalletLogOutSection />
      <PresaleMainContent skipTimeLeft={skipTimeLeft} />
    </>
  );
});

const PresaleMainContent = observer(
  ({ skipTimeLeft }: { skipTimeLeft: boolean }) => {
    const store = useRootStore();
    const presale = store.presale;
    const { howMany } = presale;

    const { data: tokensLeft }: any = useSCSWR(`/api/sc/getTokensLeft`);
    const { data: tokensDrop }: any = useSCSWR(`/api/sc/getTokensDrop`);

    const tokensMinted = Math.max(tokensDrop - tokensLeft, 0);

    const WalletCardSection = () => (
      <div className={s.walletCardImage}>
        {howMany === 2 ? (
          <Image
            src="/assets/images/wc2.png"
            width={617}
            height={300}
            priority={true}
          />
        ) : (
          <Image
            src="/assets/images/wc1.png"
            width={617}
            height={300}
            priority={true}
          />
        )}
      </div>
    );

    const MinusButton = () => {
      const isDisabled = howMany === 1 || tokensLeft < 1;
      const color = isDisabled ? "bg-gray-600" : "bg-pallete-primary";

      return (
        <div
          className={`w-9 h-9 ${color} text-white text-2xl flex justify-center items-center rounded-lg pb-1 cursor-pointer`}
          onClick={() => !isDisabled && presale.setHowMany(1)}
        >
          -
        </div>
      );
    };

    const PlusButton = () => {
      const isDisabled = howMany >= 2 || tokensLeft < 2;
      const color = isDisabled ? "bg-gray-600" : "bg-pallete-primary";

      return (
        <div
          className={`w-9 h-9 ${color} text-white text-2xl flex justify-center items-center rounded-lg pb-1 cursor-pointer`}
          onClick={() => !isDisabled && presale.setHowMany(2)}
        >
          +
        </div>
      );
    };

    const QuantityPicker = () => {
      return (
        <div className="flex flex-row items-center justify-between self-stretch my-3">
          <MinusButton />
          <div className="text-3xl text-white uppercase font-header text-center pt-2">
            {howMany}
          </div>
          <PlusButton />
        </div>
      );
    };

    const TransactionItemLine = () => {
      return (
        <div className="flex flex-row items-center justify-between self-stretch my-2">
          <div className="font-semibold">{howMany} deainostri</div>
          <div className="font-semibold flex flex-row items-center">
            {howMany * presale.nftPrice} EGLD{" "}
            <EgldIcon className="ml-2 w-4 h-4" />
          </div>
        </div>
      );
    };

    return (
      <>
        <div className={cn(s.content, s.loggedInMainContent)}>
          <div className={s.loggedin_main_content_transaction}>
            <WalletCardSection />
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-header">
                {tokensMinted} / {tokensDrop}
              </div>
              <div className="text-xs -mt-1">total deainostri minted</div>
            </div>
            <QuantityPicker />
            <hr className="w-full border-t-gray-600 mb-3" />
            <TransactionItemLine />
            <hr className="w-full border-t-gray-600 my-3" />
            <div className="flex flex-col items-center justify-center w-full">
              <MintButtonSection
                tokensDrop={tokensDrop}
                tokensLeft={tokensLeft}
                skipTimeLeft={skipTimeLeft}
              />
            </div>
          </div>
          <div className={s.loggedin_main_content_preview}>
            <div style={{ maxWidth: 280 }}>
              <Image
                src="/assets/images/unkown_pill.png"
                width={587}
                height={912}
                priority={true}
              />
            </div>
          </div>
        </div>

        <MyNFTsSection />
      </>
    );
  }
);

const MintButtonSection = observer(
  ({
    tokensLeft,
    tokensDrop,
    skipTimeLeft,
  }: {
    tokensLeft: number;
    tokensDrop: number;
    skipTimeLeft: boolean;
  }) => {
    const store = useRootStore();
    const presale = store.presale;
    const { howMany } = presale;

    // const timeLeft = useCountDown(1644592400000);
    const timeLeft = useCountDown(1644951600000);
    const timeConfig = {
      hours: Math.floor(timeLeft / 3600000),
      minutes: Math.floor((timeLeft % 3600000) / 60000),
      seconds: Math.floor((timeLeft % 60000) / 1000),
    };

    const tokensMinted = Math.max(tokensDrop - tokensLeft, 0);
    const isSendingMint = presale.isSendingMint;
    const balance = store.elrond.balance;

    if (!skipTimeLeft && timeLeft > 0) {
      return (
        <Button
          variant="cta-disabled"
          className="py-2 flex items-center w-full"
        >
          <>
            Presale in{" "}
            {`${timeConfig.hours
              .toString()
              .padStart(2, "0")}:${timeConfig.minutes
              .toString()
              .padStart(2, "0")}:${timeConfig.seconds
              .toString()
              .padStart(2, "0")}`}
          </>
        </Button>
      );
    }

    if (isSendingMint) {
      return (
        <Button
          variant="cta-disabled"
          className="py-2 flex items-center w-full"
        >
          <div>Please sign transaction...</div>
        </Button>
      );
    }

    if (tokensLeft < 1) {
      return (
        <Button
          variant="cta-disabled"
          className="py-2 flex items-center w-full"
        >
          <div>The presale has ended!</div>
        </Button>
      );
    }

    if (!store.presale.hasEnoughBalance) {
      return (
        <Button
          variant="cta-disabled"
          className="py-2 flex items-center w-full"
        >
          You don&amp;t have enough EGLD
        </Button>
      );
    }

    return (
      <Button
        variant="cta"
        className="py-2 flex items-center w-full"
        onClick={() => store.presale.try_sign_buy_tx()}
      >
        <>
          <IoFlashSharp className="mr-2 w-4 h-4" /> Mint
        </>
      </Button>
    );
  }
);

const MyNFTsSection = ({ isInside }: any) => {
  const store = useRootStore();
  const { data: nfts }: any = useSCSWR(
    `/api/presale/getMyNfts/${store.elrond.address}`
  );

  const local_nfts = (store.presale.myNfts || []).slice();
  const combined_nfts = [...local_nfts, ...(nfts || [])];
  const unique_nfts = uniqBy(combined_nfts, (nft: any) => nft.identifier);

  if (!unique_nfts || !unique_nfts.length) {
    return null;
  }

  let className = cn(s.content, s.loggedInMyNftsContent);

  if (isInside) {
    className = cn(s.insideMyNftsContent);
  }

  return (
    <div className={className}>
      <div className="flex flex-col text-3xl text-pallete-primary uppercase font-header text-center mt-3">
        <div>my</div>
        <div>deainostri</div>
      </div>
      <div className={s.myNftsGrid}>
        {(unique_nfts || []).map((nft: any) => (
          <div key={nft.id} className="flex flex-col items-center flex-1">
            <div
              className={cn(s.nftImage)}
              style={{
                backgroundImage: "url(" + nft.url + ")",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl">
                #{hex_to_decimal(nft.identifier.split("-")[2])?.toString()}
              </div>
            </div>
            <div className="flex flex-row justify-around items-center bg-white bg-opacity-20 rounded-lg p-2 space-x-3">
              <a
                href={`https://trust.market/nft/${nft.identifier}`}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center border-2 border-solid border-white"
                  style={{
                    boxShadow: "0px 0px 10px rgb(0,0,0,.4)",
                  }}
                >
                  <img
                    src="https://trust.market/static/media/TR.badc882b.webp"
                    style={{ width: "80%" }}
                  />
                </div>
              </a>
              <a
                href={`https://isengard.market/nft/${nft.identifier}`}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center border-2 border-solid border-white"
                  style={{
                    boxShadow: "0px 0px 10px rgb(0,0,0,.4)",
                  }}
                >
                  <img
                    src="https://media.elrond.com/tokens/asset/ISET-84e55e/logo.svg"
                    style={{ width: "80%" }}
                  />
                </div>
              </a>
              <a
                href={`https://deadrare.io/nft/${nft.identifier}`}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center border-2 border-solid border-white"
                  style={{
                    boxShadow: "0px 0px 10px rgb(0,0,0,.4)",
                  }}
                >
                  <img
                    src="https://deadrare.io/_next/image?url=%2Ffavicon.png&w=32&q=75"
                    style={{ width: "80%" }}
                  />
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PresaleNotWhitelisted = () => {
  return (
    <div className={cn(s.content, s.loggedInMainContent)}>
      <div className="text-sm font-semibold text-center">
        Your address has not been whitelisted for this presale.
      </div>
    </div>
  );
};

export default NewPresalePageLoggedIn;
