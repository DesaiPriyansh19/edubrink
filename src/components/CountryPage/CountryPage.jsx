import React, { useState } from "react";
import University from "../../assets/CountryPage/University.png";
import KeyLogo from "../../../svg/KeyFact";
import MillionLogo from "../../../svg/Millions";
import LanguageLogo from "../../../svg/LanguageLogo";
import UniversityLogo from "../../../svg/UniversityLogo";
import DollerRounded from "../../../svg/DollerRounded/Index";
import CountryHome from "../../../svg/CountryHome";
import CountryPopularCourse from "./CountryPopularCourse";
import CountryPopularUniversity from "./CountryPopularUniversity";
import CountryBlogs from "./CountryBlogs";
import { useParams } from "react-router-dom";

import useFetch from "../../../hooks/useFetch";
import { useTranslation } from "react-i18next";
import CountrySkeletonLoader from "../SkeletonLoaders/CountrySkeletonLoader";
import { useLanguage } from "../../../context/LanguageContext";

const CountryPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL;

  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/country/name/${slug}`
  );
  console.log(data);

  if (loading) {
    return <CountrySkeletonLoader />;
  }

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltl"}
      className="max-w-[1240px] px-10  mx-auto py-8 font-sans"
    >
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center">
          <CountryHome />
          <span className="mx-2">&gt;</span>
        </div>
        <div className="flex items-center font-medium">
          <span>Country</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium">
            Study in {data?.countryName?.[language]}
          </span>
        </div>
      </div>

      <div className="w-full rounded-lg overflow-hidden mb-6">
        <img
          src={
            "https://placehold.co/1376x426" ||
            data?.countryPhotos?.mainPagePhoto
          }
          alt="Australia University"
          className="w-full object-cover"
        />
      </div>
      <div>
        <div className="mb-8 flex items-center ">
          <h1 className="text-3xl md:text-5xl mb-0 me-5 font-sans font-semibold leading-[55.7px]">
            Study In {data?.countryName?.[language]}
          </h1>

          {data?.hotDestination && (
            <p className="inline-block bg-[rgba(232,36,72,1)] font-sans font-medium text-base text-white pt-[0.5rem] pb-[0.5rem] pl-[1rem] pr-[1.5rem] rounded-full leading-7">
              🔥Hot Destination
            </p>
          )}
        </div>

        <p className="text-sm font-medium mt-2 mb-3">
          {data?.countrySummary?.[language]}
        </p>

        <div className="text-sm mb-4 flex items-center">
          <div className="flex items-center me-4">
            <KeyLogo />
          </div>
          <div className="flex items-center ">
            <span className="font-medium">Key Fact</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
            <div className="mr-3">
              <span className="text-2xl rounded">
                <DollerRounded />
              </span>
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5">
                {data?.countryCurrency}
              </p>
              <p className="font-semibold">Currency</p>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
            <div className="mr-3">
              <span className="text-2xl">
                <MillionLogo />
              </span>
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5">
                ${data?.livingCost}
              </p>
              <p className="font-semibold">Living Cost</p>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
            <div className="mr-3">
              <span className="text-2xl rounded bg-gr">
                <LanguageLogo />
              </span>
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5">
                {data?.countryLanguages[0]}
              </p>
              <p className="font-semibold">Language</p>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
            <div className="mr-3">
              <span className="text-2xl">
                <UniversityLogo />
              </span>
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5">
                {data?.universities?.length}
              </p>
              <p className="font-semibold">University</p>
            </div>
          </div>
        </div>

        <div
          className="text-sm mt-2 mb-10"
          dangerouslySetInnerHTML={{
            __html: data?.countryOverview?.[language],
          }}
        />
      </div>
      <CountryPopularCourse data={data} />
      <CountryPopularUniversity data={data} />
      <CountryBlogs data={data} />
    </div>
  );
};

export default CountryPage;
