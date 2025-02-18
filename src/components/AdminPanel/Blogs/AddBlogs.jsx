import React from "react";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";
import validationBlogSchema from "./ValidationBlogs";

export default function AddBlogs({
  handleEdit,
  addNew,
  setFormData,
  formData,
  handleInputChange,
  validationErrors,
  setValidationErrors,
  addArray,
  removeArray,
  initialFormData,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate formData using Yup
      await validationBlogSchema.validate(formData, { abortEarly: false });

      await addNew(formData);
      setFormData({ ...initialFormData });
      handleEdit("View");
    } catch (err) {
      if (err.inner) {
        const formattedErrors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});

        setValidationErrors(formattedErrors);
      }
    }
  };
  return (
    <>
      <div className="text-white  mx-auto p-4">
        {" "}
        <div className="flex mb-6 justify-between">
          <div>
            {" "}
            <p className="text-xl font-semibold uppercase ">Add Blogs</p>
            <p className=" text-sm text-gray-200">Add Your Blogs</p>
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
            {/* Blog Title (English) */}
            <div className="flex w-full gap-4 items-center justify-between">
              <div className="mb-4 w-full">
                <InputField
                  label="Blog Title (English)"
                  type="text"
                  name="blogTitle.en"
                  placeholder="Blog Title (English)"
                  value={formData?.blogTitle?.en}
                  onChange={handleInputChange}
                  error={validationErrors["blogTitle.en"]}
                  autoComplete="blogTitle"
                  variant={1}
                />
              </div>
              {/* Blog Title (Arabic) */}
              <div className="mb-4 w-full">
                <InputField
                  label="عنوان المدونة (عربي)"
                  type="text"
                  name="blogTitle.ar"
                  placeholder="عنوان المدونة (عربي)"
                  value={formData?.blogTitle?.ar}
                  onChange={handleInputChange}
                  error={validationErrors["blogTitle.ar"]}
                  autoComplete="blogTitle"
                  variant={1}
                />
              </div>
            </div>

            {/* Blog Subtitle */}
            <div className="flex w-full gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Blog Subtitle (English)"
                  type="text"
                  name="blogSubtitle.en"
                  placeholder="Enter Blog Subtitle (English)"
                  value={formData?.blogSubtitle?.en}
                  error={validationErrors["blogSubtitle.en"]}
                  onChange={handleInputChange}
                  autoComplete="blogSubtitle"
                  variant={1}
                />
              </div>
              <div className="mb-4 w-full">
                <InputField
                  label="عنوان فرعي (عربي)"
                  type="text"
                  name="blogSubtitle.ar"
                  placeholder="أدخل العنوان الفرعي (عربي)"
                  value={formData?.blogSubtitle?.ar}
                  onChange={handleInputChange}
                  error={validationErrors["blogSubtitle.ar"]}
                  autoComplete="blogSubtitle"
                  variant={1}
                />
              </div>
            </div>

            {/* Blog Description */}
            <div className="flex w-full gap-4">
              <div className="mb-4 w-full">
                <InputField
                  label="Blog Description (English)"
                  type="textarea"
                  name="blogDescription.en"
                  placeholder="Enter Blog Description (English)"
                  value={formData?.blogDescription?.en}
                  onChange={handleInputChange}
                  error={validationErrors["blogDescription.en"]}
                  autoComplete="blogDescription"
                  rows={5}
                  variant={1}
                />
              </div>
              <div className="mb-4 w-full">
                <InputField
                  label="وصف المدونة (عربي)"
                  type="textarea"
                  name="blogDescription.ar"
                  placeholder="أدخل وصف المدونة (عربي)"
                  value={formData?.blogDescription?.ar}
                  onChange={handleInputChange}
                  error={validationErrors["blogDescription.ar"]}
                  autoComplete="blogDescription"
                  rows={5}
                  variant={1}
                />
              </div>
            </div>

            {/* Blog Photo  */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">
                Blog Photo URL (رابط الصورة المدونة)
              </h2>
              <div className="mb-2">
                {/* For blogPhoto */}
                <div className="flex items-center">
                  <div className="mb-4 w-full">
                    <InputField
                      label="Blog Photo URL"
                      type="text"
                      name="blogPhoto"
                      placeholder="Enter Blog Photo URL"
                      value={formData?.blogPhoto}
                      onChange={handleInputChange}
                      autoComplete="blogPhoto"
                      variant={1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        blogPhoto: "", // Reset field
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
                    folder: "blog/Photos",
                  }}
                  setFormData={setFormData}
                  field="blogPhoto"
                  uploadName="Upload Blog Photo"
                  id="upload_widget_blog_photo"
                />
              </div>
            </div>

            {/* Related Blogs */}
            <div className="flex flex-wrap gap-4">
              {formData?.blogRelated.map((related, index) => (
                <div key={index} className="w-full flex gap-4 relative">
                  {/* Related Blog (English) */}
                  <div className="w-full">
                    <InputField
                      label={`Related Blog (English) ${index + 1}`}
                      type="text"
                      name={`blogRelated[${index}].en`}
                      placeholder="Related Blog (English)"
                      value={related?.en}
                      onChange={handleInputChange}
                      error={validationErrors[`blogRelated[${index}].en`]}
                      autoComplete="blogRelated"
                      variant={1}
                    />
                  </div>
                  {/* Related Blog (Arabic) */}
                  <div className="w-full">
                    <InputField
                      label={`مدونة ذات صلة (عربي) ${index + 1}`}
                      type="text"
                      name={`blogRelated[${index}].ar`}
                      placeholder="مدونة ذات صلة (عربي)"
                      value={related?.ar}
                      onChange={handleInputChange}
                      error={validationErrors[`blogRelated[${index}].ar`]}
                      autoComplete="blogRelated"
                      variant={1}
                    />
                  </div>
                  {/* Remove Button (Cross) */}
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    onClick={() => removeArray("blogRelated", index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              {/* Add New Related Blog */}
              <div className="w-full mb-4">
                <button
                  type="button"
                  className="text-blue-500 border border-blue-500 hover:border-blue-700 px-4 py-2 rounded hover:text-blue-700"
                  onClick={() => addArray("blogRelated")}
                >
                  Add New Related Blog
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
