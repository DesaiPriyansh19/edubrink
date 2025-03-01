import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function DropdownSelect({
  label,
  placeholder,
  icon: Icon,
  selectedItems,
  searchKey,
  options,
  onSearch,
  onSelect,
  onRemove,
  language,
  dropdownKey,
  showDropdown,
  setShowDropdown,
}) {
  const [searchInput, setSearchInput] = useState("");

  const toggleDropdown = () => {
    setShowDropdown((prev) => ({
      universities: dropdownKey === "universities" ? !prev.universities : false,
      blogs: dropdownKey === "blogs" ? !prev.blogs : false,
      faculty: dropdownKey === "faculty" ? !prev.faculty : false,
      courses: dropdownKey === "courses" ? !prev.courses : false,
      major: dropdownKey === "major" ? !prev.major : false,
      tags: dropdownKey === "tags" ? !prev.tags : false,
    }));
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <span className="text-gray-600">{searchInput || placeholder}</span>
            <Icon className="w-5 h-5 text-gray-400" />
          </button>

          {showDropdown[dropdownKey] && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${placeholder.toLowerCase()}...`}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {options?.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setShowDropdown((prev) => ({
                        ...prev,
                        [dropdownKey]: false, // Close dropdown after selection
                      }));
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium">
                        {item[searchKey].en} - {item[searchKey].ar}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Items */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectedItems?.map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
              <Icon className="w-4 h-4" />
              <span>{item?.[searchKey]?.[language]}</span>
              <button
                type="button"
                onClick={() => onRemove(item._id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
