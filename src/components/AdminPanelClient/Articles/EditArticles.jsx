"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, ArrowLeft, Tag, X, BookOpen, Search } from "lucide-react"
import { useLanguage } from "../../../../context/LanguageContext"
import InputField from "../../../../utils/InputField"
import UploadWidget from "../../../../utils/UploadWidget"
import useApiData from "../../../../hooks/useApiData"
import MetaArrayFields from "../Universities/MetaArrayFields"
import useDropdownData from "../../../../hooks/useDropdownData"
import RichText from "../../../../utils/RichText"
import { getEmoji } from "../../../../libs/countryFlags"
const isWindows = navigator.userAgent.includes("Windows")

const initialFormData = {
  blogTitle: {
    en: "",
    ar: "",
  },
  blogSubtitle: {
    en: "",
    ar: "",
  },
  blogDescription: {
    en: "",
    ar: "",
  },
  publishImmediately: false,
  featuredBlog: false,
  blogAuthor: "",
  blogCategory: "",
  blogTags: {
    en: [],
    ar: [],
  },
  blogCountry: null,
  countryName: { en: "", ar: "" },
  countryCode: "",
  countryEmoji: "",
  blogPhoto: "",
  status: "Draft", // Article Status
  excerpt: { en: "", ar: "" },
  scheduledPublishDate: null, // Scheduling future publish dates
  allowComments: true, // Enable/Disable comments
  visibility: "Public",
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
}

const categories = [
  "Study Abroad",
  "University Life",
  "Career Advice",
  "Student Tips",
  "Academic Success",
  "Cultural Exchange",
  "Language Learning",
  "Scholarships",
  "Student Stories",
  "Education News",
]

const Visibility = ["Public", "Private", "Password Protected"]
const Status = ["Draft", "Pending Review", "Published"]

export default function EditArticle() {
  const { language } = useLanguage()
  const { filteredData } = useDropdownData()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [showFlagPicker, setShowFlagPicker] = useState(false)
  const [flagSearch, setFlagSearch] = useState("")
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [newTag, setNewTag] = useState({ en: "", ar: "" })
  const { data, updateWithOutById } = useApiData(`https://edu-brink-backend.vercel.app/api/blog/${id}`)

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})

  useEffect(() => {
    if (data) {
      setFormData({
        blogTitle: {
          en: data?.blogTitle?.en || "",
          ar: data?.blogTitle?.ar || "",
        },
        blogSubtitle: {
          en: data?.blogSubtitle?.en || "",
          ar: data?.blogSubtitle?.ar || "",
        },
        blogDescription: {
          en: data?.blogDescription?.en || "",
          ar: data?.blogDescription?.ar || "",
        },
        publishImmediately: !!data?.publishImmediately, // Ensure Boolean
        featuredBlog: !!data?.featuredBlog, // Ensure Boolean
        blogAuthor: data?.blogAuthor || "",
        blogCategory: data?.blogCategory || "",
        blogTags: {
          en: Array.isArray(data?.blogTags?.en) ? data.blogTags.en : [],
          ar: Array.isArray(data?.blogTags?.ar) ? data.blogTags.ar : [],
        },
        blogCountry: data?.blogCountry?._id || null,
        countryName: {
          en: data?.blogCountry?.countryName?.en || "",
          ar: data?.blogCountry?.countryName?.ar || "",
        },
        countryCode: data?.blogCountry?.countryCode || "",
        countryEmoji: data?.blogCountry?.countryPhotos?.countryFlag || "",
        blogPhoto: data?.blogPhoto || "",
        status: data?.status || "Draft", // Default to "Draft"
        excerpt: {
          en: data?.excerpt?.en || "",
          ar: data?.excerpt?.ar || "",
        },
        scheduledPublishDate: data?.scheduledPublishDate || null,
        allowComments: data?.allowComments ?? true, // Ensure Boolean
        visibility: data?.visibility || "Public",
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
            en: Array.isArray(data?.seo?.metaKeywords?.en) ? data.seo.metaKeywords.en : [],
            ar: Array.isArray(data?.seo?.metaKeywords?.ar) ? data.seo.metaKeywords.ar : [],
          },
        },
        customURLSlug: {
          en: data?.customURLSlug?.en || "",
          ar: data?.customURLSlug?.ar || "",
        },
      })
    } else {
      setFormData(initialFormData) // Reset to initial state when `data` is empty
    }
  }, [data])

  const filterFacultyData = filteredData.countries?.filter(
    (country) =>
      country.countryName.en.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.countryName.ar.toLowerCase().includes(flagSearch.toLowerCase()),
  )

  // Function to strip HTML tags for validation
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  // Validation function
  const validateField = (name, value) => {
    let error = ""

    // Handle nested fields like blogTitle.en
    if (name.includes(".")) {
      const [field, subfield] = name.split(".")

      // Handle different field types
      if (field === "blogTitle") {
        if (!value.trim()) {
          error = `Blog title in ${subfield === "en" ? "English" : "Arabic"} is required`
        } else if (value.trim().length < 3) {
          error = `Blog title in ${subfield === "en" ? "English" : "Arabic"} must be at least 3 characters`
        }
      } else if (field === "blogSubtitle") {
        if (!value.trim()) {
          error = `Blog subtitle in ${subfield === "en" ? "English" : "Arabic"} is required`
        }
      } else if (field === "excerpt") {
        if (!value.trim()) {
          error = `Excerpt in ${subfield === "en" ? "English" : "Arabic"} is required`
        }
      } else if (field === "seo" && subfield === "metaTitle") {
        const lang = name.split(".")[2] // Get en or ar
        if (!value.trim()) {
          error = `Meta title in ${lang === "en" ? "English" : "Arabic"} is required`
        } else if (value.length > 60) {
          error = `Meta title should be less than 60 characters`
        }
      } else if (field === "blogDescription") {
        const cleanText = stripHtml(value).trim()
        if (!cleanText) {
          error = `Content in ${subfield === "en" ? "English" : "Arabic"} is required`
        }
      }
    } else {
      // Handle non-nested fields
      if (name === "blogAuthor") {
        if (!value.trim()) {
          error = "Author name is required"
        }
      } else if (name === "blogCategory") {
        if (!value) {
          error = "Please select a category"
        }
      } else if (name === "blogCountry") {
        if (!value) {
          error = "Please select a country"
        }
      } else if (name === "scheduledPublishDate") {
        if (formData.status === "Draft" && !formData.publishImmediately && !value) {
          error = "Please set a scheduled publish date"
        } else if (value) {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          if (isNaN(selectedDate.getTime())) {
            error = "Please enter a valid date"
          } else if (selectedDate < today) {
            error = "Scheduled date cannot be in the past"
          }
        }
      }
    }

    return error
  }

  // Handle field blur for validation
  const handleBlur = (event) => {
    const { name, value } = event.target

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate the field
    const error = validateField(name, value)

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  // Validate blog tags
  const validateTags = (lang) => {
    if (!formData.blogTags[lang] || formData.blogTags[lang].length === 0) {
      return `Please add at least one tag in ${lang === "en" ? "English" : "Arabic"}`
    }
    return ""
  }

  // Mark tags as touched when interacting with them
  const handleTagsInteraction = (lang) => {
    setTouchedFields((prev) => ({
      ...prev,
      [`blogTags.${lang}`]: true,
    }))

    const error = validateTags(lang)
    setValidationErrors((prev) => ({
      ...prev,
      [`blogTags.${lang}`]: error,
    }))
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

    if (nameParts.includes("blogTitle")) {
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

    // Clear validation error when field is edited
    if (touchedFields[name]) {
      const error = validateField(name, value)
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  // Handle country selection
  const handleCountrySelect = (country) => {
    setFormData((prev) => ({
      ...prev,
      blogCountry: country._id,
      countryName: {
        ...prev.countryName,
        en: country.countryName.en,
        ar: country.countryName.ar,
      },
      countryCode: country.countryCode,
      countryEmoji: country.countryPhotos.countryFlag,
    }))

    setShowFlagPicker(false)

    // Mark as touched and validate
    setTouchedFields((prev) => ({
      ...prev,
      blogCountry: true,
    }))

    setValidationErrors((prev) => ({
      ...prev,
      blogCountry: country._id ? "" : "Please select a country",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = [
      "blogTitle.en",
      "blogTitle.ar",
      "blogSubtitle.en",
      "blogSubtitle.ar",
      "blogDescription.en",
      "blogDescription.ar",
      "blogAuthor",
      "blogCategory",
      "blogCountry",
      "excerpt.en",
      "excerpt.ar",
      "seo.metaTitle.en",
      "seo.metaTitle.ar",
      "blogTags.en",
      "blogTags.ar",
    ]

    // Add scheduledPublishDate conditionally
    if (formData.status === "Draft" && !formData.publishImmediately) {
      allFields.push("scheduledPublishDate")
    }

    const newTouchedFields = {}
    allFields.forEach((field) => {
      newTouchedFields[field] = true
    })

    setTouchedFields(newTouchedFields)

    // Validate all fields
    const newErrors = {}
    let hasErrors = false

    allFields.forEach((field) => {
      let value

      // Handle nested fields
      if (field.includes(".")) {
        const parts = field.split(".")
        if (parts.length === 2) {
          value = formData[parts[0]][parts[1]]
        } else if (parts.length === 3) {
          value = formData[parts[0]][parts[1]][parts[2]]
        }
      } else {
        value = formData[field]
      }

      // Special case for blogTags
      if (field === "blogTags.en") {
        const error = validateTags("en")
        if (error) {
          newErrors[field] = error
          hasErrors = true
        }
      } else if (field === "blogTags.ar") {
        const error = validateTags("ar")
        if (error) {
          newErrors[field] = error
          hasErrors = true
        }
      } else {
        // Regular field validation
        const error = validateField(field, value)
        if (error) {
          newErrors[field] = error
          hasErrors = true
        }
      }
    })

    setValidationErrors(newErrors)

    if (hasErrors) {
      // Find the first error element and scroll to it
      const firstErrorField = Object.keys(newErrors)[0]
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        errorElement.focus()
      }

      setError("Please fix the validation errors before submitting")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { countryName, countryEmoji, countryCode, ...updatedFormData } = {
        ...formData,
      }

      console.log(updatedFormData)

      await updateWithOutById(updatedFormData)

      navigate(`/${language}/admin/articles`)
    } catch (err) {
      console.error("Error updating article:", err)
      setError(err.message || "Failed to update article")
    } finally {
      setLoading(false)
    }
  }

  const addTag = (lang) => {
    if (newTag[lang] && !formData?.blogTags?.[lang]?.includes(newTag[lang])) {
      setFormData((prev) => ({
        ...prev,
        blogTags: {
          ...prev.blogTags,
          [lang]: [...(prev.blogTags?.[lang] ?? []), newTag[lang]],
        },
      }))
      setNewTag((prev) => ({
        ...prev,
        [lang]: "", // Clear only the corresponding language field
      }))

      // Validate tags after adding
      handleTagsInteraction(lang)
    }
  }

  const removeTag = (lang, tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      blogTags: {
        ...prev.blogTags,
        [lang]: prev.blogTags?.[lang]?.filter((tag) => tag !== tagToRemove) ?? [],
      },
    }))

    // Validate tags after removing
    handleTagsInteraction(lang)
  }

  // Helper function to determine if a field has an error and has been touched
  const hasError = (fieldName) => {
    return touchedFields[fieldName] && validationErrors[fieldName]
  }

  // Helper function to get error message
  const getErrorMessage = (fieldName) => {
    return hasError(fieldName) ? validationErrors[fieldName] : ""
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/articles`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>
        <h1 className="text-2xl font-bold">Edit Article</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputField
              label="Blog Title (English)"
              type="text"
              name="blogTitle.en"
              placeholder="Blog Title (English)"
              value={formData?.blogTitle?.en}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="blog_title_english"
              variant={3}
              className={hasError("blogTitle.en") ? "border-red-500" : ""}
            />
            {hasError("blogTitle.en") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogTitle.en")}</p>}
          </div>

          <div>
            <InputField
              label="عنوان المدونة (عربي)"
              type="text"
              name="blogTitle.ar"
              placeholder="عنوان المدونة (عربي)"
              value={formData?.blogTitle?.ar}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="blog_title_arabic"
              variant={3}
              className={hasError("blogTitle.ar") ? "border-red-500" : ""}
            />
            {hasError("blogTitle.ar") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogTitle.ar")}</p>}
          </div>

          <div>
            <InputField
              label="Blog Subtitle (English)"
              type="text"
              name="blogSubtitle.en"
              placeholder="Enter Blog Subtitle (English)"
              value={formData?.blogSubtitle?.en}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="blog_subtitle_english"
              variant={3}
              className={hasError("blogSubtitle.en") ? "border-red-500" : ""}
            />
            {hasError("blogSubtitle.en") && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogSubtitle.en")}</p>
            )}
          </div>

          <div>
            <InputField
              label="عنوان فرعي (عربي)"
              type="text"
              name="blogSubtitle.ar"
              placeholder="أدخل العنوان الفرعي (عربي)"
              value={formData?.blogSubtitle?.ar}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="blog_subtitle_arabic"
              variant={3}
              className={hasError("blogSubtitle.ar") ? "border-red-500" : ""}
            />
            {hasError("blogSubtitle.ar") && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogSubtitle.ar")}</p>
            )}
          </div>

          <div>
            <InputField
              label="Blog Category"
              type="select"
              name="blogCategory"
              value={formData?.blogCategory || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              options={categories.map((mode) => ({
                value: mode,
                label: mode,
              }))}
              className={hasError("blogCategory") ? "border-red-500" : ""}
            />
            {hasError("blogCategory") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogCategory")}</p>}
          </div>

          <div>
            <InputField
              label="Blog Author"
              type="text"
              name="blogAuthor"
              placeholder="Name of the Author"
              value={formData?.blogAuthor}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="blog_author"
              variant={3}
              className={hasError("blogAuthor") ? "border-red-500" : ""}
            />
            {hasError("blogAuthor") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogAuthor")}</p>}
          </div>

          <div className="col-span-2">
            <RichText
              label="Content (English)"
              value={formData.blogDescription.en}
              onChange={(content) => {
                setFormData((prev) => ({
                  ...prev,
                  blogDescription: { ...prev.blogDescription, en: content },
                }))

                if (touchedFields["blogDescription.en"]) {
                  const error = validateField("blogDescription.en", content)
                  setValidationErrors((prev) => ({
                    ...prev,
                    "blogDescription.en": error,
                  }))
                }
              }}
              onBlur={() => {
                setTouchedFields((prev) => ({
                  ...prev,
                  "blogDescription.en": true,
                }))

                const error = validateField("blogDescription.en", formData.blogDescription.en)
                setValidationErrors((prev) => ({
                  ...prev,
                  "blogDescription.en": error,
                }))
              }}
              className={hasError("blogDescription.en") ? "border-red-500" : ""}
            />
            {hasError("blogDescription.en") && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogDescription.en")}</p>
            )}
          </div>

          <div className="col-span-2">
            <RichText
              label="المحتوى (عربي)"
              value={formData.blogDescription.ar}
              onChange={(content) => {
                setFormData((prev) => ({
                  ...prev,
                  blogDescription: { ...prev.blogDescription, ar: content },
                }))

                if (touchedFields["blogDescription.ar"]) {
                  const error = validateField("blogDescription.ar", content)
                  setValidationErrors((prev) => ({
                    ...prev,
                    "blogDescription.ar": error,
                  }))
                }
              }}
              onBlur={() => {
                setTouchedFields((prev) => ({
                  ...prev,
                  "blogDescription.ar": true,
                }))

                const error = validateField("blogDescription.ar", formData.blogDescription.ar)
                setValidationErrors((prev) => ({
                  ...prev,
                  "blogDescription.ar": error,
                }))
              }}
              className={hasError("blogDescription.ar") ? "border-red-500" : ""}
            />
            {hasError("blogDescription.ar") && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogDescription.ar")}</p>
            )}
          </div>

          {[
            { id: 1, label: "Blog Tags (English)", lang: "en" },
            { id: 2, label: "Blog Tags (Arabic)", lang: "ar" },
          ].map((item) => {
            return (
              <div key={item.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag[item.lang]}
                    onChange={(e) =>
                      setNewTag((prev) => ({
                        ...prev,
                        [item.lang]: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(item.lang)
                      }
                    }}
                    onFocus={() => handleTagsInteraction(item.lang)}
                    placeholder={`Add a tag (${item.lang.toUpperCase()})...`}
                    className={`flex-1 border ${hasError(`blogTags.${item.lang}`) ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addTag(item.lang)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData?.blogTags?.[item.lang]?.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(item.lang, tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {hasError(`blogTags.${item.lang}`) && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(`blogTags.${item.lang}`)}</p>
                )}
              </div>
            )
          })}

          <div className="col-span-2 space-y-4">
            {/* Blog Photo Input Field */}
            <div className="flex items-center gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Blog Photo URL"
                  type="text"
                  name="blogPhoto"
                  placeholder="Enter Blog Photo URL"
                  value={formData?.blogPhoto}
                  onChange={handleInputChange}
                  autoComplete="blogPhoto"
                  variant={3}
                />
              </div>
              {formData.blogPhoto ? (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      blogPhoto: "", // Reset field
                    }))
                  }
                  className="text-red-500 ml-2 px-4 py-2 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
                >
                  Remove
                </button>
              ) : (
                <div className="whitespace-nowrap">
                  <UploadWidget
                    uwConfig={{
                      cloudName: "edubrink",
                      uploadPreset: "EduBrinkImages",
                      multiple: false, // Only one photo
                      maxImageFileSize: 2000000,
                      folder: "blog/Photos",
                    }}
                    setFormData={setFormData}
                    field="blogPhoto"
                    uploadName="Upload Blog Photo"
                    id="upload_widget_blog_photo"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <InputField
              label="Excerpt (English)"
              type="textarea"
              name="excerpt.en"
              placeholder="Write the summary"
              value={formData?.excerpt.en}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="excerpt_en"
              variant={3}
              className={hasError("excerpt.en") ? "border-red-500" : ""}
            />
            {hasError("excerpt.en") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("excerpt.en")}</p>}
          </div>

          <div className="w-full">
            <InputField
              label="مقتطفات (عربي)"
              type="textarea"
              name="excerpt.ar"
              placeholder="اكتب الملخص"
              value={formData?.excerpt.ar}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="excerpt_ar"
              variant={3}
              className={hasError("excerpt.ar") ? "border-red-500" : ""}
            />
            {hasError("excerpt.ar") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("excerpt.ar")}</p>}
          </div>

          <div>
            <InputField
              label="Visibility"
              type="select"
              name="visibility"
              checked={formData?.visibility || ""}
              onChange={handleInputChange}
              options={Visibility.map((mode) => ({
                value: mode,
                label: mode,
              }))}
              variant={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFlagPicker(!showFlagPicker)
                  setTouchedFields((prev) => ({
                    ...prev,
                    blogCountry: true,
                  }))
                }}
                className={`w-full flex items-center justify-between px-4 py-1 border ${hasError("blogCountry") ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white`}
              >
                <span className="flex gap-2 items-center">
                  {isWindows ? (
                    formData?.countryCode ? (
                      <div className="flex gap-2 items-center">
                        <img
                          src={`https://flagcdn.com/w320/${getEmoji(formData?.countryCode)}.png`}
                          alt="Country Flag"
                          className="w-4 h-4 object-cover rounded-full"
                        />
                        <span className="py-1 text-gray-600">
                          {formData?.countryName?.en || formData?.uniCountry || "Select Country"}{" "}
                        </span>
                      </div>
                    ) : (
                      <span className="py-1 text-gray-600">Select Country</span>
                    )
                  ) : (
                    <>
                      <span>{formData?.countryEmoji}</span>
                      <span className="py-1 text-gray-600">
                        {formData?.countryName?.en || formData?.uniCountry || "Select Country"}{" "}
                      </span>
                    </>
                  )}
                </span>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </button>

              {hasError("blogCountry") && <p className="mt-1 text-sm text-red-600">{getErrorMessage("blogCountry")}</p>}

              {showFlagPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={flagSearch}
                        onChange={(e) => setFlagSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filterFacultyData?.map((country) => (
                      <button
                        key={country._id}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                      >
                        {isWindows ? (
                          country?.countryCode ? (
                            <div className="flex gap-2 mt-2 items-center">
                              <img
                                src={`https://flagcdn.com/w320/${getEmoji(country?.countryCode)}.png`}
                                alt="Country Flag"
                                className="w-4 h-4 object-cover rounded-full"
                              />
                              <p className="text-black text-sm">
                                {language === "ar" ? country?.countryName?.ar : country?.countryName?.en}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[.6rem] font-medium">No flag</span>
                          )
                        ) : (
                          <>
                            <span>{country?.countryPhotos?.countryFlag}</span>
                            <span className="text-black text-sm">
                              {country?.countryName?.en} - {country?.countryName?.ar}
                            </span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!formData?.publishImmediately && (
            <div className="col-span-2">
              <InputField
                label="Status"
                type="select"
                name="status"
                value={formData?.status || ""}
                onChange={handleInputChange}
                options={Status.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
              />
              {formData?.status === "Draft" && (
                <div className="col-span-2 mt-4 w-full">
                  <InputField
                    label="Scheduled Publish Date"
                    type="date"
                    name="scheduledPublishDate"
                    value={formData?.scheduledPublishDate ? formData?.scheduledPublishDate.slice(0, 10) : ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="scheduled_publish_date"
                    variant={3}
                    className={hasError("scheduledPublishDate") ? "border-red-500" : ""}
                  />
                  {hasError("scheduledPublishDate") && (
                    <p className="mt-1 text-sm text-red-600">{getErrorMessage("scheduledPublishDate")}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="col-span-2 mb-4 flex flex-col gap-4">
            <div>
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
                className={hasError("seo.metaTitle.en") ? "border-red-500" : ""}
              />
              {hasError("seo.metaTitle.en") && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage("seo.metaTitle.en")}</p>
              )}
            </div>

            <div>
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
                className={hasError("seo.metaTitle.ar") ? "border-red-500" : ""}
              />
              {hasError("seo.metaTitle.ar") && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage("seo.metaTitle.ar")}</p>
              )}
            </div>

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
                onBlur={handleBlur}
                autoComplete="metaDescription"
                variant={3}
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
          </div>

          <InputField
            label="Custom URL (English)"
            type="text"
            name="customURLSlug.en"
            placeholder="Enter Custom Slug in English"
            value={formData?.customURLSlug?.en}
            onChange={handleInputChange}
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
            autoComplete="custom_url_slug_ar"
            variant={3}
          />

          <div className="flex items-center col-span-2 space-x-6">
            <InputField
              label="Publish Immediately"
              type="checkbox"
              name="publishImmediately"
              checked={formData?.publishImmediately || false}
              onChange={handleInputChange}
              autoComplete="publishImmediately"
              variant={3}
            />

            <InputField
              label="Featured Article"
              type="checkbox"
              name="featuredBlog"
              checked={formData?.featuredBlog || false}
              onChange={handleInputChange}
              autoComplete="publishImmediately"
              variant={3}
            />

            <InputField
              label="Allow Comments"
              type="checkbox"
              name="allowComments"
              checked={formData?.allowComments || false}
              onChange={handleInputChange}
              autoComplete="allow_comments"
              variant={3}
            />
          </div>

          <div className="mt-6 flex col-span-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/${language}/admin/articles`)}
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
                  Save Article
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

