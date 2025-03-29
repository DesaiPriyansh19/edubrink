import React from "react";
import DollerRounded from "../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../svg/PriUniLogo/Index";
import TickMark from "../../../svg/TickMark";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearch } from "../../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { getEmoji } from "../../../libs/countryFlags";
import ReactGA from "react-ga4";

const isWindows = navigator.userAgent.includes("Windows");

const CountryPopularUniversity = ({ data }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { setFilterProp } = useSearch();
  const navigate = useNavigate();
  const handleViewAll = (selectedValue) => {
    setFilterProp((prev) => ({
      ...prev,
      Destination: Array.isArray(prev.Destination)
        ? [selectedValue]
        : [selectedValue],
    }));
    navigate(`/${language}/searchresults/university`);
  };

  const handleApplyClick = (uniName, countryName) => {
    const uniLabel =
      language === "ar" ? uniName?.ar : uniName?.en || "Unknown University";
    const countryLabel =
      language === "ar"
        ? countryName?.ar
        : countryName?.en || "Unknown Country";

    // Track event using ReactGA
    ReactGA.event({
      category: "University Application",
      action: "Apply Click",
      label: uniLabel, // University name in the correct language
      university_name: uniLabel,
      country_name: countryLabel,
    });
  };

  const handleNavigation = (apply, id, category, slug) => {
    if (apply) {
      navigate(
        `/${language}/applications/${id}?category=${encodeURIComponent(
          category
        )}&slug=${slug}`
      );
    } else {
      navigate(`/${language}/university/${slug}`);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center mb-8 justify-between mt-6 md:mb-4">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-start mb-4 md:mb-0 font-semibold">
            {t("countryPage.PopularTitle", { title: t("universities") })}{" "}
            {data?.countryName?.[language] || "N/A"}
          </h1>
          <button
            onClick={() => handleViewAll(data?.countryName?.en)}
            className={`bg-white flex  whitespace-nowrap  justify-center items-center shadow-sm hover:shadow-xl text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group`}
          >
            {t("viewAll")}

            <ArrowRight
              className={`inline-block ml-2 ${
                language === "ar"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "rotate-0 group-hover:translate-x-1"
              } w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`}
            />
          </button>
        </div>

        {/* Universities */}
        <div className="overflow-x-auto scrollbar-hide whitespace-nowrap">
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
            {/* Iterate through universities */}
            {data?.universities?.map((university, idx) => {
              const dynamicFeatures = [
                {
                  icon: <DollerRounded />,
                  title: language === "ar" ? "الرسوم الدراسية" : "Tuition Fees",
                  description: `$ ${university?.uniTutionFees}` || "N/A",
                },

                {
                  icon: <ScholerShipLogo />,
                  title: language === "ar" ? "المنح الدراسية" : "Scholarship",
                  description:
                    university?.scholarshipAvailability === true
                      ? language === "ar"
                        ? "متاح"
                        : "Available"
                      : language === "ar"
                      ? "غير متاح"
                      : "Not Available",
                },
                {
                  icon: <DiscountLogo />,
                  title: language === "ar" ? "الخصم" : "Discount",
                  description: university?.uniDiscount
                    ? language === "ar"
                      ? "متاح"
                      : "Available"
                    : language === "ar"
                    ? "غير متاح"
                    : "Not Available",
                },
              ];
              return (
                <div
                  key={idx}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  className="relative mt-6 border rounded-xl shadow-md bg-white max-w-full"
                >
                  <div className="p-4 sm:p-6">
                    <div
                      className={`absolute top-0 ${
                        language === "ar"
                          ? "left-0 rounded-br-[4px] rounded-tl-xl"
                          : "right-0 rounded-bl-[4px] rounded-tr-xl"
                      } bg-red-500 text-white text-xs sm:text-sm px-2 py-1`}
                    >
                      {t("mostPopular")}
                    </div>

                    <div className="flex gap-3 sm:gap-4 items-center mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20">
                        <img
                          src={
                            university.uniSymbol || "https://placehold.co/80x80"
                          }
                          alt="Logo"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-lg font-semibold gap-1 flex">
                          {language === "ar"
                            ? university?.uniName?.ar
                            : university?.uniName?.en || "N/A"}
                          <span>
                            <TickMark />
                          </span>
                        </h1>

                        {isWindows ? (
                          data?.countryName?.[language] ? (
                            <div className="flex gap-1 items-center">
                              <img
                                src={`https://flagcdn.com/w320/${getEmoji(
                                  data?.countryCode
                                )}.png`}
                                alt="Country Flag"
                                className="w-3 h-3 object-cover rounded-full"
                              />
                              <p className="text-sm font-medium text-gray-700 flex items-center ">
                                {data?.countryName
                                  ? data?.countryName?.[language]
                                  : "N/A"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[.6rem] font-medium">
                              No flag
                            </span>
                          )
                        ) : (
                          <p className="text-sm font-medium text-gray-700 flex items-center mt-1">
                            {data?.countryPhotos?.countryFlag}{" "}
                            {data?.countryName
                              ? data?.countryName?.[language]
                              : "N/A"}
                          </p>
                        )}

                        <div className="flex items-center mt-1">
                          <span className="w-5 h-5 rounded-full mr-2">
                            <PrivetUniLogo />
                          </span>

                          <p className="text-sm capitalize font-medium text-gray-700">
                            {language === "ar"
                              ? university?.uniType === "Private"
                                ? "جامعة خاصة"
                                : "جامعة حكومية"
                              : university?.uniType === "Private"
                              ? "Private University"
                              : "Public University"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                      {dynamicFeatures.flat().map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 justify-center"
                        >
                          <span className="rounded-full w-10 flex items-center justify-center h-10 border">
                            {feature.icon}
                          </span>
                          <div>
                            <p className="text-xs font-medium">
                              {feature.title}
                            </p>
                            <p className="text-xs font-medium">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-300"></div>

                  <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
                    <button
                      onClick={() => {
                        handleApplyClick(
                          university?.uniName,
                          data?.countryName
                        );
                        handleNavigation(
                          true,
                          university?._id,
                          "University",
                          university?.customURLSlug?.en
                        );
                      }}
                      className="bg-slateBlue text-white text-sm py-2 px-3 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() =>
                        handleNavigation(
                          false,
                          university?._id,
                          "University",
                          university?.customURLSlug?.en
                        )
                      }
                      className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800"
                    >
                      {t("learnMore")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CountryPopularUniversity;
