import React from "react";

import bgImage from "../assets/1293242-dual-degree.webp";
import { useTranslation } from "react-i18next";
function ContactSection() {
  const { t } = useTranslation();
  return (
    <section
      className=" max-w-[1240px] w-[95%] 1xl:w-full px-4  mt-6 mx-auto rounded-3xl 
           h-[50vh] sm:h-[70vh] md:h-[300px] relative overflow-hidden"
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
          background: `linear-gradient(to right, rgba(56, 12, 149, 0.8), rgba(225, 87, 84, 0.8)`,
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center p-1 text-white flex flex-col items-center justify-center h-full space-y-2 md:space-y-4">
        <h1
          className="text-xl sm:text-3xl md:text-4xl font-semibold"
          dangerouslySetInnerHTML={{ __html: t("takeEducationTitle") }}
        ></h1>
        <p className="text-[.6rem] md:text-[.8rem] px-4 md:px-[20%]">
          {t("takeEducationDescription")}
        </p>
        <button className="px-5 rounded-full py-2  bg-gradient-to-r from-[#380C95] to-[#E15754] text-sm text-white   md:text-sm font-light shadow-lg hover:scale-105 transition-transform">
          {t("contactUs")}
        </button>
      </div>
    </section>
  );
}

export default ContactSection;
