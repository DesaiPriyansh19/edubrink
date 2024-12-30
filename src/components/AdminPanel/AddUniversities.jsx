import React from "react";
import UploadWidget from "../../../utils/UploadWidget";
import InputField from "../../../utils/InputField";

export default function AddUniversities({
  addNew,
  formData,
  handleEdit,
  setFormData,
}) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addNew(formData);
    handleEdit("View");
  };

  return (
    <div className="text-white  mx-auto p-4">
      {" "}
      <div className="flex mb-6 justify-between">
        <div>
          {" "}
          <p className="text-xl font-semibold uppercase ">Add Property</p>
          <p className=" text-sm text-gray-200">
            Add New Real Estate To Your Portfolio
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className=" bg-blue-500 text-white h-10 p-2 rounded "
          >
            Confirm
          </button>
          <button
            onClick={() => {
              handleEdit("View");
            }}
            className=" bg-red-500 text-white h-10 px-3 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full  ">
        <form className="w-full text-white rounded shadow-md">
          {/* University Name and Scholarship Availability */}
          <div className="flex w-full gap-4 items-center justify-between">
            <div className="mb-4 w-auto">
              <div className="relative w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                {formData.uniSymbol ? (
                  <>
                    <div className="relative w-full h-full">
                      <img
                        src={formData.uniSymbol}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <button
                          onClick={() =>
                            setFormData((prevData) => ({
                              ...prevData,
                              uniSymbol: "",
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
                      folder: "university/Logo",
                    }}
                    setFormData={setFormData}
                    field="uniSymbol"
                    uploadName="Upload Logo"
                    id="upload_widget_logo"
                    className="text-xs text-black"
                  />
                )}
              </div>
            </div>

            <div className="mb-4 w-full">
              <InputField
                label="University Name (English)"
                type="text"
                name="uniName.en"
                placeholder="University Name (English)"
                value={formData.uniName.en}
                onChange={handleInputChange}
                autoComplete="uniName"
                variant={1}
              />
            </div>
            <div className="mb-4 w-full">
              <InputField
                label="اسم الجامعة (عربي)"
                type="text"
                name="uniName.ar"
                placeholder="اسم الجامعة (عربي)"
                value={formData.uniName.ar}
                onChange={handleInputChange}
                autoComplete="uniName"
                variant={1}
              />
            </div>
          </div>
          <div className="flex w-full gap-4 justify-between">
            <div className="mb-4 w-full">
              <InputField
                label="Scholarship Availability (توافر المنح الدراسية)"
                type="select"
                name="scholarshipAvailability"
                value={formData.scholarshipAvailability}
                onChange={handleInputChange}
                variant={1}
                options={[
                  { value: "true", label: "True (حقيقي)" },
                  { value: "false", label: "False (خطأ شنيع)" },
                ]}
              />
            </div>
            <div className="mb-4 w-full">
              <InputField
                label="Entrance Exam Required (امتحان القبول مطلوب)"
                type="select"
                name="entranceExamRequired"
                value={formData.entranceExamRequired}
                onChange={handleInputChange}
                variant={1}
                options={[
                  { value: "true", label: "True (حقيقي)" },
                  { value: "false", label: "False (خطأ شنيع)" },
                ]}
              />
            </div>
            <div className="mb-4 w-full">
              <InputField
                label="Study Level  (مستوى الدراسة)"
                type="select"
                name="studyLevel"
                value={formData.studyLevel}
                onChange={handleInputChange}
                variant={1}
                options={[
                  {
                    value: "UnderGraduate",
                    label: "UnderGraduate (المرحلة الجامعية)",
                  },
                  {
                    value: "PostGraduate",
                    label: "PostGraduate (الدراسات العليا)",
                  },
                  { value: "Foundation", label: "Foundation (مؤسسة)" },
                  { value: "Doctorate", label: "Doctorate (دكتوراه)" },
                ]}
              />
            </div>
          </div>

          {/* University Location */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              University Location (موقع الجامعة)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Address (English)"
                type="text"
                name="uniLocation.uniAddress.en"
                placeholder="Address (English)"
                value={formData.uniLocation.uniAddress.en}
                onChange={handleInputChange}
                variant={1}
              />
              <InputField
                label="عنوان (عربي)"
                type="text"
                name="uniLocation.uniAddress.ar"
                placeholder="عنوان (عربي)"
                value={formData.uniLocation.uniAddress.ar}
                onChange={handleInputChange}
                variant={1}
              />
              <InputField
                label="City (English)"
                type="text"
                name="uniLocation.uniCity.en"
                placeholder="City (English)"
                value={formData.uniLocation.uniCity.en}
                onChange={handleInputChange}
                variant={1}
              />
              <InputField
                label="مدينة (عربي)"
                type="text"
                name="uniLocation.uniCity.ar"
                placeholder="مدينة (عربي)"
                value={formData.uniLocation.uniCity.ar}
                onChange={handleInputChange}
                variant={1}
              />
              <div className="col-span-2">
                <InputField
                  label="Pincode (الرمز السري)"
                  type="text"
                  name="uniLocation.uniPincode"
                  placeholder="Pincode (الرمز السري)"
                  value={formData.uniLocation.uniPincode}
                  onChange={handleInputChange}
                  variant={1}
                />
              </div>
              <InputField
                label="Country (English)"
                type="text"
                name="uniLocation.uniCountry.en"
                placeholder="Country (English)"
                value={formData.uniLocation.uniCountry.en}
                onChange={handleInputChange}
                variant={1}
              />
              <InputField
                label="دولة (عربي)"
                type="text"
                name="uniLocation.uniCountry.ar"
                placeholder="دولة (عربي)"
                value={formData.uniLocation.uniCountry.ar}
                onChange={handleInputChange}
                variant={1}
              />
            </div>
          </div>

          {/* Tuition Fees */}
          <div className="mb-4">
            <InputField
              label="Tuition Fees (الرسوم الدراسية)"
              type="number"
              name="uniTutionFees"
              placeholder="Tuition Fees (الرسوم الدراسية)"
              value={formData.uniTutionFees}
              onChange={handleInputChange}
              variant={1}
            />
          </div>

          {/* Overview */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              University Overview (نظرة عامة على الجامعة)
            </h2>
            <InputField
              label="Overview (English)"
              type="textarea"
              name="uniOverview.en"
              placeholder="Overview (English)"
              value={formData.uniOverview.en}
              onChange={handleInputChange}
              variant={1}
            />
            <InputField
              label="ملخص (عربي)"
              type="textarea"
              name="uniOverview.ar"
              placeholder="ملخص (عربي)"
              value={formData.uniOverview.ar}
              onChange={handleInputChange}
              variant={1}
            />
          </div>

          {/* Accommodation */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              University Accommodation (السكن الجامعي)
            </h2>
            <InputField
              label="Accommodation (English)"
              type="textarea"
              name="uniAccomodation.en"
              placeholder="Accommodation (English)"
              value={formData.uniAccomodation.en}
              onChange={handleInputChange}
              variant={1}
            />
            <InputField
              label="إقامة (عربي)"
              type="text"
              name="uniAccomodation.ar"
              placeholder="إقامة (عربي)"
              value={formData.uniAccomodation.ar}
              onChange={handleInputChange}
              variant={1}
            />
          </div>

          <div className="mb-20">
            <h2 className="text-lg font-semibold mb-2">
              University Library (مكتبة الجامعة)
            </h2>
            <InputField
              label="Library Description (English)"
              type="text"
              name="uniLibrary.libraryDescription.en"
              placeholder="Library Description (English)"
              value={formData?.uniLibrary?.libraryDescription.en}
              onChange={handleInputChange}
              variant={1}
            />
            <InputField
              label="وصف المكتبة (عربي)"
              type="textarea"
              name="uniLibrary.libraryDescription.ar"
              placeholder="وصف المكتبة (عربي)"
              value={formData?.uniLibrary?.libraryDescription.ar}
              onChange={handleInputChange}
              variant={1}
            />
            <div className="mb-2">
              <h2 className="text-sm font-semibold">
                library Photos (صور المكتبة)
              </h2>
              {formData?.uniLibrary?.libraryPhotos.map((photo, index) => (
                <div key={index} className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label={`Main Photo URL ${index + 1}`}
                      type="text"
                      name={`uniLibrary.libraryPhotos[${index}]`}
                      value={photo}
                      onChange={(e) =>
                        handleMainPhotoChange(
                          index,
                          "uniLibrary.libraryPhotos",
                          e.target.value
                        )
                      }
                      placeholder={`Main Photo URL ${index + 1}`}
                      variant={1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPhotos = [
                        ...formData.uniLibrary.libraryPhotos,
                      ];
                      updatedPhotos.splice(index, 1);
                      setFormData((prevData) => ({
                        ...prevData,
                        uniSports: {
                          ...prevData.uniLibrary,
                          libraryPhotos: updatedPhotos,
                        },
                      }));
                    }}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prevData) => ({
                      ...prevData,
                      uniLibrary: {
                        ...prevData.uniLibrary,
                        libraryPhotos: [
                          ...prevData.uniLibrary.libraryPhotos,
                          "",
                        ],
                      },
                    }));
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Add Blank Field
                </button>
                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: true,
                    maxImageFileSize: 2000000,
                    folder: "university/libraryImages",
                  }}
                  setFormData={setFormData}
                  field="uniLibrary"
                  fieldName="libraryPhotos"
                  uploadName="Upload Library Photo"
                  id="upload_widget_library"
                />
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-lg font-semibold mb-2">
              University Sports (الرياضة الجامعية)
            </h2>
            <InputField
              label="Sports Description (English)"
              type="text"
              name="uniSports.sportsDescription.en"
              placeholder="Sports Description (English)"
              value={formData.uniSports.sportsDescription.en}
              onChange={handleInputChange}
              variant={1}
            />
            <InputField
              label="وصف الرياضة (عربي)"
              type="text"
              name="uniSports.sportsDescription.ar"
              placeholder="وصف الرياضة (عربي)"
              value={formData.uniSports.sportsDescription.ar}
              onChange={handleInputChange}
              variant={1}
            />
            <div className="mb-2">
              <h2 className="text-sm font-semibold">
                Sports Photos (صور رياضية)
              </h2>
              {formData.uniSports.sportsPhotos.map((photo, index) => (
                <div key={index} className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label={`Main Photo URL ${index + 1}`}
                      type="text"
                      name={`uniSports.sportsPhotos[${index}]`}
                      value={photo}
                      onChange={(e) =>
                        handleMainPhotoChange(
                          index,
                          "uniSports.sportsPhotos",
                          e.target.value
                        )
                      }
                      placeholder={`Main Photo URL ${index + 1}`}
                      variant={1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPhotos = [
                        ...formData.uniSports.sportsPhotos,
                      ];
                      updatedPhotos.splice(index, 1);
                      setFormData((prevData) => ({
                        ...prevData,
                        uniSports: {
                          ...prevData.uniSports,
                          sportsPhotos: updatedPhotos,
                        },
                      }));
                    }}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prevData) => ({
                      ...prevData,
                      uniSports: {
                        ...prevData.uniSports,
                        sportsPhotos: [...prevData.uniSports.sportsPhotos, ""],
                      },
                    }));
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Add Blank Field
                </button>
                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: true,
                    maxImageFileSize: 2000000,
                    folder: "university/sportsImage",
                  }}
                  setFormData={setFormData}
                  field="uniSports"
                  fieldName="sportsPhotos"
                  uploadName="Upload Sports Photo"
                  id="upload_widget_sports"
                />
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-lg font-semibold mb-2">
              Student Lifestyle in University (نمط حياة الطالب في الجامعة)
            </h2>
            <InputField
              label="Lifestyle Description (English)"
              type="text"
              name="studentLifeStyleInUni.lifestyleDescription.en"
              placeholder="Lifestyle Description (English)"
              value={formData.studentLifeStyleInUni.lifestyleDescription.en}
              onChange={handleInputChange}
              variant={1}
            />
            <InputField
              label="وصف أسلوب الحياة (عربي)"
              type="text"
              name="studentLifeStyleInUni.lifestyleDescription.ar"
              placeholder="وصف أسلوب الحياة (عربي)"
              value={formData.studentLifeStyleInUni.lifestyleDescription.ar}
              onChange={handleInputChange}
              variant={1}
            />
            <div className="mb-2">
              <h2 className="text-sm font-semibold">
                Sports Photos (صور رياضية)
              </h2>
              {formData.studentLifeStyleInUni.lifestylePhotos.map(
                (photo, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mb-4 w-full">
                      <InputField
                        label={`Main Photo URL ${index + 1}`}
                        type="text"
                        name={`studentLifeStyleInUni.lifestylePhotos[${index}]`}
                        value={photo}
                        onChange={(e) =>
                          handleMainPhotoChange(
                            index,
                            "studentLifeStyleInUni.lifestylePhotos",
                            e.target.value
                          )
                        }
                        placeholder={`Main Photo URL ${index + 1}`}
                        variant={1}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedPhotos = [
                          ...formData.studentLifeStyleInUni.lifestylePhotos,
                        ];
                        updatedPhotos.splice(index, 1);
                        setFormData((prevData) => ({
                          ...prevData,
                          studentLifeStyleInUni: {
                            ...prevData.studentLifeStyleInUni,
                            lifestylePhotos: updatedPhotos,
                          },
                        }));
                      }}
                      className="text-red-500 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prevData) => ({
                      ...prevData,
                      studentLifeStyleInUni: {
                        ...prevData.studentLifeStyleInUni,
                        lifestylePhotos: [
                          ...prevData.studentLifeStyleInUni.lifestylePhotos,
                          "",
                        ],
                      },
                    }));
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Add Blank Field
                </button>
                <UploadWidget
                  uwConfig={{
                    cloudName: "edubrink",
                    uploadPreset: "EduBrinkImages",
                    multiple: true,
                    maxImageFileSize: 2000000,
                    folder: "university/lifestyleImages",
                  }}
                  setFormData={setFormData}
                  field="studentLifeStyleInUni"
                  fieldName="lifestylePhotos"
                  uploadName="Upload Lifestyle Photo"
                  id="upload_widget_lifestyle"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
