import { ArrowRight } from "lucide-react";
import { useSearch } from "../../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

// You can replace these with your actual icons
const DollarRounded = () => (
  <div className="text-gray-600 flex items-center justify-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 16.09V18H10.74V16.07C9.03 15.71 7.58 14.61 7.47 13.01H9.43C9.53 13.95 10.23 14.57 12.05 14.57C13.97 14.57 14.18 13.76 14.18 13.38C14.18 12.73 13.91 12.07 11.96 11.67C9.58 11.19 7.97 10.29 7.97 8.43C7.97 6.96 9.16 5.87 10.74 5.51V3.6H13.41V5.54C15.08 5.99 15.96 7.17 16.03 8.4H14.07C14 7.53 13.45 7.01 12.05 7.01C10.71 7.01 9.93 7.57 9.93 8.44C9.93 9.15 10.54 9.63 12.24 10C14.86 10.54 16.17 11.54 16.17 13.37C16.17 14.88 15.04 15.74 13.41 16.09Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const unitMap = {
  en: {
    Years: "Years",
    Months: "Months",
    Weeks: "Weeks",
  },
  ar: {
    Years: "سنوات",
    Months: "أشهر",
    Weeks: "أسابيع",
  },
};

const LanguageLogo = () => (
  <div className="text-gray-600 flex items-center justify-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const DurationIcon = () => (
  <div className="text-gray-600 flex items-center justify-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default function CountryPopularMajors({ data }) {
  // Default language to English if not provided
  const { language } = useLanguage();
  const { setFilterProp } = useSearch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const studyLevelMap = {
    en: {
      "Bachelor's": "Bachelor's",
      "Master's": "Master's",
      PhD: "PhD",
      Diploma: "Diploma",
      Certificate: "Certificate",
    },
    ar: {
      "Bachelor's": "بكالوريوس",
      "Master's": "ماجستير",
      PhD: "دكتوراه",
      Diploma: "دبلوم",
      Certificate: "شهادة",
    },
  };
  // Navigation function - replace with your actual navigation logic
  const handleNavigation = (apply, id, category, slug) => {
    if (apply) {
      navigate(
        `/${language}/applications/${id}?category=${encodeURIComponent(
          category
        )}&slug=${slug}`
      );
    } else {
      navigate(`/${language}/major/${slug}`);
    }
  };

  // View all function - replace with your actual view all logic
  const handleViewAll = (selectedValue) => {
    setFilterProp((prev) => ({
      ...prev,
      Destination: Array.isArray(prev.Destination)
        ? [selectedValue]
        : [selectedValue],
    }));
    navigate(`/${language}/searchresults/majors`);
  };

  return (
    <>
      <div className="max-w-full mx-auto ">
        <div className="flex flex-col sm:flex-row items-center mb-8 justify-between mt-6 md:mb-4">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-start mb-4 md:mb-0 font-semibold">
            {t("countryPage.PopularTitle", { title: t("majors") })}{" "}
            {data?.countryName?.[language] || "N/A"}
          </h1>
          <button
            onClick={() => handleViewAll(data?.countryName?.en)}
            className={`flex whitespace-nowrap justify-center items-center text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
      </div>

      {/* Horizontal scrollable container */}
      <div className="w-full overflow-x-auto pb-6 hide-scrollbar">
        <div className="flex flex-nowrap gap-4">
          {data?.universities?.map((university, uIndex) => {
            return university.major?.map((major, mIndex) => {
              const dynamicFeatures = [
                {
                  icon: <DollarRounded />,
                  title: language === "ar" ? "رسوم الدراسة" : "Tuition Fees",
                  description: `$ ${major?.majorTuitionFees}` || "N/A",
                },
                {
                  icon: <LanguageLogo />,
                  title: language === "ar" ? "اللغة" : "Language",
                  description: major?.majorLanguages?.[0] || "English",
                },
                {
                  icon: <DurationIcon />,
                  title: language === "ar" ? "المدة" : "Duration",
                  description:
                    `${major?.duration} ${
                      unitMap[language]?.[major.durationUnits] ||
                      majorData.durationUnits ||
                      ""
                    }` || "N/A",
                },
              ];

              return (
                <div
                  key={`${uIndex}-${mIndex}`}
                  className="flex-none w-[280px] sm:w-[320px] relative  p-2 rounded-xl shadow-sm bg-white"
                >
                  <div className="px-2 pr-2 sm:pr-4 md:pr-5 lg:pr-5 p-2">
                    <div className="flex gap-2 items-center  mb-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={
                            university?.uniSymbol ||
                            "/placeholder.svg?height=80&width=80" ||
                            "/placeholder.svg"
                          }
                          alt="University Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-semibold">
                          {(() => {
                            const majorName =
                              language === "ar"
                                ? major?.majorName?.ar
                                : major?.majorName?.en;
                            if (!majorName) return "N/A";

                            if (majorName.length > 25) {
                              const lastSpaceIndex = majorName.lastIndexOf(
                                " ",
                                25
                              );
                              const splitIndex =
                                lastSpaceIndex > 0 ? lastSpaceIndex : 25;

                              return (
                                <>
                                  {majorName.substring(0, splitIndex)}
                                  <br />
                                  {majorName.substring(splitIndex + 1)}
                                </>
                              );
                            }
                            return majorName;
                          })()}
                        </h1>
                        <p className="text-[0.7rem] font-medium text-black">
                          {language === "ar"
                            ? university?.uniName?.ar
                            : university?.uniName?.en || "N/A"}
                        </p>
                        <p className="text-[0.65rem] text-gray-600">
                          {Array.isArray(major?.studyLevel) &&
                          major.studyLevel.length > 0
                            ? major.studyLevel
                                .map((level, index) => {
                                  const translated =
                                    studyLevelMap[language]?.[level] || level;
                                  if (
                                    index === 0 &&
                                    major.studyLevel.length > 1
                                  ) {
                                    return `${translated} +${
                                      major.studyLevel.length - 1
                                    }`;
                                  }
                                  return index === 0 ? translated : translated;
                                })
                                .slice(0, 1) // only show the first one with +X
                                .join(", ")
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-start">
                      {dynamicFeatures.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center gap-1"
                        >
                          <span className="rounded-full w-7 h-7 flex items-center justify-center border">
                            {feature.icon}
                          </span>
                          <div
                            className={`${language === "ar" ? "mr-1" : "ml-1"}`}
                          >
                            <p className="text-[0.55rem] font-medium">
                              {feature.title}
                            </p>
                            <p className="text-[0.55rem] font-medium">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 px-2 grid-cols-2 mb-3 mt-2">
                    <button
                      onClick={() =>
                        handleNavigation(
                          true,
                          major._id,
                          "major",
                          major?.customURLSlug?.en
                        )
                      }
                      className="bg-slateBlue text-white text-xs py-2 px-2 rounded-full"
                    >
                      {t("applyNow")}
                    </button>
                    <button
                      onClick={() =>
                        handleNavigation(
                          false,
                          major._id,
                          "major",
                          major?.customURLSlug?.en
                        )
                      }
                      className="text-black text-xs px-2 py-2 hover:font-medium rounded-full border border-gray-800"
                    >
                      {t("learnMore")}
                    </button>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Add custom scrollbar styling */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
