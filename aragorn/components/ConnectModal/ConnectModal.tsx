//
import Modal from "@/components/Modal";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { IoClose, IoArrowForward } from "react-icons/io5";
import ElrondWebWalletIcon from "../../icons/ElrondWebWalletIcon";
import MaiarAppIcon from "../../icons/MaiarAppIcon";
import MaiarWalletIcon from "../../icons/MaiarWalletIcon";

const ConnectModal = observer((props: any) => {
  const store = useRootStore();
  const { elrond: elrondStore } = store;
  const isOpen = elrondStore.connectModalOpen;

  useEffect(() => {
    if (store.elrond.address) {
      store.elrond.setConnectModalOpen(false);
    }
  }, [store.elrond.address]);

  return (
    <Modal
      open={isOpen}
      className="bg-white p-5 rounded-lg text-black w-full max-w-sm"
    >
      <div className="flex flex-row justify-between items-center">
        <div>Connect to a wallet</div>
        <div
          className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white cursor-pointer"
          onClick={() => elrondStore.setConnectModalOpen(false)}
        >
          <IoClose className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        <div
          className="border rounded-lg py-2 px-3 flex flex-row items-center bg-gray-100 cursor-pointer"
          onClick={() => elrondStore.login.extension.login()}
        >
          <div className="w-8 flex items-center justify-center">
            <MaiarWalletIcon />
          </div>
          <div className="ml-2 flex-1">Maiar Web Wallet</div>
          <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
            <IoArrowForward className="w-4 h-4" />
          </div>
        </div>

        <div
          className="border rounded-lg py-2 px-3 flex flex-row items-center bg-gray-100 cursor-pointer"
          onClick={() => elrondStore.toggleMaiarAppModal()}
        >
          <div className="w-8 flex items-center justify-center">
            <MaiarAppIcon />
          </div>
          <div className="ml-2 flex-1">Maiar App</div>
          <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
            <IoArrowForward className="w-4 h-4" />
          </div>
        </div>

        <div
          className="border rounded-lg py-2 px-3 flex flex-row items-center bg-gray-100 cursor-pointer"
          onClick={() => elrondStore.login_wallet()}
        >
          <div className="w-8 flex items-center justify-center">
            <ElrondWebWalletIcon />
          </div>
          <div className="ml-2 flex-1">Elrond Web Wallet</div>
          <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
            <IoArrowForward className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ConnectModal;
