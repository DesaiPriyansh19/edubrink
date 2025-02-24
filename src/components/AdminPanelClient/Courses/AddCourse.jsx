"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  Languages,
  FileCheck,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import ImageUpload from "../../../../utils/ImageUpload";

const initialFormData = {
  name: "",
  university_id: "",
  type: "",
  study_mode: "",
  duration: "",
  study_levels: [],
  languages: [],
  admission_requirements: [],
  tuition_fees: "",
  description: "",
  scholarships_available: false,
  discount_available: false,
  most_popular: false,
};

const courseTypes = ["Bachelor", "Master", "PhD", "Diploma", "Certificate"];
const studyModes = ["Full-time", "Part-time", "Online", "Blended"];
const studyLevels = ["Beginner", "Intermediate", "Advanced"];
const languages = ["English", "French", "German", "Spanish"];
const admissionRequirements = [
  "High School Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "IELTS",
  "TOEFL",
];

export default function AddCourse() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [universities, setUniversities] = useState([]);
  const [newItems, setNewItems] = useState({
    study_levels: "",
    languages: "",
    admission_requirements: "",
  });
  const [activeSection, setActiveSection] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase.from("universities").select(`
        id,
        name,
        country (
          id,
          name
        )
      `);

      if (error) throw error;

      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setError(error.message || "Failed to fetch universities");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload image to Cloudinary if imageUrl exists
      let courseImageUrl = null;
      if (imageUrl) {
        const formData = new FormData();
        formData.append("file", imageUrl);
        formData.append("upload_preset", "your_cloudinary_upload_preset");
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        courseImageUrl = data.secure_url;
      }

      const { error: insertError } = await supabase.from("courses").insert([
        {
          ...formData,
          image_url: courseImageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;
      navigate("/courses");
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setImageUrl(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageUrl(null);
  };

  const addItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], newItems[field]],
    });
    setNewItems({ ...newItems, [field]: "" });
    setActiveSection(null);
  };

  const removeItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const renderArrayField = (field, label, icon, placeholder, suggestions) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {formData[field].map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
          >
            <span className="text-sm text-gray-800">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(field, index)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={newItems[field]}
          onChange={(e) =>
            setNewItems({ ...newItems, [field]: e.target.value })
          }
          placeholder={placeholder}
          className="flex-grow border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => addItem(field)}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Image
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                imageUrl={imageUrl}
                onImageRemove={handleImageRemove}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <select
                value={formData.university_id}
                onChange={(e) =>
                  setFormData({ ...formData, university_id: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name} ({university.country.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Course Type</option>
                {courseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Mode
              </label>
              <select
                value={formData.study_mode}
                onChange={(e) =>
                  setFormData({ ...formData, study_mode: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Study Mode</option>
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
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 6 months, 1 year"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
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
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
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
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., $5,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.scholarships_available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scholarships_available: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Scholarships Available
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.discount_available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_available: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Discount Available</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.most_popular}
                onChange={(e) =>
                  setFormData({ ...formData, most_popular: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Most Popular Course</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/courses")}
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
