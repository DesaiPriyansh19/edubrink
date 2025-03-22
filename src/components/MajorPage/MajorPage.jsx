"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Home,
  FileText,
  Calendar,
  Ticket,
  Share2,
  GraduationCap,
  Globe,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock3,
  Briefcase,
  Loader2,
  BadgeIcon as Certificate,
} from "lucide-react";
import ShareCard from "../../../utils/ShareCard";
import { useLanguage } from "../../../context/LanguageContext";
import useFetch from "../../../hooks/useFetch";
import { useTranslation } from "react-i18next";

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

      // Update document title
      document.title = seoTitle;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", seoDescription);
    }
  }, [majorData, loading, language]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFaq = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleApplyNow = (id, category, slug) => {
    navigate(
      `/${language}/applications/${id}?category=${encodeURIComponent(
        category
      )}&slug=${slug}`
    );
  };

  // Get the current URL for sharing
  const majorUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
    <div className="bg-white min-h-screen font-sans">
      {majorData?.majorCheckBox?.featuredMajor && (
        <div
          className="bg-[#3b3d8d] text-white py-3 px-4 text-center shadow-md"
          data-aos="fade-down"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Certificate className="w-5 h-5" />
            <p className="font-medium text-base">
              {t("majorPage.featuredMajor")} - {majorData.majorName[language]}
            </p>
          </div>
        </div>
      )}
      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          className="flex items-center text-sm text-gray-500 mb-4"
          data-aos="fade-right"
        >
          <Link to="/" className="flex items-center hover:text-gray-700">
            <Home className="w-4 h-4" />
          </Link>
          <span className="mx-2">›</span>
          <p className="hover:text-gray-700">
            {t("majorPage.breadcrumbMajors")}
          </p>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{majorData.majorName[language]}</span>
        </div>

        {/* Major Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            data-aos="fade-up"
          >
            {majorData.majorName[language]}
          </h1>

          <div
            className="flex items-center gap-3 mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Link
              to={`/${language}/university/${majorData?.university?.customURLSlug?.en}`}
              className="flex items-center"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-2">
                <img
                  src={
                    majorData?.university?.uniSymbol ||
                    "/placeholder.svg?height=32&width=32" ||
                    "/placeholder.svg"
                  }
                  alt={majorData?.university?.uniName?.[language]}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-gray-700">
                {majorData?.university?.uniName?.[language]}
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Share2 className="w-5 h-5 mr-1" />
                <span className="text-sm">{t("majorPage.share")}</span>
              </button>
            </div>
            <button
              onClick={() =>
                handleApplyNow(
                  majorData._id,
                  "major",
                  majorData?.customURLSlug?.en
                )
              }
              className="hidden md:block text-white px-8 py-3 rounded-full font-medium transition-all"
              style={{ backgroundColor: themeColor }}
            >
              {t("applyNow")}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Major Description - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            {/* Key Features */}
            <div className="mb-8" data-aos="fade-up">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="text-gray-400 mr-3 mt-1">•</div>
                  <div>
                    {t("majorPage.taughtInPartnership")}{" "}
                    {majorData?.university?.uniName?.[language]} School of{" "}
                    {majorData.studyLevel[0]}
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="text-gray-400 mr-3 mt-1">•</div>
                  <div>
                    {t("majorPage.combineModules", {
                      major: majorData.majorName[language],
                    })}
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="text-gray-400 mr-3 mt-1">•</div>
                  <div>{t("majorPage.learnFromResearch")}</div>
                </li>
              </ul>

              <div className="mt-4">
                <button
                  onClick={toggleReadMore}
                  className="font-medium flex items-center"
                  style={{ color: themeColor }}
                >
                  {isExpanded
                    ? t("majorPage.readLess")
                    : t("majorPage.readMore")}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div
                  className="mt-4 text-gray-700 prose max-w-none"
                  data-aos="fade-up"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: majorData.majorDescription[language],
                    }}
                  />
                </div>
              )}
            </div>

            {/* Requirements Section */}
            <div className="mb-8" data-aos="fade-up">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-gray-700 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  {t("majorPage.requirements")}
                </h2>
              </div>

              <p className="text-gray-700 mb-4">
                {t("majorPage.requirementsMayVary")}
              </p>

              {/* Requirements as keyword pills/tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {majorData.majorAdmissionRequirement.map((req, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200 text-gray-800 text-sm font-medium"
                    data-aos="fade-up"
                    data-aos-delay={50 * index}
                  >
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div data-aos="fade-up">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-gray-700 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  {t("majorPage.faq")}
                </h2>
              </div>

              <div className="space-y-4">
                {majorData?.faq?.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFaq(index)}
                    >
                      {faq.faqQuestions[language]}
                      {expandedFaqs[index] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaqs[index] && (
                      <div className="p-4 pt-0 text-gray-700 border-t border-gray-200 bg-gray-50">
                        {faq.faqAnswers[language]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Major Details Card - 1/3 width on desktop */}
          <div className="lg:col-span-1">
            {/* Tuition Fee Card */}
            <div
              className="bg-white border border-gray-200 rounded-2xl mb-6"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Ticket className="w-5 h-5 text-gray-700 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {majorData.majorTuitionFees}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  {t("majorPage.tuitionFee")}
                </p>

                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-gray-700 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.applyBy")} Aug 2025
                    </h4>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {t("majorPage.startDate")}
                    </span>
                    <span className="font-medium text-gray-900">
                      {majorData.majorIntakeMonth[0]}{" "}
                      {majorData.majorIntakeYear}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {t("majorPage.duration")}
                    </span>
                    <span className="font-medium text-gray-900">
                      {majorData.duration} {majorData.durationUnits}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {t("majorPage.campus")}
                    </span>
                    <span className="font-medium text-gray-900">
                      Main Campus
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">
                      {t("majorPage.modeOfStudy")}
                    </span>
                    <span className="font-medium text-gray-900">
                      {majorData.modeOfStudy}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyNow(majorData._id)}
                  className="w-full text-white py-3 rounded-full font-medium transition-all"
                  style={{ backgroundColor: themeColor }}
                >
                  {t("applyNow")}
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div
              className="bg-white border border-gray-200 rounded-2xl p-6"
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
                    <Clock3 className="w-5 h-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("majorPage.duration")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {majorData.duration} {majorData.durationUnits},{" "}
                      {majorData.modeOfStudy}
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
                      {majorData?.university?.uniName?.[language]}
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
                      {t("majorPage.studyLevelDegree", {
                        studyLevel: majorData.studyLevel[0],
                      })}
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
                      {majorData.majorLanguages.join(", ")}
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
                {majorData?.majorCheckBox?.scholarshipsAvailable && (
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
                        {t("Scholarships")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("Scholarships Available")}
                      </p>
                    </div>
                  </div>
                )}

                {majorData?.majorCheckBox?.expressAdmission && (
                  <div className="flex items-start">
                    <div
                      className="p-2 rounded-full mr-3"
                      style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                    >
                      <Clock3
                        className="w-5 h-5"
                        style={{ color: themeColor }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {t("Express Admission")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("Fast-track application process")}
                      </p>
                    </div>
                  </div>
                )}

                {majorData?.majorCheckBox?.entranceExamRequired && (
                  <div className="flex items-start">
                    <div
                      className="p-2 rounded-full mr-3"
                      style={{ backgroundColor: "rgba(59, 61, 141, 0.1)" }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: themeColor }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {t("Entrance Exam")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("Entrance examination required")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apply Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:hidden z-10">
          <button
            onClick={() => handleApplyNow(majorData._id)}
            className="w-full text-white py-3 rounded-full font-medium transition-all"
            style={{ backgroundColor: themeColor }}
          >
            {t("applyNow")}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={majorData.majorName[language] || "major"}
        contentType={"major"}
        contentUrl={majorUrl}
      />
    </div>
  );
};

export default MajorPage;
