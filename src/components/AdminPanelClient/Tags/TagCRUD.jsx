"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Search, Loader2, AlertTriangle, X, Tag } from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

export default function TagCRUD() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    tags: { en: [], ar: [] },
  });
  const [tagLanguage, setTagLanguage] = useState(language);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [tagToRemove, setTagToRemove] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const baseUrl = `https://edu-brink-backend.vercel.app/api/tags`;
  const { data, error, loading, updateById } = useApiData(baseUrl);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data[0]?._id || "",
        tags: {
          en: data[0]?.tags?.en || [],
          ar: data[0]?.tags?.ar || [],
        },
      });
    }
  }, [data]);

  const filteredTags = formData?.tags?.[tagLanguage]?.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLanguage = () => {
    setTagLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  const handleRemoveTag = (tag) => {
    setTagToRemove(tag);
    setShowRemovePopup(true);
  };

  const confirmRemoveTag = () => {
    const updatedFormData = {
      ...formData,
      tags: {
        ...formData.tags,
        [tagLanguage]: formData.tags[tagLanguage].filter(
          (tag) => tag !== tagToRemove
        ),
      },
    };

    setFormData(updatedFormData);
    setShowRemovePopup(false);
    setTagToRemove(null);

    // Ensure `id` exists in formData before calling updateById
    if (formData.id) {
      updateById(formData.id, updatedFormData);
    } else {
      console.error("No ID found in formData");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      // Directly modify formData while creating updatedFormData
      const updatedFormData = {
        ...formData,
        tags: {
          ...formData.tags,
          [tagLanguage]: [...formData.tags[tagLanguage], newTag.trim()],
        },
      };

      setFormData(updatedFormData);
      setNewTag("");
      setShowAddPopup(false);

      // Assuming `formData` has an `id`, pass `updatedFormData`
      updateById(updatedFormData.id, updatedFormData);

      // Refresh AOS to animate new elements
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  };

  // Reinitialize AOS when component mounts or when filtered tags change
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 0,
      easing: "ease-in-out",
      disable: !animationsEnabled,
    });

    // Refresh AOS when filtered tags change
    AOS.refresh();
  }, [filteredTags, animationsEnabled]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div
      dir={tagLanguage === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#1C1F26]">
            Tags Management
          </h1>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {tagLanguage === "en" ? "Switch to Arabic" : "Switch to English"}
          </button>
        </div>

        {/* Search and Add Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                tagLanguage === "ar" ? "علامات البحث..." : "Search tags..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
            />
          </div>
          <button
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors flex items-center justify-center"
            data-aos="fade-left"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Tag
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Tags Display Section */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-medium text-gray-700">Available Tags</h2>
            <span className="text-sm text-gray-500">
              {filteredTags?.length || 0} tags
            </span>
          </div>

          <div className="p-4 overflow-hidden overflow-y-auto h-[600px]">
            {filteredTags?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tags found matching your search.
              </div>
            ) : (
              <div className="flex  flex-wrap gap-3">
                {filteredTags?.reverse()?.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center bg-gray-50 border rounded-lg px-3 py-2 hover:border-[#0066FF] transition-colors"
                    // data-aos="fade-up"
                    // data-aos-duration="300"
                    // data-aos-delay={Math.min(index * 50, 500)}
                  >
                    <Tag className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(item)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Tag Confirmation Popup */}
      {showRemovePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            data-aos="zoom-in"
            data-aos-duration="200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Confirm Deletion
              </h2>
              <button
                onClick={() => setShowRemovePopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this tag?
              </p>
              <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">
                {tagToRemove}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemovePopup(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveTag}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            data-aos="zoom-in"
            data-aos-duration="200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Tag
              </h2>
              <button
                onClick={() => setShowAddPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Enter tag name:
              </label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                placeholder="New tag..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTag.trim()}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
