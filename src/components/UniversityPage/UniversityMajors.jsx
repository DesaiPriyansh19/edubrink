"use client"

import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

const UniversityMajors = ({
  data,
  language,
  themeColor = "#3b3d8d",
  majorPage = 1,
  majorLimit = 2,
  onPageChange,
  majorPagination,
  activeFilter,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language: currentLanguage } = useLanguage()

  const handleApply = (majorId) => {
    navigate(`/${currentLanguage}/apply/${majorId}?category=major&slug=${data.customURLSlug?.[language]}`)
  }

  const handleLearnMore = (majorId) => {
    navigate(`/${currentLanguage}/major/${data.majors.find((m) => m._id === majorId)?.customURLSlug?.[language] || ""}`)
  }

  // Calculate total pages
  const totalPages = majorPagination ? Math.ceil(majorPagination.total / majorPagination.limit) : 1

  // Check if there are previous or next pages
  const hasPreviousPage = majorPage > 1
  const hasNextPage = majorPage < totalPages && data?.majors?.length >= majorLimit

  // Add a more robust check for the next button
  const shouldDisableNextButton =
    !hasNextPage ||
    data?.majors?.length < majorLimit ||
    (majorPagination && majorPagination.total <= majorPage * majorLimit)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-[#3b3d8d]">
          {t("UniversitySlugPage.FeaturedMajors") || "Featured Majors"}
        </h2>

        {/* Show active filter indicator if a filter is applied */}
        {activeFilter && (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#3b3d8d]/10 rounded-full">
            <Filter className="w-4 h-4 text-[#3b3d8d]" />
            <span className="text-sm font-medium text-[#3b3d8d]">{activeFilter}</span>
          </div>
        )}
      </div>

      {data?.majors?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.majors?.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="p-5">
                {/* Major header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      className="w-full h-full object-cover"
                      src={data?.uniSymbol || "https://placehold.co/64x64"}
                      alt="University logo"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-[#3b3d8d] transition-colors duration-300">
                      {item?.majorName?.[language] || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{data?.uniName?.[language] || "N/A"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#3b3d8d]"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span className="font-medium text-sm">
                        {item?.majorTuitionFees ? `$${item.majorTuitionFees}` : "Contact for pricing"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-4"></div>

                {/* Action buttons */}
                <div className="flex gap-3">
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
            {t("UniversitySlugPage.NoMajorsFound") || "No majors found"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeFilter
              ? t("UniversitySlugPage.NoMajorsWithFilter") ||
                `No majors found with the "${activeFilter}" mode of study. Try selecting a different filter.`
              : t("UniversitySlugPage.NoMajorsAvailable") ||
                "There are no majors available for this university at the moment."}
          </p>
        </div>
      )}

      {/* Only show pagination if there are majors */}
      {data?.majors?.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, majorPage - 1))}
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
            onClick={() => onPageChange(Math.min(totalPages, majorPage + 1))}
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

export default UniversityMajors

