"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
  BookOpen,
  Search,
  X,
  Tag,
  Landmark,
  AlertCircle,
} from "lucide-react"
import { useLanguage } from "../../../../context/LanguageContext"
import InputField from "../../../../utils/InputField"
import useDropdownData from "../../../../hooks/useDropdownData"
import useApiData from "../../../../hooks/useApiData"
import RichText from "../../../../utils/RichText"
import MetaArrayFields from "../Universities/MetaArrayFields"

const initialFormData = {
  CourseName: {
    en: "",
    ar: "",
  },
  CourseDescription: {
    en: "",
    ar: "",
  },
  DeadLine: null,
  university: null,
  uniName: {
    en: "",
    ar: "",
  },
  CourseType: "",
  ModeOfStudy: {
    en: [],
    ar: [],
  },
  Tags: { en: [], ar: [] },
  CourseDuration: "",
  CourseDurationUnits: "Years",
  StudyLevel: [],
  Languages: [],
  Requirements: [],
  scholarshipsAvailable: false,
  scholarshipType: "none",
  scholarshipPercentage: "",
  DiscountAvailable: false,
  DiscountValue: "",
  MostPopular: false,
  CourseCategory: "university_course",
  provider: "",
  seo: {
    metaTitle: {
      en: "", // SEO Meta Title in English
      ar: "", // SEO Meta Title in Arabic
    },
    metaDescription: {
      en: "", // SEO Meta Title in English
      ar: "", // SEO Meta Description in Arabic
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
}

const courseTypes = ["Bachelor", "Master", "PhD", "Diploma", "Certificate"]
const studyModes = ["Full-time", "Part-time", "Online", "Blended"]
const studyModesAr = ["دوام كامل", "دوام جزئي", "عبر الإنترنت", "مختلط"]
const studyLevels = ["Beginner", "Intermediate", "Advanced"]
const languages = ["English", "French", "German", "Spanish"]
const admissionRequirements = ["High School Diploma", "Bachelor's Degree", "Master's Degree", "IELTS", "TOEFL"]
const durationUnits = ["Years", "Months", "Weeks"]

export default function EditCourse() {
  const { id } = useParams()
  const { filteredData } = useDropdownData()
  const { language } = useLanguage()
  const { addTags } = useDropdownData()
  const { data, updateWithOutById } = useApiData(`https://edu-brink-backend.vercel.app/api/course/${id}`)

  useEffect(() => {
    if (!data) return // Ensure `data` is available

    setFormData((prev) => ({
      ...initialFormData, // Ensures all fields exist
      ...prev, // Keeps previous state
      CourseName: {
        en: data?.CourseName?.en || "",
        ar: data?.CourseName?.ar || "",
      },
      CourseDescription: {
        en: data?.CourseDescription?.en || "",
        ar: data?.CourseDescription?.ar || "",
      },
      DeadLine: data?.DeadLine || null,
      university: data?.university?._id || null,
      uniName: {
        en: data?.university?.uniName?.en || "",
        ar: data?.university?.uniName?.ar || "",
      },
      CourseType: data?.CourseType || "",
      ModeOfStudy: {
        en: Array.isArray(data?.ModeOfStudy?.en)
          ? data?.ModeOfStudy?.en
          : Array.isArray(data?.ModeOfStudy)
            ? data?.ModeOfStudy.map((item) => item.en).filter(Boolean)
            : [],
        ar: Array.isArray(data?.ModeOfStudy?.ar)
          ? data?.ModeOfStudy?.ar
          : Array.isArray(data?.ModeOfStudy)
            ? data?.ModeOfStudy.map((item) => item.ar).filter(Boolean)
            : [],
      },
      Tags: {
        en: Array.isArray(data?.Tags?.en) ? data?.Tags.en : [],
        ar: Array.isArray(data?.Tags?.ar) ? data?.Tags.ar : [],
      },
      CourseFees: data?.CourseFees || "",
      CourseDuration: data?.CourseDuration || "",
      CourseDurationUnits: data?.CourseDuration || "Years",
      StudyLevel: Array.isArray(data?.StudyLevel) ? data?.StudyLevel : [],
      Languages: Array.isArray(data?.Languages) ? data?.Languages : [],
      Requirements: {
        en: Array.isArray(data?.Requirements?.en)
          ? data?.Requirements?.en
          : Array.isArray(data?.Requirements)
            ? data?.Requirements.map((item) => item.en).filter(Boolean)
            : [],
        ar: Array.isArray(data?.Requirements?.ar)
          ? data?.Requirements?.ar
          : Array.isArray(data?.Requirements)
            ? data?.Requirements.map((item) => item.ar).filter(Boolean)
            : [],
      },
      scholarshipsAvailable: data?.scholarshipsAvailable || false,
      scholarshipType: data?.scholarshipType || "none",
      scholarshipPercentage: data?.scholarshipPercentage || "",
      DiscountAvailable: data?.DiscountAvailable || false,
      DiscountValue: data?.DiscountValue || "",
      MostPopular: data?.MostPopular || false,
      CourseCategory: data?.CourseCategory || "university_course",
      provider: data?.provider || "",
      seo: {
        metaTitle: {
          en: data?.seo?.metaTitle?.en || "",
          ar: data?.seo?.metaTitle?.ar || "",
        },
        metaDescription: {
          en: data?.seo?.metaDescription?.en || "",
          ar: data?.seo?.metaDescription?.ar || "",
        },
        metaKeywords: {
          en: Array.isArray(data?.seo?.metaKeywords?.en) ? data?.seo?.metaKeywords?.en : [],
          ar: Array.isArray(data?.seo?.metaKeywords?.ar) ? data?.seo?.metaKeywords?.ar : [],
        },
      },
      customURLSlug: {
        en: data?.customURLSlug?.en || "",
        ar: data?.customURLSlug?.ar || "",
      },
    }))
  }, [data]) // Runs when `data` changes

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFlagPicker, setShowFlagPicker] = useState(false)
  const [flagSearch, setFlagSearch] = useState("")
  const [formData, setFormData] = useState(initialFormData)
  const [validationErrors, setValidationErrors] = useState({})
  const [touched, setTouched] = useState({})

  const [newItem, setNewItem] = useState("")
  const [searchInput, setSearchInput] = useState({ tagEn: "", tagAr: "" })
  const [showDropdown, setShowDropdown] = useState({
    tagEn: false,
    tagAr: false,
  })

  // Extract English & Arabic tags from addTags
  const tagOptions = {
    tagEn: addTags[0]?.tags?.en || [],
    tagAr: addTags[0]?.tags?.ar || [],
  }

  // Filter tags based on search input
  const filteredTags = {
    tagEn: tagOptions.tagEn.filter((tag) => tag.toLowerCase().includes(searchInput.tagEn.toLowerCase())),
    tagAr: tagOptions.tagAr.filter((tag) => tag.toLowerCase().includes(searchInput.tagAr.toLowerCase())),
  }

  const filteredUniData = filteredData.universities.filter((item) => {
    if (!flagSearch.trim()) {
      return true // Show all universities when flagSearch is empty
    }
    return (
      item.uniName.en.toLowerCase().includes(flagSearch.toLowerCase()) ||
      item.uniName.ar.toLowerCase().includes(flagSearch.toLowerCase())
    )
  })

  // Toggle dropdown visibility
  const toggleDropdown = (key) => {
    setShowDropdown((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Handle tag selection
  const onSelect = (key, tag, drop) => {
    setFormData((prev) => ({
      ...prev,
      Tags: {
        ...prev.Tags,
        [key]: prev.Tags[key].includes(tag) ? prev.Tags[key] : [...prev.Tags[key], tag], // Prevent duplicates
      },
    }))

    // Mark as touched
    setTouched((prev) => ({ ...prev, [`Tags.${key}`]: true }))

    // Validate
    validateField(`Tags.${key}`, [...formData.Tags[key], tag])

    setShowDropdown((prev) => ({ ...prev, [drop]: false })) // Close dropdown
  }

  // Handle tag removal
  const onRemove = (key, tag) => {
    const updatedTags = formData.Tags[key].filter((t) => t !== tag)

    setFormData((prev) => ({
      ...prev,
      Tags: {
        ...prev.Tags,
        [key]: updatedTags, // Remove the tag
      },
    }))

    // Validate
    validateField(`Tags.${key}`, updatedTags)
  }

  const [activeSection, setActiveSection] = useState(null)

  const validateField = (name, value) => {
    let error = ""

    // Handle undefined or null values consistently
    if (value === undefined) {
      // For fields that access formData directly, try to get the value from formData
      if (name.includes(".")) {
        const parts = name.split(".")
        let currentValue = formData
        for (const part of parts) {
          currentValue = currentValue?.[part]
          if (currentValue === undefined) break
        }
        value = currentValue || ""
      } else {
        value = formData[name] || ""
      }
    }

    if (name.includes("CourseName")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Course name is required" : "اسم الدورة مطلوب"
      } else if (typeof value === "string" && value.length < 3) {
        error = lang === "en" ? "Course name must be at least 3 characters" : "يجب أن يكون اسم الدورة 3 أحرف على الأقل"
      }
    }

    if (name === "CourseType" && (!value || value === "")) {
      error = "Course type is required"
    }

    if (name === "CourseCategory" && (!value || value === "")) {
      error = "Course category is required"
    }

    if (name === "CourseDuration") {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = "Duration is required"
      } else if (isNaN(value) || Number.parseFloat(value) <= 0) {
        error = "Duration must be a positive number"
      }
    }

    if (name === "DeadLine") {
      if (value) {
        // If a deadline is provided, validate it's a valid date
        const deadlineDate = new Date(value)
        if (isNaN(deadlineDate.getTime())) {
          error = "Please enter a valid date"
        }

        // Optionally validate that the deadline is in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to beginning of day for fair comparison
        if (deadlineDate < today) {
          error = "Deadline should be a future date"
        }
      }
    }

    if (name === "CourseFees") {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = "Course fees information is required"
      } else if (isNaN(value) || Number.parseFloat(value) < 0) {
        error = "Course fees must be a non-negative number"
      }
    }

    if (name === "university" && formData.CourseCategory === "university_course" && (!value || value === "")) {
      error = "University is required for university courses"
    }

    if (name === "provider" && formData.CourseCategory === "external_course" && (!value || value === "")) {
      error = "Provider is required for external courses"
    }

    if (name.includes("ModeOfStudy")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      const modesArray = Array.isArray(value) ? value : formData.ModeOfStudy?.[lang] || []
      if (!modesArray.length) {
        error = lang === "en" ? "At least one study mode must be selected" : "يجب تحديد وضع دراسة واحد على الأقل"
      }
    }

    if (name === "StudyLevel") {
      const levelsArray = Array.isArray(value) ? value : formData.StudyLevel || []
      if (!levelsArray.length) {
        error = "At least one study level must be selected"
      }
    }

    if (name === "Languages") {
      const languagesArray = Array.isArray(value) ? value : formData.Languages || []
      if (!languagesArray.length) {
        error = "At least one language must be selected"
      }
    }

    if (name.includes("Tags")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      const tagsArray = Array.isArray(value) ? value : formData.Tags?.[lang] || []
      if (!tagsArray.length) {
        error = lang === "en" ? "At least one tag must be selected" : "يجب تحديد علامة واحدة على الأقل"
      }
    }

    if (name.includes("CourseDescription")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Description is required" : "الوصف مطلوب"
      } else if (typeof value === "string" && value.length < 20) {
        error = lang === "en" ? "Description must be at least 20 characters" : "يجب أن يكون الوصف 20 حرفًا على الأقل"
      }
    }

    if (name === "scholarshipPercentage" && formData.scholarshipsAvailable && formData.scholarshipType === "partial") {
      if (!value || value.trim() === "") {
        error = "Scholarship percentage is required"
      } else if (isNaN(value) || Number.parseFloat(value) <= 0 || Number.parseFloat(value) >= 100) {
        error = "Scholarship percentage must be between 1 and 99"
      }
    }

    if (name === "DiscountValue" && formData.DiscountAvailable) {
      if (!value || value.trim() === "") {
        error = "Discount value is required"
      } else if (isNaN(value) || Number.parseFloat(value) <= 0) {
        error = "Discount value must be a positive number"
      }
    }

    if (name.includes("seo.metaTitle")) {
      const lang = name.split(".")[2] // Extract language (en or ar)
      if (!value || value.trim() === "") {
        error = lang === "en" ? "Meta title is required" : "العنوان التعريفي مطلوب"
      }
    }

    if (name.includes("seo.metaDescription")) {
      const lang = name.split(".")[2] // Extract language (en or ar)
      if (!value || value.trim() === "") {
        error = lang === "en" ? "Meta description is required" : "الوصف التعريفي مطلوب"
      }
    }

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

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

    if (nameParts.includes("CourseName")) {
      const lang = nameParts[nameParts.length - 1] // Extract language (en or ar)

      if (lang === "en") {
        // English slug: Convert to lowercase, replace spaces with hyphens, remove special characters
        temp.customURLSlug = {
          ...temp.customURLSlug,
          [lang]: value
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/[^a-zA-Z0-9-]/g, ""), // Remove special characters
        }
      } else if (lang === "ar") {
        // Arabic slug: Just replace spaces with hyphens, keep Arabic characters
        temp.customURLSlug = {
          ...temp.customURLSlug,
          [lang]: value.replace(/\s+/g, "-"), // Replace spaces with hyphens but keep Arabic characters
        }
      }
    }

    // Update formData state with the new temp object
    setFormData(temp)

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate the field
    validateField(name, type === "checkbox" ? checked : value)
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const validateForm = () => {
    const errors = {}

    // Validate course names
    errors["CourseName.en"] = validateField("CourseName.en", formData.CourseName?.en)
    errors["CourseName.ar"] = validateField("CourseName.ar", formData.CourseName?.ar)

    // Validate course type and category
    errors["CourseType"] = validateField("CourseType", formData.CourseType)
    errors["CourseCategory"] = validateField("CourseCategory", formData.CourseCategory)

    // Validate university or provider based on course category
    if (formData.CourseCategory === "university_course") {
      errors["university"] = validateField("university", formData.university)
    } else if (formData.CourseCategory === "external_course") {
      errors["provider"] = validateField("provider", formData.provider)
    }

    // Validate duration
    errors["CourseDuration"] = validateField("CourseDuration", formData.CourseDuration)

    // Validate fees
    errors["CourseFees"] = validateField("CourseFees", formData.CourseFees)

    // Validate arrays
    errors["ModeOfStudy.en"] = validateField("ModeOfStudy.en", formData.ModeOfStudy?.en)
    errors["ModeOfStudy.ar"] = validateField("ModeOfStudy.ar", formData.ModeOfStudy?.ar)
    errors["StudyLevel"] = validateField("StudyLevel", formData.StudyLevel)
    errors["Languages"] = validateField("Languages", formData.Languages)
    errors["Tags.en"] = validateField("Tags.en", formData.Tags?.en)
    errors["Tags.ar"] = validateField("Tags.ar", formData.Tags?.ar)

    // Validate descriptions
    errors["CourseDescription.en"] = validateField("CourseDescription.en", formData.CourseDescription?.en)
    errors["CourseDescription.ar"] = validateField("CourseDescription.ar", formData.CourseDescription?.ar)

    // Validate conditional fields
    if (formData.scholarshipsAvailable && formData.scholarshipType === "partial") {
      errors["scholarshipPercentage"] = validateField("scholarshipPercentage", formData.scholarshipPercentage)
    }

    if (formData.DiscountAvailable) {
      errors["DiscountValue"] = validateField("DiscountValue", formData.DiscountValue)
    }

    // Validate SEO fields
    errors["seo.metaTitle.en"] = validateField("seo.metaTitle.en", formData.seo?.metaTitle?.en)
    errors["seo.metaTitle.ar"] = validateField("seo.metaTitle.ar", formData.seo?.metaTitle?.ar)
    errors["seo.metaDescription.en"] = validateField("seo.metaDescription.en", formData.seo?.metaDescription?.en)
    errors["seo.metaDescription.ar"] = validateField("seo.metaDescription.ar", formData.seo?.metaDescription?.ar)

    errors["DeadLine"] = validateField("DeadLine", formData.DeadLine)

    setValidationErrors(errors)

    // Check if there are any errors
    return !Object.values(errors).some((error) => error !== "")
  }

  const handleRichTextChange = (content, lang) => {
    setFormData((prev) => ({
      ...prev,
      CourseDescription: {
        ...prev.CourseDescription,
        [lang]: content,
      },
    }))

    // Mark as touched
    setTouched((prev) => ({ ...prev, [`CourseDescription.${lang}`]: true }))

    // Validate
    validateField(`CourseDescription.${lang}`, content)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = {
      "CourseName.en": true,
      "CourseName.ar": true,
      CourseType: true,
      CourseCategory: true,
      CourseDuration: true,
      CourseFees: true,
      DeadLine: true,
      "ModeOfStudy.en": true,
      "ModeOfStudy.ar": true,
      StudyLevel: true,
      Languages: true,
      "Tags.en": true,
      "Tags.ar": true,
      "CourseDescription.en": true,
      "CourseDescription.ar": true,
      "seo.metaTitle.en": true,
      "seo.metaTitle.ar": true,
      "seo.metaDescription.en": true,
      "seo.metaDescription.ar": true,
    }

    // Add conditional fields
    if (formData.CourseCategory === "university_course") {
      allFields["university"] = true
    } else {
      allFields["provider"] = true
    }

    if (formData.scholarshipsAvailable && formData.scholarshipType === "partial") {
      allFields["scholarshipPercentage"] = true
    }

    if (formData.DiscountAvailable) {
      allFields["DiscountValue"] = true
    }

    setTouched(allFields)

    // Validate all fields
    const isValid = validateForm()

    if (!isValid) {
      setError("Please fix the validation errors before submitting")
      window.scrollTo(0, 0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { uniName, ...updatedFormData } = {
        ...formData,
      }

      console.log(updatedFormData)

      await updateWithOutById(updatedFormData)
      navigate(`/${language}/admin/courses`)
    } catch (err) {
      console.error("Error updating course:", err)
      setError(err.message || "Failed to update course")
      window.scrollTo(0, 0)
    } finally {
      setLoading(false)
    }
  }

  const addItem = (field) => {
    if (!newItem.trim()) return // Prevent empty values

    setFormData((prev) => {
      const fieldPath = field.split(".")
      const newState = { ...prev } // Clone the state

      let ref = newState
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const key = fieldPath[i]
        ref[key] = ref[key] || {} // Ensure object structure exists
        ref = ref[key]
      }

      const lastKey = fieldPath[fieldPath.length - 1]
      ref[lastKey] = Array.isArray(ref[lastKey]) ? ref[lastKey] : [] // Ensure it's an array
      if (!ref[lastKey].includes(newItem)) {
        ref[lastKey].push(newItem)
      }

      return newState
    })

    // Mark as touched
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Validate
    const fieldPath = field.split(".")
    let currentValue = formData
    for (let i = 0; i < fieldPath.length - 1; i++) {
      currentValue = currentValue[fieldPath[i]] || {}
    }
    const lastKey = fieldPath[fieldPath.length - 1]
    const updatedArray = [...(currentValue[lastKey] || []), newItem]
    validateField(field, updatedArray)

    setNewItem("") // Clear input field
  }

  const removeItem = (field, itemToRemove) => {
    setFormData((prev) => {
      const fieldPath = field.split(".")
      const newState = { ...prev } // Clone the state

      let ref = newState
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const key = fieldPath[i]
        ref[key] = ref[key] || {} // Ensure object structure exists
        ref = ref[key]
      }

      const lastKey = fieldPath[fieldPath.length - 1]
      if (Array.isArray(ref[lastKey])) {
        ref[lastKey] = ref[lastKey].filter((item) => item !== itemToRemove)
      }

      return newState
    })

    // Validate
    const fieldPath = field.split(".")
    let currentValue = formData
    for (let i = 0; i < fieldPath.length - 1; i++) {
      currentValue = currentValue[fieldPath[i]] || {}
    }
    const lastKey = fieldPath[fieldPath.length - 1]
    const updatedArray = (currentValue[lastKey] || []).filter((item) => item !== itemToRemove)
    validateField(field, updatedArray)
  }

  const renderArrayField = (field, label, icon, placeholder, options) => {
    const fieldPath = field.split(".")
    const fieldData = fieldPath.reduce((acc, key) => acc?.[key] || [], formData) // Ensure data is an array

    const error = validationErrors[field]
    const isTouched = touched[field]

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2 mb-2">
          {options ? (
            <select
              value={activeSection === field ? newItem || "" : ""}
              onChange={(e) => {
                setNewItem(e.target.value)
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
            <input
              type="text"
              value={activeSection === field ? newItem || "" : ""}
              onChange={(e) => {
                setNewItem(e.target.value)
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
          {Array.isArray(fieldData) &&
            fieldData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/courses`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Course Name (English)"
                type="text"
                name="CourseName.en"
                placeholder="Course Name (English)"
                value={formData?.CourseName?.en || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="courseName"
                variant={3}
                error={touched["CourseName.en"] ? validationErrors["CourseName.en"] : ""}
              />
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="اسم الدورة (عربي)"
                type="text"
                name="CourseName.ar"
                placeholder="اسم الدورة (عربي)"
                value={formData?.CourseName?.ar || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="courseName"
                variant={3}
                error={touched["CourseName.ar"] ? validationErrors["CourseName.ar"] : ""}
              />
            </div>

            <div>
              <InputField
                label="Course Category"
                type="select"
                name="CourseCategory"
                value={formData?.CourseCategory || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                options={[
                  {
                    value: "university_course",
                    label: "University Course",
                  },
                  {
                    value: "external_course",
                    label: "External Course",
                  },
                ]}
                error={touched["CourseCategory"] ? validationErrors["CourseCategory"] : ""}
              />
            </div>
            <div>
              <InputField
                label="Course Type"
                type="select"
                name="CourseType"
                value={formData?.CourseType || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                options={courseTypes.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
                error={touched["CourseType"] ? validationErrors["CourseType"] : ""}
              />
            </div>

            <div className="col-span-2">
              <RichText
                label="Course Description (English)"
                value={formData.CourseDescription.en}
                onChange={(content) => handleRichTextChange(content, "en")}
                error={touched["CourseDescription.en"] ? validationErrors["CourseDescription.en"] : ""}
              />
            </div>
            <div className="col-span-2">
              <RichText
                label="وصف الدورة (باللغة الإنجليزية)"
                value={formData.CourseDescription.ar}
                onChange={(content) => handleRichTextChange(content, "ar")}
                error={touched["CourseDescription.ar"] ? validationErrors["CourseDescription.ar"] : ""}
              />
            </div>

            <div className=" w-full col-span-2">
              <InputField
                label="Deadline"
                type="date"
                name="DeadLine"
                value={formData?.DeadLine ? formData?.DeadLine.slice(0, 10) : ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="deadLine"
                variant={3}
                error={touched["DeadLine"] ? validationErrors["DeadLine"] : ""}
              />
            </div>

            <div className=" w-full">
              <InputField
                label="Course Duration"
                type="text"
                name="CourseDuration"
                placeholder="e.g., 6,8"
                value={formData?.CourseDuration || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="courseDuration"
                variant={3}
                error={touched["CourseDuration"] ? validationErrors["CourseDuration"] : ""}
              />
            </div>

            <div className=" w-full">
              <InputField
                label="Course Duration Units"
                type="select"
                name="CourseDurationUnits"
                placeholder="e.g., Course Figure"
                value={formData?.CourseDurationUnits }
                onChange={handleInputChange}
                onBlur={handleBlur}
                options={durationUnits.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
                variant={3}
              />
            </div>

            {formData.CourseCategory === "external_course" && (
              <div className="relative col-span-2">
                <InputField
                  label="Provider (External Course)"
                  type="text"
                  name="provider"
                  value={formData?.provider || ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="course_provider"
                  variant={3}
                  error={touched["provider"] ? validationErrors["provider"] : ""}
                />
                <div className="absolute right-5 top-1/2">
                  <Landmark className="w-4 h-4" />
                </div>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University {formData.CourseCategory === "external_course" ? "External Course (Optional)" : ""}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFlagPicker(!showFlagPicker)
                    setTouched((prev) => ({ ...prev, university: true }))
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                    touched["university"] && validationErrors["university"] ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.uniName?.en || formData?.university || "Select University"}{" "}
                      {/* Placeholder if name is empty */}
                    </span>
                  </span>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </button>

                {touched["university"] && validationErrors["university"] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors["university"]}</p>
                )}

                {showFlagPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search universities..."
                          value={flagSearch}
                          onChange={(e) => setFlagSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredUniData.map((university) => (
                        <button
                          key={university._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              university: university._id, // Updating faculty ID
                              uniName: {
                                ...prev.uniName, // Preserve existing values
                                en: university.uniName.en,
                                ar: university.uniName.ar,
                              },
                            }))
                            setShowFlagPicker(false)

                            // Validate
                            validateField("university", university._id)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-black text-sm">
                            {university?.uniName?.en} - {university?.uniName?.ar}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {renderArrayField(
            "ModeOfStudy.en",
            "Study Mode (English)",
            <Languages className="w-4 h-4" />,
            "Add New Mode...",
            studyModes,
          )}
          {renderArrayField(
            "ModeOfStudy.ar",
            "وضع الدراسة (الإنجليزية)",
            <Languages className="w-4 h-4" />,
            "Add New Mode...",
            studyModesAr,
          )}

          {renderArrayField(
            "StudyLevel",
            "Study Levels",
            <GraduationCap className="w-4 h-4" />,
            "Add study level...",
            studyLevels,
          )}
          {renderArrayField(
            "Languages",
            "Languages of Instruction",
            <Languages className="w-4 h-4" />,
            "Add language...",
            languages,
          )}
          {renderArrayField(
            "Requirements",
            "Admission Requirements",
            <FileCheck className="w-4 h-4" />,
            "Add requirement...",
            admissionRequirements,
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <InputField
            label="Meta Title (English)"
            type="text"
            name="seo.metaTitle.en"
            placeholder="Enter Meta Title in English"
            value={formData?.seo?.metaTitle?.en}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="metaTitle"
            variant={3}
            error={touched["seo.metaTitle.en"] ? validationErrors["seo.metaTitle.en"] : ""}
          />

          {/* Meta Title (Arabic) */}

          <InputField
            label="Meta Title (العنوان التعريفي)"
            type="text"
            name="seo.metaTitle.ar"
            placeholder="أدخل العنوان التعريفي"
            value={formData?.seo?.metaTitle?.ar}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="metaTitle"
            variant={3}
            error={touched["seo.metaTitle.ar"] ? validationErrors["seo.metaTitle.ar"] : ""}
          />

          <div className="col-span-2">
            <InputField
              label="Meta Description (English)"
              type="textarea"
              name="seo.metaDescription.en"
              placeholder="Enter Meta Description in English"
              value={formData?.seo?.metaDescription?.en}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="metaDescription"
              variant={3}
              error={touched["seo.metaDescription.en"] ? validationErrors["seo.metaDescription.en"] : ""}
            />
          </div>

          {/* Meta Description (Arabic) */}
          <div className="col-span-2">
            <InputField
              label="Meta Description (الوصف التعريفي)"
              type="textarea"
              name="seo.metaDescription.ar"
              placeholder="أدخل الوصف التعريفي"
              value={formData?.seo?.metaDescription?.ar}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="metaDescription"
              variant={3}
              error={touched["seo.metaDescription.ar"] ? validationErrors["seo.metaDescription.ar"] : ""}
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
          </div>
          <InputField
            label="Custom URL (English)"
            type="text"
            name="customURLSlug.en"
            placeholder="Enter Custom Slug in English"
            value={formData?.customURLSlug?.en}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="custom_url_slug_en"
            variant={3}
          />
          <InputField
            label="Custom URL (Arabic)"
            type="text"
            name="customURLSlug.ar"
            placeholder="Enter Custom Slug in Arabic"
            value={formData?.customURLSlug?.ar}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="custom_url_slug_ar"
            variant={3}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="mb-4 w-full">
            <InputField
              label=" Tuition Fees"
              type="number"
              name="CourseFees"
              placeholder="e.g., $5,000"
              value={formData?.CourseFees || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="courseFees"
              variant={3}
              error={touched["CourseFees"] ? validationErrors["CourseFees"] : ""}
            />
          </div>

          <div className="mb-4">
            {/* English Tags */}
            {[
              { label: "Tags (English)", key: "tagEn", value: "en" },
              { label: "Tags (Arabic)", key: "tagAr", value: "ar" },
            ].map(({ label, key, value }) => (
              <div key={key} className="mb-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDropdown(key)
                        setTouched((prev) => ({ ...prev, [`Tags.${value}`]: true }))
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                        touched[`Tags.${value}`] && validationErrors[`Tags.${value}`]
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <span className="text-gray-600">{searchInput[key] || "Select Tags..."}</span>
                      <Search className="w-5 h-5 text-gray-400" />
                    </button>

                    {touched[`Tags.${value}`] && validationErrors[`Tags.${value}`] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[`Tags.${value}`]}</p>
                    )}

                    {showDropdown[key] && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search tags..."
                              value={searchInput[key]}
                              onChange={(e) =>
                                setSearchInput((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredTags[key]?.length > 0 ? (
                            filteredTags[key].map((tag, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => onSelect(value, tag, key)} // Pass "en" or "ar"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                              >
                                <span className="font-medium">{tag}</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-gray-500 text-center">No results found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Tags */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.Tags[value].map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => onRemove(value, tag)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <InputField
              label="Scholarships Available"
              type="checkbox"
              name="scholarshipsAvailable"
              checked={formData?.scholarshipsAvailable || false}
              onChange={handleInputChange}
              autoComplete="scholarshipsAvailable"
              variant={3}
            />

            <InputField
              label="Discount Available"
              type="checkbox"
              name="DiscountAvailable"
              checked={formData?.DiscountAvailable || false}
              onChange={handleInputChange}
              autoComplete="discountAvailable"
              variant={3}
            />

            <InputField
              label="Most Popular"
              type="checkbox"
              name="MostPopular"
              checked={formData?.MostPopular || false}
              onChange={handleInputChange}
              autoComplete="mostPopular"
              variant={3}
            />
          </div>
        </div>

        {formData.scholarshipsAvailable && (
          <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg space-y-4">
            <h3 className="font-medium text-blue-800">Scholarship Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Scholarship Type"
                type="select"
                name="scholarshipType"
                value={formData?.scholarshipType || "none"}
                onChange={handleInputChange}
                onBlur={handleBlur}
                options={[
                  { value: "", label: "None" },
                  { value: "partial", label: "Partial" },
                  { value: "full", label: "Full" },
                ]}
                variant={3}
              />

              {formData.scholarshipType === "partial" && (
                <InputField
                  label="Scholarship Percentage"
                  type="text"
                  name="scholarshipPercentage"
                  placeholder="e.g., 50"
                  value={formData?.scholarshipPercentage || ""}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="scholarshipPercentage"
                  variant={3}
                  min="1"
                  max="99"
                  error={touched["scholarshipPercentage"] ? validationErrors["scholarshipPercentage"] : ""}
                />
              )}
            </div>
          </div>
        )}

        {/* Discount fields - conditionally rendered */}
        {formData.DiscountAvailable && (
          <div className="p-4 border border-green-100 bg-green-50 rounded-lg space-y-4">
            <h3 className="font-medium text-green-800">Discount Details</h3>
            <InputField
              label="Discount Value"
              type="text"
              name="DiscountValue"
              placeholder="Enter discount amount"
              value={formData?.DiscountValue || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="discountValue"
              variant={3}
              min="1"
              error={touched["DiscountValue"] ? validationErrors["DiscountValue"] : ""}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/${language}/admin/courses`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-colors duration-200"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Save Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

