import React, { useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import ViewCourses from "./ViewCourses";
import AddCourses from "./AddCourses";
import EditCourses from "./EditCourses";

export default function CourseCRUD() {
  const baseUrl = "https://edu-brink-backend.vercel.app/api/course";
  const { data, loading, updateById, addNew, deleteById } = useApiData(baseUrl);
  const initialFormData = {
    CourseName: {
      en: "",
      ar: "",
    },
    CourseDescription: {
      en: "",
      ar: "",
    },
    CourseDuration: "",
    DeadLine: null,
    CourseFees: "",
    ModeOfStudy: [
      {
        en: "",
        ar: "",
      },
    ], // Array of objects for mode of study
    Requirements: [
      {
        en: "",
        ar: "",
      },
    ],
  };

  const [editData, setEditData] = useState({ type: "View", id: null });
  const [formData, setFormData] = useState(initialFormData);

  const handleEdit = (type, id) => {
    const selectedCourse = data.find((course) => course._id === id); // Filter data by ID

    if (selectedCourse) {
      setFormData({
        id: selectedCourse._id || "", // Use the course ID if available
        CourseName: {
          en: selectedCourse?.CourseName?.en || "", // English name
          ar: selectedCourse?.CourseName?.ar || "", // Arabic name
        },
        CourseDescription: {
          en: selectedCourse?.CourseDescription?.en || "", // English description
          ar: selectedCourse?.CourseDescription?.ar || "", // Arabic description
        },
        CourseDuration: selectedCourse?.CourseDuration || "", // Default to empty string if not available
        DeadLine: selectedCourse?.DeadLine || null, // Default to null if not available
        CourseFees: selectedCourse?.CourseFees || "", // Default to empty string
        ModeOfStudy: selectedCourse?.ModeOfStudy || [
          { en: "", ar: "" }, // Default structure for ModeOfStudy
        ],
        Requirements: selectedCourse?.Requirements || [
          { en: "", ar: "" }, // Default structure for Requirements
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

  // Remove an item from the Requirements array by index
  const removeArray = (arrayName, index) => {
    setFormData((prevState) => ({
      ...prevState,
      [arrayName]: prevState[arrayName].filter((_, i) => i !== index),
    }));
  };
  

  return (
    <>
      {editData.type === "View" && (
        <ViewCourses loading={loading} handleEdit={handleEdit} data={data} />
      )}
      {editData.type === "Add" && (
        <AddCourses
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
        <EditCourses
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
