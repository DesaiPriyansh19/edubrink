import React, { useEffect, useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import ViewCourses from "./ViewCourses";
import AddCourses from "./AddCourses";
import EditCourses from "./EditCourses";
import axios from "axios";

export default function CourseCRUD() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = `https://edu-brink-backend.vercel.app/api/course`;
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
    CourseFees: null,
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
    Tags: [],
  };

  const [editData, setEditData] = useState({ type: "View", id: null });
  const [formData, setFormData] = useState(initialFormData);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addTags, setAddtags] = useState([]);
  const [searchInput, setSearchInput] = useState({
    id: "",
    TagName: "",
  });

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
        CourseFees: selectedCourse?.CourseFees || null, // Default to empty string
        ModeOfStudy: selectedCourse?.ModeOfStudy || [
          { en: "", ar: "" }, // Default structure for ModeOfStudy
        ],
        Requirements: selectedCourse?.Requirements || [
          { en: "", ar: "" }, // Default structure for Requirements
        ],
        Tags: selectedCourse?.Tags || [],
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

  const filteredTags = addTags?.filter(
    (tag) =>
      tag?.TagName?.en
        .toLowerCase()
        .includes(searchInput?.TagName?.toLowerCase()) ||
      tag?.TagName?.ar
        .toLowerCase()
        .includes(searchInput?.TagName?.toLowerCase())
  );

  useEffect(() => {
    const handleTags = async () => {
      try {
        const res = await axios.get(
          `https://edu-brink-backend.vercel.app/api/tags`
        );
        if (res) {
          setAddtags(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleTags();
  }, []);

  const handleAddItem = (filteredItems) => {
    if (searchInput.TagName !== "" && searchInput.id !== "") {
      const selectedItem = filteredItems.find(
        (item) => item._id === searchInput.id
      );

      if (selectedItem) {
        setFormData((prevData) => ({
          ...prevData,
          Tags: [
            ...(prevData.Tags || []),
            selectedItem, // Add selected tag directly, not inside an object
          ],
        }));

        setSearchInput({
          id: "",
          TagName: "",
        });
      }
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      Tags: prevData.Tags.filter((_, i) => i !== index),
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
          handleRemoveItem={handleRemoveItem}
          handleAddItem={handleAddItem}
          filteredTags={filteredTags}
          setShowDropdown={setShowDropdown}
          showDropdown={showDropdown}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
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
          handleRemoveItem={handleRemoveItem}
          handleAddItem={handleAddItem}
          filteredTags={filteredTags}
          setShowDropdown={setShowDropdown}
          showDropdown={showDropdown}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      )}
    </>
  );
}
