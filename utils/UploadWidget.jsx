import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({
  uwConfig,
  setFormData,
  field,
  fieldName,
  uploadName,
  id,
  className,
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById("uw")) {
      const script = document.createElement("script");
      script.id = "uw";
      script.src = "https://upload-widget.cloudinary.com/global/all.js"; // Correct script URL
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true); // Script already loaded
    }
  }, []);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
          } else if (result && result.event === "success") {
            console.log("Upload success:", result.info);

            // Update both single and array-based field in formData
            setFormData((prevData) => ({
              ...prevData,
              [field]: result.info.secure_url, // For single upload field
              [fieldName]: {
                ...(prevData[fieldName] || {}), // Ensure fieldName exists as an object
                photos: [
                  ...(prevData[fieldName]?.photos || []), // Ensure photos exists as an array
                  result.info.secure_url, // Append the new URL
                ],
              },
            }));
          }
        }
      );

      if (!document.getElementById(id).hasAttribute("data-listener-attached")) {
        document
          .getElementById(id)
          .addEventListener("click", () => myWidget.open(), false);
        document
          .getElementById(id)
          .setAttribute("data-listener-attached", "true");
      }
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        type="button"
        id={id}
        className={`${
          className
            ? className
            : "border border-blue-500 text-blue-500 px-4 py-2 rounded-lg mt-2"
        }`}
        onClick={initializeCloudinaryWidget}
        disabled={!loaded} // Disable button if widget isn't loaded yet
      >
        {uploadName}
      </button>
      {!loaded && <p>Loading Cloudinary widget...</p>}
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
