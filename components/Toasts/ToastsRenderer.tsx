// components
import Toast from "./Toast";

// utils
import { observer } from "mobx-react";
import { useRootStore } from "@/state/RootStore";

// styles
import s from "./ToastsRenderer.module.scss";

//
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

export default ToastsRenderer;
