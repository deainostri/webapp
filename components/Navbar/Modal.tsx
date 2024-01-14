// utils
import cn from "classnames";
import ReactDOM from "react-dom";
import { Fragment, useEffect, useState } from "react";

import styling from "./Modal.module.scss";

const ModalOverlay = (props: any) => {
  return (
    <div className={cn(styling["modal"], props.className)}>
      <div className={cn(styling["content"], props.contentClassName)}>
        {props.children}
      </div>
    </div>
  );
};

const Modal = (props: any) => {
  const [portalElement, setPortalElement]: any = useState(null);
  const { children, ...otherProps } = props;

  useEffect(() => {
    setPortalElement(document.getElementById("overlays"));
  });

  return (
    <Fragment>
      {portalElement &&
        ReactDOM.createPortal(
          <ModalOverlay {...otherProps}>{children}</ModalOverlay>,
          portalElement as any
        )}
    </Fragment>
  );
};

export default Modal;
