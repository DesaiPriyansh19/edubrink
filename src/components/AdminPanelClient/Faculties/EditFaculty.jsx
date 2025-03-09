import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  GraduationCap,
  CalendarPlus2,
  School,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import DropdownSelect from "../../../../utils/DropdownSelect";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";
import RichText from "../../../../utils/RichText";

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
};

export default function EditFaculty() {
  const { id } = useParams();
  const { filteredData, setSearchInput, handleAdd, handleRemove } =
    useDropdownData();
  const { language } = useLanguage();
  const [showDropdown, setShowDropdown] = useState({
    major: false,
    universities: false,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const { data, updateWithOutById } = useApiData(
    `https://edu-brink-backend.vercel.app/api/faculty/${id}`
  );

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
      });
    }
  }, [data]);

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

    if (nameParts.includes("facultyName")) {
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
      const updatedFormData = {
        ...formData,
        universities: formData.universities.map(
          (universities) => universities._id
        ),
        major: formData.major.map((major) => major._id),
      };
      console.log(updatedFormData);
      await updateWithOutById(updatedFormData);

      navigate(`/${language}/admin/faculties`);
    } catch (err) {
      console.error("Error adding faculty:", err);
      setError(err.message || "Failed to add faculty");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold">Edit Faculty</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <InputField
            label="Faculty Name (English)"
            type="text"
            name="facultyName.en"
            placeholder="Faculty Name"
            value={formData?.facultyName?.en}
            onChange={handleInputChange}
            autoComplete="facultyName"
            variant={3}
          />

          <InputField
            label="اسم الكلية (عربي)"
            type="text"
            name="facultyName.ar"
            placeholder="اسم الكلية"
            value={formData?.facultyName?.ar}
            onChange={handleInputChange}
            autoComplete="facultyName"
            variant={3}
          />

          <div className="col-span-2">
            <DropdownSelect
              label="Enrolled Major "
              placeholder="Major List"
              icon={CalendarPlus2}
              disabled={true}
              selectedItems={formData?.major}
              searchKey="majorName"
              options={filteredData?.majors}
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
          </div>

          <div className="col-span-2">
            <DropdownSelect
              label="Enroll University (التسجيل في الجامعة)"
              placeholder="Select a university"
              icon={School}
              selectedItems={formData?.universities}
              searchKey="uniName"
              options={filteredData?.universities}
              onSearch={(value) =>
                setSearchInput((prev) => ({ ...prev, univername: value }))
              }
              onSelect={(university) =>
                handleAdd(
                  "universities",
                  university,
                  setFormData,
                  setShowDropdown
                )
              }
              onRemove={(id) => handleRemove("universities", id, setFormData)}
              language="en"
              dropdownKey="universities"
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
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
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  facultyDescription: {
                    ...prev.facultyDescription,
                    en: content,
                  },
                }))
              }
            />
          </div>
          <div className="col-span-2">
            <RichText
              label="وصف الكلية (انجليزي)"
              value={formData?.facultyDescription?.ar || ""}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  facultyDescription: {
                    ...prev.facultyDescription,
                    ar: content,
                  },
                }))
              }
            />
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
  );
}
