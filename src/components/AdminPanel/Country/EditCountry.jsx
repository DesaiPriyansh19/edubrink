import React, { useEffect, useRef, useState } from "react";
import UploadWidget from "../../../../utils/UploadWidget";
import InputField from "../../../../utils/InputField";
import ConfirmationModal from "../../../../utils/ConfirmationModal";
import axios from "axios";

export default function EditCountry({
  formData,
  handleEdit,
  setFormData,
  updateById,
  editData,
  initialFormData,
  deleteById,
  handleInputChange,
  handleMainPhotoChange,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const blogRef = useRef(null);
  const uniRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [addUniversity, setAddUniversity] = useState([]);
  const [addBlog, setAddBlog] = useState([]);
  const [showDropdown, setShowDropdown] = useState("");
  const [searchInput, setSearchInput] = useState({
    id: "",
    univername: "",
    blogname: "",
  });

  useEffect(() => {
    const handleUniversity = async () => {
      try {
        const res = await axios.get(
          `https://edu-brink-backend.vercel.app/api/university`
        );
        if (res) {
          setAddUniversity(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleBlog = async () => {
      try {
        const res = await axios.get(
          `https://edu-brink-backend.vercel.app/api/blog`
        );
        if (res) {
          setAddBlog(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleBlog();
    handleUniversity();
  }, []);

  const filteredUniversities = addUniversity?.filter(
    (university) =>
      university?.uniName?.en
        .toLowerCase()
        .includes(searchInput?.univername?.toLowerCase()) ||
      university?.uniName?.ar
        .toLowerCase()
        .includes(searchInput?.univername?.toLowerCase())
  );

  const filteredBlogs = addBlog?.filter(
    (university) =>
      university.blogTitle.en
        .toLowerCase()
        .includes(searchInput?.blogname?.toLowerCase()) ||
      university?.blogTitle?.ar
        .toLowerCase()
        .includes(searchInput?.blogname?.toLowerCase())
  );

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete this country ${name}?`,
      onConfirm: () => {
        deleteById(id); // Perform delete operation
        setModal(null); // Close modal
        handleEdit("View");
        setFormData(initialFormData);
      },
      onCancel: () => setModal(null), // Close modal
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      countryPhotos: {
        ...formData,
        mainPagePhoto: Array.isArray(formData.countryPhotos.mainPagePhoto)
          ? formData.countryPhotos.mainPagePhoto[0]
          : formData.countryPhotos.mainPagePhoto,
      },
      universities: formData.universities.map((university) => university._id),
      blog: formData.blog.map((blog) => blog._id),
    };

    console.log(updatedFormData);
    await updateById(editData.id, updatedFormData);

    handleEdit("View");
  };
  const handleAddItem = (itemType, filteredItems) => {
    if (searchInput[itemType] !== "" && searchInput.id !== "") {
      const selectedItem = filteredItems.find(
        (item) => item._id === searchInput.id
      );

      if (selectedItem) {
        // Determine the plural name for the itemType
        const itemPlural = itemType === "univername" ? "universities" : "blog";

        setFormData((prevData) => ({
          ...prevData,
          [itemPlural]: [...(prevData[itemPlural] || []), selectedItem],
        }));

        setSearchInput({
          id: "",
          [itemType]: "",
        });
      }
    }
  };

  const handleRemoveItem = (itemType, index) => {
    const itemPlural = itemType === "univername" ? "universities" : "blog";
    setFormData((prevData) => ({
      ...prevData,
      [itemPlural]: prevData[itemPlural].filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        blogRef.current &&
        !blogRef.current.contains(event.target) &&
        showDropdown === "Blog"
      ) {
        setShowDropdown("");
      }
      if (
        uniRef.current &&
        !uniRef.current.contains(event.target) &&
        showDropdown === "Uni"
      ) {
        setShowDropdown("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      {modal && (
        <ConfirmationModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
      <div className="text-white  mx-auto p-4">
        {" "}
        <div className="flex mb-6 justify-between">
          <div>
            {" "}
            <p className="text-xl font-semibold uppercase ">Edit Country</p>
            <p className=" text-sm text-gray-200">
              Edit Your Univeristy Portfolio
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className=" bg-green-500 text-white h-10 p-2 rounded "
            >
              Confirm
            </button>
            <button
              onClick={() => {
                handleEdit("View");
                setFormData(initialFormData);
              }}
              className=" bg-blue-500 text-white h-10 px-3 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(formData.id, formData.countryName.en);
              }}
              className=" bg-red-500 text-white h-10 px-3 rounded"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full  ">
          <form className="w-full text-white rounded shadow-md">
            <div className="flex w-full gap-4 items-center justify-between">
              <div className="mb-4 w-auto">
                <div className="relative w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                  {formData?.countryPhotos?.countryFlag ? (
                    <>
                      <div className="relative w-full h-full">
                        <img
                          src={formData?.countryPhotos?.countryFlag}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                          <button
                            onClick={() =>
                              setFormData((prevData) => ({
                                ...prevData,
                                countryPhotos: {
                                  ...prevData.countryPhotos,
                                  countryFlag: "",
                                },
                              }))
                            }
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <UploadWidget
                      uwConfig={{
                        cloudName: "edubrink",
                        uploadPreset: "EduBrinkImages",
                        multiple: false,
                        maxImageFileSize: 2000000,
                        folder: "country/Logo",
                      }}
                      setFormData={setFormData}
                      field="countryFlag"
                      uploadName="Upload Flag"
                      id="upload_country_flag"
                      className="text-xs text-black"
                    />
                  )}
                </div>
              </div>

              <div className="mb-4 w-full">
                <InputField
                  label="Country Name (English)"
                  type="text"
                  name="countryName.en"
                  placeholder="Country Name (English)"
                  value={formData?.countryName?.en}
                  onChange={handleInputChange}
                  autoComplete="countryName"
                  variant={1}
                />
              </div>
              <div className="mb-4 w-full">
                <InputField
                  label="اسم الدولة (عربي)"
                  type="text"
                  name="countryName.ar"
                  placeholder="اسم الدولة (عربي)"
                  value={formData?.countryName?.ar}
                  onChange={handleInputChange}
                  autoComplete="countryName"
                  variant={1}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Country Currency (عملة البلد)"
                  type="text"
                  name="countryCurrency"
                  placeholder="Enter Country Currency (أدخل عملة البلد)"
                  value={formData?.countryCurrency}
                  onChange={handleInputChange}
                  autoComplete="countryCurrency"
                  variant={1}
                />
              </div>
              <div className="mb-4 w-full">
                <InputField
                  label="Country Student Population (عدد الطلاب في الدولة)"
                  type="text"
                  name="countryStudentPopulation"
                  placeholder="Enter Student Population (أدخل عدد الطلاب)"
                  value={formData?.countryStudentPopulation}
                  onChange={handleInputChange}
                  autoComplete="countryStudentPopulation"
                  variant={1}
                />
              </div>
            </div>

            {/* Country Overview */}
            <div className="flex  w-full gap-4">
              <div className="w-full">
                <InputField
                  label="Country Overview (English)"
                  type="textarea"
                  name="countryOverview.en"
                  placeholder="Enter Country Overview "
                  value={formData?.countryOverview?.en}
                  onChange={handleInputChange}
                  autoComplete="countryOverview"
                  rows={5}
                  variant={1}
                />
              </div>
              <div className="w-full">
                <InputField
                  label="نظرة عامة على الدولة (العربية)"
                  type="textarea"
                  name="countryOverview.ar"
                  placeholder="أدخل نظرة عامة على البلد"
                  value={formData?.countryOverview?.ar}
                  onChange={handleInputChange}
                  autoComplete="countryOverview"
                  rows={5}
                  variant={1}
                />
              </div>
            </div>

            {/* CountryLanguage */}
            <div className="flex w-full gap-4 justify-between">
              <div className="mb-2">
                <h2 className="text-sm font-semibold">
                  Country Languages (اللغةالبلد)
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {formData?.countryLanguages?.map((photo, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mb-4 w-full">
                        <InputField
                          type="text"
                          name={`countryLanguages[${index}]`}
                          value={photo}
                          onChange={(e) =>
                            handleMainPhotoChange(
                              index,
                              "countryLanguages",
                              e.target.value
                            )
                          }
                          placeholder={`Add Another Language ${index + 1}`}
                          variant={1}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLanguage = [
                            ...formData.countryLanguages,
                          ];
                          updatedLanguage.splice(index, 1);
                          setFormData((prevData) => ({
                            ...prevData,
                            countryLanguages: updatedLanguage,
                          }));
                        }}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        countryLanguages: [
                          ...(prevData.countryLanguages || []),
                          "",
                        ], // Append a blank string
                      }));
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                  >
                    Add Another Language Field
                  </button>
                </div>
              </div>
            </div>

            {/* University Main Photo */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">
                University Main Photo (الصورة الرئيسية للجامعة)
              </h2>
              <div className="mb-2">
                {/* For mainPagePhoto */}
                <div className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label="Main Photo URL"
                      type="text"
                      name="countryPhotos.mainPagePhoto" // Single field, no array indexing
                      value={formData?.countryPhotos?.mainPagePhoto || ""}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          countryPhotos: {
                            ...prevData.countryPhotos,
                            mainPagePhoto: e.target.value,
                          },
                        }))
                      }
                      placeholder="Main Photo URL"
                      variant={1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        countryPhotos: {
                          ...prevData.countryPhotos,
                          mainPagePhoto: "", // Reset field
                        },
                      }));
                    }}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>

                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: false, // Only one photo
                    maxImageFileSize: 2000000,
                    folder: "country/CoverPhoto",
                  }}
                  setFormData={setFormData}
                  field="countryPhotos"
                  fieldName="mainPagePhoto" // Use mainPagePhoto directly
                  uploadName="Upload Univeristy Cover Photo"
                  id="upload_widget_country_cover_photo"
                />
              </div>
            </div>

            {/* Add University */}
            <div
              className={`pb-20 ${showDropdown === "Uni" ? "mb-24" : "mb-8"}`}
            >
              <h2 className="text-lg font-semibold mb-2">
                Manage Universities
              </h2>
              <div className="flex items-center gap-4 mb-4 w-full">
                <div className="w-full relative" ref={uniRef}>
                  <InputField
                    label="Enroll University (التسجيل في الجامعة)"
                    type="text"
                    placeholder="Enter University Name (أدخل اسم الجامعة)"
                    value={searchInput.univername}
                    onChange={(e) => {
                      setSearchInput((prev) => ({
                        ...prev,
                        univername: e.target.value,
                      }));
                      setShowDropdown("Uni");
                    }}
                    autoComplete="enrollUniversity"
                    onFocus={() => setShowDropdown("Uni")}
                    variant={1}
                  />
                  {showDropdown === "Uni" &&
                    filteredUniversities.length > 0 && (
                      <div className="absolute text-black bg-white border max-h-40  mt-1 w-full rounded shadow-lg  overflow-auto z-10">
                        <ul>
                          {filteredUniversities.map((university, index) => (
                            <li
                              key={index}
                              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                console.log("Selected University:", university);
                                setSearchInput((prev) => ({
                                  ...prev,
                                  id: university._id,
                                  univername: university.uniName.en,
                                }));
                                setShowDropdown("");
                              }}
                            >
                              {/* University Name */}
                              <span className="font-medium text-sm text-gray-800">
                                {`${university?.uniName?.en} - ${university?.uniName?.ar}`}
                              </span>

                              {/* Country Name */}
                              <span className="text-xs text-gray-500">
                                {`${university?.uniLocation?.uniCountry?.en} - ${university?.uniLocation?.uniCountry?.ar}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleAddItem("univername", filteredUniversities)
                  }
                  className="bg-transparent border-b-0 border hover:text-black hover:border-black hover:bg-white active:scale-95 transition-all ease-in-out duration-300 text-white px-4 py-2 "
                >
                  Add
                </button>
              </div>

              {/* List of Universities */}
              <ul className="list-disc">
                {formData?.universities?.map((university, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <span>{`${university?.uniName?.en} - ${university?.uniName?.ar} `}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("univername", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Blog */}
            <div
              className={`pb-20 ${showDropdown === "Blog" ? "mb-24" : "mb-8"}`}
            >
              <h2 className="text-lg font-semibold mb-2">Manage Blogs</h2>
              <div className="flex items-center gap-4 mb-4 w-full">
                <div className="w-full relative" ref={blogRef}>
                  <InputField
                    label="Search Blog (ابحث عن مدونة)"
                    type="text"
                    placeholder="Enter Blog Name (أدخل اسم المدونة)"
                    value={searchInput.blogname}
                    onChange={(e) => {
                      setSearchInput({
                        ...searchInput,
                        blogname: e.target.value,
                      });
                      setShowDropdown("Blog");
                    }}
                    autoComplete="searchBlog"
                    onFocus={() => setShowDropdown("Blog")}
                    variant={1}
                  />
                  {showDropdown === "Blog" && filteredBlogs.length > 0 && (
                    <div className="absolute text-black bg-white border max-h-40 mt-1 w-full rounded shadow-lg overflow-auto z-10">
                      <ul>
                        {filteredBlogs.map((blog, index) => (
                          <li
                            key={index}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setSearchInput((prev) => ({
                                ...prev,
                                id: blog._id,
                                blogname: blog.blogTitle.en,
                              }));
                              setShowDropdown("");
                            }}
                          >
                            {/* Blog Name */}
                            <span className="font-medium text-sm text-gray-800">
                              {`${blog?.blogTitle?.en} - ${blog?.blogTitle?.ar}`}
                            </span>

                            {/* Blog Subtitle */}
                            <span className="text-xs text-gray-500">
                              {`${blog?.blogSubtitle?.en} - ${blog?.blogSubtitle?.ar}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddItem("blogname", filteredBlogs)}
                  className="bg-transparent border-b-0 border hover:text-black hover:border-black hover:bg-white active:scale-95 transition-all ease-in-out duration-300 text-white px-4 py-2"
                >
                  Add
                </button>
              </div>

              {/* List of Blogs */}
              <ul className="list-disc">
                {formData?.blog?.map((blog, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <span>{`${blog?.blogTitle?.en} - ${blog?.blogTitle?.ar} `}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("blogname", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
