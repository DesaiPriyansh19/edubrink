"use client";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../../context/LanguageContext";
import { countryFlags, getEmoji } from "../../../libs/countryFlags";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";

const isWindows = navigator.userAgent.includes("Windows");

// Default countries to show immediately while API loads
const defaultCountries = [
  {
    countryName: { en: "United States", ar: "الولايات المتحدة" },
    countryCode: "USA",
    customURLSlug: { en: "united-states", ar: "الولايات-المتحدة" },
  },
  {
    countryName: { en: "United Kingdom", ar: "المملكة المتحدة" },
    countryCode: "GBR",
    customURLSlug: { en: "united-kingdom", ar: "المملكة-المتحدة" },
  },
  {
    countryName: { en: "Germany", ar: "ألمانيا" },
    countryCode: "DEU",
    customURLSlug: { en: "germany", ar: "ألمانيا" },
  },
  {
    countryName: { en: "India", ar: "الهند" },
    countryCode: "IND",
    customURLSlug: { en: "india", ar: "الهند" },
  },
  {
    countryName: { en: "Azerbaijan", ar: "أذربيجان" },
    countryCode: "AZE",
    customURLSlug: { en: "azerbaijan", ar: "أذربيجان" },
  },
  {
    countryName: { en: "Italy", ar: "إيطاليا" },
    countryCode: "ITA",
    customURLSlug: { en: "italy", ar: "إيطاليا" },
  },
  {
    countryName: { en: "Georgia", ar: "جورجيا" },
    countryCode: "GEO",
    customURLSlug: { en: "georgia", ar: "جورجيا" },
  },
  {
    countryName: { en: "Malaysia", ar: "ماليزيا" },
    countryCode: "MYS",
    customURLSlug: { en: "malaysia", ar: "ماليزيا" },
  },
];

const fetchCountries = async () => {
  const res = await fetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryCode,customURLSlug"
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const SkeletonLoader = () => (
  <div className="flex gap-4 sm:gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex-shrink-0 flex flex-col items-center w-24 sm:w-28 md:w-28 lg:w-32"
      >
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-none mb-3"></div>
        <div className="w-16 h-4 bg-gray-200 animate-none rounded"></div>
      </div>
    ))}
  </div>
);

const CarouselSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [displayedCountries, setDisplayedCountries] =
    useState(defaultCountries);

  const handleNavigate = (customURLSlug) => {
    navigate(`/${language}/country/${customURLSlug}`);
  };

  // Fetch countries in the background
  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      // Only update if we got valid data
      if (Array.isArray(data) && data.length > 0) {
        setDisplayedCountries(data);
      } else if (
        data?.data &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        setDisplayedCountries(data.data);
      }
    },
  });

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // `md` breakpoint
    };
    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldUseMarquee = displayedCountries.length >= 8 || isMobile;

  return (
    <section className="bg-gradient-to-r w-full py-5 md:px-4">
      <div className="flex items-center justify-center mb-12">
        <h1 className="text-3xl sm:text-3xl text-center font-semibold text-gray-800">
          🎓 {t("carouselItemTitle")}
        </h1>
      </div>

      {shouldUseMarquee ? (
        <div className="overflow-hidden">
          <Marquee speed={30} pauseOnHover={true} loop={0} gradient={false}>
            <div className="flex">
              {/* First set of countries */}
              {displayedCountries.map((country, index) => (
                <CountryCard
                  key={`first-${index}`}
                  country={country}
                  handleNavigate={handleNavigate}
                  language={language}
                />
              ))}
              {/* Duplicate set to ensure smooth looping */}
              {displayedCountries.map((country, index) => (
                <CountryCard
                  key={`second-${index}`}
                  country={country}
                  handleNavigate={handleNavigate}
                  language={language}
                />
              ))}
            </div>
          </Marquee>
        </div>
      ) : (
        <div className="flex justify-center flex-row scrollbar-hide overflow-x-scroll gap-6 px-4">
          {displayedCountries.map((country, index) => (
            <CountryCard
              key={index}
              country={country}
              handleNavigate={handleNavigate}
              language={language}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const CountryCard = ({ country, handleNavigate, language }) => (
  <div
    onClick={() =>
      handleNavigate(
        language === "ar"
          ? country?.customURLSlug?.ar
          : country?.customURLSlug?.en
      )
    }
    className="flex-shrink-0 cursor-pointer flex flex-col items-center group mx-6"
  >
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
        {isWindows ? (
          country?.countryCode ? (
            <img
              src={`https://flagcdn.com/w320/${getEmoji(
                country.countryCode
              )}.png`}
              alt="Country Flag"
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover flag-shadow transition-all duration-300 group-hover:rotate-12 rounded-full"
            />
          ) : (
            <span className="text-[.6rem] font-medium">No flag</span>
          )
        ) : (
          <span
            className="text-4xl sm:text-5xl transition-all duration-300"
            style={{
              textShadow:
                "4px 4px 10px rgba(0, 0, 0, 0.6), -4px -4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            {getCountryEmoji(country?.countryCode)}
          </span>
        )}
      </div>
    </div>
    <p className="text-center text-xs sm:text-sm font-medium transition-all duration-300 group-hover:text-[#6439a2]">
      {language === "ar" ? country?.countryName?.ar : country?.countryName?.en}
    </p>
  </div>
);

// Function to get country emoji from country code
const getCountryEmoji = (countryCode) => {
  if (!countryCode) return "🏳️";

  const country = countryFlags.find(
    (c) =>
      c.code === countryCode.toUpperCase() ||
      c.alpha3 === countryCode.toUpperCase()
  );

  return country ? (
    <span
      style={{
        fontFamily: `"Segoe UI Emoji", "Apple Color Emoji", sans-serif`,
      }}
    >
      {country.emoji}
    </span>
  ) : (
    "🏳️"
  );
};

export default CarouselSection;
