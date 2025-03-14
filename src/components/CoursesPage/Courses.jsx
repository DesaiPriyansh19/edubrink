"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams } from "react-router-dom";
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
  X,
} from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import ShareCard from "../../../utils/ShareCard";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/LanguageContext";
import ApplyForm from "../../../utils/ApplyForm";

const CoursePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [itemId, setItemId] = useState("");
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const apiUrl = isObjectId
    ? `https://edu-brink-backend.vercel.app/api/course/${id}`
    : `https://edu-brink-backend.vercel.app/api/course/name/${encodeURIComponent(
        id
      )}`;

  const { data } = useFetch(apiUrl);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  const handleApplyNow = (id) => {
    setShowApplyForm(true);
    setItemId(id);
  };

  const handleFormClose = () => {
    setShowApplyForm(false);
  };

  const handleFormSubmit = () => {
    setShowApplyForm(false);
    setShowVerifiedModal(true);

    // Hide the verification modal after 3 seconds
    setTimeout(() => {
      setShowVerifiedModal(false);
    }, 3000);
  };

  // Get the current URL for sharing
  const courseUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
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
            <span>{t("CourseSlugPage.Country")}</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-gray-900">
              {language === "ar" ? data?.CourseName?.ar : data?.CourseName?.en}
            </span>
          </div>
        </div>

        {/* Course Header */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {data?.CourseName?.[language]}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={
                    data?.university?.uniSymbol ||
                    "/placeholder.svg?height=28&width=28" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt="University Logo"
                  className="rounded-full"
                />
                <p className="text-lg text-gray-700">
                  {language === "ar"
                    ? data?.university?.uniName?.ar
                    : data?.university?.uniName?.en}
                </p>
              </div>
            </div>
            <div
              className="hidden md:flex items-center gap-3"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <button
                className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-all"
                aria-label="Share course"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                className="bg-[rgba(56,12,149,1)] hover:bg-[rgba(46,10,129,1)] text-white px-6 py-2.5 rounded-full font-semibold transition-all"
                onClick={() => {
                  handleApplyNow(data?._id);
                }}
              >
                {t("applyNow")}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Course Description - 2/3 width on desktop */}
          <div
            className="lg:col-span-2 order-2 lg:order-1"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div
                className={`relative transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-full" : "max-h-40 overflow-hidden"
                }`}
              >
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: data.CourseDescription[language],
                  }}
                />
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              <button
                onClick={toggleReadMore}
                className="mt-4 px-4 py-2 text-[rgba(56,12,149,1)] border border-[rgba(56,12,149,1)] hover:bg-[rgba(56,12,149,0.05)] font-medium rounded-lg transition-all"
              >
                {isExpanded
                  ? language === "ar"
                    ? "اقرأ أقل"
                    : "Read Less"
                  : language === "ar"
                  ? "اقرأ المزيد"
                  : "Read More"}
              </button>
            </div>

            {/* Requirements Section */}
            <div
              className="bg-white rounded-xl shadow-sm p-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {t("CourseSlugPage.Requirements")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.Requirements?.[language]?.length > 0 ? (
                  data.Requirements?.[language].map((req, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg flex items-start gap-3"
                      data-aos="fade-up"
                      data-aos-delay={400 + index * 50}
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-[rgba(56,12,149,1)]" />
                      <span className="font-medium text-gray-700">
                        {req || "Requirement not specified."}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No requirements available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Details Card - 1/3 width on desktop */}
          <div
            className="lg:col-span-1 order-1 lg:order-2"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
              {/* Price Header */}
              <div className="bg-[rgba(232,36,72,1)] text-white p-6 rounded-t-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Ticket className="w-5 h-5" />
                  <h4 className="text-xl font-bold">
                    {data?.CourseFees} {t("UniversitySlugPage.PerYear")}
                  </h4>
                </div>
                <p className="text-white/90 text-sm">
                  {t("UniversitySlugPage.InterFees")}
                </p>
              </div>

              {/* Course Details */}
              <div className="p-6 space-y-4">
                {/* Duration */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-[rgba(56,12,149,1)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {data?.CourseDuration || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {" "}
                      {t("UniversitySlugPage.Duration")}
                    </p>
                  </div>
                </div>

                {/* Start Month */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-[rgba(56,12,149,1)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Sep 2025</p>
                    <p className="text-sm text-gray-500">
                      {" "}
                      {t("UniversitySlugPage.StartMonth")}
                    </p>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Timer className="w-5 h-5 text-[rgba(56,12,149,1)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(data?.DeadLine).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      }) || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("UniversitySlugPage.ApplicationDeadline")}
                    </p>
                  </div>
                </div>

                {/* Mode of Study */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <BookOpen className="w-5 h-5 text-[rgba(56,12,149,1)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {language === "ar"
                        ? data?.ModeOfStudy?.ar?.[0]
                        : data?.ModeOfStudy?.en?.[0] || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {" "}
                      {t("UniversitySlugPage.ModeOfStudy")}
                    </p>
                  </div>
                </div>

                {/* Discount */}
                <div className="flex items-center gap-4 py-3">
                  <div className="bg-gray-50 p-2 rounded-full">
                    <Tag className="w-5 h-5 text-[rgba(56,12,149,1)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {" "}
                      {t("CourseSlugPage.ScholarshipAva")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {" "}
                      {t("CourseSlugPage.ScholarshipOptions")}
                    </p>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  className="w-full mt-4 bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
                  onClick={() => {
                    handleApplyNow(data?._id);
                  }}
                >
                  {t("applyNow")}
                </button>
              </div>
            </div>

            {/* Counselor Card */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="inline-flex bg-gray-100 text-gray-800 font-medium px-4 py-1.5 rounded-full mb-4">
                {t("UniversitySlugPage.CounsellorTitle")}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt="Counselor"
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-bold text-xl mb-2">
                    {" "}
                    {t("UniversitySlugPage.CounsellorName")}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t("UniversitySlugPage.CounsellorDesc")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white py-2.5 rounded-full font-medium hover:shadow-md transition-all">
                  {t("UniversitySlugPage.CallNow")}
                </button>
                <button className="bg-white border border-gray-200 text-gray-800 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all">
                  {t("UniversitySlugPage.ChatNow")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={data?.CourseName?.[language] || "Course"}
        contentType={"course"}
        contentUrl={courseUrl}
      />

      {/* Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleFormClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <ApplyForm
                itemId={itemId}
                category="Course"
                onClose={handleFormClose}
                onSubmitSuccess={handleFormSubmit}
                isDesktop={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
    </div>
  );
};

export default CoursePage;
