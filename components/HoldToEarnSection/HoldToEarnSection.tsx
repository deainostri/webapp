//
import EgldIcon from "@/aragorn/icons/EgldIcon";
import { IoWallet, IoShirt, IoTicket, IoMegaphone } from "react-icons/io5";
import ShowWhenInView from "../ShowWhenInView";

const HoldToEarnSection = (props: any) => {
  return (
    <div className="container flex flex-col items-center" id="utility">
      <ShowWhenInView>
        <h2 className="text-xl text-pallete-secondary uppercase font-header">
          care este
        </h2>
      </ShowWhenInView>

      <ShowWhenInView>
        <h2 className="text-4xl text-pallete-primary uppercase font-header">
          utilitatea
        </h2>
      </ShowWhenInView>

      <DesktopSection />
      <MobileSection />
    </div>
  );
};

const EarnCard = ({ IconComponent, title, description }: any) => {
  return (
    <ShowWhenInView className="flex-1">
      <div className="flex flex-row space-y-2 text-justify lg:text-left w-full border-2 rounded-xl p-4 bg-white h-full">
        <div className="flex items-center justify-center w-10 h-10 bg-pallete-primary rounded-full text-white self-center lg:self-start flex-shrink-0 mr-4 mt-2">
          <IconComponent className="w-6 h-6 fill-white" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg text-pallete-secondary uppercase font-header">
            {title}
          </h2>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    </ShowWhenInView>
  );
};

const ALL_CARDS = {
  HOLD_TO_EARN: () => (
    <EarnCard
      IconComponent={EgldIcon}
      title="Airdrops"
      description={
        <ul className="space-y-2">
          <li>
            - 50% din royalties sunt investite intr-o ferma de tokeni.
            Castigurile din ferma sunt distribuite lunar holderilor deainostri.
          </li>
          <li>
            - mai mult de 5% din profitul facut din presale a fost distribuit
            inapoi catre holderi.
          </li>
        </ul>
      }
    />
  ),
  GIVEAWAYS: () => (
    <EarnCard
      IconComponent={IoMegaphone}
      title="Giveaway"
      description={
        <div className="space-y-2">
          <div>
            Giveaway-urile vor face parte mereu din comunitate. De cateva ori pe
            luna organizam giveaway-uri pentru holderi.
          </div>
          <ul>
            <li>
              - 50% din royalties sunt pastrati intr-un wallet pentru a fi
              folositi in concursuri si giveaway-uri.
            </li>
          </ul>
        </div>
      }
    />
  ),
  GAMING: () => (
    <EarnCard
      IconComponent={IoWallet}
      title="Mai mult"
      description={
        <div className="space-y-2">
          <div>
            Planul nostru este de durata si mai lung decat putem scrie aici.
            Momentan, avem un canal special pe server-ul nostru Discord unde
            puteti afla toate actualizarile facute strategiei Hold 2 Earn.
          </div>
        </div>
      }
    />
  ),
  PARTNERSHIPS: () => (
    <EarnCard
      IconComponent={IoTicket}
      title="Acces Exclusiv"
      description="Odata cu parteneriate noi, detinatorii de NFT deainostri vor putea beneficia de acces, promotii si giveaway-uri atat virtual cat si in viata reala."
    />
  ),
  MERCH: () => (
    <EarnCard
      IconComponent={IoShirt}
      title="Detine Merch-ul"
      description="Unul din primele sisteme de royalties pentru holders. Castiga EGLD fiind detinatorul unui NFT deainostri care este folosit in merch-ul cumparat!"
    />
  ),
};

const MobileSection = () => (
  <div className="lg:hidden flex flex-col space-y-4">
    <div className="flex-1">
      <ShowWhenInView>
        Credem ca un NFT nu este doar o poza, ci este un club privat. Succesul
        proiectului depinde de comunitate, de voi. NFT-ul trebuie sa aduca
        benificii fiecarui membru in comunitate. Trebuie sa castigam si sa
        crestem impreuna. De aceea am dezvoltat un sistem unic de a motiva si
        rasplati holderii deainostri:
      </ShowWhenInView>
    </div>

    <div className="flex-1">
      <div
        className="w-full h-full flex flex-col items-center bg-gray-200 flex-1 self-end -mb-4"
        style={{
          background: `url(/assets/images/hold-to-earn-bg.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        <img src="/assets/images/hold-to-earn.png" style={{ width: "75%" }} />
      </div>
    </div>

    {ALL_CARDS.HOLD_TO_EARN()}

    {ALL_CARDS.MERCH()}
    {ALL_CARDS.PARTNERSHIPS()}

    {ALL_CARDS.GIVEAWAYS()}
    {ALL_CARDS.GAMING()}
  </div>
);

const DesktopSection = () => (
  <div className="hidden lg:flex flex-col space-y-4">
    <div className="flex flex-row space-x-4">
      <div className="flex-1" />

      <div
        style={{
          flex: "2 0 0%",
        }}
      >
        <ShowWhenInView>
          Credem ca un NFT nu este doar o poza, ci este un club privat. Succesul
          proiectului depinde de comunitate, de voi. NFT-ul trebuie sa aduca
          benificii fiecarui membru in comunitate. Trebuie sa castigam si sa
          crestem impreuna. De aceea am dezvoltat un sistem unic de a motiva si
          rasplati holderii deainostri:
        </ShowWhenInView>
      </div>
    </div>

    <div className="flex flex-row space-x-4">
      <div
        className="w-full h-full flex flex-col items-center bg-gray-200 flex-1 self-end -mb-4"
        style={{
          background: `url(/assets/images/hold-to-earn-bg.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        <img src="/assets/images/hold-to-earn.png" style={{ width: "75%" }} />
      </div>

      {ALL_CARDS.MERCH()}
      {ALL_CARDS.PARTNERSHIPS()}
    </div>

    <div className="flex flex-row space-x-4">
      {ALL_CARDS.HOLD_TO_EARN()}
      {ALL_CARDS.GIVEAWAYS()}
      {ALL_CARDS.GAMING()}
    </div>
  </div>
);

export default HoldToEarnSection;
