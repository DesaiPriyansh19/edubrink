"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, ArrowLeft, CalendarPlus2, School, AlertCircle } from "lucide-react"
import { useLanguage } from "../../../../context/LanguageContext"
import InputField from "../../../../utils/InputField"
import DropdownSelect from "../../../../utils/DropdownSelect"
import useDropdownData from "../../../../hooks/useDropdownData"
import useApiData from "../../../../hooks/useApiData"
import RichText from "../../../../utils/RichText"

const initialFormData = {
  facultyName: { en: "", ar: "" },
  major: [],
  universities: [],
  facultyDescription: { en: "", ar: "" },
  featured: false,
  customURLSlug: {
    en: "",
    ar: "",
  },
}

export default function EditFaculty() {
  const { id } = useParams()
  const { filteredData, setSearchInput, handleAdd, handleRemove } = useDropdownData()
  const { language } = useLanguage()
  const [showDropdown, setShowDropdown] = useState({
    major: false,
    universities: false,
  })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [validationErrors, setValidationErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { data, updateWithOutById } = useApiData(`https://edu-brink-backend.vercel.app/api/faculty/${id}`)

  useEffect(() => {
    if (data) {
      setFormData({
        facultyName: {
          en: data?.facultyName?.en || "",
          ar: data?.facultyName?.ar || "",
        },
        major: data?.major || [],
        universities: data?.universities || [],
        facultyDescription: {
          en: data?.facultyDescription?.en || "",
          ar: data?.facultyDescription?.ar || "",
        },
        facultyFeatured: data?.facultyFeatured ?? false,
        customURLSlug: {
          en: data?.customURLSlug?.en || "",
          ar: data?.customURLSlug?.ar || "",
        },
      })
    }
  }, [data])

  const validateField = (name, value) => {
    let error = ""

    if (name.includes("facultyName")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || value.trim() === "") {
        error = lang === "en" ? "Faculty name is required" : "اسم الكلية مطلوب"
      } else if (value.length < 3) {
        error = lang === "en" ? "Faculty name must be at least 3 characters" : "يجب أن يكون اسم الكلية 3 أحرف على الأقل"
      }
    }

    if (name === "universities" && (!value || value.length === 0)) {
      error = "At least one university must be selected"
    }

    if (name.includes("facultyDescription")) {
      const lang = name.split(".")[1] // Extract language (en or ar)
      if (!value || value.trim() === "") {
        error = lang === "en" ? "Description is required" : "الوصف مطلوب"
      } else if (value.length < 20) {
        error = lang === "en" ? "Description must be at least 20 characters" : "يجب أن يكون الوصف 20 حرفًا على الأقل"
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

    if (nameParts.includes("facultyName")) {
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

    // Validate faculty names
    errors["facultyName.en"] = validateField("facultyName.en", formData.facultyName.en)
    errors["facultyName.ar"] = validateField("facultyName.ar", formData.facultyName.ar)

    // Validate universities
    errors["universities"] = validateField("universities", formData.universities)

    // Validate descriptions
    errors["facultyDescription.en"] = validateField("facultyDescription.en", formData.facultyDescription.en)
    errors["facultyDescription.ar"] = validateField("facultyDescription.ar", formData.facultyDescription.ar)

    setValidationErrors(errors)

    // Check if there are any errors
    return !Object.values(errors).some((error) => error !== "")
  }

  const handleRichTextChange = (content, lang) => {
    setFormData((prev) => ({
      ...prev,
      facultyDescription: {
        ...prev.facultyDescription,
        [lang]: content,
      },
    }))

    // Mark as touched
    setTouched((prev) => ({ ...prev, [`facultyDescription.${lang}`]: true }))

    // Validate
    const error = validateField(`facultyDescription.${lang}`, content)
    setValidationErrors((prev) => ({
      ...prev,
      [`facultyDescription.${lang}`]: error,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = {
      "facultyName.en": true,
      "facultyName.ar": true,
      universities: true,
      "facultyDescription.en": true,
      "facultyDescription.ar": true,
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
      const updatedFormData = {
        ...formData,
        universities: formData.universities.map((universities) => universities._id),
        major: formData.major.map((major) => major._id),
      }
      await updateWithOutById(updatedFormData)

      navigate(`/${language}/admin/faculties`)
    } catch (err) {
      console.error("Error updating faculty:", err)
      setError(err.message || "Failed to update faculty")
      window.scrollTo(0, 0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/faculties`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Faculties
        </button>
        <h1 className="text-2xl font-bold">Edit Faculty</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div>
            <InputField
              label="Faculty Name (English)"
              type="text"
              name="facultyName.en"
              placeholder="Faculty Name"
              value={formData?.facultyName?.en}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="facultyName"
              variant={3}
              error={touched["facultyName.en"] ? validationErrors["facultyName.en"] : ""}
            />
          </div>

          <div>
            <InputField
              label="اسم الكلية (عربي)"
              type="text"
              name="facultyName.ar"
              placeholder="اسم الكلية"
              value={formData?.facultyName?.ar}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoComplete="facultyName"
              variant={3}
              error={touched["facultyName.ar"] ? validationErrors["facultyName.ar"] : ""}
            />
          </div>

          <div className="col-span-2">
            <DropdownSelect
              label="Enrolled Major "
              placeholder="Major List"
              icon={CalendarPlus2}
              disabled={true}
              selectedItems={formData?.major}
              searchKey="majorName"
              options={filteredData?.majors}
              onSearch={(value) => setSearchInput((prev) => ({ ...prev, majorname: value }))}
              onSelect={(major) => handleAdd("major", major, setFormData, setShowDropdown)}
              onRemove={(id) => handleRemove("major", id, setFormData)}
              language="en"
              dropdownKey="major"
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          </div>

          <div className="col-span-2">
            <DropdownSelect
              label="Enroll University (التسجيل في الجامعة)"
              placeholder="Select a university"
              icon={School}
              selectedItems={formData?.universities}
              searchKey="uniName"
              options={filteredData?.universities}
              onSearch={(value) => setSearchInput((prev) => ({ ...prev, univername: value }))}
              onSelect={(university) => {
                handleAdd("universities", university, setFormData, setShowDropdown)

                // Mark as touched
                setTouched((prev) => ({ ...prev, universities: true }))

                // Validate
                const updatedUniversities = [...formData.universities, university]
                const error = validateField("universities", updatedUniversities)
                setValidationErrors((prev) => ({
                  ...prev,
                  universities: error,
                }))
              }}
              onRemove={(id) => {
                handleRemove("universities", id, setFormData)

                // Validate
                const updatedUniversities = formData.universities.filter((uni) => uni._id !== id)
                const error = validateField("universities", updatedUniversities)
                setValidationErrors((prev) => ({
                  ...prev,
                  universities: error,
                }))
              }}
              language="en"
              dropdownKey="universities"
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              error={touched["universities"] ? validationErrors["universities"] : ""}
            />
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

          <div className="col-span-2">
            <RichText
              label="Faculty Description (English)"
              value={formData?.facultyDescription?.en || ""}
              onChange={(content) => handleRichTextChange(content, "en")}
              error={touched["facultyDescription.en"] ? validationErrors["facultyDescription.en"] : ""}
            />
          </div>
          <div className="col-span-2">
            <RichText
              label="وصف الكلية (عربي)"
              value={formData?.facultyDescription?.ar || ""}
              onChange={(content) => handleRichTextChange(content, "ar")}
              error={touched["facultyDescription.ar"] ? validationErrors["facultyDescription.ar"] : ""}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Faculty
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/${language}/admin/faculties`)}
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
                Save Faculty
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

