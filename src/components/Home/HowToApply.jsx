import React from "react";
import BookLogo from "../../../svg/BookLogo/Index";
import TrakeLogo from "../../../svg/TrakeLogo/Index";
import TestLogo from "../../../svg/TestLogo/Index";
import ChatLogo from "../../../svg/ChatLogo/Index";
import ManSticker from "../../assets/ManSticker.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/LanguageContext";
function HowToApply() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Fetch localized items from JSON
  const items = t("howToApplySection.items", { returnObjects: true });

  return (
    <section className="w-full mb-10 py-4">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold flex items-center gap-3 justify-center text-center mb-3">
        {t("howToApplySection.title")}
        <img src={ManSticker}></img>
      </h1>
      <p className="text-[.9rem] max-w-2xl mx-auto px-2 lg:px-24 md:p-0 text-center mb-16">
        {t("howToApplySection.description")}
      </p>
      {/* Four Divs in One Line */}
      <div className="ew:grid ew:grid-cols-2 gap-4 lg:flex w-[90%] max-w-[1050px] mx-auto rounded-3xl justify-between px-2 overflow-x-auto sm:overflow-visible">
  <div className="flex  sm:grid-cols-2 gap-4 w-max sm:w-auto">
    {items.map((item, index) => (
      <div
        key={index}
        className={`p-1  ${language === "ar" ? "xl:p-12 sm:p-10" : "sm:p-4"} pb-2 sm:pb-4 rounded-3xl max-h-72 bg-white w-[250px] md:box hover:scale-105 hover:shadow-lg transition duration-700 sm:w-auto text-center 
      `}
      >
        {/* Icon */}
        <div className="mt-4 mb-5 md:mt-4 md:mb-4">
          <div
            style={{ backgroundColor: `${item.color}` }}
            className="flex items-center justify-center w-24 h-24 md:w-24 md:h-24 mx-auto rounded-full"
          >
            <span>
              {index === 0 && <BookLogo />}
              {index === 1 && <TrakeLogo />}
              {index === 2 && <TestLogo />}
              {index === 3 && <ChatLogo />}
            </span>
          </div>
        </div>
        {/* Title */}
        <h3 className="text-sm sm:text-xl px-4 sm:px-0 font-semibold mb-2">
          {item.title}
        </h3>
        {/* Description */}
        <p className="text-black lg:max-w-max max-w-56 md:max-w-72 mx-auto text-[11px] pb-2 sm:text-[.9rem] font-normal">
          {item.description}
        </p>
      </div>
    ))}
  </div>
</div>

    </section>
  );
}

export default HowToApply;
