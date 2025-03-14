import React from "react";
import JhonSmith from "../../assets/CoursePage/JhonSmith.png";
import Phone from "../../../svg/Phone";
import { useTranslation } from "react-i18next";
const FacultyRightLayoutCard = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="container mt-[10%] mb-[10%]">
        <div className="bg-white  rounded-3xl p-6 w-full">
          <div className="w-full flex md:justify-start justify-center">
            {" "}
            <div className="inline-flex  mt-4 bg-[#F8F8F8]   font-sans font-medium text-[1rem] leading-7 px-3 py-1 rounded-full">
              {t("UniversitySlugPage.CounsellorTitle")}
            </div>
          </div>

          <div className="flex lg:flex-row flex-col md:items-start items-center mt-2 md:mt-[8%]">
            <img
              src={JhonSmith}
              alt="Profile"
              className="w-[11vw] h-[11vh] rounded-full mr-4 mt-[3%] mb-[3%]"
            />
            <div className=" md:mt-[5%] md:text-start text-center mb-[5%]">
              <div className="font-sans font-semibold text-2xl leading-7 text-black">
                {t("UniversitySlugPage.CounsellorName")}
              </div>
              <p className="font-sans text-[#595959] font-medium text-[.9rem] mt-2">
                {t("UniversitySlugPage.CounsellorDesc")}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4 justify-between">
            <button className="w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white font-medium text-sm rounded-full">
              {t("UniversitySlugPage.CallNow")}
            </button>
            <button className="w-full bg-white border-[1.5px] font-medium text-sm border-black text-black rounded-full flex items-center justify-center gap-2  py-[0.5rem]">
              {t("UniversitySlugPage.ChatNow")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyRightLayoutCard;
