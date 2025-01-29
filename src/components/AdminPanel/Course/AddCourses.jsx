import React from "react";
import InputField from "../../../../utils/InputField";

export default function AddCourses({
  handleEdit,
  addNew,
  setFormData,
  formData,
  handleInputChange,
  addArray,
  removeArray,
  initialFormData,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNew(formData);
    handleEdit("View");
  };

  return (
    <>
      <div className="text-white  mx-auto p-4">
        {" "}
        <div className="flex mb-6 justify-between">
          <div>
            {" "}
            <p className="text-xl font-semibold uppercase ">Edit Courses</p>
            <p className=" text-sm text-gray-200">Edit Your Courses</p>
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
          </div>
        </div>
        <div className="flex justify-center items-center w-full  ">
          <form className="w-full text-white rounded shadow-md">
            <div className="flex w-full gap-4 items-center justify-between">
              {/* Course Name (English) */}
              <div className="mb-4 w-full">
                <InputField
                  label="Course Name (English)"
                  type="text"
                  name="CourseName.en"
                  placeholder="Course Name (English)"
                  value={formData?.CourseName?.en}
                  onChange={handleInputChange}
                  autoComplete="courseName"
                  variant={1}
                />
              </div>
              {/* Course Name (Arabic) */}
              <div className="mb-4 w-full">
                <InputField
                  label="اسم الدورة (عربي)"
                  type="text"
                  name="CourseName.ar"
                  placeholder="اسم الدورة (عربي)"
                  value={formData?.CourseName?.ar}
                  onChange={handleInputChange}
                  autoComplete="courseName"
                  variant={1}
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="flex w-full gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Course Description (English)"
                  type="textarea"
                  name="CourseDescription.en"
                  placeholder="Enter Course Description"
                  value={formData?.CourseDescription?.en}
                  onChange={handleInputChange}
                  autoComplete="courseDescription"
                  rows={5}
                  variant={1}
                />
              </div>
              <div className="mb-4 w-full">
                <InputField
                  label="وصف الدورة (عربي)"
                  type="textarea"
                  name="CourseDescription.ar"
                  placeholder="أدخل وصف الدورة"
                  value={formData?.CourseDescription?.ar}
                  onChange={handleInputChange}
                  autoComplete="courseDescription"
                  rows={5}
                  variant={1}
                />
              </div>
            </div>

            {/* Course Duration */}
            <div className="flex w-full gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Course Duration"
                  type="text"
                  name="CourseDuration"
                  placeholder="Enter Course Duration"
                  value={formData?.CourseDuration}
                  onChange={handleInputChange}
                  autoComplete="courseDuration"
                  variant={1}
                />
              </div>

              {/* DeadLine */}
              <div className="mb-4 w-full">
                <InputField
                  label="Deadline"
                  type="date"
                  name="DeadLine"
                  value={formData?.DeadLine || ""}
                  onChange={handleInputChange}
                  autoComplete="deadLine"
                  variant={1}
                />
              </div>

              {/* Course Fees */}
              <div className="mb-4 w-full">
                <InputField
                  label="Course Fees"
                  type="number"
                  name="CourseFees"
                  placeholder="Enter Course Fees"
                  value={formData?.CourseFees}
                  onChange={handleInputChange}
                  autoComplete="courseFees"
                  variant={1}
                />
              </div>
            </div>

            {/* Mode of Study */}
            <div className="flex flex-wrap gap-4">
              {formData?.ModeOfStudy.map((mode, index) => (
                <div key={index} className="w-full  flex gap-4 relative">
                  {/* Mode of Study (English) */}
                  <div className="w-full">
                    <InputField
                      label={`Mode of Study (English) ${index + 1}`}
                      type="text"
                      name={`ModeOfStudy[${index}].en`}
                      placeholder="Mode of Study (English)"
                      value={mode?.en}
                      onChange={handleInputChange}
                      autoComplete="modeOfStudy"
                      variant={1}
                    />
                  </div>
                  {/* Mode of Study (Arabic) */}
                  <div className="w-full">
                    <InputField
                      label={`طريقة الدراسة (عربي) ${index + 1}`}
                      type="text"
                      name={`ModeOfStudy[${index}].ar`}
                      placeholder="طريقة الدراسة (عربي)"
                      value={mode?.ar}
                      onChange={handleInputChange}
                      autoComplete="modeOfStudy"
                      variant={1}
                    />
                  </div>
                  {/* Remove Button (Cross) */}
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    onClick={() => removeArray("ModeOfStudy", index)}
                  >
                    ✖
                  </button>
                </div>
              ))}

              {/* Add New Mode of Study */}
              <div className="w-full mb-4">
                <button
                  type="button"
                  className="text-blue-500 border border-blue-500 hover:border-blue-700 px-4 py-2 rounded hover:text-blue-700"
                  onClick={() => addArray("ModeOfStudy")}
                >
                  Add New Mode of Study
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="flex flex-wrap gap-4">
              {formData?.Requirements?.map((requirement, index) => (
                <div key={index} className="w-full relative flex gap-4 ">
                  <div className="w-full">
                    <InputField
                      label={`Requirement (English) ${index + 1}`}
                      type="text"
                      name={`Requirements[${index}].en`} // Dynamic name to bind to array index
                      placeholder="Requirement (English)"
                      value={requirement?.en}
                      onChange={handleInputChange}
                      autoComplete="requirement"
                      variant={1}
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      label={`المتطلبات (عربي) ${index + 1}`}
                      type="text"
                      name={`Requirements[${index}].ar`} // Dynamic name to bind to array index
                      placeholder="المتطلبات (عربي)"
                      value={requirement?.ar}
                      onChange={handleInputChange}
                      autoComplete="requirement"
                      variant={1}
                    />
                  </div>
                  {/* Add a remove button to delete a requirement */}
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    onClick={() => removeArray("Requirements", index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              {/* Add a button to add a new requirement */}
              <button
                type="button"
                onClick={() => addArray("Requirements")}
                className="text-blue-500 border border-blue-500 hover:border-blue-700 px-4 py-2 rounded hover:text-blue-700"
              >
                Add Requirement
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
