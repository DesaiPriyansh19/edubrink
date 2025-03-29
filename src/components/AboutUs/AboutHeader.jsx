import React from "react";
import studyabroad from "../../assets/AboutpageImage/33037937511.png";
import { useTranslation } from "react-i18next";
const AboutHeader = () => {
  const { t } = useTranslation();
  return (
    <div>
      <section className="bg-[rgba(248,248,248,1)] py-4 px-5 md:py-5 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-[rgba(29,33,28,1)] md:text-5xl">
              {t("global_education")}
            </h1>
            <p className="text-gray-600 font-medium text-[1rem] leading-[155%] text-[rgba(18,18,18,0.8)]">
              {t("explore_universities")}
            </p>
            <button className="px-auto hover:shadow-lg bg-gradient-to-r from-[rgba(58,61,141)] to-[rgba(73,75,134)] rounded-[1.5rem] w-[266px] h-[52px]">
              <p className="font-medium text-[1rem] leading-[155%] text-[rgba(255,255,255,1)]">
                {t("start_journey")}
              </p>
            </button>
            <p className="font-medium text-[1rem] leading-[155%]">
              {t("join_students")}
            </p>
          </div>
          <div className="relative">
            <div className="ab-image">
              <img src={studyabroad} alt="Student" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutHeader;
