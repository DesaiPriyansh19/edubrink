import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../../context/LanguageContext";

const fetchCountries = async () => {
  const res = await fetch(
    "https://edu-brink-backend.vercel.app/api/country/fields/query?fields=countryName,countryPhotos"
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json(); // Ensure the correct structure
};

const CarouselSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching countries</p>;

  // ✅ Ensure data is an array
  const countries = Array.isArray(data) ? data : data?.data || [];

  return (
    <section className="bg-transparent w-full mb-20">
      <div className="flex items-center justify-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl text-center font-semibold mr-4">
          🎓 {t("carouselItemTitle")}
        </h1>
      </div>

      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 sm:gap-11">
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
                className="flex-shrink-0 cursor-pointer flex flex-col items-center w-28 sm:w-32 md:w-32 lg:w-44"
              >
                <img
                  src={
                    country?.countryPhotos?.countryFlag ||
                    "https://placehold.co/70x70"
                  }
                  alt={`${
                    language === "ar"
                      ? country?.countryName?.ar
                      : country?.countryName?.en
                  } Flag`}
                  className="w-[12vw] h-[12vw] sm:w-[70px] sm:h-[70px] rounded-full mb-2"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                  }}
                />

                <p className="text-center text-xl text-black font-semibold">
                  {language === "ar"
                    ? country?.countryName?.ar
                    : country?.countryName?.en}
                </p>
              </div>
            ))
          ) : (
            <p>No countries found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
