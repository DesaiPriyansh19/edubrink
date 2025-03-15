"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Mail, User, Shield, Users, ShieldCheck, UserCog } from "lucide-react"
import useApiData from "../../../../hooks/useApiData"
import { useLanguage } from "../../../../context/LanguageContext"
import { useNavigate } from "react-router-dom"

const initialFormData = {
  FullName: "",
  Email: "",
  Password: "",
  isAdmin: false,
  ActionStatus: "Viewer",
  verified: false,
  Status: "Active",
  Gender: "Male",
}

const actionStatus = ["Viewer", "Admin", "Editor"]
const genders = ["Male", "Female", "Non-Binary"]
const status = ["Active", "Not Active"]

export default function AddUser() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { error: resError, addNew } = useApiData("https://edu-brink-backend.vercel.app/api/users/admin")

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const formRef = useRef(null)

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Function to validate password strength
  const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  // Validate a specific field
  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "FullName":
        if (!value.trim()) {
          error = "Full Name is required"
        } else if (value.trim().length < 3) {
          error = "Full Name must be at least 3 characters"
        }
        break
      case "Email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!isValidEmail(value)) {
          error = "Please enter a valid email address"
        }
        break
      case "Password":
        if (!value.trim()) {
          error = "Password is required"
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters"
        } else if (!isStrongPassword(value)) {
          error = "Password must include uppercase, lowercase, and numbers"
        }
        break
      default:
        break
    }

    return error
  }

  // Handle field blur to mark as touched
  const handleBlur = (e) => {
    const { name, value } = e.target

    // Mark the field as touched
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // If field has been touched, validate on change
    if (touchedFields[name]) {
      const error = validateField(name, newValue)
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ["FullName", "Email", "Password"]
    const newTouchedFields = allFields.reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {})
    setTouchedFields(newTouchedFields)

    // Validate all fields
    const errors = {}
    let hasErrors = false

    allFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        errors[field] = error
        hasErrors = true
      }
    })

    setValidationErrors(errors)

    // If there are errors, scroll to the first error field and stop submission
    if (hasErrors) {
      const firstErrorField = allFields.find((field) => errors[field])
      if (firstErrorField && formRef.current) {
        const errorElement = formRef.current.querySelector(`[name="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
          errorElement.focus()
        }
      }
      return
    }

    setLoading(true)
    setError(null)

    try {
      const updatedFormData = {
        ...formData,
        isAdmin: formData.ActionStatus === "Admin" ? true : false,
      }

      await addNew(updatedFormData)

      setSuccess(true)

      setTimeout(() => {
        setFormData(initialFormData)
        setSuccess(false)
      }, 3000)
      navigate(`/${language}/admin/users`)
    } catch (err) {
      console.error("Error adding user:", err)
      setError(err.message || "Failed to add user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/users`)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:bg-gray-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300">
            Back to Users
          </span>
        </button>
        <h1 className="text-2xl font-bold animate-fade-in">Add New User</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-shake">{error}</div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg animate-fade-in">
          User added successfully!
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 transition-all duration-500 hover:shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="FullName"
                value={formData.FullName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border ${
                  validationErrors.FullName && touchedFields.FullName ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
              />
            </div>
            {validationErrors.FullName && touchedFields.FullName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.FullName}</p>
            )}
          </div>

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border ${
                  validationErrors.Email && touchedFields.Email ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
              />
            </div>
            {validationErrors.Email && touchedFields.Email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.Email}</p>
            )}
          </div>

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Shield className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 border ${
                  validationErrors.Password && touchedFields.Password ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300`}
              />
            </div>
            {validationErrors.Password && touchedFields.Password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.Password}</p>
            )}
          </div>

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="relative">
              <Users className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="Status"
                value={formData.Status || "Active"}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {status.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Restrict</label>
            <div className="relative">
              <UserCog className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="ActionStatus"
                value={formData.ActionStatus}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 appearance-none"
              >
                {actionStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-2 flex gap-4">
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-700">Verified User</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/${language}/admin/users`)}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Save User
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

