// components
import Expand from "react-expand-animated";
import { IoRemove, IoAdd } from "react-icons/io5";

// utils
import { useState } from "react";
import { isServer } from "@/utils/isServer";
import ShowWhenInView from "../ShowWhenInView";

const FAQ = (props: any) => {
  const [openValue, setOpenValue]: any = useState(null);

  const onItemToggle = (value: any) =>
    openValue === value ? setOpenValue(null) : setOpenValue(value);

  return (
    <div className="flex flex-col space-y-2" id="faq">
      <FAQItem
        openValue={openValue}
        value="how-large"
        title="Cat de mare este colectia?"
        onToggle={onItemToggle}
      >
        <p className="text-app-textbody text-justify">
          Colectia contine 5,500 de NFT-uri unice generate.
        </p>
      </FAQItem>
      <FAQItem
        openValue={openValue}
        value="how-to-purchase"
        title="Cum cumpar un deainostri?"
        onToggle={onItemToggle}
      >
        <p className="text-app-textbody text-justify">
          Poti cumpara un NFT deainostri de pe acest site, deainostri.com. De
          asemenea, poti castiga un NFT si din concursurile pe care le
          organizam.
        </p>
      </FAQItem>
      <FAQItem
        openValue={openValue}
        value="giveaways"
        title="O sa fie consursuri giveaway?"
        onToggle={onItemToggle}
      >
        <p className="text-app-textbody text-justify">
          Cu siguranta! Concursurile giveaway fac parte din comunitatea noastra
          si speram sa organizam un astfel de concurs o data la doua saptamani.
        </p>
      </FAQItem>
      <FAQItem
        openValue={openValue}
        value="will-be-presale"
        title="O sa fie un presale?"
        description="Presale s-a incheiat si s-a vandut in 45 de secunde. Singura ta sansa de a obtine un deainostri este sa il mintezi in vanzarea noastra publica."
        onToggle={onItemToggle}
      />
      <FAQItem
        openValue={openValue}
        value="11"
        title="Cand va incepe vanzarea publica?"
        description="A inceput deja!"
        onToggle={onItemToggle}
      />
      <FAQItem
        openValue={openValue}
        value="12"
        title="Care este pretul unui deainostri?"
        description={
          <div>Puteti mint-ui un deainostri NFT la pretul de 1 EGLD</div>
        }
        onToggle={onItemToggle}
      />
      <FAQItem
        openValue={openValue}
        value="13"
        title="Care sunt taxele de royalties?"
        description={
          <>
            <div>0% !</div>
            <div>
              Ei bine, aproape. Ai 80% intr-o clipa, iar noi rezervam 20% pentru
              a-i da inapoi comunitatii noastre loiale. intreaga strategie este
              explicata in sectiunea Hold 2 Earn.
            </div>
          </>
        }
        onToggle={onItemToggle}
      />
    </div>
  );
};

const FAQItem = (props: any) => {
  const { openValue, value, title, children, description, onToggle } = props;
  const isOpen = value === openValue;

  if (isServer) {
    return null;
  }

  return (
    <ShowWhenInView>
      <div className="md:border-2 md:bg-white rounded-md p-2 md:pl-3">
        <div
          className="flex flex-row justify-between items-center font-bold cursor-pointer uppercase"
          onClick={() => onToggle(value)}
        >
          {title}
          <div className="p-2 rounded-lg shadow-sm cursor-pointer text-white bg-pallete-primary">
            {isOpen ? (
              <IoRemove className="w-5 h-5" />
            ) : (
              <IoAdd className="w-5 h-5" />
            )}
          </div>
        </div>
        <Expand open={isOpen}>
          <div className="flex flex-col">
            <hr className="mt-2 mb-4" />
            {description || children}
          </div>
        </Expand>
      </div>
    </ShowWhenInView>
  );
};

export default FAQ;
