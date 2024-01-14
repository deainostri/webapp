//
import cn from "classnames";
import { SiDiscord, SiTelegram, SiInstagram, SiTwitter } from "react-icons/si";
import s from "./SplashPage.module.scss";

const SplashPage = (props: any) => {
  return (
    <div
      className={cn(
        s.container,
        "fixed inset-0 px-4 md:px-0 bg-gray-900 flex flex-col justify-center items-center"
      )}
    >
      <div className={cn(s.splash, "absolute inset-0")}></div>

      <div className={s.logo}>deainostri</div>

      <img className={s.mobilesplash} src="/assets/images/splash.png" />

      <div className={s.content}>
        <div className="relative flex flex-col items-stretch space-y-4 z-10">
          <div
            className={cn(
              s.lol,
              "flex flex-row justify-center items-center text-left w-full border-2 rounded-xl py-2 px-3 space-x-4 bg-white"
            )}
          >
            <a target="_blank" rel="noreferrer" href="https://t.me/deainostri">
              <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
                <SiTelegram className="w-6 h-6" />
              </div>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/deainostri"
            >
              <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
                <SiDiscord className="w-6 h-6" />
              </div>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/deainostri/"
            >
              <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
                <SiInstagram className="w-6 h-6" />
              </div>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/deainostri"
            >
              <div className="p-2 rounded-lg shadow-sm bg-pallete-primary text-white">
                <SiTwitter className="w-6 h-6" />
              </div>
            </a>
          </div>
        </div>

        <div className="relative z-10 text-white uppercase mt-2 font-extrabold text-center">
          DEAR ION, SIT
        </div>
      </div>

      <div className="absolute bottom-3 text-center font-semibold text-xs text-white z-10 bg-gray-900 bg-opacity-50 p-1 px-2 rounded-lg">
        made with 3 randuri de 🧠
      </div>
    </div>
  );
};

export default SplashPage;
