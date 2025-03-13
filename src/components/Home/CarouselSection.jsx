import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../../context/LanguageContext";
import { countryFlags, getEmoji } from "../../../libs/countryFlags";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";

const isWindows = navigator.userAgent.includes("Windows");

const fetchCountries = async () => {
  const res = await fetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryCode,customURLSlug"
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const SkeletonLoader = () => (
  <div className="flex gap-6 sm:gap-11">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex-shrink-0 flex flex-col items-center w-28 sm:w-32 md:w-32 lg:w-44"
      >
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
        <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    ))}
  </div>
);

const CarouselSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const handleNavigate = (customURLSlug) => {
    navigate(`/${language}/country/${customURLSlug}`);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const countries = Array.isArray(data) ? data : data?.data || [];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // `md` breakpoint
    };
    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldUseMarquee = countries.length >= 8 || isMobile;

  return (
    <section className="bg-gradient-to-r from-[#6439a2]/10 to-[#d76a6b]/10 w-full py-16 md:px-4">
      <div className="flex items-center justify-center mb-12">
        <h1 className="text-3xl sm:text-4xl text-center font-semibold text-gray-800">
          🎓 {t("carouselItemTitle")}
        </h1>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : isError ? (
        <p className="text-center text-red-500">Error fetching countries</p>
      ) : shouldUseMarquee ? (
        <Marquee speed={50} pauseOnHover={true} loop={0}>
          {countries.map((country, index) => (
            <CountryCard
              key={index}
              country={country}
              handleNavigate={handleNavigate}
              language={language}
            />
          ))}
        </Marquee>
      ) : (
        <div className="flex justify-center flex-row scrollbar-hide overflow-x-scroll gap-6">
          {countries.map((country, index) => (
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
    className="flex-shrink-0 mx-6 cursor-pointer flex flex-col items-center group"
  >
    <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6439a2]/20 to-[#d76a6b]/20 transition-transform duration-300 group-hover:scale-110"></div>
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
        {isWindows ? (
          country?.countryCode ? (
            <img
              src={`https://flagcdn.com/w320/${getEmoji(
                country.countryCode
              )}.png`}
              alt="Country Flag"
              className="w-12 h-12 object-cover transition-all duration-300 group-hover:rotate-12 rounded-full"
            />
          ) : (
            <span className="text-[.6rem] font-medium">No flag</span>
          )
        ) : (
          <span className="text-5xl filter transition-all duration-300 group-hover:rotate-12">
            {getCountryEmoji(country?.countryCode)}
          </span>
        )}
      </div>
    </div>
    <p className="text-center text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-[#6439a2]">
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
