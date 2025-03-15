"use client";

import { useEffect } from "react";
import TickMark from "../../../svg/TickMark";
import UniversityRightLayout from "./UniversityRightLayout";
import UniversityLeftLayout from "./UniversityLeftLayout";
import UniversityCard from "./UniversityCard";
import UniversityHighlight from "./UniversityHighlight";
import useFetch from "../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";

const UniversityPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { data, loading } = useFetch(
    `https://edu-brink-backend.vercel.app/api/university/name/${slug}`
  );

  useEffect(() => {
    if (data && !loading) {
      // SEO data based on current language
      const seoTitle =
        data?.seo?.metaTitle?.[language] ||
        `${data?.uniName?.[language]} | Study at ${data?.uniName?.[language]}` ||
        "University Details";

      const seoDescription =
        data?.seo?.metaDescription?.[language] ||
        data?.uniDescription?.[language]
          ?.substring(0, 160)
          .replace(/<[^>]*>/g, "") ||
        `Explore programs, courses, and admission details for ${data?.uniName?.[language]}.`;

      const seoKeywords =
        data?.seo?.metaKeywords?.[language]?.join(", ") ||
        `${data?.uniName?.[language]}, university, education, ${data?.uniCountry?.[language]}, study abroad`;

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

      // Use university images if available
      if (data?.uniMainImage) {
        updateMetaTag("og:image", data.uniMainImage);
      }

      if (data?.uniSymbol) {
        updateMetaTag("og:image:alt", `${data?.uniName?.[language]} Logo`);
      }

      // Twitter Card tags
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", seoTitle);
      updateMetaTag("twitter:description", seoDescription);

      if (data?.uniMainImage) {
        updateMetaTag("twitter:image", data.uniMainImage);
      }

      // Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", window.location.href);

      // Additional structured data for educational organization (Schema.org)
      const universitySchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": window.location.href,
        name: data?.uniName?.[language],
        description: seoDescription,
        url: window.location.href,
        logo: data?.uniSymbol || "",
        image: data?.uniMainImage || "",
        address: {
          "@type": "PostalAddress",
          addressCountry: data?.uniCountry?.[language] || "",
          addressLocality: data?.uniCity?.[language] || "",
        },
      };

      // Add or update structured data
      let structuredDataScript = document.querySelector(
        "#university-structured-data"
      );
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.id = "university-structured-data";
        structuredDataScript.type = "application/ld+json";
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(universitySchema);
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

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-3 md:px-0 lg:px-8">
      <div className="relative">
        <div className="h-[426px]">
          <img
            src={data?.uniMainImage || "https://placehold.co/1376x426"}
            alt={`${data?.uniName?.[language]} Campus`}
            className="w-full h-full object-cover rounded-lg"
            width="1376"
            height="426"
          />
        </div>
        <div
          className={`absolute top-[96%] -translate-y-1/2 
    ${
      language === "ar"
        ? "right-4 sm:right-6 md:right-8"
        : "left-4 sm:left-6 md:left-8"
    } 
    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white shadow-lg flex items-center justify-center rounded-[1.2rem] bottom-[4%]`}
        >
          <img
            src={data?.uniSymbol || "https://placehold.co/64x64"}
            alt={`${data?.uniName?.[language]} Logo`}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
            width="64"
            height="64"
          />
          <span className="absolute bottom-[14%] top-[86%] right-1">
            <TickMark />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 md:col-span-8 space-y-6">
          <UniversityLeftLayout data={data} language={language} />
          <UniversityCard data={data} language={language} />
          <UniversityHighlight data={data} language={language} />
        </div>
        <div className="col-span-12 md:col-span-4 space-y-6">
          <UniversityRightLayout data={data} language={language} />
        </div>
      </div>
    </div>
  );
};

export default UniversityPage;
