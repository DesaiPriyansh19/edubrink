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
    <section className="w-full mb-20 py-8">
      {/* Title */}
      <h1 className="text-3xl sm:text-5xl font-semibold flex items-center gap-3 justify-center text-center mb-3">
        {t("howToApplySection.title")}
        <img src={ManSticker}></img>
      </h1>
      <p className="text-[.9rem] max-w-2xl mx-auto px-2 md:p-0 text-center mb-16">
        {t("howToApplySection.description")}
      </p>
      {/* Four Divs in One Line */}
      <div className="grid grid-cols-1 ew:grid-cols-2 gap-4 lg:flex max-w-[1240px] mx-auto rounded-3xl justify-between px-2  ">
        {items.map((item, index) => (
          <div
            key={index}
            className={` p-1 box ${language==="ar"?"xl:p-12 sm:p-10":"sm:p-4"} pb-2  sm:pb-9 rounded-3xl  bg-white w-auto text-center`}
          >
            {/* P tag and round div in one line */}
            <div className="mt-4 mb-5 md:mt-14 md:mb-9">
              <div
                style={{ backgroundColor: `${item.color}` }}
                className="flex items-center justify-center w-24 h-24  md:w-40 md:h-40 mx-auto rounded-full"
              >
                <span>
                  {" "}
                  <span>
                    {index === 0 && <BookLogo />}
                    {index === 1 && <TrakeLogo />}
                    {index === 2 && <TestLogo />}
                    {index === 3 && <ChatLogo />}
                  </span>
                </span>
              </div>
            </div>
            {/* H3 Title */}
            <h3 className="text-sm sm:text-xl px-4 sm:px-0 font-semibold mb-2">
              {item.title}
            </h3>
            {/* P Description */}
            <p className="text-black lg:max-w-max max-w-56 md:max-w-72 mx-auto text-[11px] pb-2 sm:text-[.9rem] font-normal">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowToApply;
