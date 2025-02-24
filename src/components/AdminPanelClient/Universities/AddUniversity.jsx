import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Building2,
  GraduationCap,
  Languages,
  FileCheck,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";

const initialFormData = {
  name: "",
  country_id: "",
  type: "Public",
  description: "",
  website: "",
  study_levels: [],
  study_programs: [],
  languages: [],
  admission_requirements: [],
  tuition_fees: "",
  preparatory_year: false,
  preparatory_year_fees: "",
  scholarships_available: false,
  housing_available: false,
  living_cost: "",
  featured: false,
  cover_image: "",
};

const universityTypes = ["Public", "Private", "Research", "Technical"];
const studyLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
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

export default function AddUniversity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [countries, setCountries] = useState([]);
  const [newItems, setNewItems] = useState({
    study_levels: "",
    study_programs: "",
    languages: "",
    admission_requirements: "",
  });
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name");

      if (error) throw error;
      setCountries(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, country_id: data[0].id }));
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load countries. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine all information into a comprehensive description
      const enhancedDescription = `
${formData.description}

Study Programs:
${formData.study_programs.map((p) => `- ${p}`).join("\n")}

Study Levels:
${formData.study_levels.map((l) => `- ${l}`).join("\n")}

Languages of Instruction:
${formData.languages.map((l) => `- ${l}`).join("\n")}

Admission Requirements:
${formData.admission_requirements.map((r) => `- ${r}`).join("\n")}

Costs:
- Tuition Fees: ${formData.tuition_fees}
- Living Cost: ${formData.living_cost}
${
  formData.preparatory_year
    ? `- Preparatory Year Fees: ${formData.preparatory_year_fees}`
    : ""
}

Additional Information:
${formData.scholarships_available ? "- Scholarships are available" : ""}
${formData.housing_available ? "- Student housing is available" : ""}
${formData.preparatory_year ? "- Preparatory year program is available" : ""}
`.trim();

      const { error: insertError } = await supabase
        .from("universities")
        .insert([
          {
            name: formData.name,
            country_id: formData.country_id,
            description: enhancedDescription,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;
      navigate("/universities");
    } catch (err) {
      console.error("Error adding university:", err);
      setError(err.message || "Failed to add university. Please try again.");
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
          onClick={() => navigate(`/${language}/admin/universities`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Universities
        </button>
        <h1 className="text-2xl font-bold">Add New University</h1>
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
                University Name
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
                Country
              </label>
              <select
                value={formData.country_id}
                onChange={(e) =>
                  setFormData({ ...formData, country_id: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {universityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://www.university.edu"
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
              "study_programs",
              "Study Programs",
              <Building2 className="w-4 h-4" />,
              "Add program...",
              studyPrograms
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
              commonRequirements
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tuition Fees (per year)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Living Cost (per month)
              </label>
              <input
                type="text"
                value={formData.living_cost}
                onChange={(e) =>
                  setFormData({ ...formData, living_cost: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., $800 - $1,200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="preparatoryYear"
                checked={formData.preparatory_year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparatory_year: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="preparatoryYear"
                className="text-sm font-medium text-gray-700"
              >
                Preparatory Year Available
              </label>
            </div>

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
                id="housing"
                checked={formData.housing_available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    housing_available: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="housing"
                className="text-sm font-medium text-gray-700"
              >
                Student Housing Available
              </label>
            </div>
          </div>

          {formData.preparatory_year && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparatory Year Fees
              </label>
              <input
                type="text"
                value={formData.preparatory_year_fees}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparatory_year_fees: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., $15,000"
              />
            </div>
          )}

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
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) =>
                setFormData({ ...formData, cover_image: e.target.value })
              }
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/university-image.jpg"
            />
            {formData.cover_image && (
              <div className="mt-2">
                <img
                  src={formData.cover_image}
                  alt={formData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
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
              Featured University
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/universities")}
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
      </form>
    </div>
  );
}
