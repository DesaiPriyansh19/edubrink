import React, { useState } from "react";
import { Plus, MapPin, Building, Camera, Trash2 } from "lucide-react";
import UploadWidget from "../../../../utils/UploadWidget";
import InputField from "../../../../utils/InputField";

const CampusSection = ({ formData, setFormData }) => {
  const [activeCampus, setActiveCampus] = useState(0);
  const [newFacility, setNewFacility] = useState("");

  const addCampus = () => {
    setFormData((prevData) => ({
      ...prevData,
      campuses: [
        ...prevData.campuses,
        {
          campusName: { en: "", ar: "" },
          campusLocation: {
            uniAddress: { en: "", ar: "" },
            uniPincode: "",
            uniCity: { en: "", ar: "" },
            uniState: { en: "", ar: "" },
            uniCountry: { en: "", ar: "" },
          },
          campusFacilities: [],
          campusPhotos: [],
        },
      ],
    }));
    // Set the newly added campus as active
    setActiveCampus(formData.campuses.length);
  };

  const removeCampus = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      campuses: prevData.campuses.filter((_, i) => i !== index),
    }));
    // Adjust active campus if needed
    if (activeCampus === index) {
      setActiveCampus(Math.max(0, index - 1));
    } else if (activeCampus > index) {
      setActiveCampus(activeCampus - 1);
    }
  };

  const handleCampusChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedCampuses = [...prevData.campuses];

      // Handle nested fields with dot notation
      if (field.includes(".")) {
        const [parent, child, grandchild] = field.split(".");
        if (grandchild) {
          updatedCampuses[index][parent][child][grandchild] = value;
        } else {
          updatedCampuses[index][parent][child] = value;
        }
      } else {
        updatedCampuses[index][field] = value;
      }

      return { ...prevData, campuses: updatedCampuses };
    });
  };

  const addFacility = (index) => {
    if (newFacility.trim()) {
      setFormData((prevData) => {
        const updatedCampuses = [...prevData.campuses];
        updatedCampuses[index].campusFacilities = [
          ...updatedCampuses[index].campusFacilities,
          newFacility.trim(),
        ];
        return { ...prevData, campuses: updatedCampuses };
      });
      setNewFacility("");
    }
  };

  const removeFacility = (campusIndex, facilityIndex) => {
    setFormData((prevData) => {
      const updatedCampuses = [...prevData.campuses];
      updatedCampuses[campusIndex].campusFacilities = updatedCampuses[
        campusIndex
      ].campusFacilities.filter((_, i) => i !== facilityIndex);
      return { ...prevData, campuses: updatedCampuses };
    });
  };

  const handlePhotoUpload = (index, photos) => {
    setFormData((prevData) => {
      const updatedCampuses = [...prevData.campuses];
      // If photos is a string (single photo), convert to array
      const photoArray = typeof photos === "string" ? [photos] : photos;
      updatedCampuses[index].campusPhotos = photoArray;
      return { ...prevData, campuses: updatedCampuses };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <Building className="w-5 h-5 mr-2" />
          University Campuses
        </h2>
        <button
          type="button"
          onClick={addCampus}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Campus
        </button>
      </div>

      {/* Campus tabs */}
      {formData.campuses.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {formData.campuses.map((campus, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveCampus(index)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeCampus === index
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {campus.campusName.en || `Campus ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Active campus form */}
      {formData.campuses.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {formData.campuses[activeCampus].campusName.en
                ? formData.campuses[activeCampus].campusName.en
                : `Campus ${activeCampus + 1}`}
            </h3>
            <button
              type="button"
              onClick={() => removeCampus(activeCampus)}
              className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campus Name */}
            <div>
              <InputField
                label="Campus Name (English)"
                type="text"
                name={`campusName.en`}
                placeholder="Main Campus, Medical Campus, etc."
                value={formData.campuses[activeCampus].campusName.en}
                onChange={(e) =>
                  handleCampusChange(
                    activeCampus,
                    "campusName.en",
                    e.target.value
                  )
                }
                variant={3}
              />
            </div>
            <div>
              <InputField
                label="اسم الحرم الجامعي (عربي)"
                type="text"
                name={`
campusName.ar`}
                placeholder="اسم الحرم الجامعي بالعربية"
                value={formData.campuses[activeCampus].campusName.ar}
                onChange={(e) =>
                  handleCampusChange(
                    activeCampus,
                    "campusName.ar",
                    e.target.value
                  )
                }
                variant={3}
              />
            </div>
            {/* Campus Location */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                <h4 className="text-md font-medium">Campus Location</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
                <InputField
                  label="Address (English)"
                  type="text"
                  name={`
campusLocation.uniAddress.en`}
                  placeholder="Campus Address"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniAddress.en
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniAddress.en",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="عنوان (عربي)"
                  type="text"
                  name={`
campusLocation.uniAddress.ar`}
                  placeholder="عنوان الحرم الجامعي"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniAddress.ar
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniAddress.ar",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="City (English)"
                  type="text"
                  name={`
campusLocation.uniCity.en`}
                  placeholder="City"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniCity.en
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniCity.en",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="مدينة (عربي)"
                  type="text"
                  name={`
campusLocation.uniCity.ar`}
                  placeholder="المدينة"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniCity.ar
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniCity.ar",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="State (English)"
                  type="text"
                  name={`
campusLocation.uniState.en`}
                  placeholder="State/Province"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniState.en
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniState.en",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="الولاية (عربي)"
                  type="text"
                  name={`
campusLocation.uniState.ar`}
                  placeholder="الولاية/المقاطعة"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniState.ar
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniState.ar",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="Country (English)"
                  type="text"
                  name={`
campusLocation.uniCountry.en`}
                  placeholder="Country"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniCountry.en
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniCountry.en",
                      e.target.value
                    )
                  }
                  variant={3}
                />
                <InputField
                  label="دولة (عربي)"
                  type="text"
                  name={`
campusLocation.uniCountry.ar`}
                  placeholder="الدولة"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniCountry.ar
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniCountry.ar",
                      e.target.value
                    )
                  }
                  variant={3}
                />
               <div className="col-span-2">
               <InputField
                  label="Pincode"
                  type="text"
                  name={`
campusLocation.uniPincode`}
                  placeholder="Postal/Zip Code"
                  value={
                    formData.campuses[activeCampus].campusLocation.uniPincode
                  }
                  onChange={(e) =>
                    handleCampusChange(
                      activeCampus,
                      "campusLocation.uniPincode",
                      e.target.value
                    )
                  }
                  variant={3}
                /></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <Building className="w-4 h-4 mr-2 text-gray-600" />
                <h4 className="text-md font-medium">Campus Facilities</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Add facility (e.g., Library, Gym, Cafeteria)"
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => addFacility(activeCampus)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.campuses[activeCampus].campusFacilities.map(
                    (facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {facility}
                        <button
                          type="button"
                          onClick={() => removeFacility(activeCampus, idx)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                  {formData.campuses[activeCampus].campusFacilities.length ===
                    0 && (
                    <p className="text-gray-500 text-sm italic">
                      No facilities added yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <Camera className="w-4 h-4 mr-2 text-gray-600" />
                <h4 className="text-md font-medium">Campus Photos</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="mb-4">
                  <UploadWidget
                    uwConfig={{
                      cloudName: "edubrink",
                      uploadPreset: "EduBrinkImages",
                      multiple: true,
                      maxImageFileSize: 2000000,
                      folder: "university/CampusPhotos",
                    }}
                    setFormData={setFormData}
                    field="campuses"
                    fieldName="campusPhotos"
                    arrayIndex={activeCampus}
                    uploadName="Upload Campus Photos"
                    id={`upload_widget_campus_${activeCampus}`} // Simplified ID to avoid recreating widgets
                    className="text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer"
                  />
                </div>

                {formData.campuses[activeCampus].campusPhotos.length === 0 ? (
                  <p className="text-gray-500 text-sm italic col-span-full">
                    No photos uploaded yet
                  </p>
                ) : (
                  <CampusPhotoGrid
                    photos={formData.campuses[activeCampus].campusPhotos}
                    campusIndex={activeCampus}
                    onRemovePhoto={(photoIndex) => {
                      setFormData((prevData) => {
                        const updatedCampuses = [...prevData.campuses];
                        updatedCampuses[activeCampus].campusPhotos =
                          updatedCampuses[activeCampus].campusPhotos.filter(
                            (_, i) => i !== photoIndex
                          );
                        return { ...prevData, campuses: updatedCampuses };
                      });
                    }}
                  />
                )}
              </div>
            </div> */}
          </div>
        </div>
      )}

      {formData.campuses.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Building className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No campuses added yet</p>
          <button
            type="button"
            onClick={addCampus}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Campus
          </button>
        </div>
      )}
    </div>
  );
};

// Memoized component for rendering campus photos
const CampusPhotoGrid = React.memo(({ photos, campusIndex, onRemovePhoto }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {photos.map((photo, idx) => (
        <div key={idx} className="relative group">
          <img
            src={photo || "/placeholder.svg"}
            alt={`Campus \${campusIndex + 1} photo \${idx + 1}`}
            className="w-full h-24 object-cover rounded-lg border"
            loading="lazy" // Add lazy loading
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
            <button
              type="button"
              onClick={() => onRemovePhoto(idx)}
              className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default CampusSection;
