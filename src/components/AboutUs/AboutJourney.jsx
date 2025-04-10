import React, { useState, useEffect } from "react";
import journey from "../../assets/AboutpageImage/journey.png";
import journey1 from "../../assets/AboutpageImage/journey1.png";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import imgAr from "../../assets/AboutpageImage/journyAR.png"
const AboutJourney = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { language } = useLanguage();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 646);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 bg-[rgba(248,248,248,1)]">
      <div className="jour-layout-wrapper flex flex-col items-center justify-center max-w-[677px] h-[131px] gap-5 mx-auto">
        <h2 className="text-5xl sm:text-3xl font-semibold text-center leading-[114.99%]">
       {t("Journey to Success")} 
        </h2>
        <p className="text-lg sm:text-[14px] font-medium leading-[21.7px] text-center">
         {t("Easily explore global")}
        </p>
      </div>
      <div className="jour-layout flex justify-center items-center p-0 mt-10 sm:m-0 border-none">
      <img
          className="border-none mx-auto"
          src={
            isArabic 
              ? (isMobile ? imgAr : imgAr ) 
              : (isMobile ?  journey1 : journey)
          }
          alt="Journey"
        />
      </div>
    </div>
  );
};

export default AboutJourney;
