import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
  Calendar,
  BookOpen,
  Flag,
  Search,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";

const initialFormData = {
  majorName: {
    en: "",
    ar: "",
  },
  faculty: "",
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

// Create a properly typed wrapper for ReactQuill

const QuillWrapper = forwardRef((props, ref) => (
  <ReactQuill
    ref={ref}
    theme={props.theme || "snow"}
    value={props.value}
    onChange={props.onChange}
    modules={props.modules}
    formats={props.formats}
    className={props.className}
  />
));

QuillWrapper.displayName = "QuillWrapper";

export default function AddMajor() {
  const { filteredData } = useDropdownData();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFlagPicker, setShowFlagPicker] = useState(false);
  const [flagSearch, setFlagSearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [newItems, setNewItems] = useState({
    studyLevel: "",
    majorLanguages: "",
    majorAdmissionRequirement: "",
    majorIntakeMonth: "",
  });
  const { addNew } = useApiData(
    "https://edu-brink-backend.vercel.app/api/majors"
  );
  const [activeSection, setActiveSection] = useState(null);
  const quillRef = useRef(null);

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
      const { facultyName, ...updatedFormData } = {
        ...formData,
      };

      console.log(updatedFormData);
      await addNew(updatedFormData);
      navigate(`/${language}/admin/majors`);
    } catch (err) {
      console.error("Error adding major:", err);
      setError(err.message || "Failed to add major");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field) => {
    const newItem = newItems[field];
    if (newItem && !formData[field].includes(newItem)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], newItem],
      }));
      setNewItems((prev) => ({ ...prev, [field]: "" }));
      setActiveSection(null);
    }
  };

  const removeItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };

  const filterFacultyData = filteredData.faculties.filter(
    (country) =>
      country.facultyName.en.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.facultyName.ar.toLowerCase().includes(flagSearch.toLowerCase())
  );

  const renderArrayField = (field, label, icon, placeholder, options) => {
    const fieldPath = field.split("."); // Split nested field (e.g., ["keywords", "en"])
    const fieldKey = fieldPath[0]; // First key (e.g., "keywords")
    const subKey = fieldPath[1]; // Second key (e.g., "en")

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          {options ? (
            // Dropdown select if options exist
            <select
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }));
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
            // Text input if no options are provided
            <input
              type="text"
              value={activeSection === field ? newItems[field] : ""}
              onChange={(e) => {
                setNewItems((prev) => ({ ...prev, [field]: e.target.value }));
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
          {subKey
            ? formData?.[fieldKey]?.[subKey]?.map((item) => (
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
            : formData?.[fieldKey]?.map((item) => (
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
        <h1 className="text-2xl font-bold">Add New Major</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Major Name (English)"
              type="text"
              name="majorName.en"
              placeholder="Major Name"
              value={formData?.majorName?.en}
              onChange={handleInputChange}
              autoComplete="majorName"
              variant={3}
            />
            <InputField
              label="اسم التخصص (بالعربية)"
              type="text"
              name="majorName.ar"
              placeholder="اسم التخصص"
              value={formData?.majorName?.ar}
              onChange={handleInputChange}
              autoComplete="majorName"
              variant={3}
            />

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
                placeholder="e.g., 4"
                required
                variant={3}
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

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFlagPicker(!showFlagPicker)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <span className="flex items-center">
                    <span className="py-1 text-gray-600">
                      {formData?.facultyName?.en ||
                        formData?.faculty ||
                        "Select Flag"}{" "}
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
                      {filterFacultyData.map((faculty) => (
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
                            setShowFlagPicker(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-gray-400 text-sm">
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
                placeholder="e.g., $20,000 - $30,000"
                variant={3}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Major Description (English)
            </label>
            <div className="prose max-w-none">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <QuillWrapper
                  ref={quillRef}
                  theme="snow"
                  value={formData.majorDescription.en}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      majorDescription: {
                        ...prev.majorDescription,
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

          <div>
            {/* Arabic Major Description */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف التخصص (عربي)
            </label>
            <div className="prose max-w-none">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <QuillWrapper
                  ref={quillRef}
                  theme="snow"
                  value={formData.majorDescription?.ar || ""} // Ensure it's a string
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      majorDescription: {
                        ...prev.majorDescription,
                        ar: content, // Update Arabic description
                      },
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  className="h-64 " // Add RTL styling
                />
              </div>
            </div>
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
            onClick={() => navigate("/majors")}
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
