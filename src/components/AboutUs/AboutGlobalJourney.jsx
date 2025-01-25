import React from "react";
import global from "../../assets/AboutpageImage/global.png";
import VseuaxPeople from "../../../svg/AboutGlobalCOne";
import VuesaxBuilding from "../../../svg/AboutGlobalCTwo";
import VseuaxUser from "../../../svg/AboutGlobalCThree";
import { useTranslation } from "react-i18next";

const AboutGlobalJourney = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-0 md:py-16 bg-[rgba(248,248,248,1)]">
      <div className="jour-layout-wrapper flex flex-col items-center justify-center max-w-[677px] h-[131px] gap-5 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          {t("global_coverage")}
        </h2>
        <p className="font-sans text-xs sm:text-[14px] font-medium leading-[21.7px] text-center">
          {t("global_coverage_description")}
        </p>
      </div>

      <div className="relative w-full max-w-[95%] sm:max-w-[90%] aspect-[1240/634] mx-auto bg-[rgba(248,248,248,1)] flex justify-center items-center p-0 m-0 border-none mt-10">
        <img
          src={global}
          className="object-cover rounded-tl-[5%] rounded-tr-[5%]"
          alt="World Map"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4 py-6 px-0 sm:px-4">
        {/* Card 1 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold text-5xl leading-[55.2px] flex justify-between w-full">
            1,00,00+
            <div className="bg-[rgba(248,248,248,1)] rounded-full flex items-center justify-center w-12 h-12">
              <span>
                <VseuaxPeople />
              </span>
            </div>
          </h2>
          <p className="font-general-sans font-medium text-lg leading-7">
            {t("total_students")}
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold text-5xl leading-[55.2px] flex justify-between w-full">
            3230+
            <div className="bg-[rgba(248,248,248,1)] rounded-full flex items-center justify-center w-12 h-12">
              <span>
                <VuesaxBuilding />
              </span>
            </div>
          </h2>
          <p className=" font-general-sans font-medium  text-lg leading-7">
            {t("partner_universities")}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold text-5xl leading-[55.2px] flex justify-between w-full">
            160+
            <div className="bg-[rgba(248,248,248,1)] rounded-full flex items-center justify-center w-12 h-12">
              <span>
                <VseuaxUser />
              </span>
            </div>
          </h2>
          <p className="font-general-sans font-medium text-lg leading-7">
            {t("student_ambassadors")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutGlobalJourney;
