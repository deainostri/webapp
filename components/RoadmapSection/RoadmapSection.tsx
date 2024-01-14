//
import cn from "classnames";
import { IoCheckmark, IoTime } from "react-icons/io5";
import ShowWhenInView from "../ShowWhenInView";

const RoadmapSection = (props: any) => {
  return (
    <>
      <div id="roadmap" className="container flex flex-col items-center">
        <ShowWhenInView>
          <h2 className="text-xl text-pallete-secondary uppercase font-header">
            {`care este`}
          </h2>
        </ShowWhenInView>

        <ShowWhenInView>
          <h2 className="text-4xl text-pallete-primary uppercase font-header">
            roadmap-ul
          </h2>
        </ShowWhenInView>
      </div>
      <div className="container md:max-w-3xl relative py-4 space-y-14">
        <hr className="absolute border-l h-full top-0 left-9 hidden md:block" />

        <RoadmapItem
          title="Concept &amp; Design"
          description="Ideea de baza ca un NFT ar putea contine trasaturi vizuale cunoscute de noi toti, ca ne putem regasi cu totii in el intr-un fel sau altul, ne-a facut sa fixam ideea si sa incepem sa proiectam intregul proces. Deainostri nu sunt doar simple imagini, ci sunt noi. Asa ca, dupa multe iteratii de design, credem ca ceea ce puteti vedea astazi, este amestecul perfect de imagini digitale si referinte sociale pentru a crea mai multe parteneriate pe parcurs."
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          title="Social Media Campaign & Website"
          description={
            <>
              <div>
                Colectia fiind completa si gata de mintat, e timpul sa facem
                proiectul cunoscut prin publicarea proiectului pe toate
                platformele sociale (Discord, Telegram, Twitter, Instagram).
              </div>
            </>
          }
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          title="incepem Evenimentele Giveaway"
          description="Realizam o multitudine de giveaway-uri pentru a raspandi proiectul nostru. In afara de NFT-uri deainostri, premiile sunt si in EGLD.

                    Pe langa aceste evenimente de promovare, incep si evenimentele de giveway recurente odata cu pornirea public sale-ului.
                    "
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          title="Presale"
          description={
            <>
              <div>
                Credem in a fi un &quot;early adopter&quot;. De aceea organizam
                un presale pentru membrii comunitatii care merita sa participe
                la acest eveniment.
              </div>

              <div className="mt-2">
                500 de NFT-uri vor fi puse la bataie pentru un numar maxim de
                2000 de adrese.
              </div>
            </>
          }
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          title="Lansare Publica"
          description="Evenimentul de presale a luat sfarsit. Acum este momentul sa lansam proiectul pentru toata lumea!"
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          title="Castiguri Pasive"
          description="in afara de evenimente si giveaway-uri exclusive, acum premiem si mai mult pe cei care detin NFT deainostri. Sistemul Hold-2-Earn este activat si adaptat pe parcurs. Urmand strategia mentionata in locurile special amenajate, dam drumul la airdrops."
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          disabled
          title="Platforma Merch"
          description="Iti plac merch-urile? Perfect! 
                    Am dezvoltat propria noastra platforma prin care poti sa-ti cumperi merch cu EGLD.
                    
                    Pentru o anumita suma de EGLD poti cumpara un merch fie cu NFT-urile detinute de catre tine ori cu altele. Detinatorii NFT-urilor folosite in cumpararea unui merch vor fi rasplatiti in EGLD. Asadar cu cat un NFT este mai popular, cu atat este mai valoros."
          IconComponent={IoCheckmark}
        />

        <RoadmapItem
          disabled
          title="Pagina Colectiei &amp; Buletin Digital"
          description="Deschidem o noua pagina pe platforma noastra web deainostri unde puteti naviga prin colectia deainostri, filtra NFT-urile dupa atribute, verifica raritatea si proprietarii acestora. In acelasi loc puteti, de asemenea, sa va vizualizati NFT-urile deainostri intr-un mod unic, distractiv si partajabil."
          IconComponent={IoCheckmark}
        />

        {/* <RoadmapItem
                    disabled
                    title="Donate to Charities"
                    description="Upon reaching various milestones, we are going to make donations to local charitable organizations. That's where you, the holder, come in. You have the power to decide to what charitable organizations we're going to donate to.

                    We're going to donate $20k when the first milestone is met = 25% of the collection is minted."
                    IconComponent={IoCheckmark}
                /> */}

        <RoadmapItem
          disabled
          title="Parteneriate"
          description="Mai multe idei de proiecte au fost schitate si sunt in curs de realizare pentru a oferi si mai multa utilitate. Cateva dintre acestea sunt: seriale de animatie de scurta durata care contin NFT-uri existente (NFT-ul tau deainostri ar putea deveni o celebritate a metaversului), figurine fizice exclusive deainostri, jocuri interconectate prin intermediul unei platforme metaverse, posibilitatea de a oferi branding in timp ce detineti NFT-ul si multe altele."
          IconComponent={IoCheckmark}
        />

        {/* <RoadmapItem
                    disabled
                    title="More Drops"
                    description="First drop is sold out, lots of roadmap milestones have been achieved. In order to grow the community even more, next drops will be introduced to deainostri collection."
                    IconComponent={IoCheckmark}
                /> */}

        <RoadmapItem
          disabled
          title="Cum arata viitorul?"
          description="Nimeni nu stie cum va arata viitorul, insa cel mai probabil va contine un nou statut social, jocuri, mai multe drop-uri, mai multe optiuni de merch, parteneriate si multe altele. Cu siguranta voi ne veti ajuta sa formam impreuna viitorul!"
          IconComponent={IoCheckmark}
        />
      </div>
    </>
  );
};

const RoadmapItem = (props: any) => {
  const { title, disabled, description, imgSrc } = props;

  let IconComponent = disabled ? IoTime : IoCheckmark;

  return (
    <ShowWhenInView>
      <div className="relative flex flex-col-reverse md:flex-row items-center space-x-4">
        <div className="relative flex flex-col">
          <div className="flex flex-col md:flex-row justify-center md:justify-start items-center md:space-x-5">
            <div
              className={cn(
                "hidden md:flex items-center justify-center w-10 h-10 rounded-full text-white self-center md:self-start flex-shrink-0",
                {
                  ["bg-pallete-secondary"]: disabled,
                  ["bg-pallete-primary"]: !disabled,
                }
              )}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            {!disabled ? (
              <div className="flex md:hidden text-white bg-pallete-primary rounded-lg px-2 py-1 text-xs mb-2">
                DONE
              </div>
            ) : (
              <div className="flex md:hidden text-white bg-pallete-secondary rounded-lg px-2 py-1 text-xs mb-2">
                SOON
              </div>
            )}
            <div
              className={cn("font-header text-3xl text-center md:text-left", {
                ["text-pallete-secondary"]: disabled,
                ["text-pallete-primary"]: !disabled,
              })}
            >
              {title}
            </div>
          </div>
          <div className="text-justify md:ml-16">{description}</div>
        </div>
      </div>
    </ShowWhenInView>
  );
};

export default RoadmapSection;
