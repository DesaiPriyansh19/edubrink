"use client";

import { useEffect, useState } from "react";
import TickMark from "../../../svg/TickMark";
import UniversityRightLayout from "./UniversityRightLayout";
import UniversityLeftLayout from "./UniversityLeftLayout";
import UniversityHighlight from "./UniversityHighlight";
import UniversityFAQ from "./UniversityFAQ";
import UniversityDetails from "./UniversityDetails";
import useFetch from "../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import axios from "axios";
import { Loader2 } from "lucide-react";
import UniversityPrograms from "./UniversityPrograms";
import verify from '../../../svg/verify/verify.svg'
const UniversityPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();

  // State for courses
  const [coursePage, setCoursePage] = useState(1);
  const [courseLimit] = useState(4); // Default to 2 courses per page
  const [coursePagination, setCoursePagination] = useState(null);

  // State for majors
  const [majorPage, setMajorPage] = useState(1);
  const [majorLimit] = useState(4); // Default to 2 majors per page
  const [majorPagination, setMajorPagination] = useState(null);

  // Updated state for filters to support multiple selections
  const [filters, setFilters] = useState({
    studyLevel: null,
    modeOfStudy: null,
  });

  // Handle filter changes from child components
  const handleFilterChange = (newFilters) => {
    // Check if either filter value has changed
    if (
      JSON.stringify(newFilters.studyLevel) !==
        JSON.stringify(filters.studyLevel) ||
      JSON.stringify(newFilters.modeOfStudy) !==
        JSON.stringify(filters.modeOfStudy)
    ) {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));

      // Reset to first page when any filter changes
      setCoursePage(1);
      setMajorPage(1);
    }
  };

  // Construct the API URL with pagination parameters and filters
  const apiUrl = `https://edu-brink-backend.vercel.app/api/university/name/${slug}?coursePage=${coursePage}&courseLimit=${courseLimit}&majorPage=${majorPage}&majorLimit=${majorLimit}${
    filters.studyLevel
      ? `&studyLevel=${encodeURIComponent(
          Array.isArray(filters.studyLevel)
            ? filters.studyLevel.join(",")
            : filters.studyLevel
        )}`
      : ""
  }${
    filters.modeOfStudy
      ? `&modeOfStudy=${encodeURIComponent(
          Array.isArray(filters.modeOfStudy)
            ? filters.modeOfStudy.join(",")
            : filters.modeOfStudy
        )}`
      : ""
  }`;

  const { data, loading, refetch } = useFetch(apiUrl);
  const userInfo = JSON.parse(localStorage.getItem("eduuserInfo") || "{}");
  const token = userInfo?.token || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, refetch the main data if the refetch function exists
        if (refetch) {
          await refetch();
        }

        // Then fetch pagination data
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setCoursePagination(response.data.coursePagination || null);
          setMajorPagination(response.data.majorPagination || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, token]); // Only depend on apiUrl and token, not on refetch

  // Handlers for pagination
  const handleCoursePageChange = (newPage) => {
    setCoursePage(newPage);
  };

  const handleMajorPageChange = (newPage) => {
    setMajorPage(newPage);
  };

  // useEffect(() => {
  //   // Initialize AOS animation library
  //   if (typeof window !== "undefined") {
  //     import("aos").then((AOS) => {
  //       AOS.init({
  //         duration: 800,
  //         once: true,
  //         easing: "ease-in-out",
  //         mirror: true,
  //       });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (data && !loading) {
      // SEO data based on current language
      const seoTitle =
        data?.seo?.metaTitle?.[language] ||
        `${data?.uniName?.[language]} | Study at ${data?.uniName?.[language]}` ||
        "University Details";

      const seoDescription =
        data?.seo?.metaDescription?.[language] ||
        data?.uniOverview?.[language]
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 ">
      <div className="relative mb-16" data-aos="fade-up">
        <div className="h-[250px] sm:h-[300px] lg:h-[400px] overflow-hidden rounded-xl bg-transparent ">
          <img
            src={data?.uniMainImage || "https://placehold.co/1376x426"}
            alt={`${data?.uniName?.[language]} Campus`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            width="1376"
            height="426"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
        </div>

        {/* University Logo */}
        <div
          className={`absolute -bottom-8  -translate-y-1/2 
          ${language === "ar" ? "right-8" :"left-8"} 
          w-24 h-24 sm:w-28 sm:h-28 md:w-[7.5rem] md:h-32 bg-white shadow-xl
          flex items-center justify-center rounded-2xl 
          transition-all duration-300 `}
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <img
            src={data?.uniSymbol || "https://placehold.co/64x64"}
            alt={`${data?.uniName?.[language]} Logo`}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            width="80"
            height="80"
          />
          <span className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center ">
            <img src={verify}/>
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div data-aos="fade-up" data-aos-delay="100">
            <UniversityLeftLayout
              data={data}
              language={language}
              themeColor="#3b3d8d"
              onFilterChange={handleFilterChange}
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <UniversityPrograms
              data={data}
              language={language}
              themeColor="#3b3d8d"
              coursePage={coursePage}
              courseLimit={courseLimit}
              majorPage={majorPage}
              majorLimit={majorLimit}
              onCoursePageChange={handleCoursePageChange}
              onMajorPageChange={handleMajorPageChange}
              coursePagination={coursePagination}
              majorPagination={majorPagination}
              courseFilter={filters.studyLevel}
              majorFilter={filters.modeOfStudy}
            />
          </div>

          {/* Add the new University Details component */}
          <div data-aos="fade-up" data-aos-delay="275">
            <UniversityDetails
              data={data}
              language={language}
              themeColor="#3b3d8d"
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <UniversityHighlight data={data} language={language} />
          </div>

          {/* FAQ component */}
          {data?.faq && data.faq.length > 0 && (
            <div data-aos="fade-up" data-aos-delay="350">
              <UniversityFAQ
                data={data}
                language={language}
                themeColor="#3b3d8d"
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <div data-aos="fade-left" data-aos-delay="400">
            <UniversityRightLayout
              data={data}
              language={language}
              themeColor="#3b3d8d"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityPage;
