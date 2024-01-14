import Modal from "./Modal";
import NavbarLinks from "../Button/NavbarLinks";
import { NAVBAR_LINKS } from "@/configs/constants";

import styles from "./NavbarMenu.module.scss";
import Navbar from "./";
import { useRootStore } from "@/state/RootStore";
import scrollToElem from "@/utils/scrollToElem";

const NavbarMenu = (props: any) => {
  const store = useRootStore();

  const onClose = (link: any) => {
    if (link) {
      scrollToElem(link);
    }

    props.onClose();
  };

  return (
    <Modal onClose={props.onClose} className={styles.modalContainer}>
      <Navbar onShowMenu={() => store.ui.setIsMenuOpen()} />
      <div className={styles["navbar"]}>
        <div className="container">
          <div className={styles["navbar-content"]}>
            <div className={styles["navbar-menu"]}>
              <div onClick={props.onClose} className={styles["navbar-exit"]}>
                lol exit
              </div>
            </div>
          </div>

          <div className={styles["navbar-open"]}>
            <div className={styles["navbar-links"]}>
              {NAVBAR_LINKS.map((link) => (
                <div key={link.id} className={styles["navbar-links_button"]}>
                  <NavbarLinks
                    onClick={() => onClose(link.link)}
                    link={link.link}
                    title={link.title}
                  />
                </div>
              ))}
            </div>
            <div className={styles["navbar-socials"]}></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NavbarMenu;
