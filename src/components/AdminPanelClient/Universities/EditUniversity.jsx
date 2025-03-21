"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Building2,
  Languages,
  FileCheck,
  BookOpen,
  Tag,
  Search,
  BookDown,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";
import ArrayFieldAndPhotos from "../../../../utils/ArrayFieldAndPhotos";
import RichText from "../../../../utils/RichText";
import DropdownSelect from "../../../../utils/DropdownSelect";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";
import CampusSection from "./CampusSection";
import MetaArrayFields from "./MetaArrayFields";
import FaqSection from "../../../../utils/FaqSection";
import { getEmoji } from "../../../../libs/countryFlags";
const isWindows = navigator.userAgent.includes("Windows");

const initialFormData = {
  uniName: {
    en: "",
    ar: "",
  },
  study_programs: [],
  major: [],
  courseId: [],
  uniTutionFees: "",
  uniMainImage: "",
  uniCountry: {},
  countryName: { en: "", ar: "" },
  countryEmoji: "",
  countryCode: "",
  uniOverview: {
    en: "",
    ar: "",
  },
  uniAccomodation: {
    en: "",
    ar: "",
  },
  uniLibrary: {
    libraryPhotos: [],
    libraryDescription: {
      en: "",
      ar: "",
    },
  },
  uniSports: {
    sportsPhotos: [],
    sportsDescription: {
      en: "",
      ar: "",
    },
  },
  studentLifeStyleInUni: {
    lifestylePhotos: [],
    lifestyleDescription: {
      en: "",
      ar: "",
    },
  },
  uniStartDate: "",
  uniDeadline: "",
  uniType: "",
  spokenLanguage: [],
  scholarshipAvailability: false,
  admission_requirements: [],
  preparatory_year: false,
  preparatory_year_fees: "",
  housing_available: false,
  living_cost: "",
  uniFeatured: false,
  campuses: [
    {
      campusName: { en: "", ar: "" },
      campusLocation: {
        uniCity: { en: "", ar: "" },
        uniDescription: { en: "", ar: "" },
      },
      campusFacilities: [], // List of facilities available on the campus
    },
  ],
  faq: [{ faqQuestions: { en: "", ar: "" }, faqAnswers: { en: "", ar: "" } }],
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
};

const universityTypes = ["Public", "Private", "Research", "Technical"];

const studyPrograms = [
  "Engineering",
  "Medicine",
  "Business Administration",
  "Computer Science",
  "Law",
  "Arts and Humanities",
  "Social Sciences",
  "Natural Sciences",
  "Architecture",
];
const languages = [
  "English",
  "French",
  "German",
  "Spanish",
  "Arabic",
  "Chinese",
];
const commonRequirements = [
  "High School Diploma",
  "Bachelor Degree",
  "IELTS",
  "TOEFL",
  "GRE",
  "GMAT",
  "Motivation Letter",
  "Recommendation Letters",
];

export default function EditUniversity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [photosshow, setPhotosShow] = useState("LifeStyle");
  const [showFlagPicker, setShowFlagPicker] = useState(false);
  const [flagSearch, setFlagSearch] = useState("");
  const { filteredData, setSearchInput, handleAdd, handleRemove } =
    useDropdownData();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState({
    courses: false,
    major: false,
  });
  const { data, updateWithOutById } = useApiData(
    `https://edu-brink-backend.vercel.app/api/university/${id}`
  );

  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData((prevData) => ({
        ...initialFormData, // Start with the initial form structure

        uniName: {
          en: data?.uniName?.en || "",
          ar: data?.uniName?.ar || "",
        },
        major: data?.major || [],
        courseId: data?.courseId || [],
        uniSymbol: data?.uniSymbol || "",
        uniTutionFees: data?.uniTutionFees || "",
        uniMainImage: data?.uniMainImage || "",
        uniCountry: data?.uniCountry || null,
        countryName: {
          en: data?.uniCountry?.countryName?.en || "",
          ar: data?.uniCountry?.countryName?.ar || "",
        },
        countryCode: data?.uniCountry?.countryCode || "",
        countryEmoji: data?.uniCountry?.countryPhotos?.countryFlag || "",
        uniOverview: {
          en: data?.uniOverview?.en || "",
          ar: data?.uniOverview?.ar || "",
        },
        uniAccomodation: {
          en: data?.uniAccomodation?.en || "",
          ar: data?.uniAccomodation?.ar || "",
        },
        uniLibrary: {
          libraryPhotos: data?.uniLibrary?.libraryPhotos || [],
          libraryDescription: {
            en: data?.uniLibrary?.libraryDescription?.en || "",
            ar: data?.uniLibrary?.libraryDescription?.ar || "",
          },
        },
        uniSports: {
          sportsPhotos: data?.uniSports?.sportsPhotos || [],
          sportsDescription: {
            en: data?.uniSports?.sportsDescription?.en || "",
            ar: data?.uniSports?.sportsDescription?.ar || "",
          },
        },
        studentLifeStyleInUni: {
          lifestylePhotos: data?.studentLifeStyleInUni?.lifestylePhotos || [],
          lifestyleDescription: {
            en: data?.studentLifeStyleInUni?.lifestyleDescription?.en || "",
            ar: data?.studentLifeStyleInUni?.lifestyleDescription?.ar || "",
          },
        },
        uniStartDate: data?.uniStartDate || "",
        uniDeadline: data?.uniDeadline || "",
        uniType: data?.uniType || "",
        study_programs: data?.study_programs || "",
        spokenLanguage: data?.spokenLanguage || [],
        scholarshipAvailability: data?.scholarshipAvailability ?? false,
        admission_requirements: data?.admission_requirements || [],
        preparatory_year: data?.preparatory_year ?? false,
        preparatory_year_fees: data?.preparatory_year_fees || "",
        housing_available: data?.housing_available ?? false,
        living_cost: data?.living_cost || "",
        uniFeatured: data?.uniFeatured ?? false,
        faq: data?.faq?.length
          ? data.faq.map((item) => ({
              faqQuestions: {
                en: item?.faqQuestions?.en || "",
                ar: item?.faqQuestions?.ar || "",
              },
              faqAnswers: {
                en: item?.faqAnswers?.en || "",
                ar: item?.faqAnswers?.en || "",
              },
            }))
          : [
              {
                faqQuestions: { en: "", ar: "" },
                faqAnswers: { en: "", ar: "" },
              },
            ],

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
            en: data?.seo?.metaKeywords?.en || [],
            ar: data?.seo?.metaKeywords?.ar || [],
          },
        },
        customURLSlug: {
          en: data?.customURLSlug?.en || "",
          ar: data?.customURLSlug?.ar || "",
        },

        campuses: data?.campuses?.length
          ? data.campuses.map((campus) => ({
              campusName: {
                en: campus?.campusName?.en || "",
                ar: campus?.campusName?.ar || "",
              },
              campusLocation: {
                uniCity: {
                  en: campus?.campusLocation?.uniCity?.en || "",
                  ar: campus?.campusLocation?.uniCity?.ar || "",
                },
                uniDescription: {
                  en: campus?.campusLocation?.uniDescription?.en || "",
                  ar: campus?.campusLocation?.uniDescription?.ar || "",
                },
              },
              campusFacilities: campus?.campusFacilities || [],
            }))
          : [
              {
                campusName: { en: "", ar: "" },
                campusLocation: {
                  uniCity: { en: "", ar: "" },
                  uniDescription: { en: "", ar: "" },
                },
                campusFacilities: [],
              },
            ],
      }));
    }
  }, [data]);

  const { language } = useLanguage();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [newItems, setNewItems] = useState({
    study_programs: "",
    spokenLanguage: "",
    admission_requirements: "",
  });

  const filterCountryData = filteredData.countries?.filter(
    (country) =>
      country.countryName.en.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.countryName.ar.toLowerCase().includes(flagSearch.toLowerCase())
  );

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

    if (nameParts.includes("uniName")) {
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
    setFormData(temp);

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name]; // Remove the error for this field
        return updatedErrors;
      });
    }
  };

  const [activeSection, setActiveSection] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!formData.uniName.en) {
      errors["uniName.en"] = "University Name (English) is required";
    }
    if (!formData.uniName.ar) {
      errors["uniName.ar"] = "University Name (Arabic) is required";
    }
    if (!formData.uniType) {
      errors["uniType"] = "University Type is required";
    }
    if (!formData.uniTutionFees) {
      errors["uniTutionFees"] = "Tuition Fees is required";
    }
    if (!formData.uniMainImage) {
      errors["uniMainImage"] = "Main Image URL is required";
    }
    if (!formData.uniCountry) {
      errors["uniCountry"] = "Country is required";
    }
    if (formData.study_programs.length === 0) {
      errors["study_programs"] = "At least one study program is required";
    }
    if (formData.spokenLanguage.length === 0) {
      errors["spokenLanguage"] = "At least one language is required";
    }
    if (formData.admission_requirements.length === 0) {
      errors["admission_requirements"] =
        "At least one admission requirement is required";
    }
    if (!formData.seo.metaTitle.en) {
      errors["seo.metaTitle.en"] = "Meta Title (English) is required";
    }
    if (!formData.seo.metaTitle.ar) {
      errors["seo.metaTitle.ar"] = "Meta Title (Arabic) is required";
    }
    if (!formData.seo.metaDescription.en) {
      errors["seo.metaDescription.en"] =
        "Meta Description (English) is required";
    }
    if (!formData.seo.metaDescription.ar) {
      errors["seo.metaDescription.ar"] =
        "Meta Description (Arabic) is required";
    }
    if (!formData.customURLSlug.en) {
      errors["customURLSlug.en"] = "Custom URL (English) is required";
    }
    if (!formData.customURLSlug.ar) {
      errors["customURLSlug.ar"] = "Custom URL (Arabic) is required";
    }

    // Add these validation checks
    if (!formData.uniStartDate) {
      errors["uniStartDate"] = "University Start Date is required";
    }
    if (!formData.uniDeadline) {
      errors["uniDeadline"] = "Application Deadline is required";
    }
    if (!formData.living_cost) {
      errors["living_cost"] = "Living Cost is required";
    }
    if (!formData.uniAccomodation.en) {
      errors["uniAccomodation.en"] = "Accommodation (English) is required";
    }
    if (!formData.uniAccomodation.ar) {
      errors["uniAccomodation.ar"] = "Accommodation (Arabic) is required";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the validation errors before submitting");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { countryEmoji, countryName, ...updatedFormData } = {
        ...formData,
        courseId: formData.courseId.map((course) => course._id),
        major: formData.major.map((major) => major._id),
      };
      console.log(updatedFormData);

      await updateWithOutById(updatedFormData);
      navigate(`/${language}/admin/universities`);
    } catch (err) {
      console.error("Error updating university:", err);
      setError(err.message || "Failed to update university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMainPhotoChange = (index, field, value) => {
    setFormData((prevData) => {
      const keys = field.split("."); // Split the nested path into keys
      const updatedData = { ...prevData }; // Create a copy of the previous data

      // Traverse the nested structure to reach the target field
      let current = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {}; // Initialize if undefined
        }
        current = current[key];
      }

      // Update the specific field (last key in the path)
      const lastKey = keys[keys.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = []; // Ensure the target field is an array
      }
      current[lastKey][index] = value; // Update the value at the specified index

      return updatedData; // Return the updated form data
    });
  };

  const addItem = (field) => {
    const newItem = newItems[field];
    if (newItem) {
      setFormData((prev) => {
        // Check if the field exists in the form data
        if (!(field in prev)) {
          // If the field doesn't exist, create it as an array
          return {
            ...prev,
            [field]: [newItem],
          };
        }

        // If the field exists but is not an array, convert it to an array with the new item
        if (!Array.isArray(prev[field])) {
          console.warn(`Field ${field} is not an array, converting to array`);
          return {
            ...prev,
            [field]: [newItem],
          };
        }

        // If the field is an array and doesn't already include the item, add it
        if (!prev[field].includes(newItem)) {
          return {
            ...prev,
            [field]: [...prev[field], newItem],
          };
        }

        // If the item already exists in the array, return the unchanged state
        return prev;
      });

      setNewItems((prev) => ({ ...prev, [field]: "" }));
      setActiveSection(null);

      // Clear validation error for this field if it exists
      if (validationErrors[field]) {
        setValidationErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[field];
          return updatedErrors;
        });
      }
    }
  };

  const removeItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  const renderArrayField = (field, label, icon, placeholder, options) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {validationErrors[field] && (
        <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
      )}
      <div className="flex gap-2 mb-2">
        {options ? (
          <select
            value={activeSection === field ? newItems[field] : ""}
            onChange={(e) => {
              setNewItems((prev) => ({ ...prev, [field]: e.target.value }));
              setActiveSection(field);
            }}
            className={`flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              validationErrors[field] ? "border-red-500" : ""
            }`}
          >
            <option value="">Select {label}</option>
            {options.map((option) =>
              typeof option === "object" && option.value ? (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ) : (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
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
            className={`flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              validationErrors[field] ? "border-red-500" : ""
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
        {Array.isArray(formData[field]) ? (
          formData[field].map((item) => (
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
          ))
        ) : (
          <p className="text-sm text-gray-500">No items added yet</p>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    console.log("Form data structure:", Object.keys(formData));
    // Check specific fields that might be causing issues
    console.log("study_programs:", formData.study_programs);
    console.log("spokenLanguage:", formData.spokenLanguage);
    console.log("admission_requirements:", formData.admission_requirements);
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/universities`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Universities
        </button>
        <h1 className="text-2xl font-bold">Edit University</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="">
        <div className="space-y-6">
          <div className="grid grid-cols-1 bg-white rounded-lg shadow-md p-6  md:grid-cols-2 gap-6">
            <div className="mb-4 w-auto">
              <div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                {formData.uniSymbol ? (
                  <>
                    <div className="relative w-full h-full">
                      <img
                        src={formData.uniSymbol || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <button
                          onClick={() =>
                            setFormData((prevData) => ({
                              ...prevData,
                              uniSymbol: "",
                            }))
                          }
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <UploadWidget
                    uwConfig={{
                      cloudName: "edubrink",
                      uploadPreset: "EduBrinkImages",
                      multiple: false,
                      maxImageFileSize: 2000000,
                      folder: "university/Logo",
                    }}
                    setFormData={setFormData}
                    field="uniSymbol"
                    uploadName="Upload Logo"
                    id="upload_widget_logo"
                    className="text-xs text-black"
                  />
                )}
              </div>
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="University type (نوع الجامعة)"
                type="select"
                name="uniType"
                value={formData?.uniType}
                onChange={handleInputChange}
                variant={3}
                error={validationErrors["uniType"]}
                options={[
                  {
                    value: "",
                    label: "Select University Type (حدد نوع الجامعة)",
                  },
                  {
                    value: "public",
                    label: "Public (عام)",
                  },
                  {
                    value: "private",
                    label: "Private (خاص)",
                  },
                ]}
              />
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="University Name (English)"
                type="text"
                name="uniName.en"
                placeholder="University Name (English)"
                value={formData?.uniName?.en}
                onChange={handleInputChange}
                autoComplete="uniName"
                variant={3}
                error={validationErrors["uniName.en"]}
              />
            </div>
            <div className="mb-4 w-full">
              <InputField
                label="اسم الجامعة (عربي)"
                type="text"
                name="uniName.ar"
                placeholder="اسم الجامعة (عربي)"
                value={formData?.uniName?.ar}
                onChange={handleInputChange}
                autoComplete="uniName"
                variant={3}
                error={validationErrors["uniName.ar"]}
              />
            </div>

            <div className="col-span-2">
              <RichText
                label="University Description"
                value={formData.uniOverview.en || ""}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    uniOverview: {
                      ...prevData.uniOverview,
                      en: value,
                    },
                  }))
                }
              />
            </div>

            <div className="col-span-2">
              <RichText
                label="وصف الجامعة"
                value={formData.uniOverview.ar || ""}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    uniOverview: {
                      ...prevData.uniOverview,
                      ar: value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 bg-white rounded-lg shadow-md p-6 md:grid-cols-2 gap-6">
            <InputField
              label="University Start Date (تاريخ بدء الجامعة)"
              type="date"
              name="uniStartDate"
              value={formData?.uniStartDate || ""}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["uniStartDate"]}
            />

            <InputField
              label="Application Deadline (الموعد النهائي للتقديم)"
              type="date"
              name="uniDeadline"
              value={formData?.uniDeadline || ""}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["uniDeadline"]}
            />

            {/* UniLocation End */}

            <InputField
              label="Tuition Fees (per year)"
              type="text"
              name="uniTutionFees"
              placeholder="e.g., $20,000 "
              value={formData.uniTutionFees}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["uniTutionFees"]}
            />

            <InputField
              label="Living Cost (per month)"
              type="text"
              name="living_cost"
              placeholder="e.g., $800 - $1,200"
              value={formData.living_cost}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["living_cost"]}
            />

            <InputField
              label="Accommodation (English)"
              type="textarea"
              name="uniAccomodation.en"
              placeholder="Accommodation (English)"
              value={formData.uniAccomodation.en}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["uniAccomodation.en"]}
            />
            <InputField
              label="إقامة (عربي)"
              type="textarea"
              name="uniAccomodation.ar"
              placeholder="إقامة (عربي)"
              value={formData.uniAccomodation.ar}
              onChange={handleInputChange}
              variant={3}
              error={validationErrors["uniAccomodation.ar"]}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFlagPicker(!showFlagPicker)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <span className="flex gap-2 items-center">
                    {isWindows ? (
                      formData?.countryCode ? (
                        <div className="flex gap-2  items-center">
                          <img
                            src={`https://flagcdn.com/w320/${getEmoji(
                              formData?.countryCode
                            )}.png`}
                            alt="Country Flag"
                            className="w-4 h-4 object-cover rounded-full"
                          />
                          <span className="py-1 text-gray-600">
                            {formData?.countryName?.en ||
                              formData?.uniCountry.countryName?.en ||
                              "Select Country"}{" "}
                            {/* Placeholder if name is empty */}
                          </span>
                        </div>
                      ) : (
                        <span className="py-1 text-gray-600">
                          Select Country
                        </span>
                      )
                    ) : (
                      <>
                        <span>{formData?.countryEmoji}</span>
                        <span className="py-1 text-gray-600">
                          {formData?.countryName?.en ||
                            formData?.uniCountry?.countryName?.en ||
                            "Select Country"}{" "}
                          {/* Placeholder if name is empty */}
                        </span>
                      </>
                    )}
                  </span>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </button>

                {validationErrors["uniCountry"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors["uniCountry"]}
                  </p>
                )}

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
                      {filterCountryData?.map((country) => (
                        <button
                          key={country._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              uniCountry: country._id,
                              countryCode: country.countryCode,
                              countryName: {
                                ...prev.countryName, // Preserve existing values
                                en: country.countryName.en,
                                ar: country.countryName.ar,
                              },
                              countryEmoji: country.countryPhotos.countryFlag,
                            }));
                            setShowFlagPicker(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          {isWindows ? (
                            country?.countryCode ? (
                              <div className="flex gap-2 mt-2 items-center">
                                <img
                                  src={`https://flagcdn.com/w320/${getEmoji(
                                    country?.countryCode
                                  )}.png`}
                                  alt="Country Flag"
                                  className="w-4 h-4 object-cover rounded-full"
                                />
                                <p className="text-black text-sm">
                                  {language === "ar"
                                    ? country?.countryName?.ar
                                    : country?.countryName?.en}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[.6rem] font-medium">
                                No flag
                              </span>
                            )
                          ) : (
                            <>
                              <span>{country?.countryPhotos?.countryFlag}</span>
                              <span className="text-black text-sm">
                                {country?.countryName?.en} -{" "}
                                {country?.countryName?.ar}
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
          </div>

          <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
            {renderArrayField(
              "study_programs",
              "Study Programs",
              <Building2 className="w-4 h-4" />,
              "Add program...",
              studyPrograms
            )}
            {renderArrayField(
              "spokenLanguage",
              "Languages of Instruction",
              <Languages className="w-4 h-4" />,
              "Add language...",
              languages
            )}
            {renderArrayField(
              "admission_requirements",
              "Admission Requirements",
              <FileCheck className="w-4 h-4" />,
              "Add requirement...",
              commonRequirements
            )}
          </div>

          <div className="bg-white rounded-lg space-y-6 shadow-md p-6">
            <div className="w-full flex items-center gap-4 justify-between">
              <div className="w-full mb-4">
                <InputField
                  label="University Main Image URL (رابط الصورة الرئيسية للجامعة)"
                  type="text"
                  name="uniMainImage"
                  placeholder="Upload or enter image URL"
                  value={formData.uniMainImage || ""}
                  onChange={handleInputChange}
                  autoComplete="off"
                  variant={3}
                  error={validationErrors["uniMainImage"]}
                />
              </div>

              <div className=" whitespace-nowrap">
                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: false,
                    maxImageFileSize: 2000000,
                    folder: "university/MainImages",
                  }}
                  setFormData={setFormData}
                  field="uniMainImage"
                  uploadName="Upload Main Image"
                  id="upload_widget_mainImage"
                  className=" text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              {["LifeStyle", "Sports", "Library"].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotosShow(item)}
                  className={`relative px-5 py-2 rounded-md font-medium transition-all duration-300 
      ${
        item === photosshow
          ? "bg-[#eff6ff] text-[#294dd8] shadow-lg transform scale-105"
          : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
      }`}
                >
                  {item}
                  {item === photosshow && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#294dd8] "></span>
                  )}
                </button>
              ))}
            </div>

            {photosshow === "LifeStyle" && (
              <ArrayFieldAndPhotos
                title="Student Lifestyle in University (نمط حياة الطالب في الجامعة)"
                fields={[
                  {
                    label: "Lifestyle Description (English)",
                    name: "studentLifeStyleInUni.lifestyleDescription.en",
                    placeholder: "Lifestyle Description (English)",
                  },
                  {
                    label: "وصف أسلوب الحياة (عربي)",
                    name: "studentLifeStyleInUni.lifestyleDescription.ar",
                    placeholder: "وصف أسلوب الحياة (عربي)",
                  },
                ]}
                photosTitle={"Life Style"}
                fieldName="studentLifeStyleInUni"
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                handleMainPhotoChange={handleMainPhotoChange}
                uploadConfig={{
                  cloudName: "edubrink",
                  fieldName: "lifestylePhotos",
                  uploadPreset: "EduBrinkImages",
                  multiple: true,
                  maxImageFileSize: 2000000,
                  folder: "university/lifestyleImages",
                  uploadName: "Upload Lifestyle Photo",
                }}
                photosKey={"lifestylePhotos"}
              />
            )}

            {photosshow === "Sports" && (
              <ArrayFieldAndPhotos
                title="University Sports (الرياضة الجامعية)"
                fields={[
                  {
                    label: "Sports Description (English)",
                    name: "uniSports.sportsDescription.en",
                    placeholder: "Sports Description (English)",
                  },
                  {
                    label: "وصف الرياضة (عربي)",
                    name: "uniSports.sportsDescription.ar",
                    placeholder: "وصف الرياضة (عربي)",
                  },
                ]}
                fieldName="uniSports"
                photosTitle={"Sports"}
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                handleMainPhotoChange={handleMainPhotoChange}
                uploadConfig={{
                  cloudName: "edubrink",
                  fieldName: "sportsPhotos",
                  uploadPreset: "EduBrinkImages",
                  multiple: true,
                  maxImageFileSize: 2000000,
                  folder: "university/sportsImage",
                  uploadName: "Upload Sports Photo",
                }}
                photosKey={"sportsPhotos"}
              />
            )}

            {photosshow === "Library" && (
              <ArrayFieldAndPhotos
                title="University Library (مكتبة الجامعة)"
                fields={[
                  {
                    label: "Library Description (English)",
                    name: "uniLibrary.libraryDescription.en",
                    placeholder: "Library Description (English)",
                  },
                  {
                    label: "وصف المكتبة (عربي)",
                    name: "uniLibrary.libraryDescription.ar",
                    placeholder: "وصف المكتبة (عربي)",
                  },
                ]}
                fieldName="uniLibrary"
                photosTitle={"Library"}
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                handleMainPhotoChange={handleMainPhotoChange}
                uploadConfig={{
                  cloudName: "edubrink",
                  uploadPreset: "EduBrinkImages",
                  fieldName: "libraryPhotos",
                  multiple: true,
                  maxImageFileSize: 2000000,
                  folder: "university/libraryImages",
                  uploadName: "Upload Library Photo",
                }}
                photosKey="libraryPhotos"
              />
            )}

            <DropdownSelect
              label="Enrolled Major"
              placeholder="Select a Major"
              disabled={true}
              icon={BookDown}
              selectedItems={formData?.major}
              searchKey="majorName"
              options={filteredData.majors}
              onSearch={(value) =>
                setSearchInput((prev) => ({ ...prev, majorname: value }))
              }
              onSelect={(major) =>
                handleAdd("major", major, setFormData, setShowDropdown)
              }
              onRemove={(id) => handleRemove("major", id, setFormData)}
              language="en"
              dropdownKey="major"
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />

            <DropdownSelect
              label="Enrolled Course "
              placeholder="Select a Course"
              disabled={true}
              icon={BookOpen}
              selectedItems={formData?.courseId}
              searchKey="CourseName"
              options={filteredData.courses}
              onSearch={(value) =>
                setSearchInput((prev) => ({ ...prev, coursename: value }))
              }
              onSelect={(course) =>
                handleAdd("courseId", course, setFormData, setShowDropdown)
              }
              onRemove={(id) => handleRemove("courseId", id, setFormData)}
              language="en"
              dropdownKey="courses"
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
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

          <div className="bg-white rounded-lg shadow-md ">
            <CampusSection formData={formData} setFormData={setFormData} />
          </div>

          <div className="bg-white rounded-lg shadow-md ">
            <FaqSection formData={formData} setFormData={setFormData} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1  mt-10 mb-7 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <InputField
                  label="Preparatory Year Available"
                  type="checkbox"
                  name="preparatory_year"
                  checked={formData?.preparatory_year}
                  onChange={handleInputChange}
                  variant={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <InputField
                  label="Scholarship Availability "
                  type="checkbox"
                  name="scholarshipAvailability"
                  checked={formData?.scholarshipAvailability}
                  onChange={handleInputChange}
                  variant={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <InputField
                  label="Student Housing Available"
                  type="checkbox"
                  name="housing_available"
                  checked={formData?.housing_available}
                  onChange={handleInputChange}
                  variant={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <InputField
                  label="Entrance Exam Required"
                  type="checkbox"
                  name="entranceExamRequired"
                  checked={formData.entranceExamRequired}
                  onChange={handleInputChange}
                  variant={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <InputField
                  label="Featured University"
                  type="checkbox"
                  name="uniFeatured"
                  checked={formData?.uniFeatured}
                  onChange={handleInputChange}
                  variant={3}
                />
              </div>
            </div>

            {formData.preparatory_year && (
              <div>
                <InputField
                  label="Preparatory Year Fees"
                  type="text"
                  name="preparatory_year_fees"
                  placeholder="e.g., $15,000"
                  value={formData?.preparatory_year_fees}
                  onChange={handleInputChange}
                  autoComplete="preparatoryYearFees"
                  variant={3}
                />
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/${language}/admin/universities`)}
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
                    Save University
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
