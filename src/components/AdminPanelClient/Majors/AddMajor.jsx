"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
  Calendar,
  Search,
  AlertCircle,
  Building2,
  Tag,
} from "lucide-react"
import RichText from "../../../../utils/RichText"
import { useLanguage } from "../../../../context/LanguageContext"
import InputField from "../../../../utils/InputField"
import useDropdownData from "../../../../hooks/useDropdownData"
import useApiData from "../../../../hooks/useApiData"
import FaqSection from "../../../../utils/FaqSection"
import MetaArrayFields from "../Universities/MetaArrayFields"

const initialFormData = {
  majorName: {
    en: "",
    ar: "",
  },
  university: "",
  universityName: {
    en: "",
    ar: "",
  },
  majorDescription: {
    en: "",
    ar: "",
  },
  duration: "",
  durationUnits: "Years",
  studyLevel: [],
  majorLanguages: [],
  majorAdmissionRequirement: [],
  majorTuitionFees: "",
  majorIntakeYear: new Date().getFullYear().toString(),
  majorIntakeMonth: [],
  modeOfStudy: "Full-time",
  majorCheckBox: {
    scholarshipsAvailable: false,
    expressAdmission: false,
    entranceExamRequired: false,
    featuredMajor: false,
  },
  seo: {
    metaTitle: {
      en: "",
      ar: "",
    },
    metaDescription: {
      en: "",
      ar: "",
    },
    metaKeywords: {
      en: [], // Array of SEO Keywords in English
      ar: [], // Array of SEO Keywords in Arabic
    },
  },
  customURLSlug: {
    en: "",
    ar: "",
  },
  faq: [{ faqQuestions: { en: "", ar: "" }, faqAnswers: { en: "", ar: "" } }],
}

const studyLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"]
const majorLanguages = ["English", "French", "German", "Spanish", "Arabic", "Chinese"]
const admissionRequirements = [
  "High School Diploma",
  "Bachelor Degree",
  "IELTS",
  "TOEFL",
  "GRE",
  "GMAT",
  "Motivation Letter",
  "Recommendation Letters",
]
const durationUnits = ["Years", "Months", "Weeks"]
const studyModes = ["Full-time", "Part-time", "Online", "Hybrid", "Distance Learning"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function AddMajor() {
  const { filteredData } = useDropdownData()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showUniversityPicker, setShowUniversityPicker] = useState(false)
  const [universitySearch, setUniversitySearch] = useState("")
  const [formData, setFormData] = useState(initialFormData)
  const [newItems, setNewItems] = useState({
    studyLevel: "",
    majorLanguages: "",
    majorAdmissionRequirement: "",
    majorIntakeMonth: "",
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { addNew } = useApiData("https://edu-brink-backend.vercel.app/api/majors")
  const [activeSection, setActiveSection] = useState(null)

  const validateField = (name, value) => {
    let error = ""

    // Handle undefined or null values consistently
    if (value === undefined || value === null) {
      value = ""
    }

    if (name.includes("majorName")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Major name is required" : "اسم التخصص مطلوب"
      } else if (typeof value === "string" && value.length < 3) {
        error = lang === "en" ? "Major name must be at least 3 characters" : "يجب أن يكون اسم التخصص 3 أحرف على الأقل"
      }
    }

    if (name === "university" && (!value || value === "")) {
      error = "University is required"
    }

    if (name === "duration") {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = "Duration is required"
      } else if (isNaN(value) || Number.parseFloat(value) <= 0) {
        error = "Duration must be a positive number"
      }
    }

    if (name === "majorTuitionFees" && (!value || (typeof value === "string" && value.trim() === ""))) {
      error = "Tuition fees information is required"
    }

    if (name === "studyLevel" && (!value || (Array.isArray(value) && value.length === 0))) {
      error = "At least one study level must be selected"
    }

    if (name === "majorLanguages" && (!value || (Array.isArray(value) && value.length === 0))) {
      error = "At least one language must be selected"
    }

    if (name === "majorIntakeMonth" && (!value || (Array.isArray(value) && value.length === 0))) {
      error = "At least one intake month must be selected"
    }

    if (name.includes("majorDescription")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Description is required" : "الوصف مطلوب"
      } else if (typeof value === "string" && value.length < 20) {
        error = lang === "en" ? "Description must be at least 20 characters" : "يجب أن يكون الوصف 20 حرفًا على الأقل"
      }
    }

    // SEO Validation
    if (name.includes("seo.metaTitle") || name.includes("seo.metaDescription")) {
      const lang = name.split(".")[2]
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "This field is required" : "هذا الحقل مطلوب"
      }
    }

    if (name.includes("customURLSlug")) {
      const lang = name.split(".")[1]
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "This field is required" : "هذا الحقل مطلوب"
      }
    }

    return error
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    const nameParts = name.split(/[[\].]+/) // Split name into parts (e.g., Requirements[0].en)

    const temp = { ...formData } // Clone the form data to avoid direct mutation

    // Dynamically navigate through the object based on nameParts
    nameParts.reduce((acc, part, index) => {
      if (index === nameParts.length - 1) {
        // Set the value for the last part (en or ar)
        acc[part] = type === "checkbox" ? checked : value
      } else {
        // Navigate deeper into the nested object or array
        acc[part] = acc[part] || (isNaN(nameParts[index + 1]) ? {} : [])
      }
      return acc[part]
    }, temp)

    if (nameParts.includes("majorName")) {
      const lang = nameParts[nameParts.length - 1]; // Extract language (en or ar)

      if (lang === "en") {
        // English slug: Convert to lowercase, replace spaces with hyphens, remove special characters
        temp.customURLSlug = {
          ...temp.customURLSlug,
          [lang]: value
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/[^a-zA-Z0-9-]/g, ""), // Remove special characters
        };
      } else if (lang === "ar") {
        // Arabic slug: Just replace spaces with hyphens, keep Arabic characters
        temp.customURLSlug = {
          ...temp.customURLSlug,
          [lang]: value.replace(/\s+/g, "-"), // Replace spaces with hyphens but keep Arabic characters
        };
      }
    }

    // Update formData state with the new temp object
    setFormData(temp)

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate the field
    const error = validateField(name, value)
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const validateForm = () => {
    const errors = {}

    // Validate major names
    errors["majorName.en"] = validateField("majorName.en", formData.majorName.en)
    errors["majorName.ar"] = validateField("majorName.ar", formData.majorName.ar)

    // Validate university
    errors["university"] = validateField("university", formData.university)

    // Validate duration
    errors["duration"] = validateField("duration", formData.duration)

    // Validate tuition fees
    errors["majorTuitionFees"] = validateField("majorTuitionFees", formData.majorTuitionFees)

    // Validate arrays
    errors["studyLevel"] = validateField("studyLevel", formData.studyLevel)
    errors["majorLanguages"] = validateField("majorLanguages", formData.majorLanguages)
    errors["majorIntakeMonth"] = validateField("majorIntakeMonth", formData.majorIntakeMonth)

    // Validate descriptions
    errors["majorDescription.en"] = validateField("majorDescription.en", formData.majorDescription.en)
    errors["majorDescription.ar"] = validateField("majorDescription.ar", formData.majorDescription.ar)

    // Validate SEO fields
    errors["seo.metaTitle.en"] = validateField("seo.metaTitle.en", formData.seo?.metaTitle?.en)
    errors["seo.metaTitle.ar"] = validateField("seo.metaTitle.ar", formData.seo?.metaTitle?.ar)
    errors["seo.metaDescription.en"] = validateField("seo.metaDescription.en", formData.seo?.metaDescription?.en)
    errors["seo.metaDescription.ar"] = validateField("seo.metaDescription.ar", formData.seo?.metaDescription?.ar)

    // Validate custom URL slugs
    errors["customURLSlug.en"] = validateField("customURLSlug.en", formData.customURLSlug?.en)
    errors["customURLSlug.ar"] = validateField("customURLSlug.ar", formData.customURLSlug?.ar)

    setValidationErrors(errors)

    // Check if there are any errors
    return !Object.values(errors).some((error) => error !== "")
  }

  const handleRichTextChange = (content, lang) => {
    setFormData((prev) => ({
      ...prev,
      majorDescription: {
        ...prev.majorDescription,
        [lang]: content,
      },
    }))

    // Mark as touched
    setTouched((prev) => ({ ...prev, [`majorDescription.${lang}`]: true }))

    // Validate
    const error = validateField(`majorDescription.${lang}`, content)
    setValidationErrors((prev) => ({
      ...prev,
      [`majorDescription.${lang}`]: error,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = {
      "majorName.en": true,
      "majorName.ar": true,
      university: true,
      duration: true,
      majorTuitionFees: true,
      studyLevel: true,
      majorLanguages: true,
      majorIntakeMonth: true,
      "majorDescription.en": true,
      "majorDescription.ar": true,
      "seo.metaTitle.en": true,
      "seo.metaTitle.ar": true,
      "seo.metaDescription.en": true,
      "seo.metaDescription.ar": true,
      "customURLSlug.en": true,
      "customURLSlug.ar": true,
    }
    setTouched(allFields)

    // Validate all fields
    const isValid = validateForm()

    if (!isValid) {
      window.scrollTo(0, 0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Only remove universityName from formData, keep all other fields
      const { universityName, ...updatedFormData } = {
        ...formData,
      }

      console.log("Submitting data:", updatedFormData) // Add this for debugging

      // Make sure the API endpoint is correct
      await addNew(updatedFormData)
      navigate(`/${language}/admin/majors`)
    } catch (err) {
      console.error("Error adding major:", err)
      setError(err.message || "Failed to add major")
      window.scrollTo(0, 0)
    } finally {
      setLoading(false)
    }
  }

  const addItem = (field) => {
    const newItem = newItems[field]
    if (newItem && !formData[field].includes(newItem)) {
      const updatedItems = [...formData[field], newItem]
      setFormData((prev) => ({
        ...prev,
        [field]: updatedItems,
      }))
      setNewItems((prev) => ({ ...prev, [field]: "" }))
      setActiveSection(null)

      // Mark as touched
      setTouched((prev) => ({ ...prev, [field]: true }))

      // Validate
      const error = validateField(field, updatedItems)
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }))
    }
  }

  const removeItem = (field, item) => {
    const updatedItems = formData[field].filter((i) => i !== item)
    setFormData((prev) => ({
      ...prev,
      [field]: updatedItems,
    }))

    // Validate
    const error = validateField(field, updatedItems)
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }

  const filteredUniversityData = filteredData.universities.filter(
    (university) =>
      university.uniName.en.toLowerCase().includes(universitySearch.toLowerCase()) ||
      university.uniName.ar.toLowerCase().includes(universitySearch.toLowerCase()),
  )

  const renderArrayField = (field, label, icon, placeholder, options) => {
    const fieldPath = field.split(".") // Split nested field (e.g., ["keywords", "en"])
    const fieldKey = fieldPath[0] // First key (e.g., "keywords")
    const subKey = fieldPath[1] // Second key (e.g., "en")
    const error = validationErrors[field]
    const isTouched = touched[field]

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2 mb-2">
          {options ? (
            // Dropdown select if options exist
            <select
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }))
                setActiveSection(field)
              }}
              className={`flex-1 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                isTouched && error ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            // Text input if no options are provided
            <input
              type="text"
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }))
                setActiveSection(field)
              }}
              placeholder={placeholder}
              className={`flex-1 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                isTouched && error ? "border-red-300" : "border-gray-300"
              }`}
            />
          )}
          <button
            type="button"
            onClick={() => addItem(field)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {subKey
            ? formData?.[fieldKey]?.[subKey]?.map((item) => (
                <div key={item} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  {icon}
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem(field, item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              ))
            : formData?.[fieldKey]?.map((item) => (
                <div key={item} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  {icon}
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem(field, item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              ))}
        </div>
        {isTouched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/majors`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Majors
        </button>
        <h1 className="text-2xl font-bold">Add New Major</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      {/* Form validation summary */}
      {Object.values(validationErrors).some((error) => error !== "") && Object.values(touched).some((t) => t) && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Please fix the following errors:</h3>
          </div>
          <ul className="list-disc pl-5">
            {Object.entries(validationErrors).map(([field, error]) =>
              error && touched[field] ? <li key={field}>{error}</li> : null,
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Major Name (English)"
                type="text"
                name="majorName.en"
                placeholder="Major Name"
                value={formData?.majorName?.en}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="majorName"
                variant={3}
                error={touched["majorName.en"] ? validationErrors["majorName.en"] : ""}
              />
            </div>
            <div>
              <InputField
                label="اسم التخصص (بالعربية)"
                type="text"
                name="majorName.ar"
                placeholder="اسم التخصص"
                value={formData?.majorName?.ar}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="majorName"
                variant={3}
                error={touched["majorName.ar"] ? validationErrors["majorName.ar"] : ""}
              />
            </div>

            <InputField
              label="Intake Year"
              type="select"
              name="majorIntakeYear"
              value={formData?.majorIntakeYear || new Date().getFullYear()}
              onChange={handleInputChange}
              required
              options={Array.from({ length: 6 }, (_, i) => {
                const year = new Date().getFullYear() + i
                return { value: year, label: year } // Generates years dynamically
              })}
            />

            <InputField
              label="Mode of Study"
              type="select"
              name="modeOfStudy"
              value={formData?.modeOfStudy || ""}
              onChange={handleInputChange}
              options={studyModes.map((mode) => ({
                value: mode,
                label: mode,
              }))}
              required
            />

            <div>
              <InputField
                label="Duration"
                type="text"
                name="duration"
                value={formData?.duration || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g., 4"
                required
                variant={3}
                error={touched["duration"] ? validationErrors["duration"] : ""}
              />
            </div>
            <InputField
              type="select"
              label="Duration Units"
              name="durationUnits"
              value={formData?.durationUnits || ""}
              onChange={handleInputChange}
              options={durationUnits.map((unit) => ({
                value: unit,
                label: unit,
              }))}
            />

            {/* University Dropdown */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowUniversityPicker(!showUniversityPicker)
                    setTouched((prev) => ({ ...prev, university: true }))
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                    touched["university"] && validationErrors["university"] ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.universityName?.en || formData?.university || "Select University"}
                    </span>
                  </span>
                  <Building2 className="w-5 h-5 text-gray-400" />
                </button>

                {touched["university"] && validationErrors["university"] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors["university"]}</p>
                )}

                {showUniversityPicker && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search universities..."
                          value={universitySearch}
                          onChange={(e) => setUniversitySearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredUniversityData.map((university) => (
                        <button
                          key={university._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              university: university._id, // Updating university ID
                              universityName: {
                                en: university.uniName.en,
                                ar: university.uniName.ar,
                              },
                            }))
                            setShowUniversityPicker(false)

                            // Validate
                            const error = validateField("university", university._id)
                            setValidationErrors((prev) => ({
                              ...prev,
                              university: error,
                            }))
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-gray-700 text-sm">
                            {university?.uniName?.en} - {university?.uniName?.ar}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <InputField
                label="Tuition Fees"
                type="text"
                name="majorTuitionFees"
                value={formData?.majorTuitionFees || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g., $20,000 - $30,000"
                variant={3}
                error={touched["majorTuitionFees"] ? validationErrors["majorTuitionFees"] : ""}
              />
            </div>
          </div>

          <div className="space-y-6">
            {renderArrayField(
              "studyLevel",
              "Study Levels",
              <GraduationCap className="w-4 h-4" />,
              "Add study level...",
              studyLevels,
            )}
            {renderArrayField(
              "majorLanguages",
              "Languages of Instruction",
              <Languages className="w-4 h-4" />,
              "Add language...",
              majorLanguages,
            )}
            {renderArrayField(
              "majorAdmissionRequirement",
              "Admission Requirements",
              <FileCheck className="w-4 h-4" />,
              "Add requirement...",
              admissionRequirements,
            )}
            {renderArrayField(
              "majorIntakeMonth",
              "Intake Months",
              <Calendar className="w-4 h-4" />,
              "Add month...",
              months,
            )}
          </div>

          <div>
            <RichText
              label="Major Description (English)"
              value={formData.majorDescription.en || ""}
              onChange={(content) => handleRichTextChange(content, "en")}
              error={touched["majorDescription.en"] ? validationErrors["majorDescription.en"] : ""}
            />
          </div>

          <div>
            <RichText
              label="وصف التخصص (عربي)"
              value={formData.majorDescription.ar || ""}
              onChange={(content) => handleRichTextChange(content, "ar")}
              error={touched["majorDescription.ar"] ? validationErrors["majorDescription.ar"] : ""}
            />
          </div>

          {/* SEO Fields */}
          <div className="bg-white rounded-lg col-span-2 space-y-6">
            <InputField
              label="Meta Title (English)"
              type="text"
              name="seo.metaTitle.en"
              placeholder="Enter Meta Title in English"
              value={formData?.seo?.metaTitle?.en}
              onChange={handleInputChange}
              autoComplete="metaTitle"
              variant={3}
              error={validationErrors["seo.metaTitle.en"]}
            />

            <InputField
              label="Meta Title (العنوان التعريفي)"
              type="text"
              name="seo.metaTitle.ar"
              placeholder="أدخل العنوان التعريفي"
              value={formData?.seo?.metaTitle?.ar}
              onChange={handleInputChange}
              autoComplete="metaTitle"
              variant={3}
              error={validationErrors["seo.metaTitle.ar"]}
            />

            <div className="col-span-2">
              <InputField
                label="Meta Description (English)"
                type="textarea"
                name="seo.metaDescription.en"
                placeholder="Enter Meta Description in English"
                value={formData?.seo?.metaDescription?.en}
                onChange={handleInputChange}
                autoComplete="metaDescription"
                variant={3}
                error={validationErrors["seo.metaDescription.en"]}
              />
            </div>

            <div className="col-span-2">
              <InputField
                label="Meta Description (الوصف التعريفي)"
                type="textarea"
                name="seo.metaDescription.ar"
                placeholder="أدخل الوصف التعريفي"
                value={formData?.seo?.metaDescription?.ar}
                onChange={handleInputChange}
                autoComplete="metaDescription"
                variant={3}
                error={validationErrors["seo.metaDescription.ar"]}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <MetaArrayFields
                field="seo.metaKeywords.en"
                label="Meta Keywords (English)"
                icon={<Tag className="w-4 h-4" />}
                placeholder="Add New Keyword..."
                formData={formData}
                setFormData={setFormData}
              />
              <MetaArrayFields
                field="seo.metaKeywords.ar"
                label="Meta Keywords (Arabic)"
                icon={<Tag className="w-4 h-4" />}
                placeholder="أضف كلمة مفتاحية جديدة..."
                formData={formData}
                setFormData={setFormData}
              />

              <div className="flex w-full gap-4 justify-between">
                <div className="w-full">
                  <InputField
                    label="Custom URL (English)"
                    type="text"
                    name="customURLSlug.en"
                    placeholder="Enter Custom Slug in English"
                    value={formData?.customURLSlug?.en}
                    onChange={handleInputChange}
                    autoComplete="custom_url_slug_en"
                    variant={3}
                    error={validationErrors["customURLSlug.en"]}
                  />
                </div>
                <div className="w-full">
                  <InputField
                    label="Custom URL (Arabic)"
                    type="text"
                    name="customURLSlug.ar"
                    placeholder="Enter Custom Slug in Arabic"
                    value={formData?.customURLSlug?.ar}
                    onChange={handleInputChange}
                    autoComplete="custom_url_slug_ar"
                    variant={3}
                    error={validationErrors["customURLSlug.ar"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <FaqSection formData={formData} setFormData={setFormData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Scholarships Available */}
            <InputField
              label="Scholarships Available"
              type="checkbox"
              name="majorCheckBox.scholarshipsAvailable"
              checked={formData?.majorCheckBox?.scholarshipsAvailable || false}
              onChange={handleInputChange}
              autoComplete="scholarshipsAvailable"
              variant={3}
            />

            {/* Express Admission */}
            <InputField
              label="Express Admission"
              type="checkbox"
              name="majorCheckBox.expressAdmission"
              checked={formData?.majorCheckBox.expressAdmission || false}
              onChange={handleInputChange}
              autoComplete="express_admission"
              variant={3}
            />

            {/* Entrance Exam Required */}
            <InputField
              label="Entrance Exam Required"
              type="checkbox"
              name="majorCheckBox.entranceExamRequired"
              checked={formData?.majorCheckBox?.entranceExamRequired || false}
              onChange={handleInputChange}
              autoComplete="entrance_exam_required"
              variant={3}
            />

            {/* Featured Major */}
            <InputField
              label="Featured Major"
              type="checkbox"
              name="majorCheckBox.featuredMajor"
              checked={formData?.majorCheckBox?.featuredMajor || false}
              onChange={handleInputChange}
              autoComplete="featured_major"
              variant={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/${language}/admin/majors`)}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Save Major
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

