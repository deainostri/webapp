//
import cn from "classnames";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import s from "./Modal.module.scss";

const Modal = (props: any) => {
    const [isClient, setIsClient] = useState(false);
    const { open, children, className, overlayClassName } = props;

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    if (
        typeof document == "undefined" ||
        !document.querySelector("#overlays")
    ) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={cn(s.overlay, { [s.isOpen]: open }, overlayClassName)}>
            <section className={cn(s.root, className)}>{children}</section>
        </div>,
        document.querySelector("#overlays") as any
    );
};

export default Modal;
