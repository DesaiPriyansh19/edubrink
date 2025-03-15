"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Flag, Search, Languages, School, BookOpen, Tag } from "lucide-react"
import { countryFlags, getEmoji } from "../../../../libs/countryFlags"
import { useLanguage } from "../../../../context/LanguageContext"
import useApiData from "../../../../hooks/useApiData"
import InputField from "../../../../utils/InputField"
import UploadWidget from "../../../../utils/UploadWidget"
import useDropdownData from "../../../../hooks/useDropdownData"
import DropdownSelect from "../../../../utils/DropdownSelect"
import Loader from "../../../../utils/Loader"
import MetaArrayFields from "../Universities/MetaArrayFields"
import RichText from "../../../../utils/RichText"
const isWindows = navigator.userAgent.includes("Windows")

const initialFormData = {
  countryName: {
    en: "",
    ar: "",
  },
  countrySummary: {
    en: "",
    ar: "",
  },
  countryCurrency: "",
  countryLanguages: [], // Array for languages spoken in the country
  countryPhotos: {
    mainPagePhoto: "",
    countryFlag: "",
  },
  countryOverview: {
    en: "",
    ar: "",
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
  name: "",
  countryCode: "",
  universities: [], // Array to hold references to university IDs
  faculty: [],
  blog: [],
  hotDestination: false,
  livingCost: "",
}

export default function EditCountry() {
  const { language } = useLanguage()
  const { id } = useParams()
  const { data, updateWithOutById } = useApiData(`https://edu-brink-backend.vercel.app/api/country/${id}`)

  useEffect(() => {
    if (data) {
      setFormData({
        id: data._id || "",
        countryName: {
          en: data?.countryName?.en || "",
          ar: data?.countryName?.ar || "",
        },
        countrySummary: {
          en: data?.countrySummary?.en || "",
          ar: data?.countrySummary?.ar || "",
        },
        countryCurrency: data?.countryCurrency || "",
        countryLanguages: data?.countryLanguages || [],
        countryPhotos: {
          mainPagePhoto: data?.countryPhotos?.mainPagePhoto || "",
          countryFlag: data?.countryPhotos?.countryFlag || "",
        },
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
        countryOverview: {
          en: data?.countryOverview?.en || "",
          ar: data?.countryOverview?.ar || "",
        },
        countryCode: data?.countryCode || "",
        universities: data?.universities || [], // Default to empty array
        blog: data?.blog || [],
        faculty: data?.faculty || [],
        hotDestination: data?.hotDestination || false,
        livingCost: data?.livingCost || "",
      })
    }
  }, [data])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [showDropdown, setShowDropdown] = useState({
    universities: false,
    blogs: false,
  })
  const [error, setError] = useState(null)
  const [newItem, setNewItem] = useState("")
  const [activeSection, setActiveSection] = useState(null > null)
  const [showFlagPicker, setShowFlagPicker] = useState(false)
  const [flagSearch, setFlagSearch] = useState("")
  const { filteredData, handleRemove, handleAdd } = useDropdownData()
  const [validationErrors, setValidationErrors] = useState({})
  const [searchInput, setSearchInput] = useState({ univername: "", blogname: "" })

  // Validate form data
  const validateForm = () => {
    const errors = {}

    // Required fields validation
    if (!formData.countryName.en) errors["countryName.en"] = "Country name in English is required"
    if (!formData.countryName.ar) errors["countryName.ar"] = "Country name in Arabic is required"
    if (!formData.countrySummary.en) errors["countrySummary.en"] = "Country summary in English is required"
    if (!formData.countrySummary.ar) errors["countrySummary.ar"] = "Country summary in Arabic is required"
    if (!formData.countryCode) errors["countryCode"] = "Country ISO code is required"
    if (!formData.countryCurrency) errors["countryCurrency"] = "Country currency is required"
    if (formData.countryLanguages.length === 0) errors["countryLanguages"] = "At least one language is required"

    // SEO validation
    if (!formData.seo.metaTitle.en) errors["seo.metaTitle.en"] = "Meta title in English is required"
    if (!formData.seo.metaTitle.ar) errors["seo.metaTitle.ar"] = "Meta title in Arabic is required"
    if (!formData.seo.metaDescription.en) errors["seo.metaDescription.en"] = "Meta description in English is required"
    if (!formData.seo.metaDescription.ar) errors["seo.metaDescription.ar"] = "Meta description in Arabic is required"

    // URL slug validation
    if (!formData.customURLSlug.en) errors["customURLSlug.en"] = "Custom URL in English is required"
    if (!formData.customURLSlug.ar) errors["customURLSlug.ar"] = "Custom URL in Arabic is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      setError("Please fix the validation errors before submitting")
      // Scroll to the top to show the error message
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { name, ...updatedFormData } = {
        ...formData,
        countryPhotos: {
          ...formData.countryPhotos,
          mainPagePhoto: Array.isArray(formData.countryPhotos.mainPagePhoto)
            ? formData.countryPhotos.mainPagePhoto[0]
            : formData.countryPhotos.mainPagePhoto,
        },
        universities: formData.universities.map((university) => university._id),
        blog: formData.blog.map((blog) => blog._id),
        faculty: formData.faculty.map((faculty) => faculty._id),
      }

      console.log(updatedFormData)

      await updateWithOutById(updatedFormData)
      navigate(`/${language}/admin/countries`)
    } catch (err) {
      console.error("Error adding country:", err)
      setError(err.message || "Failed to add country")
    } finally {
      setLoading(false)
    }
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

    if (nameParts.includes("countryName")) {
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

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors }
        delete updatedErrors[name] // Remove the error for this field
        return updatedErrors
      })
    }
  }

  const addItem = (field) => {
    if (!newItem.trim()) return

    setFormData((prev) => {
      const fieldPath = field.split(".")
      const fieldKey = fieldPath[0] // "keywords"
      const subKey = fieldPath[1] // "en"

      if (subKey) {
        return {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            [subKey]: [...(prev[fieldKey]?.[subKey] || []), newItem],
          },
        }
      } else {
        return {
          ...prev,
          [field]: [...(prev[field] || []), newItem],
        }
      }
    })

    setNewItem("") // Clear input field

    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors }
        delete updatedErrors[field]
        return updatedErrors
      })
    }
  }

  const removeItem = (field, itemToRemove) => {
    setFormData((prev) => {
      const fieldPath = field.split(".")
      const fieldKey = fieldPath[0] // "keywords"
      const subKey = fieldPath[1] // "en"

      if (subKey) {
        return {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            [subKey]: prev[fieldKey]?.[subKey]?.filter((item) => item !== itemToRemove),
          },
        }
      } else {
        return {
          ...prev,
          [field]: prev[field].filter((item) => item !== itemToRemove),
        }
      }
    })
  }

  const filteredFlags = countryFlags.filter(
    (country) =>
      country.name.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.code.toLowerCase().includes(flagSearch.toLowerCase()),
  )

  const renderArrayField = (field, label, icon, placeholder) => {
    const fieldPath = field.split(".") // Split nested field (e.g., ["keywords", "en"])
    const fieldKey = fieldPath[0] // First key (e.g., "keywords")
    const subKey = fieldPath[1] // Second key (e.g., "en")

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {validationErrors[field] && <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={activeSection === field ? newItem : ""}
            onChange={(e) => {
              setNewItem(e.target.value)
              setActiveSection(field)
            }}
            placeholder={placeholder}
            className={`flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              validationErrors[field] ? "border-red-500" : ""
            }`}
          />
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
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/countries`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Countries
        </button>
        <h1 className="text-2xl font-bold">Edit Country</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Country Name (English)"
                type="text"
                name="countryName.en"
                placeholder="Country Name"
                value={formData?.countryName?.en}
                onChange={handleInputChange}
                autoComplete="countryName"
                variant={3}
                error={validationErrors["countryName.en"]}
              />
            </div>
            <div>
              <InputField
                label="اسم الدولة (عربي)"
                type="text"
                name="countryName.ar"
                placeholder="اسم الدولة "
                value={formData?.countryName?.ar}
                onChange={handleInputChange}
                autoComplete="countryName"
                variant={3}
                error={validationErrors["countryName.ar"]}
              />
            </div>

            <div className="col-span-2 flex justify-between gap-6">
              <div className="w-full">
                <InputField
                  label="Living Cost"
                  type="text"
                  name="livingCost"
                  placeholder="E.g. $800"
                  value={formData?.livingCost}
                  onChange={handleInputChange}
                  autoComplete="living_cost"
                  variant={3}
                />
              </div>

              <div className="w-full">
                <InputField
                  label="Country Currency (عملة البلد)"
                  type="text"
                  name="countryCurrency"
                  placeholder="E.g. USD"
                  value={formData?.countryCurrency}
                  onChange={handleInputChange}
                  autoComplete="countryCurrency"
                  variant={3}
                  error={validationErrors["countryCurrency"]}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Flag</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFlagPicker(!showFlagPicker)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <span className="flex items-center">
                    {isWindows ? (
                      formData?.countryCode ? (
                        <>
                          <img
                            src={`https://flagcdn.com/w320/${getEmoji(formData.countryCode)}.png`}
                            alt="Country Flag"
                            className="w-4 h-4  object-cover rounded-full"
                          />

                          <span className="ml-2 text-gray-600">
                            {formData.countryName?.en || "Select Flag"} {/* Placeholder if name is empty */}
                          </span>
                        </>
                      ) : (
                        <span className="text-[.6rem] font-medium">No flag</span>
                      )
                    ) : (
                      <>
                        <span className="text-2xl mr-2">
                          {formData.countryPhotos.countryFlag || "🏳"} {/* White flag if empty */}
                        </span>
                        <span className="text-gray-600">
                          {formData.countryName.en || "Select Flag"} {/* Placeholder if name is empty */}
                        </span>
                      </>
                    )}
                  </span>
                  <Flag className="w-5 h-5 text-gray-400" />
                </button>

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
                      {filteredFlags.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              countryCode: country.alpha3,
                              name: country.name,
                              countryPhotos: {
                                ...prev.countryPhotos, // Ensure previous countryPhotos state is preserved
                                countryFlag: country.emoji,
                              },
                            }))

                            setShowFlagPicker(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          {isWindows ? (
                            country?.alpha3 ? (
                              <>
                                <img
                                  src={`https://flagcdn.com/w320/${getEmoji(country.alpha3)}.png`}
                                  alt="Country Flag"
                                  className="w-4 h-4 object-cover  rounded-full"
                                />
                                <span>{country.name}</span>
                                <span className="text-gray-400 text-sm">({country.alpha3})</span>
                              </>
                            ) : (
                              <span className="text-[.6rem] font-medium">No flag</span>
                            )
                          ) : (
                            <>
                              <span className="text-2xl">{country.emoji}</span>
                              <span>{country.name}</span>
                              <span className="text-gray-400 text-sm">({country.alpha3})</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <InputField
              label="Country Summary (English)"
              type="textarea"
              name="countrySummary.en"
              placeholder="Country Summary"
              value={formData?.countrySummary?.en}
              onChange={handleInputChange}
              autoComplete="country_summary_en"
              variant={3}
              error={validationErrors["countrySummary.en"]}
            />

            <InputField
              label="ملخص الدولة (عربي)"
              type="textarea"
              name="countrySummary.ar"
              placeholder="ملخص الدولة"
              value={formData?.countrySummary?.ar}
              onChange={handleInputChange}
              autoComplete="country_summary_ar"
              variant={3}
              error={validationErrors["countrySummary.ar"]}
            />

            <div className="w-full">
              <InputField
                label="ISO Code"
                type="text"
                name="countryCode"
                placeholder="E.g. USA"
                value={formData?.countryCode}
                onChange={handleInputChange}
                autoComplete="countryCode"
                variant={3}
                error={validationErrors["countryCode"]}
              />
            </div>

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

            <div className=" col-span-2">
              <div className="mb-2">
                {/* For mainPagePhoto */}
                <div className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label="Main Photo URL (الرئيسية للجامعة)"
                      type="text"
                      name="countryPhotos.mainPagePhoto" // Single field, no array indexing
                      value={formData?.countryPhotos?.mainPagePhoto || ""}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          countryPhotos: {
                            ...prevData.countryPhotos,
                            mainPagePhoto: e.target.value,
                          },
                        }))
                      }
                      placeholder="Main Photo URL"
                      variant={3}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        countryPhotos: {
                          ...prevData.countryPhotos,
                          mainPagePhoto: "", // Reset field
                        },
                      }))
                    }}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>

                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: false, // Only one photo
                    maxImageFileSize: 2000000,
                    folder: "country/CoverPhoto",
                  }}
                  setFormData={setFormData}
                  field="countryPhotos"
                  fieldName="mainPagePhoto" // Use mainPagePhoto directly
                  uploadName="Upload Univeristy Cover Photo"
                  id="upload_widget_country_cover_photo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {renderArrayField(
              "countryLanguages",
              "Teaching Language",
              <Languages className="w-4 h-4" />,
              "Add New Language...",
            )}
          </div>

          <div>
            <RichText
              label="Country Description (English)"
              value={formData.countryOverview.en}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  countryOverview: { ...prev.countryOverview, en: content },
                }))
              }
            />
          </div>

          <div>
            <RichText
              label="وصف البلد (Arabic)"
              value={formData.countryOverview.ar}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  countryOverview: { ...prev.countryOverview, ar: content },
                }))
              }
            />
          </div>

          <DropdownSelect
            label="Enrolled University (التسجيل في الجامعة)"
            placeholder="Select a university"
            icon={School}
            disabled={true}
            selectedItems={formData?.universities}
            searchKey="uniName"
            options={filteredData?.universities}
            onSearch={(value) => setSearchInput((prev) => ({ ...prev, univername: value }))}
            onSelect={(university) => handleAdd("universities", university, setFormData, setShowDropdown)}
            onRemove={(id) => handleRemove("universities", id, setFormData)}
            language="en"
            dropdownKey="universities"
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          <DropdownSelect
            label="Enrolled Blog (سجل في المدونة)"
            placeholder="Select a blog"
            icon={BookOpen}
            selectedItems={formData?.blog}
            disabled={true}
            searchKey="blogTitle"
            options={filteredData?.blogs}
            onSearch={(value) => setSearchInput((prev) => ({ ...prev, blogname: value }))}
            onSelect={(blog) => handleAdd("blog", blog, setFormData, setShowDropdown)}
            onRemove={(id) => handleRemove("blog", id, setFormData)}
            language="en"
            dropdownKey="blogs"
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          <InputField
            label="Hot Destination"
            type="checkbox"
            name="hotDestination"
            checked={formData?.hotDestination || false}
            onChange={handleInputChange}
            autoComplete="hot_destination"
            variant={3}
          />
        </div>

        <div className="mt-4">
          <button type="submit" className="px-4 py-2 bg-[#294dd8] rounded-lg text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

