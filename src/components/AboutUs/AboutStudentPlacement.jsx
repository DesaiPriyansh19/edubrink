import React from "react";
import studentTwo from "../../assets/AboutpageImage/StudentTwo.png";
import studentThree from "../../assets/AboutpageImage/StudentThree.png";
import studentOne from "../../assets/AboutpageImage/Studentone.png";
import { useTranslation } from "react-i18next";
const AboutStudentPlacement = () => {
    const { t } = useTranslation();
  const cards = [
    {
      id: 1,
      image: studentThree,
      title:   t("abut us card1"),
      university: t("abut us card1uni"),
      tuitionFees: t("abut us card1fees"),
      language: t("abut us card1eng"),
      deadline: t("abut us card1date25"),
      buttonWidths: ["w-1/2", "w-1/2"],
      marginTop: "mt-[0%]",
      marginBottom: "mb-[8%]",
      marginLeft: "ml-[0%]",
    },
    {
      id: 2,
      image: studentTwo,
      title:   t("abut us card1"),
      university: t("abut us card1uni"),
      tuitionFees: t("abut us card1fees"),
      language: t("abut us card1eng"),
      deadline: t("abut us card1date25"),
      buttonWidths: ["w-[40%]", "w-[40%]"],
      marginTop: "mt-[10%]",
      marginBottom: "mb-[6%]",
      marginLeft: "ml-[5%] mmd:ml-0 lg:ml-[5%]",
    },
    {
      id: 3,
      image: studentOne,
      title:   t("abut us card1"),
      university: t("abut us card1uni"),
      tuitionFees: t("abut us card1fees"),
      language: t("abut us card1eng"),
      deadline: t("abut us card1date25"),
      buttonWidths: ["w-[45%]", "w-[45%]"],
      marginTop: "mt-[20%]",
      marginBottom: "mb-[6%]",
      marginLeft: "ml-[10%] mmd:ml-0 lg:ml-[10%]",
    },
  ];

  return (
    <div className="flex mmd:flex-row flex-col justify-between items-start px-4 gap-6 mt-6">
      {/* Left: Card Section */}
      <div className="w-full mmd:w-1/2  relative h-[320px] esm:h-[350px] md:h-[400px]">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`absolute rounded-xl shadow-md top-0 left-1/2 -translate-x-[55%] md:-translate-x-1/2 -translate-y-0 ${card.marginLeft} ${card.marginTop} ${card.marginBottom} bg-white shadow-lg rounded-lg py-3 px-5 transform scale-95 z-10 w-[18rem] esm:w-[22rem] sm:w-[27rem] p-4 sm:p-6`} // Added padding here
          >
            <div className="flex items-center gap-2">
              <img
                src={card.image}
                alt={card.title}
                className="h-auto w-auto"
              />
              <div>
                <div className="font-semibold text-black text-xs sm:text-[1rem]">
                  {card.title}
                </div>
                <div className="text-xs sm:text-sm  text-black">
                  {card.university}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-medium text-[.8rem]">
                {t("abut us card1tutuionfees")}
                </p>
                <p className="text-black font-medium text-[.8rem]">
                  {card.tuitionFees}
                </p>
              </div>
              <div>
                <p className="text-black font-medium text-[.8rem]">{t("abut us card1lang")}</p>
                <p className="text-black font-medium text-[.8rem]">
                  {card.language}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-[.8rem]">
                {t("abut us card1deadline")}
                </p>
                <p className="text-gray-900 font-medium text-[.8rem]">
                  {card.deadline}
                </p>
              </div>
            </div>

            <div className="border-t-[2px] border-black mt-2 mb-2"></div>

            <div className="mt-6 flex justify-between">
              <button
                className={`w-[211.42px] h-[40.42px] pl-[21.76px] pr-[21.76px] text-sm text-[rgba(255,255,255,1)] bg-gradient-to-r from-[rgba(58,61,141,1)] to-[rgba(73,75,134,1)] rounded-[1.5rem] ${card.buttonWidths[0]}`}
              >
                {t("apply now")}
              </button>
              <button
                className={`w-[211.42px] h-[40.42px] pl-[21.76px] pr-[21.76px] text-sm border border-black rounded-[1.5rem] ${card.buttonWidths[1]}`}
              >
              {t("Learn More")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Text Section */}
      <div className="w-full mmd:w-1/2 h-auto esm:h-[350px] md:h-[400px]">
        <div className="w-full mmd:max-w-xl">
          <h2 className="text-3xl lg:text-4xl font-semibold text-[rgba(29,33,28,1)]">
          {t("we make more than 20k")}
          </h2>
          <p className="mt-4 text-[rgba(29,33,28,1)] font-medium text-[1rem] leading-[155%]">
          {t("investigate corses")}
          </p>
          <button className="mt-6 text-[1rem] font-medium leafding-[155%] text-[rgba(29,33,28,1)] bg-[rgba(255,255,255,1)]   rounded-3xl w-[175px] py-2 hover:scale-105">
           {t("Learn More")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutStudentPlacement;
