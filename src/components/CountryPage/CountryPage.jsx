"use client";

import { useEffect, useState } from "react";
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
import AOS from "aos";
import "aos/dist/aos.css";
import { Home } from "lucide-react";
import FaqDropDown from "../../../utils/FaqDropDown";

const CountryPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showFullOverview, setShowFullOverview] = useState(false);

  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/country/name/${slug}`
  );

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: true,
    });
  }, []);

  // Update document head for SEO
  useEffect(() => {
    if (data && !loading) {
      // SEO data based on current language
      const seoTitle =
        data?.seo?.metaTitle?.[language] ||
        `Study in ${data?.countryName?.[language]}`;
      const seoDescription =
        data?.seo?.metaDescription?.[language] ||
        data?.countrySummary?.[language];
      const seoKeywords = data?.seo?.metaKeywords?.[language]?.join(", ") || "";

      // Update document title
      document.title = seoTitle;

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", seoDescription);

      // Update or create meta keywords
      if (seoKeywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement("meta");
          metaKeywords.setAttribute("name", "keywords");
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute("content", seoKeywords);
      }

      // Open Graph tags
      updateMetaTag("og:title", seoTitle);
      updateMetaTag("og:description", seoDescription);
      updateMetaTag("og:type", "website");
      updateMetaTag("og:url", window.location.href);

      if (data?.countryPhotos?.mainPagePhoto) {
        updateMetaTag("og:image", data.countryPhotos.mainPagePhoto);
      }

      // Twitter Card tags
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", seoTitle);
      updateMetaTag("twitter:description", seoDescription);

      if (data?.countryPhotos?.mainPagePhoto) {
        updateMetaTag("twitter:image", data.countryPhotos.mainPagePhoto);
      }

      // Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", window.location.href);
    }
  }, [data, loading, language]);

  // Helper function to update or create meta tags
  const updateMetaTag = (property, content) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", content);
  };

  // Function to create a truncated version of the overview
  const createTruncatedOverview = () => {
    if (!data?.countryOverview?.[language]) return "";

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = data.countryOverview[language];

    // Get the text content
    const textContent = tempDiv.textContent || tempDiv.innerText;

    // Return truncated text (300 characters)
    return textContent.substring(0, 300) + "...";
  };

  if (loading) {
    return <CountrySkeletonLoader />;
  }
  console.log(data);

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-10 mx-auto py-8 font-sans bg-gray-50">
      <div
        className="text-sm mb-6 flex items-center text-gray-600"
        data-aos="fade-right"
      >
        <div className="flex items-center">
          <CountryHome />
          <span className="mx-2">&gt;</span>
        </div>
        <div className="flex items-center font-medium">
          <span>{t("CourseSlugPage.Country")}</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium text-gray-900">
            {language === "ar"
              ? `الدراسة في ${data?.countryName?.ar || "غير متوفر"}`
              : `Study in ${data?.countryName?.en || "N/A"}`}
          </span>
        </div>
      </div>

      <div
        className="w-full rounded-xl relative overflow-hidden mb-8 max-w-[1376px] mx-auto shadow-lg"
        data-aos="zoom-in"
      >
        <img
          src={
            data?.countryPhotos?.mainPagePhoto ||
            "https://placehold.co/1376x426"
          }
          alt={`Study in ${data?.countryName?.[language]}`}
          className="w-full h-auto max-h-[426px] object-cover transform  transition-transform duration-500"
          width="1376"
          height="426"
          style={{ aspectRatio: "1376/426" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      <div className=" rounded-xl  shadow-sm mb-8">
        <div
          className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
          data-aos="fade-up"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-gray-900 leading-tight">
            {language === "ar"
              ? `الدراسة في ${data?.countryName?.[language] || "غير متوفر"}`
              : `Study in ${data?.countryName?.[language] || "N/A"}`}
          </h1>

          {data?.hotDestination && (
            <p className="inline-block bg-gradient-to-r text-sm from-rose-500 to-pink-600 font-sans font-medium  text-white py-1 px-3 rounded-full leading-7 shadow-md transform hover:scale-105 transition-transform duration-300">
              🔥 Hot Destination
            </p>
          )}
        </div>

        <p
          className="text-base font-medium mt-2 mb-6 text-gray-700 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {data?.countrySummary?.[language]}
        </p>

        <div
          className="text-sm mb-6 flex items-center"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <div className="flex items-center me-4">
            <KeyLogo />
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-900">
              {" "}
              {t("countryPage.keyFacts")}
            </span>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div
            className="flex items-center p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
            data-aos="zoom-in"
            data-aos-delay="250"
          >
            <div className="mr-4 bg-gray-100 p-3 rounded-full">
              <DollerRounded />
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5 text-gray-500">
                {data?.countryCurrency}
              </p>
              <p className="font-semibold text-gray-900">
                {" "}
                {t("countryPage.currency")}
              </p>
            </div>
          </div>

          <div
            className="flex items-center p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="mr-4 bg-gray-100 p-3 rounded-full">
              <Home />
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5 text-gray-500">
                ${data?.livingCost}
              </p>
              <p className="font-semibold text-gray-900">
                {t("countryPage.livingCost")}
              </p>
            </div>
          </div>

          <div
            className="flex items-center p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
            data-aos="zoom-in"
            data-aos-delay="350"
          >
            <div className="mr-4 bg-gray-100 p-3 rounded-full">
              <LanguageLogo />
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5 text-gray-500">
                {data?.countryLanguages[0]}
              </p>
              <p className="font-semibold text-gray-900">
                {t("UniversitySlugPage.Language")}
              </p>
            </div>
          </div>

          <div
            className="flex items-center p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <div className="mr-4 bg-gray-100 p-3 rounded-full">
              <UniversityLogo />
            </div>
            <div>
              <p className="font-sans font-medium text-sm leading-5 text-gray-500">
                {data?.universities?.length}
              </p>
              <p className="font-semibold text-gray-900">{t("universities")}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          data-aos="fade-up"
          data-aos-delay="450"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {language === "ar" ? "نظرة عامة على البلد" : "Country Overview "}
          </h2>

          {!showFullOverview ? (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {createTruncatedOverview()}
              </p>
              <button
                onClick={() => setShowFullOverview(true)}
                className="text-rose-600 font-medium hover:text-rose-700 transition-colors duration-300 flex items-center"
              >
                {language === "ar" ? "اقرأ المزيد" : "Read More "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data?.countryOverview?.[language],
                }}
              />
              <button
                onClick={() => setShowFullOverview(false)}
                className="text-rose-600 font-medium hover:text-rose-700 transition-colors duration-300 flex items-center"
              >
                {language === "ar" ? "إظهار أقل" : "Show Less "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {data?.universities.length > 0 && (
        <div data-aos="fade-up" data-aos-delay="500">
          <CountryPopularCourse data={data} />
        </div>
      )}

      {data?.universities.length > 0 && (
        <div data-aos="fade-up" data-aos-delay="550">
          <CountryPopularUniversity data={data} />
        </div>
      )}

      {data?.blog.length > 0 && (
        <div data-aos="fade-up" data-aos-delay="600">
          <CountryBlogs data={data} />
        </div>
      )}

      {data?.faq?.length > 0 && (
        <div data-aos="fade-up" data-aos-delay="600">
          <FaqDropDown faqData={data?.faq} />
        </div>
      )}
    </div>
  );
};

export default CountryPage;
