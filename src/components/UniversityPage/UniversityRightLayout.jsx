"use client";

import { useState } from "react";
import DatePicker from "../../../svg/DatePicker";
import Seconds from "../../../svg/Seconds";
import CourseBook from "../../../svg/CourseBook";
import CourseDiscount from "../../../svg/CourseDiscount";
import TicketDiscount from "../../../svg/TicketDiscount";
import Watch from "../../../svg/Watch";
import UniversityRightLayoutCard from "./UniversityRightLayoutCard";
import { useTranslation } from "react-i18next";
import { GraduationCap, Share2 } from "lucide-react";
import ShareCard from "../../../utils/ShareCard";
import { useNavigate } from "react-router-dom";

const UniversityRightLayout = ({ data, language, themeColor = "#3b3d8d" }) => {
  const courseUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="sticky top-24">
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex gap-4 items-center mb-6">
            {/* Share Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105"
              aria-label="Share"
              data-aos="zoom-in"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>

            {/* Apply Now Button */}
            <button
              onClick={() =>
                navigate(
                  `/${language}/applications/${data?._id}?category=University&slug=${data.customURLSlug.en}`
                )
              }
              className="flex-1 bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] text-white py-3 px-6 rounded-full font-medium transition-all duration-300 hover:from-[#2d2f6e] hover:to-[#3b3d8d] hover:shadow-md transform hover:-translate-y-1"
              data-aos="fade-left"
            >
              {t("applyNow")}
            </button>
          </div>

          <div
            className="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
            data-aos="fade-up"
          >
            {/* University Details */}
            <div className="divide-y divide-gray-100">
              {/* Tuition Fees */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <TicketDiscount />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {data?.courses && data.courses.length > 0
                        ? `$${Math.min(
                            ...data.courses.map(
                              (course) => Number(course.CourseFees) || 0
                            )
                          )} - $${Math.max(
                            ...data.courses.map(
                              (course) => Number(course.CourseFees) || 0
                            )
                          )}`
                        : `$${data?.uniTutionFees || 0}`}{" "}
                      {t("UniversitySlugPage.PerYear")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("UniversitySlugPage.InterFees")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {data?.scholarshipAvailability
                        ? language === "ar"
                          ? "متاح"
                          : "Available"
                        : language === "ar"
                        ? "غير متاح"
                        : "Not Available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("UniversitySlugPage.Scholarship")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <DatePicker />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {data?.uniStartDate
                        ? new Date(data.uniStartDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("UniversitySlugPage.StartMonth")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Deadline */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <Seconds />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {data?.uniDeadline
                        ? new Date(data.uniDeadline).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("UniversitySlugPage.ApplicationDeadline")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode of Study */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <CourseBook />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {language === "ar"
                        ? data?.courses[0]?.ModeOfStudy?.ar?.[0]
                        : data?.courses[0]?.ModeOfStudy?.en?.[0] || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("UniversitySlugPage.ModeOfStudy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div className="p-4 transition-all duration-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center flex-shrink-0">
                    <CourseDiscount />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {t("UniversitySlugPage.Discount")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data?.DiscountAvailable
                        ? t("UniversitySlugPage.available")
                        : t("UniversitySlugPage.notAvailable")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6" data-aos="fade-up" data-aos-delay="300">
          <UniversityRightLayoutCard />
        </div>
      </div>

      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={data?.uniName?.[language] || "University"}
        contentType={"university"}
        contentUrl={courseUrl}
      />
    </>
  );
};

export default UniversityRightLayout;
