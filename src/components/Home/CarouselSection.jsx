import React from "react";
import flag from "../../assets/Flags/UKFlag.png";
import usa from "../../assets/Flags/USAflag.png";
import germny from "../../assets/Flags/GermnyFlag.png";
import Unitedarap from "../../assets/Flags/UnitedAraPFlag.png";
import swizrland from "../../assets/Flags/SwitzerlandFlag.png";
import canada from "../../assets/Flags/CanadaFlag.png";
import Russia from "../../assets/Flags/RusiaFlag.png";
import India from "../../assets/Flags/IndiaFlag.png";
import { useTranslation } from "react-i18next";
const CarouselSection = () => {
  const { t } = useTranslation();
  const carouselItems = [
    { img: flag, text: t("carouselSectionItems.0.text") },
    { img: usa, text: t("carouselSectionItems.1.text") },
    { img: germny, text: t("carouselSectionItems.2.text") },
    { img: Unitedarap, text: t("carouselSectionItems.3.text") },
    { img: swizrland, text: t("carouselSectionItems.4.text") },
    { img: India, text: t("carouselSectionItems.5.text") },
    { img: canada, text: t("carouselSectionItems.6.text") },
    { img: Russia, text: t("carouselSectionItems.7.text") }, // Duplicate for demonstration
  ];

  return (
    <section className="bg-transparent w-full mb-20">
      {/* Title with Logo */}
      <div className="flex items-center justify-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl text-center font-semibold mr-4">
          🎓 {t("carousalItemTitle")}
        </h1>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 sm:gap-11">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center w-28 sm:w-32 md:w-32 lg:w-44"
            >
              <img
                src={item.img}
                alt={`Carousel item ${index + 1}`}
                className="w-[12vw] h-[12vw] sm:w-[70px] sm:h-[70px] rounded-full  mb-2"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                }}
              />

              <p className="text-center text-xl text-black font-semibold">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
