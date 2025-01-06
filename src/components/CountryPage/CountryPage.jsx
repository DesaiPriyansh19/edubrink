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
import Text from "../../../utils/Text";
import Loader from "../../../utils/Loader";
import SkeletonLoader from "../SkeletonLoaders/CountrySkeletonLoader";
import CountrySkeletonLoader from "../SkeletonLoaders/CountrySkeletonLoader";

const CountryPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/country/name/${slug}`
  );
  function formatPopulation(population) {
    if (!population) return ""; // Return empty string if population is undefined or null

    if (population >= 1_000_000) {
      return `${(population / 1_000_000).toFixed(1)} Million`;
    } else if (population >= 1_000) {
      return `${(population / 1_000).toFixed(1)}k`;
    }
    return population.toString(); // Return the number as-is for less than 1,000
  }
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // Change language using i18n
    setLanguage(lang); // Update local language state
  };

  if (loading) {
    return <CountrySkeletonLoader/>;
  }

  return (
    <div className="max-w-[1240px] px-10  mx-auto py-8 font-sans">
      {/* <div className="mb-4 flex justify-end">
        <button
          className={`px-4 py-2 rounded ${
            language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleLanguageChange("en")}
        >
          English
        </button>
        <button
          className={`px-4 py-2 ml-2 rounded ${
            language === "ar" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleLanguageChange("ar")}
        >
          Arabic
        </button>
      </div> */}
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center">
          <CountryHome />
          <span className="mx-2">&gt;</span>
        </div>
        <div className="flex items-center font-medium">
          <span>Country</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium">Study in {slug}</span>
        </div>
      </div>

      <div className="w-full rounded-lg overflow-hidden mb-6">
        <img
          src={University || data?.countryPhotos?.mainPagePhoto}
          alt="Australia University"
          className="w-full object-cover"
        />
      </div>
      <div>
        <div className="mb-8 flex items-center ">
          <h1 className="text-3xl md:text-5xl mb-0 me-5 font-sans font-semibold leading-[55.7px]">
            Study In {slug}
          </h1>
          <button className="inline-block bg-[rgba(232,36,72,1)] font-sans font-medium text-base text-white pt-[0.5rem] pb-[0.5rem] pl-[1rem] pr-[1.5rem] rounded-full leading-7">
            🔥Hot Destination
          </button>
        </div>

        <Text
          className="font-sans font-normal  text-base leading-6 mb-6"
          valueKey={{
            en: data?.countryOverview.en,
            ar: data?.countryOverview.ar,
          }}
        />

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
                {formatPopulation(data?.countryStudentPopulation)}
              </p>
              <p className="font-semibold">Student Population</p>
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

        <div>
          <h2 className="text-3xl md:text-3xl font-semibold mb-4 font-sans leading-[55.8px]">
            Why Study in {slug}?
          </h2>
          <p className=" text-[rgba(29,33,28,1)] font-normal text-base leading-6 mb-4">
            {slug} is a modern and multicultural country, making it a popular
            choice for international students. There are different cultures,
            food, languages and religious backgrounds to be found throughout the
            country’s six states and their cities. Australian universities offer
            a high quality education on par with many UK and US institutions.
          </p>
          <p className="text-[rgba(29,33,28,1)] font-normal text-base leading-6 mb-4">
            International University of Applied Sciences (IU) offers bachelor's,
            master's and MBA degrees, including engineering, data science, IT &
            Technology, business and management, health and social care,
            marketing, social sciences, human resources, and logistics.
          </p>
          <p className="text-[rgba(29,33,28,1)] font-normal text-base leading-6">
            The institution's faculty has experienced professionals and provides
            personalised attention and mentorship to students.
          </p>
        </div>
      </div>
      <CountryPopularCourse data={data} />
      <CountryPopularUniversity data={data} />
      <CountryBlogs />
    </div>
  );
};

export default CountryPage;
