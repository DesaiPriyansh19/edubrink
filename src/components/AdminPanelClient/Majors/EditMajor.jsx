"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
  Calendar,
  BookOpen,
  Search,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";
import RichText from "../../../../utils/RichText";

const initialFormData = {
  majorName: {
    en: "",
    ar: "",
  },
  faculty: "",
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
  facultyName: {
    en: "",
    ar: "",
  },
  majorIntakeYear: new Date().getFullYear().toString(),
  majorIntakeMonth: [],
  modeOfStudy: "Full-time",
  majorCheckBox: {
    scholarshipsAvailable: false,
    expressAdmission: false,
    entranceExamRequired: false,
    featuredMajor: false,
  },
};

const studyLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
const majorLanguages = [
  "English",
  "French",
  "German",
  "Spanish",
  "Arabic",
  "Chinese",
];
const admissionRequirements = [
  "High School Diploma",
  "Bachelor Degree",
  "IELTS",
  "TOEFL",
  "GRE",
  "GMAT",
  "Motivation Letter",
  "Recommendation Letters",
];
const durationUnits = ["Years", "Months", "Weeks"];
const studyModes = [
  "Full-time",
  "Part-time",
  "Online",
  "Hybrid",
  "Distance Learning",
];
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
];

export default function EditMajor() {
  const { id } = useParams();
  const { filteredData } = useDropdownData();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [showUniversityPicker, setShowUniversityPicker] = useState(false);
  const [facultySearch, setFacultySearch] = useState("");
  const [universitySearch, setUniversitySearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [newItems, setNewItems] = useState({
    studyLevel: "",
    majorLanguages: "",
    majorAdmissionRequirement: "",
    majorIntakeMonth: "",
  });
  const { data, updateWithOutById } = useApiData(
    `https://edu-brink-backend.vercel.app/api/majors/${id}`
  );
  const [activeSection, setActiveSection] = useState(null);
  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData({
        majorName: {
          en: data?.majorName?.en || "",
          ar: data?.majorName?.ar || "",
        },
        faculty: data?.faculty?._id || "",
        university: data?.university?._id || "",
        majorDescription: {
          en: data?.majorDescription?.en || "",
          ar: data?.majorDescription?.ar || "",
        },
        duration: data?.duration || "",
        durationUnits: data?.durationUnits || "Years",
        studyLevel: data?.studyLevel || [],
        majorLanguages: data?.majorLanguages || [],
        majorAdmissionRequirement: data?.majorAdmissionRequirement || [],
        majorTuitionFees: data?.majorTuitionFees || "",
        facultyName: {
          en: data?.faculty?.facultyName?.en || "",
          ar: data?.faculty?.facultyName?.ar || "",
        },
        universityName: {
          en: data?.university?.uniName?.en || "",
          ar: data?.university?.uniName?.ar || "",
        },
        majorIntakeYear:
          data?.majorIntakeYear || new Date().getFullYear().toString(),
        majorIntakeMonth: data?.majorIntakeMonth || [],
        modeOfStudy: data?.modeOfStudy || "Full-time",
        majorCheckBox: {
          scholarshipsAvailable:
            data?.majorCheckBox?.scholarshipsAvailable ?? false,
          expressAdmission: data?.majorCheckBox?.expressAdmission ?? false,
          entranceExamRequired:
            data?.majorCheckBox?.entranceExamRequired ?? false,
          featuredMajor: data?.majorCheckBox?.featuredMajor ?? false,
        },
      });
    }
  }, [data]);

  const validateField = (name, value) => {
    let error = "";

    // Handle undefined or null values consistently
    if (value === undefined) {
      // For fields that access formData directly, try to get the value from formData
      if (name.includes(".")) {
        const parts = name.split(".");
        let currentValue = formData;
        for (const part of parts) {
          currentValue = currentValue?.[part];
          if (currentValue === undefined) break;
        }
        value = currentValue || "";
      } else {
        value = formData[name] || "";
      }
    }

    if (name.includes("majorName")) {
      const lang = name.split(".")[1]; // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Major name is required" : "اسم التخصص مطلوب";
      } else if (typeof value === "string" && value.length < 3) {
        error =
          lang === "en"
            ? "Major name must be at least 3 characters"
            : "يجب أن يكون اسم التخصص 3 أحرف على الأقل";
      }
    }

    if (name === "faculty" && (!value || value === "")) {
      error = "Faculty is required";
    }

    if (name === "university" && (!value || value === "")) {
      error = "University is required";
    }

    if (name === "duration") {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = "Duration is required";
      } else if (isNaN(value) || Number.parseFloat(value) <= 0) {
        error = "Duration must be a positive number";
      }
    }

    if (
      name === "majorTuitionFees" &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      error = "Tuition fees information is required";
    }

    if (name === "studyLevel") {
      const studyLevelArray = Array.isArray(value)
        ? value
        : formData.studyLevel || [];
      if (!studyLevelArray.length) {
        error = "At least one study level must be selected";
      }
    }

    if (name === "majorLanguages") {
      const languagesArray = Array.isArray(value)
        ? value
        : formData.majorLanguages || [];
      if (!languagesArray.length) {
        error = "At least one language must be selected";
      }
    }

    if (name === "majorIntakeMonth") {
      const monthsArray = Array.isArray(value)
        ? value
        : formData.majorIntakeMonth || [];
      if (!monthsArray.length) {
        error = "At least one intake month must be selected";
      }
    }

    if (name.includes("majorDescription")) {
      const lang = name.split(".")[1]; // Extract language (en or ar)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = lang === "en" ? "Description is required" : "الوصف مطلوب";
      } else if (typeof value === "string" && value.length < 20) {
        error =
          lang === "en"
            ? "Description must be at least 20 characters"
            : "يجب أن يكون الوصف 20 حرفًا على الأقل";
      }
    }

    return error;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nameParts = name.split(/[[\].]+/); // Split name into parts (e.g., Requirements[0].en)

    const temp = { ...formData }; // Clone the form data to avoid direct mutation

    // Dynamically navigate through the object based on nameParts
    nameParts.reduce((acc, part, index) => {
      if (index === nameParts.length - 1) {
        // Set the value for the last part (en or ar)
        acc[part] = type === "checkbox" ? checked : value;
      } else {
        // Navigate deeper into the nested object or array
        acc[part] = acc[part] || (isNaN(nameParts[index + 1]) ? {} : []);
      }
      return acc[part];
    }, temp);

    // Update formData state with the new temp object
    setFormData(temp);

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the field
    const error = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Validate major names
    errors["majorName.en"] = validateField(
      "majorName.en",
      formData.majorName?.en
    );
    errors["majorName.ar"] = validateField(
      "majorName.ar",
      formData.majorName?.ar
    );

    // Validate faculty and university
    errors["faculty"] = validateField("faculty", formData.faculty);
    errors["university"] = validateField("university", formData.university);

    // Validate duration
    errors["duration"] = validateField("duration", formData.duration);

    // Validate tuition fees
    errors["majorTuitionFees"] = validateField(
      "majorTuitionFees",
      formData.majorTuitionFees
    );

    // Validate arrays
    errors["studyLevel"] = validateField("studyLevel", formData.studyLevel);
    errors["majorLanguages"] = validateField(
      "majorLanguages",
      formData.majorLanguages
    );
    errors["majorIntakeMonth"] = validateField(
      "majorIntakeMonth",
      formData.majorIntakeMonth
    );

    // Validate descriptions
    errors["majorDescription.en"] = validateField(
      "majorDescription.en",
      formData.majorDescription?.en
    );
    errors["majorDescription.ar"] = validateField(
      "majorDescription.ar",
      formData.majorDescription?.ar
    );

    setValidationErrors(errors);

    // Check if there are any errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleRichTextChange = (content, lang) => {
    setFormData((prev) => ({
      ...prev,
      majorDescription: {
        ...prev.majorDescription,
        [lang]: content,
      },
    }));

    // Mark as touched
    setTouched((prev) => ({ ...prev, [`majorDescription.${lang}`]: true }));

    // Validate
    const error = validateField(`majorDescription.${lang}`, content);
    setValidationErrors((prev) => ({
      ...prev,
      [`majorDescription.${lang}`]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = {
      "majorName.en": true,
      "majorName.ar": true,
      faculty: true,
      university: true,
      duration: true,
      majorTuitionFees: true,
      studyLevel: true,
      majorLanguages: true,
      majorIntakeMonth: true,
      "majorDescription.en": true,
      "majorDescription.ar": true,
    };
    setTouched(allFields);

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { facultyName, universityName, ...updatedFormData } = {
        ...formData,
      };
      await updateWithOutById(updatedFormData);
      navigate(`/${language}/admin/majors`);
    } catch (err) {
      console.error("Error updating major:", err);
      setError(err.message || "Failed to update major");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field) => {
    const newItem = newItems[field];
    if (newItem && !formData[field].includes(newItem)) {
      const updatedItems = [...formData[field], newItem];
      setFormData((prev) => ({
        ...prev,
        [field]: updatedItems,
      }));
      setNewItems((prev) => ({ ...prev, [field]: "" }));
      setActiveSection(null);

      // Mark as touched
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate
      const error = validateField(field, updatedItems);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const removeItem = (field, item) => {
    const updatedItems = formData[field].filter((i) => i !== item);
    setFormData((prev) => ({
      ...prev,
      [field]: updatedItems,
    }));

    // Validate
    const error = validateField(field, updatedItems);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const filteredFacultyData = filteredData.faculties?.filter(
    (faculty) =>
      faculty.facultyName.en
        .toLowerCase()
        .includes(facultySearch.toLowerCase()) ||
      faculty.facultyName.ar.toLowerCase().includes(facultySearch.toLowerCase())
  );

  const filteredUniversityData = filteredData.universities?.filter(
    (university) =>
      university.uniName.en
        .toLowerCase()
        .includes(universitySearch.toLowerCase()) ||
      university.uniName.ar
        .toLowerCase()
        .includes(universitySearch.toLowerCase())
  );

  const renderArrayField = (field, label, icon, placeholder, options) => {
    const error = validationErrors[field];
    const isTouched = touched[field];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          {options ? (
            <select
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }));
                setActiveSection(field);
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
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }));
                setActiveSection(field);
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
          {formData[field].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
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
        {isTouched && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

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
        <h1 className="text-2xl font-bold">Edit Major</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Form validation summary */}
      {Object.values(validationErrors).some((error) => error !== "") &&
        Object.values(touched).some((t) => t) && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Please fix the following errors:</h3>
            </div>
            <ul className="list-disc pl-5">
              {Object.entries(validationErrors).map(([field, error]) =>
                error && touched[field] ? <li key={field}>{error}</li> : null
              )}
            </ul>
          </div>
        )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
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
                error={
                  touched["majorName.en"]
                    ? validationErrors["majorName.en"]
                    : ""
                }
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
                error={
                  touched["majorName.ar"]
                    ? validationErrors["majorName.ar"]
                    : ""
                }
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
                const year = new Date().getFullYear() + i;
                return { value: year, label: year }; // Generates years dynamically
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowUniversityPicker(!showUniversityPicker);
                    setShowFacultyPicker(false);
                    setTouched((prev) => ({ ...prev, university: true }));
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                    touched["university"] && validationErrors["university"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.universityName?.en ||
                        formData?.university ||
                        "Select University"}
                    </span>
                  </span>
                  <Building2 className="w-5 h-5 text-gray-400" />
                </button>

                {touched["university"] && validationErrors["university"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors["university"]}
                  </p>
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
                      {filteredUniversityData?.map((university) => (
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
                            }));
                            setShowUniversityPicker(false);

                            // Validate
                            const error = validateField(
                              "university",
                              university._id
                            );
                            setValidationErrors((prev) => ({
                              ...prev,
                              university: error,
                            }));
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-gray-700 text-sm">
                            {university?.uniName?.en} -{" "}
                            {university?.uniName?.ar}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Faculty Dropdown */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFacultyPicker(!showFacultyPicker);
                    setShowUniversityPicker(false);
                    setTouched((prev) => ({ ...prev, faculty: true }));
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                    touched["faculty"] && validationErrors["faculty"]
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.facultyName?.en ||
                        formData?.faculty ||
                        "Select Faculty"}
                    </span>
                  </span>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </button>

                {touched["faculty"] && validationErrors["faculty"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors["faculty"]}
                  </p>
                )}

                {showFacultyPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search Faculty..."
                          value={facultySearch}
                          onChange={(e) => setFacultySearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredFacultyData?.map((faculty) => (
                        <button
                          key={faculty._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              faculty: faculty._id, // Updating faculty ID
                              facultyName: {
                                ...prev.facultyName, // Preserve existing values
                                en: faculty.facultyName.en,
                                ar: faculty.facultyName.ar,
                              },
                            }));
                            setShowFacultyPicker(false);

                            // Validate
                            const error = validateField("faculty", faculty._id);
                            setValidationErrors((prev) => ({
                              ...prev,
                              faculty: error,
                            }));
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-black text-sm">
                            {faculty?.facultyName?.en} -{" "}
                            {faculty?.facultyName?.ar}
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
                error={
                  touched["majorTuitionFees"]
                    ? validationErrors["majorTuitionFees"]
                    : ""
                }
              />
            </div>
          </div>

          <div className="space-y-6">
            {renderArrayField(
              "studyLevel",
              "Study Levels",
              <GraduationCap className="w-4 h-4" />,
              "Add study level...",
              studyLevels
            )}
            {renderArrayField(
              "majorLanguages",
              "Languages of Instruction",
              <Languages className="w-4 h-4" />,
              "Add language...",
              majorLanguages
            )}
            {renderArrayField(
              "majorAdmissionRequirement",
              "Admission Requirements",
              <FileCheck className="w-4 h-4" />,
              "Add requirement...",
              admissionRequirements
            )}
            {renderArrayField(
              "majorIntakeMonth",
              "Intake Months",
              <Calendar className="w-4 h-4" />,
              "Add month...",
              months
            )}
          </div>

          <div>
            <RichText
              label="Major Description (English)"
              value={formData.majorDescription.en || ""}
              onChange={(content) => handleRichTextChange(content, "en")}
              error={
                touched["majorDescription.en"]
                  ? validationErrors["majorDescription.en"]
                  : ""
              }
            />
          </div>

          <div>
            <RichText
              label="وصف التخصص (عربي)"
              value={formData.majorDescription.ar || ""}
              onChange={(content) => handleRichTextChange(content, "ar")}
              error={
                touched["majorDescription.ar"]
                  ? validationErrors["majorDescription.ar"]
                  : ""
              }
            />
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
  );
}
