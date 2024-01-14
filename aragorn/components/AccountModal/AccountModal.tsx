//
import Modal from "@/components/Modal";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Button } from "../../../components";
import TrimmedAddress from "../TrimmedAddress";
import { BiUserCircle } from "react-icons/bi";

const ProfileInfo = observer(({ herotag, pictureUrl }: any) => {
  return (
    <div className="my-2 flex flex-row items-center">
      {!pictureUrl ? (
        <BiUserCircle className="mr-2 w-5 h-5" />
      ) : (
        <div
          className="rounded-full w-8 h-8 mr-2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${pictureUrl})`,
          }}
        ></div>
      )}
      <span>{herotag || `My Account`}</span>
    </div>
  );
});

const AccountModal = observer((props: any) => {
  const store = useRootStore();
  const isOpen = store.ui.accountModalOpen;
  // const { data: accountData } = useSCSWR(
  //     `/api/wallet/info/${store.elrond.address}`
  // );
  const accountData: any = {};

  const closeModal = () => store.ui.setAccountModalOpen(false);

  useEffect(() => {
    if (!store.elrond.address) {
      closeModal();
    }
  }, [store.elrond.address]);

  return (
    <Modal
      open={store.ui.accountModalOpen}
      className="bg-white rounded-lg text-black w-full max-w-sm overflow-hidden max-h-full flex flex-col"
      onOutsideClick={() => closeModal()}
    >
      <div className="flex flex-row justify-between items-center px-5 pt-5">
        {/* <div className="text-xl">Your Account</div> */}
        <ProfileInfo
          herotag={accountData?.herotag}
          pictureUrl={accountData?.pictureUrl}
        />
        <div
          className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white cursor-pointer"
          onClick={() => closeModal()}
        >
          <IoClose className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="my-4 flex flex-col px-5">
          <div className="text-sm text-gray-700">Your Address</div>
          <div className="mt-1 p-2 rounded-lg shadow-sm bg-gray-100 text-gray-900 border-2 cursor-pointer">
            <TrimmedAddress address={store.elrond.address} />
          </div>
        </div>

        <div className="my-4 flex flex-col px-5"></div>

        <div className="my-4 flex flex-col flex-1"></div>
      </div>

      <div className="py-4 px-5 flex flex-col bg-gray-200 flex-0">
        <Button
          variant="cta"
          onClick={() => {
            closeModal();
            store.elrond.logout();
          }}
        >
          Disconnect
        </Button>
      </div>
    </Modal>
  );
});

export default AccountModal;
