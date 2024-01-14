//
import cn from "classnames";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { IoFlashSharp, IoLogOut } from "react-icons/io5";
import Button from "../Button/Button";
import s from "./WhitelistPage.module.scss";
import useSCSWR from "@/utils/useSCSWR";

const whitelist_time = new Date();
whitelist_time.setTime(1644670583636);

const WhitelistPage = observer((props: any) => {
  //
  const store = useRootStore();
  const isLoggedIn = store.elrond.isLoggedIn;

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col overflow-auto text-gray-200"
      style={{ background: "#1d1d1d" }}
    >
      <div className={s.containerWrapper}>
        {isLoggedIn ? <WhitelistPage_LoggedIn /> : <WhitelistPage_LoggedOut />}
      </div>
    </div>
  );
});

const WhitelistPage_LoggedIn = observer(() => {
  //
  const store = useRootStore();
  const address = store.elrond.address;
  let { data: isWhitelisted }: any = useSCSWR(
    `/api/whitelist/${store.elrond.address}`
  );

  const isLoading = isWhitelisted == "success" || isWhitelisted == "invalid";

  isWhitelisted = isWhitelisted === "success";

  const renderContent = () => {
    if (isLoading) {
      <div>loading...</div>;
    }

    const whitelist_text = isWhitelisted ? (
      <div>
        <div>Congrats!</div>
        <div>You&apos;re in for a nice treat!</div>
      </div>
    ) : (
      <div>
        <div>
          You either already minted a deainostri or you never encountered the
          error!
        </div>
      </div>
    );

    return (
      <>
        <img
          style={{ width: "50%" }}
          src={`/assets/images/${
            isWhitelisted ? "whitelist_success.png" : "whitelist_invalid.png"
          }`}
        />
        <div className="text-xl text-pallete-fourth uppercase font-header text-center">
          {whitelist_text}
        </div>
        <code className="text-xs overflow-hidden break-all w-full text-center">
          {address}
        </code>
        {!isWhitelisted && (
          <div className="text-sm text-pallete-fourth text-center">
            If you believe you qualify for the additional presale please leave
            us a message on Discord!
          </div>
        )}
        <div
          className="text-xs border-2 rounded-lg p-2 cursor-pointer flex flex-row items-center space-x-2 hover:text-white"
          onClick={() => store.elrond.logout()}
        >
          <IoLogOut className="w-4 h-4" />
          <div>Logout</div>
        </div>
      </>
    );
  };

  return (
    <div className={cn(s.contentContainer, "center-me")}>
      <div className={s.headerImage} />
      <div className={cn(s.content)}>
        <div className="text-3xl text-pallete-primary uppercase font-header text-center">
          Are you in the additional presale?
        </div>
        {renderContent()}
      </div>
      <div className="text-xs mt-2 font-semibold">
        built with 3 layers of 🧠
      </div>
    </div>
  );
});

const WhitelistPage_LoggedOut = observer(() => {
  //
  const store = useRootStore();

  return (
    <div className={cn(s.contentContainer, "center-me")}>
      <div className={s.headerImage} />
      <div className={cn(s.content)}>
        <div className="text-3xl text-pallete-primary uppercase font-header text-center">
          Are you in the additional presale?
        </div>

        <Button
          className="py-2 flex items-center"
          onClick={() => store.elrond.setConnectModalOpen(true)}
        >
          <IoFlashSharp className="mr-2 w-4 h-4" /> Connect
        </Button>
      </div>
      <div className="text-xs mt-2 font-semibold">
        built with 3 layers of 🧠
      </div>
    </div>
  );
});

export default WhitelistPage;
