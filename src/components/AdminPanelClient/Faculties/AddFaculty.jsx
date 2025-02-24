import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, GraduationCap } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLanguage } from "../../../../context/LanguageContext";

// Create a forwarded ref wrapper for ReactQuill
const QuillWrapper = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

QuillWrapper.displayName = "QuillWrapper";

const initialFormData = {
  name: "",
  university_id: "",
  description: "",
  study_levels: [],
  featured: false,
};

const studyLevels = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];

export default function AddFaculty() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [universities, setUniversities] = useState([]);
  const [newStudyLevel, setNewStudyLevel] = useState("");
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
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from("universities")
        .select(
          `
          *,
          country:countries(*)
        `
        )
        .order("name");

      if (error) throw error;
      setUniversities(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, university_id: data[0].id }));
      }
    } catch (err) {
      console.error("Error fetching universities:", err);
      setError("Failed to load universities");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("faculties").insert([
        {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;
      navigate("/faculties");
    } catch (err) {
      console.error("Error adding faculty:", err);
      setError(err.message || "Failed to add faculty");
    } finally {
      setLoading(false);
    }
  };

  const addStudyLevel = () => {
    if (newStudyLevel && !formData.study_levels.includes(newStudyLevel)) {
      setFormData((prev) => ({
        ...prev,
        study_levels: [...prev.study_levels, newStudyLevel],
      }));
      setNewStudyLevel("");
    }
  };

  const removeStudyLevel = (level) => {
    setFormData((prev) => ({
      ...prev,
      study_levels: prev.study_levels.filter((l) => l !== level),
    }));
  };

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
        <h1 className="text-2xl font-bold">Add New Faculty</h1>
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
                Faculty Name
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
                University
              </label>
              <select
                value={formData.university_id}
                onChange={(e) =>
                  setFormData({ ...formData, university_id: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name} ({university.country.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Levels
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  value={newStudyLevel}
                  onChange={(e) => setNewStudyLevel(e.target.value)}
                  className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Study Level</option>
                  {studyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addStudyLevel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.study_levels.map((level) => (
                  <div
                    key={level}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                  >
                    <GraduationCap className="w-4 h-4" />
                    {level}
                    <button
                      type="button"
                      onClick={() => removeStudyLevel(level)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
              Featured Faculty
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/faculties")}
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
  );
}
