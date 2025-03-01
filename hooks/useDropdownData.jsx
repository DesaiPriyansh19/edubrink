import { useState, useEffect } from "react";
import axios from "axios";
import { g } from "framer-motion/client";

const useDropdownData = () => {
  const [addMajor, setAddMajor] = useState([]);
  const [addFaculty, setAddFaculty] = useState([]);
  const [addUniversity, setAddUniversity] = useState([]);
  const [addBlog, setAddBlog] = useState([]);
  const [addCourse, setAddCourse] = useState([]);
  const [addTags, setAddTags] = useState([]);
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
        const [
          facultyRes,
          universityRes,
          blogRes,
          courseRes,
          majorRes,
          tagsRes,
        ] = await Promise.all([
          axios.get("https://edu-brink-backend.vercel.app/api/faculty"),
          axios.get("https://edu-brink-backend.vercel.app/api/university"),
          axios.get("https://edu-brink-backend.vercel.app/api/blog"),
          axios.get("https://edu-brink-backend.vercel.app/api/course"),
          axios.get("https://edu-brink-backend.vercel.app/api/majors"),
          axios.get("https://edu-brink-backend.vercel.app/api/tags"),
        ]);

        setAddFaculty(facultyRes.data.data);
        setAddUniversity(universityRes.data.data);
        setAddBlog(blogRes.data.data);
        setAddCourse(courseRes.data.data);
        setAddMajor(majorRes.data.data);
        setAddTags(tagsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const filteredUniversities = filterData(
    addUniversity,
    "uniName",
    "univername"
  );
  const filteredBlogs = filterData(addBlog, "blogTitle", "blogname");
  const filteredFaculty = filterData(addFaculty, "facultyName", "facultyname");
  const filteredCourses = filterData(addCourse, "CourseName", "coursename");
  const filteredMajor = filterData(addMajor, "majorName", "majorname");

  const handleAdd = (field, value, setFormData, setShowDropdown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.some((item) => item._id === value._id)
        ? prev[field]
        : [...prev[field], value],
    }));
    setSearchInput({
      facultyname: "",
      blogname: "",
      univername: "",
      coursename: "",
      majorname: "",
      id: "",
    });
    setShowDropdown(false);
  };

  const handleRemove = (field, id, setFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item._id !== id),
    }));
  };

  return {
    filteredUniversities,
    filteredBlogs,
    filteredFaculty,
    filteredCourses,
    filteredMajor,
    addTags,
    searchInput,
    setSearchInput,
    handleAdd,
    handleRemove,
  };
};

export default useDropdownData;
