"use client"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

const UniversityCard = ({
  data,
  language,
  themeColor = "#3b3d8d",
  coursePage = 1,
  courseLimit = 2,
  onPageChange,
  coursePagination,
  activeFilter,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language: currentLanguage } = useLanguage()

  const handleApply = (courseId) => {
    navigate(`/${currentLanguage}/apply/${courseId}?category=course&slug=${data.customURLSlug?.[language]}`)
  }

  // Format languages in a space-efficient way
  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return "English"
    if (languages.length === 1) return languages[0]

    // Show first language + count of additional languages
    return `${languages[0]} +${languages.length - 1}`
  }

  const handleLearnMore = (courseId) => {
    navigate(
      `/${currentLanguage}/courses/${data.courses.find((c) => c._id === courseId)?.customURLSlug?.[language] || ""}`,
    )
  }

  // Calculate total pages
  const totalPages = coursePagination ? Math.ceil(coursePagination.total / coursePagination.limit) : 1

  // Check if there are previous or next pages
  const hasPreviousPage = coursePage > 1
  const hasNextPage = coursePage < totalPages && data?.courses?.length >= courseLimit

  // Add a more robust check for the next button
  const shouldDisableNextButton =
    !hasNextPage ||
    data?.courses?.length < courseLimit ||
    (coursePagination && coursePagination.total <= coursePage * courseLimit)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-[#3b3d8d]">{t("UniversitySlugPage.FeaturedCourses")}</h2>

        {/* Show active filter indicator if a filter is applied */}
        {activeFilter && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#3b3d8d]/10 rounded-full">
            <Filter className="w-4 h-4 text-[#3b3d8d]" />
            <span className="text-sm font-medium text-[#3b3d8d]">{activeFilter}</span>
          </div>
        )}
      </div>

      {data?.courses?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.courses?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 h-14">
                  {language === "ar" ? item?.CourseName?.ar : item?.CourseName?.en}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-3 rounded-tl-xl">
                    <p className="font-semibold text-gray-700 mb-1">{t("UniversitySlugPage.TuitionFees")}</p>
                    <p className="text-[#3b3d8d] font-medium">
                      ${item.CourseFees}/ {t("UniversitySlugPage.Year")}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-tr-xl">
                    <p className="font-semibold text-gray-700 mb-1">{t("UniversitySlugPage.Language")}</p>
                    <p className="text-[#3b3d8d] font-medium" title={data?.spokenLanguage?.join(", ")}>
                      {formatLanguages(data?.spokenLanguage)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-bl-xl">
                    <p className="font-semibold text-gray-700 mb-1">{t("UniversitySlugPage.Deadline")}</p>
                    <p className="text-[#3b3d8d] font-medium">
                      {item?.DeadLine
                        ? new Date(item?.DeadLine).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-br-xl">
                    <p className="font-semibold text-gray-700 mb-1">{t("UniversitySlugPage.ModeOfStudy")}</p>
                    <p className="text-[#3b3d8d] font-medium">
                      {language === "ar" ? item?.ModeOfStudy?.ar?.[0] : item?.ModeOfStudy?.en?.[0]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleApply(item._id)}
                    className="flex-1 py-2.5 text-white bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] rounded-full text-sm font-medium transition-all duration-300 hover:from-[#2d2f6e] hover:to-[#3b3d8d] hover:shadow-md"
                  >
                    {t("applyNow")}
                  </button>

                  <button
                    onClick={() => handleLearnMore(item._id)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                  >
                    {t("learnMore")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 flex justify-center">
            <Filter className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {t("UniversitySlugPage.NoCoursesFound") || "No courses found"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeFilter
              ? t("UniversitySlugPage.NoCoursesWithFilter") ||
                `No courses found with the "${activeFilter}" study level. Try selecting a different filter.`
              : t("UniversitySlugPage.NoCoursesAvailable") ||
                "There are no courses available for this university at the moment."}
          </p>
        </div>
      )}

      {/* Only show pagination if there are courses */}
      {data?.courses?.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, coursePage - 1))}
            disabled={!hasPreviousPage}
            className={`w-10 h-10 rounded-full border ${
              hasPreviousPage
                ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition-colors flex items-center justify-center`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => onPageChange(Math.min(totalPages, coursePage + 1))}
            disabled={shouldDisableNextButton}
            className={`w-10 h-10 rounded-full border ${
              !shouldDisableNextButton
                ? "border-[#3b3d8d]/20 bg-white text-[#3b3d8d] hover:bg-[#3b3d8d]/10"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition-colors flex items-center justify-center`}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default UniversityCard

