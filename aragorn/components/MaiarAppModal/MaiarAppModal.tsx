//
import QRCode from "qrcode";
import Modal from "@/components/Modal";
import { Button } from "@/components";
import storage from "@/utils/storage";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

import { WalletConnectProvider } from "@elrondnetwork/erdjs-wallet-connect-provider";

const MaiarAppModal = observer((props: any) => {
  const { token } = props;
  const ref = useRef(null);
  const store = useRootStore();
  const [qrSvg, setQrSvg] = useState<string>("");
  const [wcUri, setWcUri] = useState<string>("");
  const { elrond: elrondStore } = store;
  const isOpen = elrondStore.maiarAppModalOpen;
  const walletConnect: any = elrondStore.maiarApp.walletConnect;

  useEffect(() => {
    if (isOpen) {
      console.log(`[maiar-modal] starting MaiarApp`);
      store.elrond.maiarApp.start();
    }
  }, [isOpen]);

  useEffect(() => {
    if (walletConnect && isOpen) {
      storage.local.removeItem("walletconnect");

      walletConnectLogin(walletConnect);

      if ("walletConnector" in walletConnect && walletConnect.walletConnector) {
        walletConnect.walletConnector.on("disconnect", () => {
          if (ref.current !== null) {
            walletConnectLogin(walletConnect);
          }
        });
      }
    }
  }, [walletConnect, token, ref, isOpen]);

  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  const isMobile = toMatch.some((toMatchItem) => {
    return typeof window !== "undefined"
      ? navigator.userAgent.match(toMatchItem)
      : false;
  });

  const svgQr: any = {
    dangerouslySetInnerHTML: {
      __html: qrSvg,
    },
    style: {
      width: "15rem",
      height: "15rem",
    },
  };

  const buildQrCode = () => {
    (async () => {
      if (wcUri && ref.current !== null) {
        const svg = await QRCode.toString(wcUri, {
          type: "svg",
        });
        setQrSvg(svg);
      }
    })();
  };

  const walletConnectLogin = (walletConnect: WalletConnectProvider) => {
    walletConnect.login().then((walletConectUri) => {
      if (token) {
        setWcUri(`${walletConectUri}&token=${token}`);

        store.elrond.setTokenLogin({
          loginToken: token,
        });
      } else {
        setWcUri(walletConectUri);
      }
    });
  };

  useEffect(buildQrCode, [wcUri]);

  return (
    <Modal
      open={isOpen}
      className="bg-white p-5 rounded-lg text-black w-full max-w-sm"
    >
      <div className="flex flex-row justify-between items-center">
        <div>Connect to a wallet</div>
        <div
          className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white cursor-pointer"
          onClick={() => elrondStore.toggleMaiarAppModal()}
        >
          <IoClose className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4" ref={ref}>
        <div className="mx-auto mb-3" {...svgQr} />
        {isMobile ? (
          <>
            <p className="lead mb-0">
              Scan the QR code using Maiar or click the button below to open the
              App.
            </p>
            <div className="flex flex-row justify-center">
              <a
                id="accessWalletBtn"
                data-testid="accessWalletBtn"
                className="btn btn-primary px-4 mt-4"
                href={`${
                  store.elrond.walletConnectDeepLink
                }?wallet-connect=${encodeURIComponent(wcUri)}`}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                <Button
                  className="py-2 flex items-center"
                  onClick={() => store.elrond.setConnectModalOpen(true)}
                >
                  Login with Maiar App
                </Button>
              </a>
            </div>
          </>
        ) : (
          <p className="lead mb-0">Scan the QR code using Maiar!</p>
        )}
      </div>
    </Modal>
  );
});

export default MaiarAppModal;
