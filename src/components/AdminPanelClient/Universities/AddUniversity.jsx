import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Building2,
  GraduationCap,
  Languages,
  FileCheck,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";
import ArrayFieldAndPhotos from "../../../../utils/ArrayFieldAndPhotos";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DropdownSelect from "../../../../utils/DropdownSelect";
import useDropdownData from "../../../../hooks/useDropdownData";
import useApiData from "../../../../hooks/useApiData";

const initialFormData = {
  uniName: {
    en: "",
    ar: "",
  },
  study_programs: [],
  faculty: [],
  courseId: [],
  uniTutionFees: "",
  uniMainImage: "",
  uniLocation: {
    uniAddress: {
      en: "",
      ar: "",
    },
    uniPincode: "",
    uniCity: {
      en: "",
      ar: "",
    },
    uniState: {
      en: "",
      ar: "",
    },
    uniCountry: {
      en: "",
      ar: "",
    },
  },
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
  studyLevel: [],
  spokenLanguage: [],
  scholarshipAvailability: false,
  admission_requirements: [],
  preparatory_year: false,
  preparatory_year_fees: "",
  housing_available: false,
  living_cost: "",
  uniFeatured: false,
};

const universityTypes = ["Public", "Private", "Research", "Technical"];
const studyLevels = [
  {
    value: "UnderGraduate",
    label: "UnderGraduate (المرحلة الجامعية)",
  },
  {
    value: "PostGraduate",
    label: "PostGraduate (الدراسات العليا)",
  },
  { value: "Foundation", label: "Foundation (مؤسسة)" },
  { value: "Doctorate", label: "Doctorate (دكتوراه)" },
];
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
  const {
    filteredData,
    setSearchInput,
    handleAdd,
    handleRemove,
  } = useDropdownData();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState({
    courses: false,
    faculty: false,
  });
  const { addNew } = useApiData(
    "https://edu-brink-backend.vercel.app/api/university"
  );
  const { language } = useLanguage();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newItems, setNewItems] = useState({
    studyLevel: "",
    study_programs: "",
    spokenLanguage: "",
    admission_requirements: "",
  });

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
  const [activeSection, setActiveSection] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        courseId: formData.courseId.map((course) => course._id),
        faculty: formData.faculty.map((faculty) => faculty._id),
      };

      await addNew(updatedFormData);
      setFormData(initialFormData);
      navigate(`/${language}/admin/universities`);
    } catch (err) {
      console.error("Error adding university:", err);
      setError(err.message || "Failed to add university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMainPhotoChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedPhotos = [...prevData[field]]; // Dynamically access the field
      updatedPhotos[index] = value;
      return { ...prevData, [field]: updatedPhotos }; // Update the specific field
    });
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
            {/* <div className="md:col-span-2">
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
            </div> */}

            <div className="mb-4 w-auto">
              <div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                {formData.uniSymbol ? (
                  <>
                    <div className="relative w-full h-full">
                      <img
                        src={formData.uniSymbol}
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
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.uniOverview.en}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    uniOverview: {
                      ...prevData.uniOverview,
                      en: value,
                    },
                  }))
                }
                modules={modules}
                formats={formats}
                preserveWhitespace
                className="h-52 pb-10"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الجامعة
              </label>
              <ReactQuill
                theme="snow"
                value={formData.uniOverview.ar}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    uniOverview: {
                      ...prevData.uniOverview,
                      ar: value,
                    },
                  }))
                }
                modules={modules}
                formats={formats}
                preserveWhitespace
                className="h-52 pb-10"
              />
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="University Start Date (تاريخ بدء الجامعة)"
                type="date"
                name="uniStartDate"
                value={formData?.uniStartDate || ""}
                onChange={handleInputChange}
                variant={3}
              />
            </div>
            <div className="mb-4 w-full">
              <InputField
                label="Application Deadline (الموعد النهائي للتقديم)"
                type="date"
                name="uniDeadline"
                value={formData?.uniDeadline || ""}
                onChange={handleInputChange}
                variant={3}
              />
            </div>
            {/* UniLocation Start */}
            <InputField
              label="Address (English)"
              type="text"
              name="uniLocation.uniAddress.en"
              placeholder="Address (English)"
              value={formData.uniLocation.uniAddress.en}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="عنوان (عربي)"
              type="text"
              name="uniLocation.uniAddress.ar"
              placeholder="عنوان (عربي)"
              value={formData.uniLocation.uniAddress.ar}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="City (English)"
              type="text"
              name="uniLocation.uniCity.en"
              placeholder="City (English)"
              value={formData.uniLocation.uniCity.en}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="مدينة (عربي)"
              type="text"
              name="uniLocation.uniCity.ar"
              placeholder="مدينة (عربي)"
              value={formData.uniLocation.uniCity.ar}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="State (English)"
              type="text"
              name="uniLocation.uniState.en"
              placeholder="State (English)"
              value={formData.uniLocation.uniState.en}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="الدولة (عربي)"
              type="text"
              name="uniLocation.uniState.ar"
              placeholder="الدولة (عربي)"
              value={formData.uniLocation.uniState.ar}
              onChange={handleInputChange}
              variant={3}
            />

            <InputField
              label="Country (English)"
              type="text"
              name="uniLocation.uniCountry.en"
              placeholder="Country (English)"
              value={formData.uniLocation.uniCountry.en}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="دولة (عربي)"
              type="text"
              name="uniLocation.uniCountry.ar"
              placeholder="دولة (عربي)"
              value={formData.uniLocation.uniCountry.ar}
              onChange={handleInputChange}
              variant={3}
            />
            <div className="col-span-2">
              <InputField
                label="Pincode (الرمز السري)"
                type="text"
                name="uniLocation.uniPincode"
                placeholder="Pincode (الرمز السري)"
                value={formData.uniLocation.uniPincode}
                onChange={handleInputChange}
                variant={3}
              />
            </div>
            {/* UniLocation End */}

            <InputField
              label="Tuition Fees (per year)"
              type="text"
              name="uniTutionFees"
              placeholder="e.g., $20,000 "
              value={formData.uniTutionFees}
              onChange={handleInputChange}
              variant={3}
            />

            <InputField
              label="Living Cost (per month)"
              type="text"
              name="living_cost"
              placeholder="e.g., $800 - $1,200"
              value={formData.tuition_fees}
              onChange={handleInputChange}
              variant={3}
            />

            <InputField
              label="Accommodation (English)"
              type="textarea"
              name="uniAccomodation.en"
              placeholder="Accommodation (English)"
              value={formData.uniAccomodation.en}
              onChange={handleInputChange}
              variant={3}
            />
            <InputField
              label="إقامة (عربي)"
              type="textarea"
              name="uniAccomodation.ar"
              placeholder="إقامة (عربي)"
              value={formData.uniAccomodation.ar}
              onChange={handleInputChange}
              variant={3}
            />
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

          <div className="w-full flex items-center gap-4 justify-between">
            <div className="w-full">
              <InputField
                label="University Main Image URL (رابط الصورة الرئيسية للجامعة)"
                type="text"
                name="uniMainImage"
                placeholder="Upload or enter image URL"
                value={formData.uniMainImage || ""}
                onChange={handleInputChange}
                autoComplete="off"
                variant={3}
              />
            </div>

            <div className="mt-6 whitespace-nowrap">
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

          <DropdownSelect
            label="Enroll Faculty (التسجيل بالكلية)"
            placeholder="Select a Faculty"
            icon={BookOpen}
            selectedItems={formData?.faculty}
            searchKey="facultyName"
            options={filteredData.faculties}
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

          <DropdownSelect
            label="Enroll Course (التسجيل في الدورة)"
            placeholder="Select a Course"
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

        <div className="grid grid-cols-1 mt-10 mb-7 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2">
            <InputField
              label="Preparatory Year Available"
              type="checkbox"
              name="preparatory_year"
              value={formData?.preparatory_year}
              onChange={handleInputChange}
              variant={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <InputField
              label="Scholarship Availability "
              type="checkbox"
              name="scholarshipAvailability"
              value={formData?.scholarshipAvailability}
              onChange={handleInputChange}
              variant={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <InputField
              label="Student Housing Available"
              type="checkbox"
              name="housing_available"
              value={formData?.housing_available}
              onChange={handleInputChange}
              variant={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <InputField
              label="Entrance Exam Required"
              type="checkbox"
              name="entranceExamRequired"
              value={formData.entranceExamRequired}
              onChange={handleInputChange}
              variant={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <InputField
              label="Featured University"
              type="checkbox"
              name="uniFeatured"
              value={formData?.uniFeatured}
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
      </form>
    </div>
  );
}
