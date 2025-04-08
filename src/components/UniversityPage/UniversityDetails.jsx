"use client"

import { useTranslation } from "react-i18next"
import {
  GraduationCap,
  Home,
  DollarSign,
  BookOpen,
  Award,
  Check,
  X,
  Building,
  Globe,
  FileText,
  Clock,
  Briefcase,
} from "lucide-react"
import { useState, useEffect } from "react"

const UniversityDetails = ({ data, language, themeColor = "#3b3d8d" }) => {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("scholarships")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper function to render boolean values
  const renderBoolean = (value) => {
    if (value === true) {
      return (
        <div className="inline-flex items-center px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
          <Check className="w-4 h-4 text-green-600 mr-1.5" />
          <span className="text-green-700 font-medium text-sm">{t("UniversitySlugPage.university.yes")}</span>
        </div>
      )
    } else if (value === false) {
      return (
        <div className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-200 rounded-md">
          <X className="w-4 h-4 text-red-600 mr-1.5" />
          <span className="text-red-700 font-medium text-sm">{t("UniversitySlugPage.university.no")}</span>
        </div>
      )
    }
    return (
      <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
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
          className="text-gray-500 mr-1.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span className="text-gray-700 font-medium text-sm">{t("UniversitySlugPage.university.notSpecified")}</span>
      </div>
    )
  }

  // Helper function to render array values
  const renderArray = (array) => {
    if (!array || array.length === 0) {
      return <span className="text-gray-500">{t("UniversitySlugPage.university.none")}</span>
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {array.map((item, index) => (
          <span
            key={index}
            className="bg-[#3b3d8d]/5 text-[#3b3d8d] px-3 py-1 rounded-full text-sm font-medium
                      transition-all duration-300 hover:bg-[#3b3d8d]/10 hover:shadow-sm"
          >
            {item}
          </span>
        ))}
      </div>
    )
  }

  const tabs = [
    {
      id: "scholarships",
      icon: <Award className="w-5 h-5" />,
      label: t("UniversitySlugPage.university.scholarshipsTitle"),
    },
    { id: "housing", icon: <Home className="w-5 h-5" />, label: t("UniversitySlugPage.university.housingLivingTitle") },
    {
      id: "academic",
      icon: <BookOpen className="w-5 h-5" />,
      label: t("UniversitySlugPage.university.academicInfoTitle"),
    },
    {
      id: "programs",
      icon: <GraduationCap className="w-5 h-5" />,
      label: t("UniversitySlugPage.university.programsRequirementsTitle"),
    },
  ]

  // Get the appropriate study programs based on language
  const getStudyPrograms = () => {
    if (!data?.study_programs) return []

    // If study_programs is an object with en/ar properties (new format)
    if (data.study_programs.en || data.study_programs.ar) {
      return language === "ar" ? data.study_programs.ar || [] : data.study_programs.en || []
    }

    // If study_programs is still an array (old format)
    if (Array.isArray(data.study_programs)) {
      return data.study_programs
    }

    return []
  }

  if (!mounted) return null

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      data-aos="fade-up"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#3b3d8d] to-[#5254a3] px-6 py-6">
        <div className="flex items-center gap-3" data-aos="fade-right">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("UniversitySlugPage.university.detailsTitle")}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 font-medium text-sm whitespace-nowrap transition-all
                      ${
                        activeTab === tab.id
                          ? "text-[#3b3d8d] border-b-2 border-[#3b3d8d] bg-white"
                          : "text-gray-600 hover:text-[#3b3d8d] hover:bg-gray-100"
                      }`}
            data-aos="fade-down"
            data-aos-delay={tabs.findIndex((t) => t.id === tab.id) * 100}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Scholarships Tab */}
        {activeTab === "scholarships" && (
          <div className="space-y-6" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#3b3d8d]" />
                    </div>
                    <h3 className="font-semibold text-[#3b3d8d]">
                      {t("UniversitySlugPage.university.scholarshipsAvailable")}
                    </h3>
                  </div>
                  {renderBoolean(data?.scholarshipsAvailable || data?.scholarshipAvailability)}
                </div>
              </div>

              {(data?.scholarshipsAvailable || data?.scholarshipAvailability) && data?.scholarshipType && (
                <div
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#3b3d8d]" />
                      </div>
                      <h3 className="font-semibold text-[#3b3d8d]">
                        {t("UniversitySlugPage.university.scholarshipType")}
                      </h3>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                        data.scholarshipType === "full"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : data.scholarshipType === "partial"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {data.scholarshipType === "full"
                        ? t("UniversitySlugPage.university.scholarshipFull")
                        : data.scholarshipType === "partial"
                          ? t("UniversitySlugPage.university.scholarshipPartial")
                          : t("UniversitySlugPage.university.scholarshipNone")}
                    </span>
                  </div>

                  {data?.scholarshipPercentage && (
                    <div className="mt-3 pl-14">
                      <span className="text-sm text-gray-500">
                        {t("UniversitySlugPage.university.scholarshipPercentage")}:
                      </span>
                      <span className="ml-2 font-medium text-[#3b3d8d]">{data.scholarshipPercentage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#3b3d8d]" />
                    </div>
                    <h3 className="font-semibold text-[#3b3d8d]">
                      {t("UniversitySlugPage.university.discountAvailable")}
                    </h3>
                  </div>
                  {renderBoolean(data?.DiscountAvailable)}
                </div>
              </div>

              {data?.DiscountAvailable && data?.DiscountValue && (
                <div
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  data-aos="fade-left"
                  data-aos-delay="400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#3b3d8d]" />
                      </div>
                      <h3 className="font-semibold text-[#3b3d8d]">
                        {t("UniversitySlugPage.university.discountValue")}
                      </h3>
                    </div>
                    <span className="font-medium text-[#3b3d8d] bg-[#3b3d8d]/5 px-3 py-1 rounded-md">
                      {data.DiscountValue}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Housing Tab */}
        {activeTab === "housing" && (
          <div className="space-y-6" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-[#3b3d8d]" />
                    </div>
                    <h3 className="font-semibold text-[#3b3d8d]">
                      {t("UniversitySlugPage.university.housingAvailable")}
                    </h3>
                  </div>
                  {renderBoolean(data?.housing_available)}
                </div>
              </div>

              {data?.living_cost && (
                <div
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#3b3d8d]" />
                      </div>
                      <h3 className="font-semibold text-[#3b3d8d]">{t("UniversitySlugPage.university.livingCost")}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-[#3b3d8d] bg-[#3b3d8d]/5 px-3 py-1 rounded-md">
                        ${data.living_cost}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{t("UniversitySlugPage.PerYear")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional housing information if available */}
            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#3b3d8d]" />
                </div>
                <h3 className="font-semibold text-[#3b3d8d]">{t("UniversitySlugPage.university.housingInfo")}</h3>
              </div>
              <p className="text-gray-600">
                {data?.uniAccomodation?.[language] || t("UniversitySlugPage.university.noHousingInfo")}
              </p>
            </div>
          </div>
        )}

        {/* Academic Tab */}
        {activeTab === "academic" && (
          <div className="space-y-6" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#3b3d8d]" />
                    </div>
                    <h3 className="font-semibold text-[#3b3d8d]">
                      {t("UniversitySlugPage.university.preparatoryYear")}
                    </h3>
                  </div>
                  {renderBoolean(data?.preparatory_year)}
                </div>
              </div>

              {data?.preparatory_year && data?.preparatory_year_fees && (
                <div
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#3b3d8d]" />
                      </div>
                      <h3 className="font-semibold text-[#3b3d8d]">
                        {t("UniversitySlugPage.university.preparatoryYearFees")}
                      </h3>
                    </div>
                    <span className="font-medium text-[#3b3d8d] bg-[#3b3d8d]/5 px-3 py-1 rounded-md">
                      ${data.preparatory_year_fees}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {data?.spokenLanguage && data.spokenLanguage.length > 0 && (
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <h3 className="font-semibold text-[#3b3d8d]">{t("UniversitySlugPage.university.spokenLanguages")}</h3>
                </div>
                {renderArray(data.spokenLanguage)}
              </div>
            )}
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === "programs" && (
          <div className="space-y-6" data-aos="fade-up">
            {/* Study Programs - Updated to handle new format */}
            {data?.study_programs && (
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <h3 className="font-semibold text-[#3b3d8d]">{t("UniversitySlugPage.university.studyPrograms")}</h3>
                </div>
                {renderArray(getStudyPrograms())}
              </div>
            )}

            {data?.admission_requirements && data.admission_requirements.length > 0 && (
              <div
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b3d8d]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#3b3d8d]" />
                  </div>
                  <h3 className="font-semibold text-[#3b3d8d]">
                    {t("UniversitySlugPage.university.admissionRequirements")}
                  </h3>
                </div>
                <ul className="space-y-3 pl-2">
                  {data.admission_requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg"
                      data-aos="fade-up"
                      data-aos-delay={300 + index * 50}
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityDetails
