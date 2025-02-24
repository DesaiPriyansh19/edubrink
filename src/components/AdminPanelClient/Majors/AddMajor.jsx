import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Building2,
  Languages,
  FileCheck,
  Award,
  Clock,
  Calendar,
  BookOpen,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLanguage } from "../../../../context/LanguageContext";

const initialFormData = {
  name: "",
  faculty_id: "",
  description: "",
  duration: "",
  duration_unit: "Years",
  study_levels: [],
  languages: [],
  admission_requirements: [],
  tuition_fees: "",
  scholarships_available: false,
  featured: false,
  intake_year: new Date().getFullYear().toString(),
  intake_months: [],
  mode_of_study: "Full-time",
  express_admission: false,
  entrance_exam_required: false,
};

const studyLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
const languages = [
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
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [faculties, setFaculties] = useState([]);
  const [newItems, setNewItems] = useState({
    study_levels: "",
    languages: "",
    admission_requirements: "",
    intake_months: "",
  });
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

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const { data, error } = await supabase
        .from("faculties")
        .select(
          `
          *,
          university:universities(
            name,
            country:countries(name)
          )
        `
        )
        .order("name");

      if (error) throw error;
      setFaculties(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, faculty_id: data[0].id }));
      }
    } catch (err) {
      console.error("Error fetching faculties:", err);
      setError("Failed to load faculties");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("majors").insert([
        {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;
      navigate("/majors");
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

  const renderArrayField = (field, label, icon, placeholder, options) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 mb-2">
        {options ? (
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
    </div>
  );

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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty
              </label>
              <select
                value={formData.faculty_id}
                onChange={(e) =>
                  setFormData({ ...formData, faculty_id: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name} - {faculty.university.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode of Study
              </label>
              <select
                value={formData.mode_of_study}
                onChange={(e) =>
                  setFormData({ ...formData, mode_of_study: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {studyModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 4"
                  required
                />
                <select
                  value={formData.duration_unit}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_unit: e.target.value })
                  }
                  className="w-40 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {durationUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intake Year
              </label>
              <input
                type="number"
                value={formData.intake_year}
                onChange={(e) =>
                  setFormData({ ...formData, intake_year: e.target.value })
                }
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 5}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tuition Fees
              </label>
              <input
                type="text"
                value={formData.tuition_fees}
                onChange={(e) =>
                  setFormData({ ...formData, tuition_fees: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., $20,000 - $30,000"
              />
            </div>
          </div>

          <div className="space-y-6">
            {renderArrayField(
              "study_levels",
              "Study Levels",
              <GraduationCap className="w-4 h-4" />,
              "Add study level...",
              studyLevels
            )}
            {renderArrayField(
              "languages",
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
              admissionRequirements
            )}
            {renderArrayField(
              "intake_months",
              "Intake Months",
              <Calendar className="w-4 h-4" />,
              "Add month...",
              months
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="prose max-w-none">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <QuillWrapper
                  ref={quillRef}
                  theme="snow"
                  value={formData.description}
                  onChange={(content) =>
                    setFormData({ ...formData, description: content })
                  }
                  modules={modules}
                  formats={formats}
                  className="h-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="scholarships"
                checked={formData.scholarships_available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scholarships_available: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="scholarships"
                className="text-sm font-medium text-gray-700"
              >
                Scholarships Available
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="express"
                checked={formData.express_admission}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    express_admission: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="express"
                className="text-sm font-medium text-gray-700"
              >
                Express Admission
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="entrance"
                checked={formData.entrance_exam_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entrance_exam_required: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="entrance"
                className="text-sm font-medium text-gray-700"
              >
                Entrance Exam Required
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700"
              >
                Featured Major
              </label>
            </div>
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
