// styles
import "../styles/globals.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// components
import AccountModal from "@/aragorn/components/AccountModal";
import ConnectModal from "@/aragorn/components/ConnectModal";
import MaiarAppModal from "@/aragorn/components/MaiarAppModal";
import ToastsRenderer from "@/components/Toasts/ToastsRenderer";

// state
import { useRootStore } from "@/state/RootStore";

// utils
import { isServer } from "@/utils/isServer";
import { useEffect } from "react";
import { withRouter } from "next/router";
import { useSWRConfig } from "swr";

function MyApp({ Component, pageProps, router }: any) {
  const appStore = useRootStore();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!isServer) {
      appStore.hydrateIfNeeded({}, router, mutate);
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ConnectModal />
      <MaiarAppModal />
      <AccountModal />
      <ToastsRenderer />
      <div id="overlays" />
    </>
  );
}

export default withRouter(MyApp);
