// components
import { Button } from "@/components";
import FAQ from "@/components/FAQ";
import Carousel from "@/components/Carousel";
import Homepage from "@/components/Homepage";
import RoadmapSection from "@/components/RoadmapSection";
import ShowWhenInView from "@/components/ShowWhenInView";
import ToastsRenderer from "@/components/Toasts/ToastsRenderer";
import HoldToEarnSection from "@/components/HoldToEarnSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SideBySideSections from "@/components/SideBySideSections";

// icons
import { SiDiscord, SiTelegram, SiInstagram, SiTwitter } from "react-icons/si";

// utils
import Head from "next/head";
import { NextPage } from "next";

const SocialButton = ({ IconComponent, link, size }: any) => {
  return (
    <a target="_blank" rel="noreferrer" href={link}>
      <IconComponent className={`w-${size || 6} h-${size || 6}`} />
    </a>
  );
};

const IndexPage: NextPage = () => {
  //

  return (
    <>
      <Head>
        <title>deainostri</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homepage />

      <div className="bg-pallete-secondary h-14 text-gray-100 flex items-center">
        <div className="container flex md:justify-between justify-center items-center">
          <div className="hidden md:flex font-semibold">
            Urmareste-ne pe platformele tale social media preferate
          </div>
          <div className="flex flex-row items-center space-x-6">
            <SocialButton
              IconComponent={SiDiscord}
              link="https://discord.gg/deainostri"
            />
            <SocialButton
              IconComponent={SiTelegram}
              link="https://t.me/deainostri"
            />
            <SocialButton
              IconComponent={SiInstagram}
              link="https://www.instagram.com/deainostri/"
            />
            <SocialButton
              IconComponent={SiTwitter}
              link="https://twitter.com/deainostri"
            />
          </div>
        </div>
      </div>

      <div className="space-y-10 py-10">
        <ShowWhenInView>
          <div
            id="about"
            className="container flex flex-col md:flex-row items-center justify-center"
          >
            <div className="flex flex-col space-y-6 text-center md:text-left max-w-md md:max-w-xl justify-center flex-1 md:mr-6">
              <h2 className="text-4xl text-pallete-primary uppercase font-header">
                Ce este deainostri?
              </h2>
              <p className="text-app-textbody text-justify">
                Deainostri este o colectie de 5,500 de NFT-uri pe blockchain-ul
                Elrond cu personaje care reprezinta stereotipurile Romanesti.
              </p>
              <p className="text-app-textbody text-justify">
                Ideea ca un NFT poate contine trasaturi vizuale cunoscute de
                catre noi toti, in care ne-am putea regasi chiar si putin, ne-a
                motivat sa &quot;pariem&quot; pe ea si sa trecem la treaba.
                Deainostri nu sunt doar niste poze, sunt noi.
              </p>
              <p className="text-app-textbody text-justify">
                Aceasta colectie nu este numai irezistibila, ci si haioasa si
                profitabila. Deainostri este unul din primele proiecte de NFT pe
                blockchain-ul Elrond care isi propune sa ofere utilitate reala.
              </p>
              <div className="flex flex-col md:flex-row items-center self-center md:self-stretch space-y-4 md:space-y-0 md:space-x-4">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://discord.gg/deainostri"
                >
                  <Button className="w-36">
                    <SiDiscord className="w-4 h-4 mr-2" /> Discord
                  </Button>
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://t.me/deainostri"
                >
                  <Button variant="quiet" className="w-36">
                    <SiTelegram className="w-4 h-4 mr-2" /> Telegram
                  </Button>
                </a>
              </div>
            </div>
            <div
              className="flex-1 w-full md:w-auto"
              style={{
                minHeight: 500,
                backgroundImage: `url(${"/assets/images/deainostri_collection_mini.png"})`,
                backgroundPosition: "center center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </ShowWhenInView>

        <Carousel />

        <SideBySideSections />

        <HowItWorksSection />

        <HoldToEarnSection />

        <RoadmapSection />

        <div className="container flex flex-col items-center">
          <div className="container flex flex-col items-center mb-4">
            <ShowWhenInView>
              <h2 className="text-xl text-pallete-secondary uppercase font-header">
                ce? cum? cand?
              </h2>
            </ShowWhenInView>

            <ShowWhenInView>
              <h2 className="text-4xl text-pallete-primary uppercase font-header">
                FAQ
              </h2>
            </ShowWhenInView>
          </div>
          <FAQ />
        </div>
      </div>

      <div className="py-20" style={{ background: "#e1e3de" }}>
        <div className="container flex flex-col">
          <h2 className="text-5xl uppercase font-header mb-4">
            Asta e tot, oameni buni
          </h2>
          <div className="max-w-2xl">
            <p>
              Ajutati-ne sa modelam viitorul deainostri si sa deblocam
              recompense pentru membrii comunitatii si pentru ambasadori!
            </p>
          </div>
          <hr className="my-5 border-black opacity-10" />
          <div className="flex flex-col items-end">
            <div className="mb-4">Urmariti-ne pentru actualizari</div>
            <div className="flex flex-row items-center space-x-6">
              <SocialButton
                IconComponent={SiTelegram}
                link="https://t.me/deainostri"
              />
              <SocialButton
                IconComponent={SiInstagram}
                link="https://www.instagram.com/deainostri/"
              />
              <SocialButton
                IconComponent={SiDiscord}
                link="https://discord.gg/deainostri"
              />
              <SocialButton
                IconComponent={SiTwitter}
                link="https://twitter.com/deainostri"
              />
            </div>
          </div>
        </div>
      </div>

      <ToastsRenderer />
    </>
  );
};

export default IndexPage;
