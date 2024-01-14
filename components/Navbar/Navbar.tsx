import { useState, useEffect } from "react";
import cn from "classnames";
import Link from "next/link";
import { NAVBAR_LINKS } from "@/configs/constants";
import { BiMenu } from "react-icons/bi";
import { IoFlashSharp } from "react-icons/io5";

import styling from "./Navbar.module.scss";
import { Button } from "@/components";
import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { IoLogOut } from "react-icons/io5";
import scrollToElem from "@/utils/scrollToElem";
import TrimmedAddress from "@/aragorn/components/TrimmedAddress";

const Navbar = observer((props: any) => {
  const store = useRootStore();
  const [isNavbarSmall, setIsNavbarSmall] = useState(false);
  // const location = useLocation();

  const shrinkNavbar = () => {
    if (window.scrollY >= 20) {
      setIsNavbarSmall(true);
    } else {
      setIsNavbarSmall(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", shrinkNavbar);
    return () => {
      window.removeEventListener("scroll", shrinkNavbar);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={cn(styling.root, "container")} id="navbar">
      <div
        className={cn(styling["navbar-content"], {
          [styling["navbar-content--active"]]: isNavbarSmall,
        })}
      >
        <div onClick={props.onShowMenu} className={styling["navbar-menu"]}>
          <div className={styling["navbar-menu_icon"]}>
            <BiMenu className="w-8 h-8" />
          </div>
        </div>

        <div className={cn(styling.logo, "flex flex-row items-center")}>
          <Link href="/">
            <div className="text-lg text-app-textheader font-bold">
              deainostri
            </div>
          </Link>
        </div>

        <div className={styling["navbar-items"]}>
          <div className={styling["navbar-links"]}>
            {NAVBAR_LINKS.map((link) => (
              <div key={link.id}>
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => scrollToElem(link.link)}
                >
                  {link.title}
                </Button>
              </div>
            ))}
            {store.elrond.isConnected ? (
              <div className="flex flex-row items-center space-x-2">
                <div
                  className="text-xs border-2 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => store.ui.setAccountModalOpen(true)}
                >
                  <TrimmedAddress
                    size={5}
                    address={store.elrond.address.toString()}
                  />
                </div>
                <div
                  className="text-xs border-2 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => store.elrond.logout()}
                >
                  <IoLogOut className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <Button
                className="py-2 flex items-center"
                size="sm"
                onClick={() => store.elrond.setConnectModalOpen(true)}
              >
                <IoFlashSharp className="mr-2 w-4 h-4" /> Conecteaza-te
              </Button>
            )}
          </div>

          <div className={styling["navbar-mobile-connect"]}>
            {store.elrond.isConnected ? (
              <div className="flex flex-row items-center space-x-2">
                <div
                  className="text-xs border-2 rounded-lg p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => store.ui.setAccountModalOpen(true)}
                >
                  <TrimmedAddress size={4} address={store.elrond.address} />
                </div>
              </div>
            ) : (
              <Button
                className="flex items-center w-10 h-10"
                onClick={() => store.elrond.setConnectModalOpen(true)}
                style={{ padding: 1 }}
              >
                <IoFlashSharp className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Navbar;
