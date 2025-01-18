import React, { useState } from "react";

import AddCountry from "./AddCountry";
import useApiData from "../../../../hooks/useApiData";
import EditCountry from "./EditCountry";
import ViewCountry from "./ViewCountry";

export default function CountryCRUD() {
  const baseUrl = "https://edu-brink-backend.vercel.app/api/country";
  const { data, loading, updateById, addNew, deleteById } = useApiData(baseUrl);
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
    universities: [], // Array to hold references to university IDs
    blog: [],
  };

  const [editData, setEditData] = useState({ type: "View", id: null });
  const [formData, setFormData] = useState(initialFormData);

  const handleEdit = (type, id) => {
    const selectedProperty = data.find((property) => property._id === id); // Filter data by ID
    if (selectedProperty) {
      setFormData({
        id: selectedProperty._id || "",
        countryName: {
          en: selectedProperty?.countryName?.en || "",
          ar: selectedProperty?.countryName?.ar || "",
        },
        countryStudentPopulation:
          selectedProperty?.countryStudentPopulation || 0, // Default to 0 if not available
        countryCurrency: selectedProperty?.countryCurrency || "",
        countryLanguages: selectedProperty?.countryLanguages || [],
        countryPhotos: {
          mainPagePhoto: selectedProperty?.countryPhotos?.mainPagePhoto || "",
          countryFlag: selectedProperty?.countryPhotos?.countryFlag || "",
        },
        countryOverview: {
          en: selectedProperty?.countryOverview?.en || "",
          ar: selectedProperty?.countryOverview?.ar || "",
        },
        universities: selectedProperty?.universities || [], // Default to empty array
        blog: selectedProperty?.blog || [],
      });
    }
    setEditData({ type, id });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nameParts = name.split(".");
    setFormData((prevData) => {
      if (nameParts.length > 1) {
        const updatedData = { ...prevData };
        let temp = updatedData;

        // Traverse the nested object path
        for (let i = 0; i < nameParts.length - 1; i++) {
          temp = temp[nameParts[i]]; // Navigate to the nested object
        }

        // Update the final nested value
        temp[nameParts[nameParts.length - 1]] =
          type === "checkbox" ? checked : value;

        return updatedData;
      }

      // Handle non-nested fields
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleMainPhotoChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedPhotos = [...prevData[field]]; // Dynamically access the field
      updatedPhotos[index] = value;
      return { ...prevData, [field]: updatedPhotos }; // Update the specific field
    });
  };

  return (
    <>
      {editData.type === "View" && (
        <ViewCountry loading={loading} handleEdit={handleEdit} data={data} />
      )}
      {editData.type === "Add" && (
        <AddCountry
          handleEdit={handleEdit}
          addNew={addNew}
          setFormData={setFormData}
          formData={formData}
          handleInputChange={handleInputChange}
          initialFormData={initialFormData}
        />
      )}
      {editData.type === "Edit" && (
        <EditCountry
          formData={formData}
          handleEdit={handleEdit}
          setFormData={setFormData}
          updateById={updateById}
          editData={editData}
          initialFormData={initialFormData}
          deleteById={deleteById}
          handleInputChange={handleInputChange}
          handleMainPhotoChange={handleMainPhotoChange}
        />
      )}
    </>
  );
}
