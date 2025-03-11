import { useState } from "react";

export default function MetaArrayFields({
  field,
  label,
  icon,
  placeholder,
  options,
  formData,
  setFormData,
}) {
  const [newItem, setNewItem] = useState("");

  const updateFieldData = (callback) => {
    setFormData((prev) => {
      const fieldPath = field.split(".");
      let newState = { ...prev };
      let ref = newState;
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const key = fieldPath[i];
        ref[key] = ref[key] || {};
        ref = ref[key];
      }
      const lastKey = fieldPath[fieldPath.length - 1];
      ref[lastKey] = callback(ref[lastKey] || []);
      return newState;
    });
  };

  const addItem = () => {
    if (!newItem.trim()) return;

    // Split the input by commas and trim each item
    const itemsToAdd = newItem
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item); // Remove empty strings

    if (itemsToAdd.length === 0) return;

    updateFieldData((prev) => {
      const newItems = itemsToAdd.filter((item) => !prev.includes(item)); // Avoid duplicates
      return [...prev, ...newItems];
    });

    setNewItem(""); // Clear the input after adding
  };

  const removeItem = (itemToRemove) => {
    updateFieldData((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const fieldPath = field.split(".");
  const fieldData = fieldPath.reduce((acc, key) => acc?.[key] || [], formData);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 mb-2">
        {options ? (
          <select
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
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
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        )}
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(fieldData) &&
          fieldData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
              {icon}
              {typeof item === "object" ? JSON.stringify(item) : item}

              <button
                type="button"
                onClick={() => removeItem(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}