//

const Buletin = (props: any) => {
  return (
    <div className="flex flex-col bg-white p-4 rounded-lg">
      <div className="flex flex-row justify-between  mb-4">
        <div className="font-bold text-xl">ROUMANIE</div>
        <div>DEAINOSATRI IMAGE</div>
        <div className="font-bold text-xl">ROMANIA</div>
      </div>
      <div className="flex flex-row">
        <div className="bg-white" style={{ flex: "0 0 25%" }}>
          <img src="/avatars/32.png" />
        </div>
        <div className="flex-col flex-1 grid grid-cols-6">
          <div className="flex flex-col items-center">
            <div>CARTE</div>
            <div>D&apos;IDENTITE</div>
          </div>
          <div className="col-start-1 col-end-3 flex flex-col items-center justify-center"></div>
          <div className="col-start-3 col-end-5 flex flex-col items-center justify-center">
            <div>CARTE DE IDENTITATE</div>
          </div>
          <div className="col-start-5 col-end-7 flex flex-col items-center justify-center">
            <div>IDENTITY</div>
          </div>
          <div className="col-start-1 col-end-3 flex flex-col items-center justify-center">
            D&apos;IDENTITE
          </div>
          <div className="col-start-3 col-end-5 flex flex-col items-center justify-center">
            <div>SERIA 01 NR 2581</div>
          </div>
          <div className="col-start-5 col-end-7 flex flex-col items-center justify-center">
            <div>CARD</div>
          </div>
          <div className="col-start-1 col-end-7 flex flex-row items-center justify-start">
            <div>CNP</div>
            <div>23478ryfhj9423eufv1290djj89032rf</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buletin;
