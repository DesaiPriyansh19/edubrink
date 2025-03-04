import InputField from "./InputField";
import UploadWidget from "./UploadWidget";

const ArrayFieldAndPhotos = ({
  title,
  fields,
  fieldName,
  formData,
  photosTitle,
  setFormData,
  handleInputChange,
  handleMainPhotoChange,
  uploadConfig,
  photosKey,
}) => {

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };
  
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {/* Dynamic Input Fields */}
      {fields?.map(({ label, name, placeholder, lang }) => (
        <InputField
          key={name}
          label={label}
          type="text"
          name={name}
          placeholder={placeholder}
          value={getNestedValue(formData, name)}
          onChange={handleInputChange}
          variant={3}
        />
      ))}

      {/* Photos Section */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold">{photosTitle} Photos</h2>
        {formData?.[fieldName]?.[photosKey]?.map((photo, index) => (
          <div key={index} className="flex items-center">
            <div className="mb-4 w-full">
              <InputField
                label={`Main Photo URL ${index + 1}`}
                type="text"
                name={`${fieldName}.${photosKey}[${index}]`}
                value={photo}
                onChange={(e) =>
                  handleMainPhotoChange(
                    index,
                    `${fieldName}.${photosKey}`,
                    e.target.value
                  )
                }
                placeholder={`Main Photo URL ${index + 1}`}
                variant={3}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updatedPhotos = [
                  ...(formData?.[fieldName]?.[photosKey] || []),
                ];
                updatedPhotos.splice(index, 1);
                setFormData((prevData) => ({
                  ...prevData,
                  [fieldName]: {
                    ...prevData[fieldName],
                    [photosKey]: updatedPhotos,
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
                [fieldName]: {
                  ...prevData[fieldName],
                  [photosKey]: [
                    ...(prevData[fieldName]?.[photosKey] || []),
                    "",
                  ],
                },
              }));
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Add Blank Field
          </button>

          {/* Upload Widget */}
          <UploadWidget
            uwConfig={{
              cloudName: uploadConfig.cloudName,
              uploadPreset: uploadConfig.uploadPreset,
              multiple: true,
              maxImageFileSize: uploadConfig.maxImageFileSize,
              folder: uploadConfig.folder,
            }}
            setFormData={setFormData}
            field={fieldName}
            fieldName={uploadConfig.fieldName}
            uploadName={uploadConfig.uploadName}
            id={`upload_widget_${fieldName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ArrayFieldAndPhotos;
