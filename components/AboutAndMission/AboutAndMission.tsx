//
import { IoBulbOutline, IoCheckmark } from "react-icons/io5";

const AboutAndMission = (props: any) => {
  return (
    <div className="container flex flex-col items-center">
      <h2 className="text-xl text-pallete-secondary uppercase font-header">
        who are the
      </h2>
      <h2 className="text-4xl text-pallete-primary uppercase font-header">
        deainostri
      </h2>
      <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 md:space-x-10 my-10">
        <div className="flex-1 space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
              <IoBulbOutline className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-app-header uppercase font-header">
              About
            </h2>
          </div>
          <p className="text-app-textbody text-justify">
            Deainostri is a 5,000 pieces collectible characters of all romanian
            stereotypes with proof of ownership stored on the Elrond Network
            blockchain. each is unique with it&quot;s own abilities, tot even
            two are exactly alike and each one of them can be officially owned
            by only a single person, made from different assets inspired by
            romanian culture & lifestyle but they all have something special in
            common - they can generate profits for you by staking them.
          </p>
          <p className="text-app-textbody text-justify">
            This collection is not only irresistible, it&quot;s also very funny
            & profitable! The Deainostri are one of the earliest examples of a
            “Non-Fungible Token” on Elrond Network, a blockchain that powers
            most digital art and collectibles.
          </p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
              <IoCheckmark className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-app-header uppercase font-header">
              Mission
            </h2>
          </div>
          <p className="text-app-textbody text-justify">
            Deainostri is a 5,000 pieces collectible characters of all romanian
            stereotypes with proof of ownership stored on the Elrond Network
            blockchain. each is unique with it&quot;s own abilities, tot even
            two are exactly alike and each one of them can be officially owned
            by only a single person, made from different assets inspired by
            romanian culture & lifestyle but they all have something special in
            common - they can generate profits for you by staking them.
          </p>
          <p className="text-app-textbody text-justify">
            This collection is not only irresistible, it&quot;s also very funny
            & profitable! The Deainostri are one of the earliest examples of a
            “Non-Fungible Token” on Elrond Network, a blockchain that powers
            most digital art and collectibles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutAndMission;
