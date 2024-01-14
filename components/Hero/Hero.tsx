//
import Button from "@/components/Button/Button";

// styles
import styles from "./Hero.module.scss";

// utils
import cn from "classnames";
import useSCSWR from "@/utils/useSCSWR";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useRootStore } from "@/state/RootStore";

const MintSection = observer(() => {
  //
  const store = useRootStore();
  const { data: pausedStatusData } = useSCSWR("/api/sc/getIsPaused");

  if (pausedStatusData !== "open") {
    return <Button variant="cta-disabled">Minting dezactivat</Button>;
  }

  if (!store.elrond.isLoggedIn) {
    return <Button variant="cta-disabled">Conecteaza-te pentru mint</Button>;
  }

  return (
    <Button variant="cta" onClick={async () => store.minting.try_sign_buy_tx()}>
      Mint 1x deainostri
    </Button>
  );
});

const Hero = observer((props: any) => {
  const store = useRootStore();

  return (
    <div className={styles.root}>
      <div className={cn(styles.wrapper, "container")}>
        <div className={cn(styles.textContainer)}>
          <h2 className="text-4xl font-bold text-pallete-primary uppercase font-header w-full">
            Descopera-i pe deainostri
          </h2>
          <p className="text-app-textbody w-full">
            Colectie creata sa reprezinte stereotipurile Romanesti cu ajutorul
            unor caracteristici specifice unor personaje autohtone.
          </p>
          <div className="flex flex-col md:flex-row items-center md:space-x-4 md:space-y-0">
            <MintSection />
          </div>
        </div>
        <div className={cn(styles.tvContainer)}>
          <div className={styles.tvContent}>
            <TVContent />
          </div>

          <div className={styles.tvBg}></div>
        </div>
      </div>
    </div>
  );
});

const TVContent = observer(() => {
  const store = useRootStore();

  useEffect(() => {
    store.ui.start_tv();
  }, []);

  const imgUrl = store.ui.tvStatic
    ? `/assets/images/static-tv-static.gif`
    : `/gogo/${store.ui.tvIndex}.jpg`;

  return <img key="lol" src={imgUrl} />;
});

export default Hero;
