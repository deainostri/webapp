//
import cn from "classnames";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { Button } from "..";
import s from "./MintPage.module.scss";
import { IoClose, IoFlashSharp } from "react-icons/io5";
import MintPageLoggedIn from "./MintPageLoggedIn";
import Confetti from "react-confetti";

import useWindowSize from "@/utils/useWindowSize";

// -----------------------
// page container
// -----------------------

const MintPage = observer((props: any) => {
  //
  const store = useRootStore();
  const isLoggedIn = store.elrond.isLoggedIn;
  const size = useWindowSize();
  const { skipTimeLeft } = props;

  const renderContent = () => {
    if (isLoggedIn) {
      return <MintPageLoggedIn skipTimeLeft={skipTimeLeft} />;
    }

    return <MintPageLoggedOut />;
  };

  return (
    <div className={s.pageContainer}>
      <div className={cn("container select-none", s.containerSizer)}>
        <Logo />
        {renderContent()}
        <div className="text-xs mt-2 font-semibold">
          built with 3 layers of 🧠
        </div>
      </div>
      <ToastsRenderer />
      {store.presale.showConfetti && (
        <Confetti
          width={size.width}
          height={size.height}
          numberOfPieces={400}
        />
      )}
    </div>
  );
});

const ToastsRenderer = observer(() => {
  const store = useRootStore();
  const allToasts = store.toasts.activeArr;

  return (
    <div className={s.toastsContainer}>
      {allToasts.map((toast: any) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
});

const Toast = observer(({ toast }: any) => {
  //
  const store = useRootStore();
  const isTransaction = toast.data?.isTransaction;
  const txUrl = `${process.env.NEXT_PUBLIC_URLS_EXPLORER}transactions/${toast.id}`;

  const renderData = () => {
    if (toast.data.successMint) {
      const nft_indices = toast.data.nft_indices;

      return (
        <div>
          You have minted deainostri{" "}
          {nft_indices.map((idx: any) => `#${idx}`).join(", ")}
        </div>
      );
    }
  };

  return (
    <div
      className={cn(s.toast, {
        [s.fail]: toast.type === "error",
        [s.success]: toast.type === "success",
      })}
    >
      <div className="flex-1 pl-1 flex flex-col pr-5">
        <div>{toast.message}</div>
        {renderData()}
        {isTransaction ? (
          <div className="mt-1">
            <a
              href={txUrl}
              target="_blank"
              className="underline cursor-pointer"
              rel="noreferrer"
            >
              Transaction Link
            </a>
          </div>
        ) : null}
      </div>
      <div className="">
        <div
          className="rounded-full bg-white text-black"
          onClick={() => store.toasts.hide(toast.id)}
        >
          <IoClose className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

// -----------------------
// logo
// -----------------------

const Logo = () => {
  return (
    <div className={s.logo}>
      <div>deainostri</div>
      <div>public sale</div>
    </div>
  );
};

// -----------------------
// logged out
// -----------------------

const MintPageLoggedOut = observer(() => {
  //
  const store = useRootStore();

  return (
    <>
      <div className={s.headerImage} />
      <div className={cn(s.content, s.loggedOutContent)}>
        <Button
          className="py-2 flex items-center"
          onClick={() => store.elrond.setConnectModalOpen(true)}
        >
          <IoFlashSharp className="mr-2 w-4 h-4" /> Connect
        </Button>
      </div>
    </>
  );
});

export default MintPage;
