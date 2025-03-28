import React from "react";
import flag from "../../assets/Flags/UKFlag.png";
import usa from "../../assets/Flags/USAflag.png";
import germny from "../../assets/Flags/GermnyFlag.png";
import Unitedarap from "../../assets/Flags/UnitedAraPFlag.png";
import swizrland from "../../assets/Flags/SwitzerlandFlag.png";
import canada from "../../assets/Flags/CanadaFlag.png";
import bgImage from "../../assets/1293242-dual-degree.webp";
import { Trans, useTranslation } from "react-i18next";

function Discover() {
  const { t } = useTranslation();
  return (
    <section
      className="w-[95%] sm:w-[98%] mx-auto rounded-3xl sm:rounded-3xl mb-10 sm:mb-16 h-[36vh] sm:h-[50vh] md:h-[450px] relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Proper Gradient Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[3px]"
        style={{
          background: `linear-gradient(to right, rgba(56, 12, 149, 0.6), rgba(56, 12, 149, 0.7)`,
          zIndex: 1,
        }}
      ></div>

      {/* Content */}

      <div className="relative z-10 text-center text-white flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-[22px] em:text-[24px] sm:text-[30px] md:text-[50px] leading-8 sm:leading-9 md:leading-[78.2px] font-semibold">
          <Trans i18nKey={"title"} />
        </p>
        <p className=" text-[.6rem] max-w-sm md:max-w-xl md:text-[.9rem] px-4">
          {t("description")}

        </p>
        <button className="px-6 rounded-full py-3 bg-[#3A3D8D] text-sm text-white   md:text-lg font-normal shadow-lg hover:scale-105 transition-transform">
          {t("buttonLabel")}
        </button>
      </div>

      {/* Rounded flag divs */}
      <div className="absolute z-10 top-[8%] left-[12%] w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={usa}
          alt="Flag 1"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>

      <div className="absolute z-10 top-[45%] left-10 w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={germny}
          alt="Flag 1"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>

      <div className="absolute z-10 top-[8%] right-[12%] w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={canada}
          alt="Flag 2"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>

      <div className="absolute z-10 top-[45%] right-10 w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={flag}
          alt="Flag 2"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>

      <div className="absolute z-10 bottom-[8%] left-[12%] w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={Unitedarap}
          alt="Flag 3"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>
      <div className="absolute z-10 bottom-[8%] right-[12%] w-16 h-16 rounded-full border-[2px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
        <img
          src={swizrland}
          alt="Flag 4"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>
    </section>
  );
}

export default Discover;
