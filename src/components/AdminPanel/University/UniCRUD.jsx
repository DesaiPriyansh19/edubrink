import React, { useEffect, useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import ViewUniversities from "./ViewUniversities";
import AddUniversities from "./AddUniversities";
import EditUniversities from "./EditUniversities";

export default function UniCRUD() {
  const API_URL = import.meta.env.VITE_API_URL;
  const baseUrl = `https://edu-brink-backend.vercel.app/api/university`;
  const { data, loading, updateById, addNew, deleteById } = useApiData(baseUrl);
  const [validationErrors, setValidationErrors] = useState({});
  const initialFormData = {
    id: "",
    uniName: {
      en: "",
      ar: "",
    },
    uniSymbol: "",
    courseId: [], // Array to hold selected course IDs
    uniMainImage: "",
    uniStartDate: "",
    uniDeadline: "",
    uniDuration: "",
    uniDiscount: {
      en: "",
      ar: "",
    },
    scholarshipAvailability: false,
    spokenLanguage: [],
    uniType: "",
    inTakeMonth: "",
    inTakeYear: null,
    entranceExamRequired: false,
    studyLevel: "", // Options: "UnderGraduate", "PostGraduate", "Foundation", "Doctorate"
    uniLocation: {
      uniAddress: {
        en: "",
        ar: "",
      },
      uniPincode: "",
      uniCity: {
        en: "",
        ar: "",
      },
      uniState: {
        en: "",
        ar: "",
      },
      uniCountry: {
        en: "",
        ar: "",
      },
    },
    uniTutionFees: "",
    uniOverview: {
      en: "",
      ar: "",
    },
    uniAccomodation: {
      en: "",
      ar: "",
    },
    uniLibrary: {
      libraryPhotos: [],
      libraryDescription: {
        en: "",
        ar: "",
      },
    },
    uniSports: {
      sportsPhotos: [],
      sportsDescription: {
        en: "",
        ar: "",
      },
    },
    studentLifeStyleInUni: {
      lifestylePhotos: [],
      lifestyleDescription: {
        en: "",
        ar: "",
      },
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editData, setEditData] = useState({ type: "View", id: null });
  const [filteredData, setFilteredData] = useState([]);

  const handleEdit = (type, id) => {
    const selectedProperty = data.find((property) => property._id === id); // Filter data by ID
    if (selectedProperty) {
      setFormData({
        id: selectedProperty._id || "",
        uniName: {
          en: selectedProperty?.uniName?.en || "",
          ar: selectedProperty?.uniName?.ar || "",
        },
        uniSymbol: selectedProperty?.uniSymbol || "",
        courseId: selectedProperty?.courseId || [], // Array of course IDs
        courseId: selectedProperty?.courseId ?? [], // Ensure it's an array
        uniMainImage: selectedProperty?.uniMainImage ?? "", // Default to an empty string
        uniStartDate: selectedProperty?.uniStartDate ?? "", // Default to an empty string
        uniDeadline: selectedProperty?.uniDeadline ?? "", // Default to an empty string
        uniDuration: selectedProperty?.uniDuration ?? "",
        uniDiscount: {
          en: selectedProperty?.uniDiscount?.en || "",
          ar: selectedProperty?.uniDiscount?.ar || "",
        },
        scholarshipAvailability:
          selectedProperty?.scholarshipAvailability || false,
        spokenLanguage: selectedProperty?.spokenLanguage || [],
        uniType: selectedProperty?.uniType || "public",
        inTakeMonth: selectedProperty?.inTakeMonth || "",
        inTakeYear: selectedProperty?.inTakeYear || "",
        entranceExamRequired: selectedProperty?.entranceExamRequired || false,
        studyLevel: selectedProperty?.studyLevel || "",
        uniLocation: {
          uniAddress: {
            en: selectedProperty?.uniLocation?.uniAddress?.en || "",
            ar: selectedProperty?.uniLocation?.uniAddress?.ar || "",
          },
          uniPincode: selectedProperty?.uniLocation?.uniPincode || "",
          uniCity: {
            en: selectedProperty?.uniLocation?.uniCity?.en || "",
            ar: selectedProperty?.uniLocation?.uniCity?.ar || "",
          },
          uniState: {
            en: selectedProperty?.uniLocation?.uniState?.en || "",
            ar: selectedProperty?.uniLocation?.uniState?.ar || "",
          },
          uniCountry: {
            en: selectedProperty?.uniLocation?.uniCountry?.en || "",
            ar: selectedProperty?.uniLocation?.uniCountry?.ar || "",
          },
        },
        uniTutionFees: selectedProperty?.uniTutionFees || "",
        uniOverview: {
          en: selectedProperty?.uniOverview?.en || "",
          ar: selectedProperty?.uniOverview?.ar || "",
        },
        uniAccomodation: {
          en: selectedProperty?.uniAccomodation?.en || "",
          ar: selectedProperty?.uniAccomodation?.ar || "",
        },
        uniLibrary: {
          libraryPhotos: selectedProperty?.uniLibrary?.libraryPhotos || [],
          libraryDescription: {
            en: selectedProperty?.uniLibrary?.libraryDescription?.en || "",
            ar: selectedProperty?.uniLibrary?.libraryDescription?.ar || "",
          },
        },
        uniSports: {
          sportsPhotos: selectedProperty?.uniSports?.sportsPhotos || [],
          sportsDescription: {
            en: selectedProperty?.uniSports?.sportsDescription?.en || "",
            ar: selectedProperty?.uniSports?.sportsDescription?.ar || "",
          },
        },
        studentLifeStyleInUni: {
          lifestylePhotos:
            selectedProperty?.studentLifeStyleInUni?.lifestylePhotos || [],
          lifestyleDescription: {
            en:
              selectedProperty?.studentLifeStyleInUni?.lifestyleDescription
                ?.en || "",
            ar:
              selectedProperty?.studentLifeStyleInUni?.lifestyleDescription
                ?.ar || "",
          },
        },
      });
    }
    setEditData({ type, id });
  };

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

    setValidationErrors((prevErrors) => {
      if (prevErrors[name]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name]; // Remove the error for this field
        return updatedErrors;
      }
      return prevErrors;
    });
  };

  const handleMainPhotoChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedPhotos = [...prevData[field]]; // Dynamically access the field
      updatedPhotos[index] = value;
      return { ...prevData, [field]: updatedPhotos }; // Update the specific field
    });
  };

  useEffect(() => {
    if (data) {
      const uniqueData = data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t._id === item._id) // Replace "id" with your unique property
      );
      setFilteredData(uniqueData);
    }
  }, [data]);

  return (
    <>
      {editData.type === "View" && (
        <ViewUniversities
          loading={loading}
          handleEdit={handleEdit}
          data={filteredData}
        />
      )}
      {editData.type === "Add" && (
        <AddUniversities
          handleEdit={handleEdit}
          addNew={addNew}
          setFormData={setFormData}
          formData={formData}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          handleInputChange={handleInputChange}
          handleMainPhotoChange={handleMainPhotoChange}
          initialFormData={initialFormData}
        />
      )}
      {editData.type === "Edit" && (
        <EditUniversities
          formData={formData}
          handleEdit={handleEdit}
          setFormData={setFormData}
          updateById={updateById}
          editData={editData}
          initialFormData={initialFormData}
          deleteById={deleteById}
          handleInputChange={handleInputChange}
          handleMainPhotoChange={handleMainPhotoChange}
        />
      )}
    </>
  );
}
