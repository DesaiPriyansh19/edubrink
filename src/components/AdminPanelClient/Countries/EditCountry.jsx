import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Flag,
  Search,
  Languages,
  School,
  BookOpen,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { countryFlags } from "../../../../libs/countryFlags";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";
import useDropdownData from "../../../../hooks/useDropDownData";
import DropdownSelect from "../../../../utils/DropdownSelect";

// const countryTemplates = [
//   {
//     name: "United States",
//     iso_code: "US",
//     currency: "USD",
//     language: "English",
//     education_system:
//       "American system with K-12 and higher education. Features a flexible credit-based system with diverse majors and specializations. Strong emphasis on practical experience and research.",
//     flag_emoji: "🇺🇸",
//     study_programs: [
//       "Engineering",
//       "Medicine",
//       "Business",
//       "Computer Science",
//       "Liberal Arts",
//     ],
//     countryLanguages: ["English"],
//     universities: [],
//     blog: [],
//     faculty: [],
//     university_types: ["Public", "Private", "Community College"],
//     admission_requirements: ["High School Diploma", "SAT/ACT", "TOEFL/IELTS"],
//     part_time_work: "20 hours per week during semester, 40 hours during breaks",
//     visa_documents: [
//       "Valid Passport",
//       "I-20 Form",
//       "Financial Proof",
//       "SEVIS Fee Receipt",
//     ],
//     visa_processing: "3-4 weeks typical processing time",
//     post_grad_residency: "Optional Practical Training (OPT) for up to 3 years",
//     tuition_range: "$20,000 - $50,000 per year",
//     living_costs: "$800 - $2,000 per month",
//     housing_options: [
//       "University Dormitory",
//       "Off-campus Apartment",
//       "Homestay",
//     ],
//   },
//   {
//     name: "United Kingdom",
//     iso_code: "GB",
//     currency: "GBP",
//     language: "English",
//     education_system:
//       "British system with undergraduate and postgraduate degrees. Known for its research-intensive universities and specialized courses. Three-year bachelor's degrees are standard.",
//     flag_emoji: "🇬🇧",
//     study_programs: [
//       "Law",
//       "Medicine",
//       "Engineering",
//       "Business",
//       "Arts and Humanities",
//     ],
//     university_types: ["Public", "Russell Group", "Private"],
//     admission_requirements: ["A-Levels/IB", "UCAS Application", "IELTS/TOEFL"],
//     part_time_work:
//       "20 hours per week during term time, full-time during holidays",
//     visa_documents: [
//       "CAS Number",
//       "Valid Passport",
//       "Financial Proof",
//       "English Proficiency",
//     ],
//     visa_processing: "3-4 weeks standard processing",
//     post_grad_residency: "Graduate Route visa for 2 years",
//     tuition_range: "£12,000 - £35,000 per year",
//     living_costs: "£800 - £1,500 per month",
//     housing_options: [
//       "University Halls",
//       "Private Accommodation",
//       "Shared Housing",
//     ],
//   },
// ];

const initialFormData = {
  countryName: {
    en: "",
    ar: "",
  },
  countryStudentPopulation: 0, // Default population set to 0
  countryCurrency: "",
  countryLanguages: [], // Array for languages spoken in the country
  countryPhotos: {
    mainPagePhoto: "",
    countryFlag: "",
  },
  countryOverview: {
    en: "",
    ar: "",
  },
  name: "",
  countryCode: "",
  universities: [], // Array to hold references to university IDs
  faculty: [],
  blog: [],
};

export default function EditCountry() {
  const { language } = useLanguage();
  const { id } = useParams();
  const {
    filteredUniversities,
    filteredBlogs,
    filteredFaculty,
    setSearchInput,
    handleAdd,
    handleRemove,
  } = useDropdownData();
  const { data, updateWithOutById } = useApiData(
    `https://edu-brink-backend.vercel.app/api/country/${id}`
  );

  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data._id || "",
        countryName: {
          en: data?.countryName?.en || "",
          ar: data?.countryName?.ar || "",
        },
        countryStudentPopulation: data?.countryStudentPopulation || 0, // Default to 0 if not available
        countryCurrency: data?.countryCurrency || "",
        countryLanguages: data?.countryLanguages || [],
        countryPhotos: {
          mainPagePhoto: data?.countryPhotos?.mainPagePhoto || "",
          countryFlag: data?.countryPhotos?.countryFlag || "",
        },
        countryOverview: {
          en: data?.countryOverview?.en || "",
          ar: data?.countryOverview?.ar || "",
        },
        countryCode: data?.countryCode || "",
        universities: data?.universities || [], // Default to empty array
        blog: data?.blog || [],
        faculty: data?.faculty || [],
      });
    }
  }, [data]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showDropdown, setShowDropdown] = useState({
    universities: false,
    blogs: false,
    faculty: false,
  });
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [activeSection, setActiveSection] = useState(null > null);
  const [showFlagPicker, setShowFlagPicker] = useState(false);
  const [flagSearch, setFlagSearch] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote"],
          [{ align: [] }],
          ["clean"],
        ],
      },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { name, ...updatedFormData } = {
        ...formData,
        countryPhotos: {
          ...formData.countryPhotos,
          mainPagePhoto: Array.isArray(formData.countryPhotos.mainPagePhoto)
            ? formData.countryPhotos.mainPagePhoto[0]
            : formData.countryPhotos.mainPagePhoto,
        },
        universities: formData.universities.map((university) => university._id),
        blog: formData.blog.map((blog) => blog._id),
        faculty: formData.faculty.map((faculty) => faculty._id),
      };

      console.log(updatedFormData);

      await updateWithOutById(updatedFormData);
      navigate(`/${language}/admin/countries`);
    } catch (err) {
      console.error("Error adding country:", err);
      setError(err.message || "Failed to add country");
    } finally {
      setLoading(false);
    }
  };

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

  const addItem = (field) => {
    if (
      newItem &&
      Array.isArray(formData[field]) &&
      !formData[field].includes(newItem)
    ) {
      setFormData({
        ...formData,
        [field]: [...formData[field], newItem],
      });
      setNewItem("");
      setActiveSection(null);
    }
  };

  const removeItem = (field, item) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: formData[field].filter((i) => i !== item),
      });
    }
  };

  const filteredFlags = countryFlags.filter(
    (country) =>
      country.name.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.code.toLowerCase().includes(flagSearch.toLowerCase())
  );

  const renderArrayField = (field, label, icon, placeholder) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 mb-2">
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
        <button
          type="button"
          onClick={() => addItem(field)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit
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
          onClick={() => navigate(`/${language}/admin/countries`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Countries
        </button>
        <h1 className="text-2xl font-bold">Edit Country</h1>
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
            <div>
              <InputField
                label="Country Name (English)"
                type="text"
                name="countryName.en"
                placeholder="Country Name"
                value={formData?.countryName?.en}
                onChange={handleInputChange}
                autoComplete="countryName"
                variant={3}
              />
            </div>
            <div>
              <InputField
                label="اسم الدولة (عربي)"
                type="text"
                name="countryName.ar"
                placeholder="اسم الدولة "
                value={formData?.countryName?.ar}
                onChange={handleInputChange}
                autoComplete="countryName"
                variant={3}
              />
            </div>

            <div>
              <InputField
                label="ISO Code"
                type="text"
                name="countryCode"
                placeholder="E.g. USA"
                value={formData?.countryCode}
                onChange={handleInputChange}
                autoComplete="countryCode"
                variant={3}
              />
            </div>

            <div>
              <InputField
                label="Country Currency (عملة البلد)"
                type="text"
                name="countryCurrency"
                placeholder="E.g. USD"
                value={formData?.countryCurrency}
                onChange={handleInputChange}
                autoComplete="countryCurrency"
                variant={3}
              />
            </div>
            <div>
              <InputField
                label="Country Student Population (عدد الطلاب في الدولة)"
                type="text"
                name="countryStudentPopulation"
                placeholder="E.g. 10,000"
                value={formData?.countryStudentPopulation}
                onChange={handleInputChange}
                autoComplete="countryStudentPopulation"
                variant={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flag
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFlagPicker(!showFlagPicker)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <span className="flex items-center">
                    <span className="text-2xl mr-2">
                      {formData.countryPhotos.countryFlag || "🏳"}{" "}
                      {/* White flag if empty */}
                    </span>
                    <span className="text-gray-600">
                      {formData.countryName.en ||
                        formData.name ||
                        "Select Flag"}{" "}
                      {/* Placeholder if name is empty */}
                    </span>
                  </span>
                  <Flag className="w-5 h-5 text-gray-400" />
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
                      {filteredFlags.map((country, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const updatedData = {
                                ...prev,
                                countryCode: country.alpha3,
                                name: country.name,
                                countryPhotos: {
                                  ...prev.countryPhotos, // Preserve existing photos
                                  countryFlag: country.emoji,
                                },
                              };
                              return updatedData;
                            });

                            setShowFlagPicker(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span className="text-2xl">{country.emoji}</span>
                          <span>{country.name}</span>
                          <span className="text-gray-400 text-sm">
                            ({country.alpha3})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" col-span-2">
              <div className="mb-2">
                {/* For mainPagePhoto */}
                <div className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label="Main Photo URL (الرئيسية للجامعة)"
                      type="text"
                      name="countryPhotos.mainPagePhoto" // Single field, no array indexing
                      value={formData?.countryPhotos?.mainPagePhoto || ""}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          countryPhotos: {
                            ...prevData.countryPhotos,
                            mainPagePhoto: e.target.value,
                          },
                        }))
                      }
                      placeholder="Main Photo URL"
                      variant={3}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        countryPhotos: {
                          ...prevData.countryPhotos,
                          mainPagePhoto: "", // Reset field
                        },
                      }));
                    }}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>

                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: false, // Only one photo
                    maxImageFileSize: 2000000,
                    folder: "country/CoverPhoto",
                  }}
                  setFormData={setFormData}
                  field="countryPhotos"
                  fieldName="mainPagePhoto" // Use mainPagePhoto directly
                  uploadName="Upload Univeristy Cover Photo"
                  id="upload_widget_country_cover_photo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {renderArrayField(
              "countryLanguages",
              "Language",
              <Languages className="w-4 h-4" />,
              "Add New Language..."
            )}
            {/* {renderArrayField(
              "study_programs",
              "Study Programs",
              <GraduationCap className="w-4 h-4" />,
              "Add new program..."
            )} */}
            {/* {renderArrayField(
              "university_types",
              "University Types",
              <Building2 className="w-4 h-4" />,
              "Add university type..."
            )} */}
            {/* {renderArrayField(
              "admission_requirements",
              "Admission Requirements",
              <Briefcase className="w-4 h-4" />,
              "Add requirement..."
            )} */}
            {/* {renderArrayField(
              "visa_documents",
              "Required Visa Documents",
              <Passport className="w-4 h-4" />,
              "Add document..."
            )} */}
            {/* {renderArrayField(
              "housing_options",
              "Housing Options",
              <Building2 className="w-4 h-4" />,
              "Add housing option..."
            )} */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Description (English)
            </label>
            <div className="prose max-w-none">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.countryOverview.en}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryOverview: { ...prev.countryOverview, en: content },
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  className="h-64"
                  preserveWhitespace
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف البلد (Arabic)
            </label>
            <div className="prose max-w-none">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.countryOverview.ar}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryOverview: { ...prev.countryOverview, ar: content },
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  className="h-64"
                  preserveWhitespace
                />
              </div>
            </div>
          </div>

          <DropdownSelect
            label="Enroll University (التسجيل في الجامعة)"
            placeholder="Select a university"
            icon={School}
            selectedItems={formData?.universities}
            searchKey="uniName"
            options={filteredUniversities}
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

          {/* Blog Dropdown */}
          <DropdownSelect
            label="Enroll Blog (سجل في المدونة)"
            placeholder="Select a blog"
            icon={BookOpen}
            selectedItems={formData?.blog}
            searchKey="blogTitle"
            options={filteredBlogs}
            onSearch={(value) =>
              setSearchInput((prev) => ({ ...prev, blogname: value }))
            }
            onSelect={(blog) =>
              handleAdd("blog", blog, setFormData, setShowDropdown)
            }
            onRemove={(id) => handleRemove("blog", id, setFormData)}
            language="en"
            dropdownKey="blogs"
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          {/* Faculty Dropdown */}
          <DropdownSelect
            label="Enroll Faculty (التسجيل بالكلية)"
            placeholder="Select a Faculty"
            icon={BookOpen}
            selectedItems={formData?.faculty}
            searchKey="facultyName"
            options={filteredFaculty}
            onSearch={(value) =>
              setSearchInput((prev) => ({ ...prev, facultyname: value }))
            }
            onSelect={(faculty) =>
              handleAdd("faculty", faculty, setFormData, setShowDropdown)
            }
            onRemove={(id) => handleRemove("faculty", id, setFormData)}
            language="en"
            dropdownKey="faculty"
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#294dd8] rounded-lg text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
