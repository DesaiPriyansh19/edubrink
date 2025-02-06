import React, { useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import ViewBlogs from "./ViewBlogs";
import AddBlogs from "./AddBlogs";
import EditBlogs from "./EditBlogs";

export default function BlogsCRUD() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = `https://edu-brink-backend.vercel.app/api/blog`;
  const { data, loading, updateById, addNew, deleteById } = useApiData(baseUrl);
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
    blogPhoto: "",
    blogRelated: [
      {
        en: "",
        ar: "",
      },
    ],
  };

  const [editData, setEditData] = useState({ type: "View", id: null });
  const [formData, setFormData] = useState(initialFormData);

  const handleEdit = (type, id) => {
    const selectedBlog = data.find((course) => course._id === id); // Filter data by ID
    if (selectedBlog) {
      setFormData({
        id: selectedBlog._id || "", // Use the course ID if available
        blogTitle: {
          en: selectedBlog?.blogTitle?.en || "", // English title
          ar: selectedBlog?.blogTitle?.ar || "", // Arabic title
        },
        blogSubtitle: {
          en: selectedBlog?.blogSubtitle?.en || "", // English subtitle
          ar: selectedBlog?.blogSubtitle?.ar || "", // Arabic subtitle
        },
        blogDescription: {
          en: selectedBlog?.blogDescription?.en || "", // English description
          ar: selectedBlog?.blogDescription?.ar || "", // Arabic description
        },
        blogAdded: selectedBlog?.blogAdded || null, // Default to null if not available
        blogPhoto: selectedBlog?.blogPhoto || "", // Default to empty string
        blogRelated: selectedBlog?.blogRelated || [
          { en: "", ar: "" }, // Default structure for related blogs
        ],
      });
    }

    setEditData({ type, id }); // Set the type and ID for editing
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
  };

  const addArray = (arrayName) => {
    setFormData((prevState) => ({
      ...prevState,
      [arrayName]: [
        ...prevState[arrayName],
        { en: "", ar: "" }, // Add a new object with empty en and ar fields
      ],
    }));
  };

  const removeArray = (arrayName, index) => {
    setFormData((prevState) => ({
      ...prevState,
      [arrayName]: prevState[arrayName].filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {editData.type === "View" && (
        <ViewBlogs loading={loading} handleEdit={handleEdit} data={data} />
      )}
      {editData.type === "Add" && (
        <AddBlogs
          handleEdit={handleEdit}
          addNew={addNew}
          setFormData={setFormData}
          formData={formData}
          handleInputChange={handleInputChange}
          initialFormData={initialFormData}
          addArray={addArray}
          removeArray={removeArray}
        />
      )}
      {editData.type === "Edit" && (
        <EditBlogs
          formData={formData}
          handleEdit={handleEdit}
          setFormData={setFormData}
          updateById={updateById}
          editData={editData}
          initialFormData={initialFormData}
          deleteById={deleteById}
          addArray={addArray}
          removeArray={removeArray}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
}
