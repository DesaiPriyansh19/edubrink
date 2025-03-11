import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  FileText,
  Tag,
  Image as ImageIcon,
  X,
  BookOpen,
  Search,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";
import useApiData from "../../../../hooks/useApiData";
import MetaArrayFields from "../Universities/MetaArrayFields";
import useDropdownData from "../../../../hooks/useDropdownData";
import RichText from "../../../../utils/RichText";

const initialFormData = {
  blogTitle: {
    en: "",
    ar: "",
  },
  blogSubtitle: {
    en: "",
    ar: "",
  },
  blogDescription: {
    en: "",
    ar: "",
  },
  blogCountry: "",
  countryName: { en: "", ar: "" },
  countryEmoji: "",
  publishImmediately: false,
  featuredBlog: false,
  blogAuthor: "",
  blogCategory: "Study Abroad",
  blogTags: {
    en: [],
    ar: [],
  },
  blogPhoto: "",
  status: "Draft", // Article Status
  excerpt: { en: "", ar: "" },
  scheduledPublishDate: null, // Scheduling future publish dates
  allowComments: true, // Enable/Disable comments
  visibility: "Public",
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

const categories = [
  "Study Abroad",
  "University Life",
  "Career Advice",
  "Student Tips",
  "Academic Success",
  "Cultural Exchange",
  "Language Learning",
  "Scholarships",
  "Student Stories",
  "Education News",
];

const Visibility = ["Public", "Private", "Password Protected"];
const Status = ["Draft", "Pending Review", "Published"];

export default function AddArticle() {
  const { language } = useLanguage();
  const { filteredData } = useDropdownData();
  const [showFlagPicker, setShowFlagPicker] = useState(false);
  const [flagSearch, setFlagSearch] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState({ en: "", ar: "" });
  const { addNew } = useApiData(
    "https://edu-brink-backend.vercel.app/api/blog?admin=true"
  );

  useEffect(() => {
    if (formData?.publishImmediately) {
      setFormData((prev) => ({
        ...prev,
        status: "Published",
        scheduledPublishDate: "",
      }));
    }
  }, [formData?.publishImmediately]);

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

    if (nameParts.includes("blogTitle")) {
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

    if (!formData.blogTitle[language].trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.blogDescription[language].trim()) {
      setError("Content is required");
      return;
    }

    if (!formData.blogAuthor.trim()) {
      setError("Author is required");
      return;
    }

    if (!formData.blogCategory) {
      setError("Category is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {  countryName, countryEmoji, ...updatedFormData } = {
        ...formData,
      };

      console.log(updatedFormData);
      await addNew(updatedFormData);

      navigate(`/${language}/admin/articles`);
    } catch (err) {
      console.error("Error adding article:", err);
      setError(err.message || "Failed to add article");
    } finally {
      setLoading(false);
    }
  };

  const filterFacultyData = filteredData.countries?.filter(
    (country) =>
      country.countryName.en.toLowerCase().includes(flagSearch.toLowerCase()) ||
      country.countryName.ar.toLowerCase().includes(flagSearch.toLowerCase())
  );

  const addTag = (lang) => {
    if (newTag[lang] && !formData?.blogTags?.[lang]?.includes(newTag[lang])) {
      setFormData((prev) => ({
        ...prev,
        blogTags: {
          ...prev.blogTags,
          [lang]: [...(prev.blogTags?.[lang] ?? []), newTag[lang]],
        },
      }));
      setNewTag((prev) => ({
        ...prev,
        [lang]: "", // Clear only the corresponding language field
      }));
    }
  };

  const removeTag = (lang, tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      blogTags: {
        ...prev.blogTags,
        [lang]:
          prev.blogTags?.[lang]?.filter((tag) => tag !== tagToRemove) ?? [],
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/${language}/admin/articles`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>
        <h1 className="text-2xl font-bold">Add New Article</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Blog Title (English)"
            type="text"
            name="blogTitle.en"
            placeholder="Blog Title (English)"
            value={formData?.blogTitle?.en}
            onChange={handleInputChange}
            autoComplete="blog_title_english"
            variant={3}
          />

          <InputField
            label="عنوان المدونة (عربي)"
            type="text"
            name="blogTitle.ar"
            placeholder="عنوان المدونة (عربي)"
            value={formData?.blogTitle?.ar}
            onChange={handleInputChange}
            autoComplete="blog_title_arabic"
            variant={3}
          />

          <InputField
            label="Blog Subtitle (English)"
            type="text"
            name="blogSubtitle.en"
            placeholder="Enter Blog Subtitle (English)"
            value={formData?.blogSubtitle?.en}
            onChange={handleInputChange}
            autoComplete="blog_subtitle_english"
            variant={3}
          />

          <InputField
            label="عنوان فرعي (عربي)"
            type="text"
            name="blogSubtitle.ar"
            placeholder="أدخل العنوان الفرعي (عربي)"
            value={formData?.blogSubtitle?.ar}
            onChange={handleInputChange}
            autoComplete="blog_subtitle_arabic"
            variant={3}
          />

          <InputField
            label="Blog Category"
            type="select"
            name="blogCategory"
            value={formData?.blogCategory}
            onChange={handleInputChange}
            options={categories.map((mode) => ({
              value: mode,
              label: mode,
            }))}
          />

          <div>
            <InputField
              label="Blog Author"
              type="text"
              name="blogAuthor"
              placeholder="Name of the Author"
              value={formData?.blogAuthor}
              onChange={handleInputChange}
              autoComplete="blog_author"
              variant={3}
            />
          </div>

          <div className="col-span-2">
            <RichText
              label="Content (English)"
              value={formData.blogDescription.en}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  blogDescription: { ...prev.blogDescription, en: content },
                }))
              }
            />
          </div>
          <div className="col-span-2">
            <RichText
              label="المحتوى (عربي)"
              value={formData.blogDescription.ar}
              onChange={(content) =>
                setFormData((prev) => ({
                  ...prev,
                  blogDescription: { ...prev.blogDescription, ar: content },
                }))
              }
            />
          </div>

          {[
            { id: 1, label: "Blog Tags (English)", lang: "en" },
            { id: 2, label: "Blog Tags (Arabic)", lang: "ar" },
          ].map((item) => {
            return (
              <div key={item.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {item.label}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag[item.lang]}
                    onChange={(e) =>
                      setNewTag((prev) => ({
                        ...prev,
                        [item.lang]: e.target.value, // Update only the corresponding language field
                      }))
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder={`Add a tag (${item.lang.toUpperCase()})...`}
                    className="flex-1 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addTag(item.lang);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData?.blogTags?.[item.lang]?.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(item.lang, tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="col-span-2 space-y-4">
            {" "}
            {/* Added space-y-4 for vertical spacing */}
            {/* Blog Photo Input Field */}
            <div className="flex items-center gap-4">
              {" "}
              {/* Added gap-4 for horizontal spacing */}
              <div className="mb-4 w-full">
                <InputField
                  label="Blog Photo URL"
                  type="text"
                  name="blogPhoto"
                  placeholder="Enter Blog Photo URL"
                  value={formData?.blogPhoto}
                  onChange={handleInputChange}
                  autoComplete="blogPhoto"
                  variant={3}
                />
              </div>
              {formData.blogPhoto ? (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      blogPhoto: "", // Reset field
                    }))
                  }
                  className="text-red-500 ml-2 px-4 py-2 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
                >
                  Remove
                </button>
              ) : (
                <div className="whitespace-nowrap">
                  <UploadWidget
                    uwConfig={{
                      cloudName: "edubrink",
                      uploadPreset: "EduBrinkImages",
                      multiple: false, // Only one photo
                      maxImageFileSize: 2000000,
                      folder: "blog/Photos",
                    }}
                    setFormData={setFormData}
                    field="blogPhoto"
                    uploadName="Upload Blog Photo"
                    id="upload_widget_blog_photo"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full col-span-2 gap-6 justify-between">
            <div className="w-full">
              <InputField
                label="Excerpt (English)"
                type="textarea"
                name="excerpt.en"
                placeholder="Write the summary"
                value={formData?.excerpt.en}
                onChange={handleInputChange}
                autoComplete="excerpt_en"
                variant={3}
              />
            </div>
            <div className="w-full">
              <InputField
                label="مقتطفات (عربي)"
                type="textarea"
                name="excerpt.ar"
                placeholder="اكتب الملخص"
                value={formData?.excerpt.ar}
                onChange={handleInputChange}
                autoComplete="excerpt_ar"
                variant={3}
              />
            </div>
          </div>

          <div>
            <InputField
              label="Visibility"
              type="select"
              name="visibility"
              checked={formData?.visibility || ""}
              onChange={handleInputChange}
              options={Visibility.map((mode) => ({
                value: mode,
                label: mode,
              }))}
              variant={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFlagPicker(!showFlagPicker)}
                className="w-full flex items-center justify-between px-4 py-1 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <span className="flex gap-2 items-center">
                  <span>{formData?.countryEmoji}</span>
                  <span className="py-1 text-gray-600">
                    {formData?.countryName?.en ||
                      formData?.uniCountry ||
                      "Select Country"}{" "}
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
                    {filterFacultyData?.map((country) => (
                      <button
                        key={country._id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            blogCountry: country._id, // Updating faculty ID
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
                        <span>{country?.countryPhotos?.countryFlag}</span>
                        <span className="text-black text-sm">
                          {country?.countryName?.en} -{" "}
                          {country?.countryName?.ar}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!formData?.publishImmediately && (
            <div className="col-span-2">
              {" "}
              <InputField
                label="Status"
                type="select"
                name="status"
                value={formData?.status || ""}
                onChange={handleInputChange}
                options={Status.map((mode) => ({
                  value: mode,
                  label: mode,
                }))}
              />
              {formData?.status === "Draft" && (
                <div className=" col-span-2 mt-4 w-full">
                  <InputField
                    label="Scheduled Publish Date"
                    type="date"
                    name="scheduledPublishDate"
                    value={
                      formData?.scheduledPublishDate
                        ? formData?.scheduledPublishDate.slice(0, 10)
                        : ""
                    }
                    onChange={handleInputChange}
                    autoComplete="scheduled_publish_date"
                    variant={3}
                  />
                </div>
              )}{" "}
            </div>
          )}

          <div className="col-span-2 mb-4 flex flex-col gap-4">
            <InputField
              label="Meta Title (English)"
              type="text"
              name="seo.metaTitle.en"
              placeholder="Enter Meta Title in English"
              value={formData?.seo?.metaTitle?.en}
              onChange={handleInputChange}
              autoComplete="metaTitle"
              variant={3}
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
            </div>
          </div>

          <InputField
            label="Custom URL (English)"
            type="text"
            name="customURLSlug.en"
            placeholder="Enter Custom Slug in English"
            value={formData?.customURLSlug.en}
            onChange={handleInputChange}
            autoComplete="custom_url_slug_en"
            variant={3}
          />
          <InputField
            label="Custom URL (Arabic)"
            type="text"
            name="customURLSlug.ar"
            placeholder="Enter Custom Slug in Arabic"
            value={formData?.customURLSlug.ar}
            onChange={handleInputChange}
            autoComplete="custom_url_slug_ar"
            variant={3}
          />

          <div className="flex items-center col-span-2 space-x-6">
            <InputField
              label="Publish Immediately"
              type="checkbox"
              name="publishImmediately"
              checked={formData?.publishImmediately || false}
              onChange={handleInputChange}
              autoComplete="publishImmediately"
              variant={3}
            />

            <InputField
              label="Featured Article"
              type="checkbox"
              name="featuredBlog"
              checked={formData?.featuredBlog || false}
              onChange={handleInputChange}
              autoComplete="publishImmediately"
              variant={3}
            />

            <InputField
              label="Allow Comments"
              type="checkbox"
              name="allowComments"
              checked={formData?.allowComments || false}
              onChange={handleInputChange}
              autoComplete="allow_comments"
              variant={3}
            />
          </div>

          <div className="mt-6 flex col-span-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/${language}/admin/articles`)}
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
                  Save Article
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
