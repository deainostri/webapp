//
import { IoWallet } from "react-icons/io5";
import { BsGrid } from "react-icons/bs";
import ShowWhenInView from "../ShowWhenInView";
import EgldIcon from "@/aragorn/icons/EgldIcon";

const HowItWorksSection = (props: any) => {
  return (
    <div className="py-20 " style={{ background: "#308BFF" }}>
      <div className="container flex flex-col items-center">
        <ShowWhenInView>
          <h2 className="text-xl text-white uppercase font-header">cum</h2>
        </ShowWhenInView>

        <ShowWhenInView>
          <h2 className="text-4xl text-pallete-primary uppercase font-header">
            functioneaza
          </h2>
        </ShowWhenInView>

        <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-8 justify-center items-stretch mt-4">
          <HowItWorksItem
            title="Conecteaza-te"
            description="Mai usor decat te astepti! Foloseste aplicatia Maiar sau Elrond Web Wallet pe site-ul deainostri.com pentru a te autentifica"
            IconComponent={IoWallet}
          />

          <HowItWorksItem
            title="Mint-uieste"
            description="Avem propriul nostru Smart Contract prin care poti mint-ui NFT deainostri fara nicio taxa ascunsa."
            IconComponent={BsGrid}
          />

          <HowItWorksItem
            title="Pastreaza"
            description="In ecosistemul deainostri te rasplatim prin metode HOLD-2-EARN pentru faptul ca pastrezi NFT-ul pe care l-ai cumparat."
            IconComponent={IoWallet}
          />

          <HowItWorksItem
            title="Foloseste si Profita"
            description="Foloseste NFT-ul tau deainostri pe platforma noastra pentru a te bucura de toate beneficiile."
            IconComponent={EgldIcon}
          />
        </div>
      </div>
    </div>
  );
};

const HowItWorksItem = ({ IconComponent, title, description }: any) => {
  return (
    <ShowWhenInView className="flex-1">
      <div className="flex flex-col space-y-2 text-center lg:text-left max-w-xs border-2 rounded-xl p-4 bg-white h-full overflow-hidden">
        <div className="flex items-center justify-center w-10 h-10 bg-pallete-primary rounded-full text-white self-center lg:self-start">
          <IconComponent className="w-6 h-6" />
        </div>
        <h2
          className="text-pallete-secondary uppercase font-header"
          style={{ marginTop: "1rem" }}
        >
          {title}
        </h2>
        <div className="text-sm">{description}</div>
      </div>
    </ShowWhenInView>
  );
};

export default HowItWorksSection;
