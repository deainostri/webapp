//
import ShowWhenInView from "@/components/ShowWhenInView";

const SideBySideSections = (props: any) => {
  return (
    <>
      <ShowWhenInView>
        <div
          id="features"
          className="container flex flex-col md:flex-row-reverse items-center justify-center md:justify-between text-sm"
        >
          <div className="flex flex-col space-y-6 text-center md:text-left max-w-md md:max-w-xl justify-center flex-1 md:ml-8">
            <h2 className="text-3xl text-pallete-primary uppercase font-header">
              PROPRIETATEA DEPLINA ASUPRA NFT ESTE ACORDATA CONSUMATORILOR
            </h2>
            <p className="text-app-textbody md:text-justify">
              Deschidem o noua zona in platforma noastra web unde puteti rasfoi
              si filtra dupa atribute si raritate toata colectia deainostri.
            </p>
            <p className="text-app-textbody md:text-justify">
              in acelasi loc puteti vizualiza NFT-urile intr-un mod haios, unic
              si share-friendly.
            </p>
            <p className="text-app-textbody md:text-justify font-semibold">
              Fii un detinator mandru, arate-le prietenilor ce deainostri ai!
            </p>
          </div>
          <div
            className="flex-1 md:max-w-xl w-full md:w-auto"
            style={{
              minHeight: 350,
              backgroundImage: `url(${"/assets/images/buletin.png"})`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </ShowWhenInView>

      <ShowWhenInView>
        <div className="container flex flex-col md:flex-row items-center justify-center md:justify-between text-sm">
          <div className="flex flex-col space-y-6 text-center md:text-left max-w-md md:max-w-xl justify-center flex-1 md:mr-8">
            <h2 className="text-3xl text-pallete-primary uppercase font-header">
              Access la evenimente si promotii
            </h2>
            <p className="text-app-textbody md:text-justify">
              Detinand cel putin un NFT deainostri iti asigura sansa de a
              participa la viitoare evenimente si promotii organizate de noi, de
              partenerii nostri sau la cele pe care le promovam chiar noi.
            </p>
          </div>
          <div
            className="flex-1 md:max-w-xl w-full md:w-auto"
            style={{
              minHeight: 500,
              backgroundImage: `url(${"/assets/images/exclusive-access.png"})`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </ShowWhenInView>

      <ShowWhenInView>
        <div className="container flex flex-col md:flex-row-reverse items-center justify-center md:justify-between text-sm">
          <div className="flex flex-col space-y-6 text-center md:text-left max-w-md md:max-w-xl justify-center flex-1 md:ml-8">
            <h2 className="text-3xl text-pallete-primary uppercase font-header">
              Merchandise 2.0
            </h2>
            <p className="text-app-textbody">
              ti-ai dori sa castigi EGLD doar detinand un NFT deainostri si
              facandu-l popular? Pe platforma &quot;deainostri merch&quot;,
              orice produs cumparat care contine un NFT detinut de tine, iti va
              genera automat profit.
            </p>
            <p className="text-app-textbody">
              Share-uieste NFT-urile tale deainostri, fa-le populare si castiga
              pasiv EGLD.
            </p>
          </div>
          <div
            className="flex-1 md:max-w-xl w-full md:w-auto"
            style={{
              minHeight: 350,
              backgroundImage: `url(${"/assets/images/merch.png"})`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </ShowWhenInView>
    </>
  );
};

export default SideBySideSections;
