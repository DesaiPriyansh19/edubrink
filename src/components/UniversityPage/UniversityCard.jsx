import React from "react";
import { useTranslation } from "react-i18next";

const UniversityCard = ({ data, language }) => {
  const { t } = useTranslation();
  return (
    <div className="container max-auto mt-[8%] mb-[8%]">
      <div className="flex flex-col ">
        <div className="flex flex-wrap gap-6 ml-[2%] mr-[2%]">
          {data?.courses?.slice(0, 2)?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="w-[26rem] h-auto p-6 bg-white rounded-3xl"
              >
                <h2 className="text-[1.2rem] font-semibold mb-4">
                  {language === "ar"
                    ? item?.CourseName?.ar
                    : item?.CourseName?.en}
                </h2>
                <div className="grid grid-cols-2 gap-[8px] text-sm">
                  <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tl-[1.2rem]">
                    <p className="font-semibold">Tuition Fees</p>
                    <p>${item.CourseFees}/Year</p>
                  </div>
                  <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-tr-[1.2rem]">
                    <p className="font-semibold ">Language</p>
                    <p>{data?.spokenLanguage[0] || "English"}</p>
                  </div>
                  <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-bl-[1.2rem]">
                    <p className="font-semibold">Deadline</p>
                    <p>
                      {" "}
                      {item?.DeadLine
                        ? new Date(item?.DeadLine).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-[rgba(248,248,248,1)] p-[16px] rounded-br-[1.2rem]">
                    <p className="font-semibold">Mode Of Study</p>
                    <p>
                      {language === "ar"
                        ? item?.ModeOfStudy?.ar?.[0]
                        : item?.ModeOfStudy?.en?.[0]}
                    </p>
                  </div>
                </div>
                <div className="flex mt-6 space-x-4">
                  <button className="flex-1 py-2 text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-full">
                    {t("applyNow")}
                  </button>

                  <button className="flex-1 py-2  border-2 border-black rounded-full">
                    {t("learnMore")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
