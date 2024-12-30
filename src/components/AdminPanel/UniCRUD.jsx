import React, { useEffect, useState } from "react";
import useApiData from "../../../hooks/useApiData";
import ViewUniversities from "./ViewUniversities";
import AddUniversities from "./AddUniversities";

export default function UniCRUD() {
  const baseUrl = "https://edu-brink-backend.vercel.app/api/university";
  const { data,loading, fetchById, updateById, addNew, deleteById } =
    useApiData(baseUrl);

  console.log(data);

  const [editData, setEditData] = useState({ type: "View", id: null });
  const [formData, setFormData] = useState({
    uniName: {
      en: "",
      ar: "",
    },
    uniSymbol: "",
    courseId: [], // Array to hold selected course IDs
    scholarshipAvailability: false,
    spokenLanguage: [],
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
  });

  const handleEdit = (type, id) => {
    const selectedProperty = data.find((property) => property._id === id); // Filter data by ID
    if (selectedProperty) {
      setFormData({
        uniName: {
          en: selectedProperty?.uniName?.en || "",
          ar: selectedProperty?.uniName?.ar || "",
        },
        uniSymbol: selectedProperty?.uniSymbol || "",
        courseId: selectedProperty?.courseId || [], // Array of course IDs
        scholarshipAvailability:
          selectedProperty?.scholarshipAvailability || false,
        spokenLanguage: selectedProperty?.spokenLanguage || [],
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

  return (
    <>
      {editData.type === "View" && (
        <ViewUniversities loading={loading} handleEdit={handleEdit} data={data} />
      )}
      {editData.type === "Add" && (
        <AddUniversities
          handleEdit={handleEdit}
          addNew={addNew}
          setFormData={setFormData}
          formData={formData}
        />
      )}
    </>
  );
}
