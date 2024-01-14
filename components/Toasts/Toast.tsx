// icons
import { IoClose } from "react-icons/io5";

// utils
import cn from "classnames";
import { observer } from "mobx-react";
import { useRootStore } from "@/state/RootStore";

// styles
import s from "./ToastsRenderer.module.scss";

//
const Toast = observer(({ toast }: any) => {
  //
  const store = useRootStore();
  const isTransaction = toast.data?.isTransaction;
  const txUrl = `${process.env.NEXT_PUBLIC_URLS_EXPLORER}transactions/${
    toast.data?.txHash || toast.id
  }`;

  const renderData = () => {
    return null;
  };

  return (
    <div
      className={cn(s.toast, {
        [s.fail]: toast.type === "error",
        [s.success]: toast.type === "success",
      })}
    >
      <div className="flex-1 pl-2 flex flex-col pr-6 overflow-hidden w-full">
        <div>{toast.message}</div>
        {renderData()}
        {isTransaction ? (
          <div className="-mt-1">
            <a
              href={txUrl}
              target="_blank"
              className="underline cursor-pointer text-xs leading-none"
              rel="noreferrer"
            >
              Explorer
            </a>
          </div>
        ) : null}
      </div>
      <div className="">
        <div
          className="rounded-full bg-white text-black cursor-pointer"
          onClick={() => store.toasts.hide(toast.id)}
        >
          <IoClose className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

export default Toast;
