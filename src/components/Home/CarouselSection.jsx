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
import { useNavigate } from "react-router-dom";
const CarouselSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const carouselItems = [
    {
      img: flag,
      text: t("carouselSectionItems.0.text"),
      name: "United Kingdom",
    },
    { img: usa, text: t("carouselSectionItems.1.text"), name: "United States" },
    { img: germny, text: t("carouselSectionItems.2.text"), name: "Germany" },
    {
      img: Unitedarap,
      text: t("carouselSectionItems.3.text"),
      name: "United Arab Emirates",
    },
    {
      img: swizrland,
      text: t("carouselSectionItems.4.text"),
      name: "Switzerland",
    },
    { img: India, text: t("carouselSectionItems.5.text"), name: "India" },
    { img: canada, text: t("carouselSectionItems.6.text"), name: "Canada" },
    { img: Russia, text: t("carouselSectionItems.7.text"), name: "Russia" }, // Duplicate for demonstration
  ];

  const handleNavigate = (name) => {
    navigate(`/country/${name}`);
    setShowCountriesDropdown(false);
  };

  return (
    <section className="bg-transparent w-full mb-20">
      {/* Title with Logo */}
      <div className="flex items-center justify-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl text-center font-semibold mr-4">
          🎓 {t("carouselItemTitle")}
        </h1>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 sm:gap-11">
          {carouselItems.map((item, index) => (
            <div
              onClick={() => handleNavigate(item.name)}
              key={index}
              className="flex-shrink-0 cursor-pointer flex flex-col items-center w-28 sm:w-32 md:w-32 lg:w-44"
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
