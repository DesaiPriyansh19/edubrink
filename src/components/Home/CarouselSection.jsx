"use client";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../../context/LanguageContext";
import { countryFlags } from "../../../libs/countryFlags";
import { useEffect, useRef } from "react";

const fetchCountries = async () => {
  const res = await fetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryCode"
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const SkeletonLoader = () => {
  return (
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
};

const CarouselSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const handleNavigate = (name) => {
    navigate(`/${language}/country/${name}`);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const countries = Array.isArray(data) ? data : data?.data || [];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition > maxScroll) {
        scrollPosition = 0;
      }
      carousel.scrollLeft = scrollPosition;
      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#6439a2]/10 to-[#d76a6b]/10 w-full py-16 px-4">
      <div className="flex items-center justify-center mb-12">
        <h1 className="text-3xl sm:text-4xl text-center font-semibold text-gray-800">
          🎓 {t("Find out the best study destination")}
        </h1>
      </div>

      <div ref={carouselRef} className="w-full overflow-x-hidden">
        {isLoading ? (
          <SkeletonLoader />
        ) : isError ? (
          <p className="text-center text-red-500">Error fetching countries</p>
        ) : (
          <div className="flex gap-8 sm:gap-12 px-4">
            {countries.length > 0 ? (
              countries.map((country, index) => (
                <div
                  onClick={() =>
                    handleNavigate(
                      language === "ar"
                        ? country?.countryName?.ar
                        : country?.countryName?.en
                    )
                  }
                  key={index}
                  className="flex-shrink-0 cursor-pointer flex flex-col items-center group"
                >
                  <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6439a2]/20 to-[#d76a6b]/20 transition-transform duration-300 group-hover:scale-110"></div>
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <span className="text-5xl filter transition-all duration-300 group-hover:rotate-12">
                        {getCountryEmoji(country?.countryCode)}
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-[#6439a2] ">
                    {language === "ar"
                      ? country?.countryName?.ar
                      : country?.countryName?.en}
                  </p>

                  {/* Animation Two */}
                  {/* <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6439a2]/20 to-[#d76a6b]/20 transition-transform duration-300 group-hover:scale-105"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl filter transition-all duration-300 group-hover:animate-bounce">
                        {getCountryEmoji(country?.countryCode)}
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-[#6439a2] group-hover:translate-y-1">
                    {language === "ar"
                      ? country?.countryName?.ar
                      : country?.countryName?.en}
                  </p> */}

                  {/* Glow Effect */}
                  {/* <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6439a2]/20 to-[#d76a6b]/20 transition-opacity duration-300 group-hover:opacity-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6439a2] to-[#d76a6b] opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl filter transition-all duration-300 group-hover:scale-110">
                        {getCountryEmoji(country?.countryCode)}
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-[#6439a2] group-hover:scale-105">
                    {language === "ar"
                      ? country?.countryName?.ar
                      : country?.countryName?.en}
                  </p> */}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-700">No countries found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const getCountryEmoji = (countryCode) => {
  if (!countryCode) return "🏳️";
  const country = countryFlags.find(
    (c) =>
      c.code === countryCode.toUpperCase() ||
      c.alpha3 === countryCode.toUpperCase()
  );
  return country ? country.emoji : "🏳️";
};

export default CarouselSection;
