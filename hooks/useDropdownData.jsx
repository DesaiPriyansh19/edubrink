import { useState, useEffect } from "react";
import axios from "axios";

const useDropdownData = () => {
  const [dropdownData, setDropdownData] = useState({
    faculties: [],
    universities: [],
    blogs: [],
    courses: [],
    majors: [],
    tags: [],
  });

  const [searchInput, setSearchInput] = useState({
    facultyname: "",
    blogname: "",
    coursename: "",
    univername: "",
    majorname: "",
    tagname: "",
    id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://edu-brink-backend.vercel.app/api/helper");

        setDropdownData(response.data.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  // Generic Filtering Function
  const filterData = (data, searchKey, inputKey) => {
    return data
      ?.filter(
        (item) =>
          item[searchKey]?.en
            ?.toLowerCase()
            .includes(searchInput[inputKey]?.toLowerCase()) ||
          item[searchKey]?.ar
            ?.toLowerCase()
            .includes(searchInput[inputKey]?.toLowerCase())
      )
      .reduce((unique, item) => {
        if (!unique.some((u) => u._id === item._id)) {
          unique.push(item);
        }
        return unique;
      }, []);
  };

  const filteredData = {
    faculties: filterData(dropdownData.faculties, "facultyName", "facultyname"),
    universities: filterData(
      dropdownData.universities,
      "uniName",
      "univername"
    ),
    blogs: filterData(dropdownData.blogs, "blogTitle", "blogname"),
    courses: filterData(dropdownData.courses, "CourseName", "coursename"),
    majors: filterData(dropdownData.majors, "majorName", "majorname"),
  };

  const handleAdd = (field, value, setFormData, setShowDropdown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.some((item) => item._id === value._id)
        ? prev[field]
        : [...prev[field], value],
    }));
    setSearchInput((prev) => ({
      ...prev,
      [field]: "",
    }));
    setShowDropdown(false);
  };

  const handleRemove = (field, id, setFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item._id !== id),
    }));
  };

  return {
    filteredData,
    addTags: dropdownData.tags,
    searchInput,
    setSearchInput,
    handleAdd,
    handleRemove,
  };
};

export default useDropdownData;
