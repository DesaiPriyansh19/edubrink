"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Home,
  FileText,
  Clock,
  Calendar,
  Timer,
  BookOpen,
  Ticket,
  Tag,
  CheckCircle,
  Share2,
  GraduationCap,
  Globe,
  Briefcase,
  BadgeIcon as Certificate,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import ShareCard from "../../../utils/ShareCard";
import { useLanguage } from "../../../context/LanguageContext";
import useFetch from "../../../hooks/useFetch";
import { useTranslation } from "react-i18next";
import FaqDropDown from "../../../utils/FaqDropDown";

const MajorPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { slug } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const navigate = useNavigate();

  // Theme color
  const themeColor = "#3b3d8d";

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Fetch major data
  const apiUrl = `https://edu-brink-backend.vercel.app/api/majors/name/${encodeURIComponent(
    slug
  )}`;
  const { data: majorData, loading } = useFetch(apiUrl);

  useEffect(() => {
    // Update document head for SEO
    if (majorData && !loading) {
      // SEO data based on current language
      const seoTitle =
        majorData?.seo?.metaTitle?.[language] ||
        majorData?.majorName?.[language] ||
        "Major Details";
      const seoDescription =
        majorData?.seo?.metaDescription?.[language] ||
        majorData?.majorDescription?.[language]
          ?.substring(0, 160)
          .replace(/<[^>]*>/g, "") + "..." ||
        "Explore major details, requirements, and application information.";
      const seoKeywords =
        majorData?.seo?.metaKeywords?.[language]?.join(", ") ||
        `${majorData?.majorName?.[language]}, ${majorData?.university?.uniName?.[language]}, education, major`;

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

      // Use university logo if available
      const imageUrl = majorData?.university?.uniSymbol || "";
      if (imageUrl) {
        updateMetaTag("og:image", imageUrl);
      }

      // Twitter Card tags
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", seoTitle);
      updateMetaTag("twitter:description", seoDescription);

      if (imageUrl) {
        updateMetaTag("twitter:image", imageUrl);
      }

      // Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", window.location.href);

      // Additional structured data for majors (Schema.org)
      const majorSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: majorData?.majorName?.[language],
        description: seoDescription,
        provider: {
          "@type": "Organization",
          name: majorData?.university?.uniName?.[language],
          sameAs:
            window.location.origin +
            "/university/" +
            (majorData?.university?.customURLSlug?.[language] ||
              majorData?.university?._id),
        },
        timeRequired: `${majorData?.duration || "N/A"} ${
          majorData?.durationUnits || ""
        }`,
        url: window.location.href,
      };

      // Add or update structured data
      let structuredDataScript = document.querySelector(
        "#major-structured-data"
      );
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.id = "major-structured-data";
        structuredDataScript.type = "application/ld+json";
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(majorSchema);
    }
  }, [majorData, loading, language]);

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

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFaq = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleApplyNow = (id, category = "major", slug) => {
    navigate(
      `/${language}/applications/${id}?category=${encodeURIComponent(
        category
      )}${slug ? `&slug=${slug}` : ""}`
    );
  };

  // Get the current URL for sharing
  const majorUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!majorData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-md">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("majorPage.majorNotFound")}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("majorPage.majorNotFoundDescription")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center text-white px-6 py-3 rounded-full font-medium transition-all"
            style={{ backgroundColor: themeColor }}
          >
            <Home className="w-4 h-4 mr-2" />
            {t("majorPage.returnHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Featured Major Banner */}
      {majorData?.majorCheckBox?.featuredMajor && (
        <div
          className="bg-[#3b3d8d] text-white py-3 px-4 text-center shadow-md"
          data-aos="fade-down"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Certificate className="w-5 h-5" />
            <p className="font-medium text-base">
              {t("majorPage.featuredMajor")} -{" "}
              {majorData.majorName?.[language] || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div
          className="flex items-center text-sm text-gray-600 mb-6"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <div className="flex items-center">
            <Home className="w-4 h-4" />
            <span className="mx-2">&gt;</span>
          </div>
          <div className="flex items-center">
            <span>{t("majorPage.breadcrumbMajors")}</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-gray-900">
              {majorData.majorName?.[language] || "N/A"}
            </span>
          </div>
        </div>

        {/* Major Header */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-[#3b3d8d]" />
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                  {majorData.studyLevel?.[0] || "N/A"} Program
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {majorData.majorName?.[language] || "N/A"}
              </h1>

              <div className="flex items-center gap-2 mb-2">
                <img
                  src={
                    majorData?.university?.uniSymbol ||
                    "/placeholder.svg?height=28&width=28" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="University Logo"
                  className="rounded-full"
                  width="28"
                  height="28"
                />
                <Link
                  to={`/${language}/university/${
                    majorData?.university?.customURLSlug?.[language] || "#"
                  }`}
                  className="text-lg hover:text-gray-900 text-gray-600"
                >
                  {majorData?.university?.uniName?.[language] || "N/A"}
                </Link>
              </div>
            </div>
            <div
              className="hidden md:flex items-center gap-3"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <button
                className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-all"
                aria-label="Share major"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                className="bg-[#3b3d8d] hover:bg-[#2E0A81] text-white px-6 text-sm py-2.5 rounded-full font-semibold transition-all"
                onClick={() =>
                  handleApplyNow(
                    majorData._id || "",
                    "major",
                    majorData?.customURLSlug?.en
                  )
                }
              >
                {t("applyNow")}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Major Description - 2/3 width on desktop */}
          <div
            className="lg:col-span-2 order-2 lg:order-1"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="rounded-xl p-6 mb-8">
              <div
                className={`relative transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-full" : "max-h-40 overflow-hidden"
                }`}
              >
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      majorData.majorDescription?.[language] ||
                      "No description available",
                  }}
                />
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-100 to-transparent"></div>
                )}
              </div>

              <button
                onClick={toggleReadMore}
                className="mt-4 text-[#3b3d8d] hover:text-[#7879bb] font-medium rounded-lg transition-all flex items-center"
              >
                {isExpanded
                  ? language === "ar"
                    ? "اقرأ أقل"
                    : "Read Less"
                  : language === "ar"
                  ? "اقرأ المزيد"
                  : "Read More"}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>

            {/* Requirements Section */}
            <div
              className="rounded-xl p-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {t("majorPage.requirements")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {majorData.majorAdmissionRequirement &&
                majorData.majorAdmissionRequirement.length > 0 ? (
                  majorData.majorAdmissionRequirement.map((req, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg flex items-start gap-3 border border-gray-100"
                      data-aos="fade-up"
                      data-aos-delay={400 + index * 50}
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-[#3b3d8d]" />
                      <span className="font-medium text-gray-700">
                        {req || "N/A"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    {t("CourseSlugPage.NoRequirementsAvailable")}
                  </p>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            {majorData?.faq && majorData.faq.length > 0 ? (
              <FaqDropDown faqData={majorData?.faq} />
            ) : null}
          </div>

          {/* Major Details Card - 1/3 width on desktop */}
          <div
            className="lg:col-span-1 order-1 lg:order-2"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden top-4">
              {/* Price Header */}
              <div className="bg-[#E82448] text-white px-6 py-4 rounded-t-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Ticket className="w-5 h-5" />
                  <h4 className="text-lg font-normal">
                    {majorData.majorTuitionFees || "N/A"}{" "}
                    {t("UniversitySlugPage.PerYear")}
                  </h4>
                </div>
                <p className="text-white/90 text-sm">
                  {t("UniversitySlugPage.InterFees")}
                </p>
              </div>

              {/* Major Details */}
              <div className="p-6 space-y-4">
                {/* Duration */}
                <div className="flex items-center gap-4 py-1 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      {majorData.duration || "N/A"}{" "}
                      {majorData.durationUnits || ""}
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("majorPage.duration")}
                    </p>
                  </div>
                </div>

                {/* Start Month */}
                <div className="flex items-center gap-4 py-1 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      {majorData.majorIntakeMonth?.[0] || "N/A"}{" "}
                      {majorData.majorIntakeYear || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("UniversitySlugPage.StartMonth")}
                    </p>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="flex items-center gap-4 py-1 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Timer className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      Aug 2025
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("majorPage.applyBy")}
                    </p>
                  </div>
                </div>

                {/* Campus */}
                <div className="flex items-center gap-4 py-1 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      Main Campus
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("majorPage.campus")}
                    </p>
                  </div>
                </div>

                {/* Mode of Study */}
                <div className="flex items-center gap-4 py-1 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <BookOpen className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      {majorData.modeOfStudy || "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("majorPage.modeOfStudy")}
                    </p>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center gap-4 py-1">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Globe className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-medium text-gray-900">
                      {majorData.majorLanguages &&
                      majorData.majorLanguages.length > 0
                        ? majorData.majorLanguages.join(", ")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-800">
                      {t("UniversitySlugPage.Language")}
                    </p>
                  </div>
                </div>

                {/* Scholarships */}
                {majorData?.majorCheckBox?.scholarshipsAvailable && (
                  <div className="flex items-center gap-4 py-2">
                    <div className="bg-gray-50 p-2 rounded-full">
                      <Tag className="w-5 h-5 text-[#3b3d8d]" />
                    </div>
                    <div>
                      <p className="text-[1rem] font-medium text-gray-900">
                        {t("CourseSlugPage.ScholarshipAva")}
                      </p>
                      <p className="text-sm text-gray-800">
                        {t("CourseSlugPage.ScholarshipOptions")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  className="w-full mt-4 bg-[#3A3D8D] text-white py-2 text-sm rounded-full font-semibold hover:shadow-lg transition-all"
                  onClick={() =>
                    handleApplyNow(
                      majorData._id || "",
                      "major",
                      majorData?.customURLSlug?.en
                    )
                  }
                >
                  {t("applyNow")}
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t("majorPage.keyFeatures")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                  >
                    <Clock className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.duration")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {majorData.duration || "N/A"}{" "}
                      {majorData.durationUnits || ""},{" "}
                      {majorData.modeOfStudy || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.location")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("majorPage.mainCampus")},{" "}
                      {majorData?.university?.uniName?.[language] || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                  >
                    <GraduationCap
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.qualification")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {majorData.studyLevel?.[0]
                        ? `${majorData.studyLevel[0]} Degree`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                  >
                    <Globe className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.language")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {majorData.majorLanguages &&
                      majorData.majorLanguages.length > 0
                        ? majorData.majorLanguages.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                  >
                    <Briefcase
                      className="w-5 h-5"
                      style={{ color: themeColor }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.careerOpportunities")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("majorPage.careerRoles")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Counselor Card */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="inline-flex bg-[#F8F8F8] font-medium px-4 py-1.5 rounded-full mb-4">
                {t("UniversitySlugPage.CounsellorTitle")}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt="Counselor"
                  className="rounded-full"
                  width="64"
                  height="64"
                />
                <div>
                  <h4 className="font-bold text-xl mb-2">
                    {t("UniversitySlugPage.CounsellorName")}
                  </h4>
                  <p className="text-[1rem]">
                    {t("UniversitySlugPage.CounsellorDesc")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-[#3A3D8D] text-white text-sm py-2.5 rounded-full font-medium hover:shadow-md transition-all">
                  {t("UniversitySlugPage.CallNow")}
                </button>
                <button className="bg-white text-sm border border-gray-200 text-gray-800 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all">
                  {t("UniversitySlugPage.ChatNow")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apply Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:hidden z-10">
          <button
            onClick={() =>
              handleApplyNow(
                majorData._id || "",
                "major",
                majorData?.customURLSlug?.en
              )
            }
            className="w-full text-white py-3 rounded-full font-medium transition-all bg-[#3A3D8D]"
          >
            {t("applyNow")}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={majorData.majorName?.[language] || "major"}
        contentType={"major"}
        contentUrl={majorUrl}
      />

      {/* Related Majors Section - If available */}
      {majorData?.university?.majorId?.length > 0 && (
        <div className="max-w-[1200px] mx-auto md:ml-5 lg:ml-9 mb-16">
          <div>
            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className="flex items-center justify-between mt-6 mb-4"
            >
              <div className="ml-5 md:ml-0">
                <h1 className="text-2xl sm:text-4xl font-semibold">
                  📚 {t("relatedMajors.title") || "Related Majors"}
                </h1>
                <p className="text-sm mt-3 max-w-xl font-medium">
                  {t("relatedMajors.description") ||
                    "Explore other majors offered by this university"}
                </p>
              </div>
              <Link to={`/${language}/searchresults/Allmajors`}>
                <div
                  className={`w-full flex mt-4 ${
                    language === "ar" ? "justify-start" : "justify-end"
                  } items-center px-4`}
                >
                  <button
                    className={`hidden md:flex justify-center items-center text-black text-[.7rem] font-normal py-2 px-3 rounded-full transform hover:scale-105 transition-all duration-300 group`}
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
              </Link>
            </div>
          </div>

          {/* This would be populated with related majors if available */}
          <div
            dir={language === "ar" ? "rtl" : "ltr"}
            className="flex overflow-x-scroll scrollbar-hide col-span-3 flex-col gap-4 sm:flex-row mx-3 md:ml-0"
          >
            {/* Placeholder for related majors */}
            <div className="text-center w-full py-8 text-gray-500">
              Related majors would appear here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MajorPage;
