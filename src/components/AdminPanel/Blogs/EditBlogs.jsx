import React, { useState } from "react";
import ConfirmationModal from "../../../../utils/ConfirmationModal";
import InputField from "../../../../utils/InputField";
import UploadWidget from "../../../../utils/UploadWidget";

export default function EditBlogs({
  formData,
  handleEdit,
  setFormData,
  updateById,
  editData,
  initialFormData,
  deleteById,
  handleInputChange,
  addArray,
  removeArray,
}) {
  const [modal, setModal] = useState(null);

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete this blog ${name}?`,
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
    await updateById(editData.id, formData);
    handleEdit("View");
  };

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
            <button
              onClick={() => {
                handleDelete(formData.id, formData.blogTitle.en);
              }}
              className=" bg-red-500 text-white h-10 px-3 rounded"
            >
              Delete
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
