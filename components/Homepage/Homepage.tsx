// components
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar/Navbar";
import NavbarMenu from "@/components/Navbar/NavbarMenu";

// state
import { useRootStore } from "@/state/RootStore";

// utils
import { observer } from "mobx-react";

const Homepage = observer(({}: any) => {
  const store = useRootStore();

  return (
    <>
      {store.ui.menuIsOpen && (
        <NavbarMenu onClose={() => store.ui.setIsMenuOpen()} />
      )}
      <Navbar onShowMenu={() => store.ui.setIsMenuOpen()} />
      <Hero />
    </>
  );
});

export default Homepage;
