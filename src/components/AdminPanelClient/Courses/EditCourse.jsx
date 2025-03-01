"use client";

import React, { useState, forwardRef, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
  BookOpen,
  Search,
  CalendarPlus2,
  X,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import ReactQuill from "react-quill";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";

const QuillWrapper = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

QuillWrapper.displayName = "QuillWrapper";

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
  university: "",
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
  StudyLevel: [],
  Languages: [],
  Requirements: [],
  scholarshipsAvailable: false,
  DiscountAvailable: false,
  MostPopular: false,
};

const courseTypes = ["Bachelor", "Master", "PhD", "Diploma", "Certificate"];
const studyModes = ["Full-time", "Part-time", "Online", "Blended"];
const studyModesAr = ["دوام كامل", "دوام جزئي", "عبر الإنترنت", "مختلط"];
const studyLevels = ["Beginner", "Intermediate", "Advanced"];
const languages = ["English", "French", "German", "Spanish"];
const admissionRequirements = [
  "High School Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "IELTS",
  "TOEFL",
];

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "blockquote",
  "align",
];

export default function EditCourse() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { filteredUniversities, addTags } = useDropdownData();
  const { data, updateWithOutById } = useApiData(
    `https://edu-brink-backend.vercel.app/api/course/${id}`
  );

  console.log(addTags);

  useEffect(() => {
    if (data) {
      setFormData({
        CourseName: {
          en: data?.CourseName?.en || "",
          ar: data?.CourseName?.ar || "",
        },
        CourseDescription: {
          en: data?.CourseDescription?.en || "",
          ar: data?.CourseDescription?.ar || "",
        },
        DeadLine: data?.DeadLine || null,
        university: data?.university?._id || "",
        uniName: {
          en: data?.uniName?.en || "",
          ar: data?.uniName?.ar || "",
        },
        CourseType: data?.CourseType || "",
        ModeOfStudy: {
          en: Array.isArray(data?.ModeOfStudy?.en)
            ? data?.ModeOfStudy?.en
            : Array.isArray(data?.ModeOfStudy)
            ? data?.ModeOfStudy.map((item) => item.en).filter(Boolean)
            : [], // ✅ Convert old format to new format
          ar: Array.isArray(data?.ModeOfStudy?.ar)
            ? data?.ModeOfStudy?.ar
            : Array.isArray(data?.ModeOfStudy)
            ? data?.ModeOfStudy.map((item) => item.ar).filter(Boolean)
            : [], // ✅ Convert old format to new format
        },
        Tags: {
          en: Array.isArray(data?.Tags?.en) ? data?.Tags.en : [],
          ar: Array.isArray(data?.Tags?.ar) ? data?.Tags.ar : [],
        },
        CourseDuration: data?.CourseDuration || "",
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
        scholarshipsAvailable: !!data?.scholarshipsAvailable,
        DiscountAvailable: !!data?.DiscountAvailable,
        MostPopular: !!data?.MostPopular,
      });
    }
  }, [data]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFlagPicker, setShowFlagPicker] = useState(false);
  const [flagSearch, setFlagSearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const [newItem, setNewItem] = useState("");
  const [searchInput, setSearchInput] = useState({ tagEn: "", tagAr: "" });
  const [showDropdown, setShowDropdown] = useState({
    tagEn: false,
    tagAr: false,
  });

  // Extract English & Arabic tags from addTags
  const tagOptions = {
    tagEn: addTags[0]?.tags?.en || [],
    tagAr: addTags[0]?.tags?.ar || [],
  };

  // Filter tags based on search input
  const filteredTags = {
    tagEn: tagOptions.tagEn.filter((tag) =>
      tag.toLowerCase().includes(searchInput.tagEn.toLowerCase())
    ),
    tagAr: tagOptions.tagAr.filter((tag) =>
      tag.toLowerCase().includes(searchInput.tagAr.toLowerCase())
    ),
  };

  // Toggle dropdown visibility
  const toggleDropdown = (key) => {
    setShowDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle tag selection
  const onSelect = (key, tag, drop) => {
    setFormData((prev) => ({
      ...prev,
      Tags: {
        ...prev.Tags,
        [key]: prev.Tags[key].includes(tag)
          ? prev.Tags[key]
          : [...prev.Tags[key], tag], // Prevent duplicates
      },
    }));

    setShowDropdown((prev) => ({ ...prev, [drop]: false })); // Close dropdown
  };

  // Handle tag removal
  const onRemove = (key, tag) => {
    setFormData((prev) => ({
      ...prev,
      Tags: {
        ...prev.Tags,
        [key]: prev.Tags[key].filter((t) => t !== tag), // Remove the tag
      },
    }));
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote"],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const [activeSection, setActiveSection] = useState(null);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nameParts = name.split(/[\[\].]+/); // Split name into parts (e.g., Requirements[0].en)

    let temp = { ...formData }; // Clone the form data to avoid direct mutation

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

    // setValidationErrors((prevErrors) => {
    //   if (prevErrors[name]) {
    //     const updatedErrors = { ...prevErrors };
    //     delete updatedErrors[name]; // Remove the error for this field
    //     return updatedErrors;
    //   }
    //   return prevErrors;
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { uniName, ...updatedFormData } = {
        ...formData,
      };

      console.log(updatedFormData);

      await updateWithOutById(updatedFormData);
      navigate(`/${language}/admin/courses`);
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field) => {
    if (!newItem.trim()) return; // Prevent empty values

    setFormData((prev) => {
      const fieldPath = field.split(".");
      const fieldKey = fieldPath[0]; // "keywords"
      const subKey = fieldPath[1]; // "en"

      if (subKey) {
        // Get existing array
        const existingItems = prev[fieldKey]?.[subKey] || [];

        // Prevent duplicates
        if (existingItems.includes(newItem)) return prev;

        return {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            [subKey]: [...existingItems, newItem],
          },
        };
      } else {
        // Get existing array
        const existingItems = prev[field] || [];

        // Prevent duplicates
        if (existingItems.includes(newItem)) return prev;

        return {
          ...prev,
          [field]: [...existingItems, newItem],
        };
      }
    });

    setNewItem(""); // Clear input field
  };

  const removeItem = (field, itemToRemove) => {
    setFormData((prev) => {
      const fieldPath = field.split(".");
      const fieldKey = fieldPath[0]; // "keywords"
      const subKey = fieldPath[1]; // "en"

      if (subKey) {
        return {
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            [subKey]: prev[fieldKey]?.[subKey]?.filter(
              (item) => item !== itemToRemove
            ),
          },
        };
      } else {
        return {
          ...prev,
          [field]: prev[field].filter((item) => item !== itemToRemove),
        };
      }
    });
  };
  const renderArrayField = (field, label, icon, placeholder, options) => {
    const fieldPath = field.split("."); // Split nested field (e.g., ["ModeOfStudy", "en"])
    const fieldKey = fieldPath[0]; // First key (e.g., "ModeOfStudy")
    const subKey = fieldPath[1]; // Second key (e.g., "en")

    const items = subKey
      ? Array.isArray(formData?.[fieldKey]?.[subKey])
        ? formData[fieldKey][subKey]
        : []
      : Array.isArray(formData?.[fieldKey])
      ? formData[fieldKey]
      : [];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          {options ? (
            // Dropdown Select if options exist
            <select
              value={activeSection === field ? newItem : ""}
              onChange={(e) => {
                setNewItem(e.target.value);
                setActiveSection(field);
              }}
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            // Text Input if no options are provided
            <input
              type="text"
              value={activeSection === field ? newItem : ""}
              onChange={(e) => {
                setNewItem(e.target.value);
                setActiveSection(field);
              }}
              placeholder={placeholder}
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          {items.map((item, index) => (
            <div
              key={index}
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
      </div>
    );
  };

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
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
                autoComplete="courseName"
                variant={3}
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
                autoComplete="courseName"
                variant={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description (English)
              </label>
              <div className="prose max-w-none">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <QuillWrapper
                    theme="snow"
                    value={formData.CourseDescription.en}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        CourseDescription: {
                          ...prev.CourseDescription,
                          en: content,
                        },
                      }))
                    }
                    modules={modules}
                    formats={formats}
                    className="h-64"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الدورة (باللغة الإنجليزية)
              </label>
              <div className="prose max-w-none">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <QuillWrapper
                    theme="snow"
                    value={formData.CourseDescription.ar}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        CourseDescription: {
                          ...prev.CourseDescription,
                          ar: content,
                        },
                      }))
                    }
                    modules={modules}
                    formats={formats}
                    className="h-64"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="Deadline"
                type="date"
                name="DeadLine"
                value={
                  formData?.DeadLine ? formData?.DeadLine.slice(0, 10) : ""
                }
                onChange={handleInputChange}
                autoComplete="deadLine"
                variant={3}
              />
            </div>

            <div>
              <InputField
                label="Course Type"
                type="select"
                name="CourseType"
                value={formData?.CourseType || ""}
                onChange={handleInputChange}
                options={courseTypes.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
              />
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="Course Duration"
                type="text"
                name="CourseDuration"
                placeholder="e.g., 6 months, 1 year"
                value={formData?.CourseDuration || ""}
                onChange={handleInputChange}
                autoComplete="courseDuration"
                variant={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFlagPicker(!showFlagPicker)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.uniName?.en ||
                        formData?.university ||
                        "Select University"}{" "}
                      {/* Placeholder if name is empty */}
                    </span>
                  </span>
                  <BookOpen className="w-5 h-5 text-gray-400" />
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
                      {filteredUniversities.map((university) => (
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
                            }));
                            setShowFlagPicker(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-gray-400 text-sm">
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {renderArrayField(
            "ModeOfStudy.en",
            "Study Mode (English)",
            <Languages className="w-4 h-4" />,
            "Add New Mode...",
            studyModes
          )}
          {renderArrayField(
            "ModeOfStudy.ar",
            "وضع الدراسة (الإنجليزية)",
            <Languages className="w-4 h-4" />,
            "Add New Mode...",
            studyModesAr
          )}

          {renderArrayField(
            "StudyLevel",
            "Study Levels",
            <GraduationCap className="w-4 h-4" />,
            "Add study level...",
            studyLevels
          )}
          {renderArrayField(
            "Languages",
            "Languages of Instruction",
            <Languages className="w-4 h-4" />,
            "Add language...",
            languages
          )}
          {renderArrayField(
            "Requirements",
            "Admission Requirements",
            <FileCheck className="w-4 h-4" />,
            "Add requirement...",
            admissionRequirements
          )}
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
              autoComplete="courseFees"
              variant={3}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(key)}
                      className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                    >
                      <span className="text-gray-600">
                        {searchInput[key] || "Select Tags..."}
                      </span>
                      <Search className="w-5 h-5 text-gray-400" />
                    </button>

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
                            <div className="p-4 text-gray-500 text-center">
                              No results found
                            </div>
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
  );
}
