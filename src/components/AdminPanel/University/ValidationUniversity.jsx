import * as Yup from "yup";

// Define validation schema using Yup
const validationSchema = Yup.object({
  uniName: Yup.object({
    en: Yup.string().required("University name (English) is required"),
    ar: Yup.string().required("University name (Arabic) is required"),
  }),
  uniSymbol: Yup.string().nullable(),
  uniStartDate: Yup.date().required("Start date is required"),
  uniDeadline: Yup.date().required("Deadline is required"),
  uniDuration: Yup.string().required("Duration is required"),
  scholarshipAvailability: Yup.boolean(),
  uniType: Yup.string().required("University type is required"),
  inTakeMonth: Yup.string().required("Intake month is required"),
  inTakeYear: Yup.number().required("Intake year is required"),
  entranceExamRequired: Yup.boolean(),
  studyLevel: Yup.string().required("Study level is required"),
  uniLocation: Yup.object({
    uniAddress: Yup.object({
      en: Yup.string().required("Address (English) is required"),
      ar: Yup.string().required("Address (Arabic) is required"),
    }),
    uniPincode: Yup.string().required("Pincode is required"),
    uniCity: Yup.object({
      en: Yup.string().required("City (English) is required"),
      ar: Yup.string().required("City (Arabic) is required"),
    }),
    uniState: Yup.object({
      en: Yup.string().required("State (English) is required"),
      ar: Yup.string().required("State (Arabic) is required"),
    }),
    uniCountry: Yup.object({
      en: Yup.string().required("Country (English) is required"),
      ar: Yup.string().required("Country (Arabic) is required"),
    }),
  }),
  uniTutionFees: Yup.string().required("Tuition fees are required"),
  uniOverview: Yup.object({
    en: Yup.string().required("Overview (English) is required"),
    ar: Yup.string().required("Overview (Arabic) is required"),
  }),
  uniAccomodation: Yup.object({
    en: Yup.string().required("Accommodation (English) is required"),
    ar: Yup.string().required("Accommodation (Arabic) is required"),
  }),
  uniLibrary: Yup.object({
    libraryDescription: Yup.object({
      en: Yup.string().required("Library description (English) is required"),
      ar: Yup.string().required("Library description (Arabic) is required"),
    }),
  }),
  uniSports: Yup.object({
    sportsDescription: Yup.object({
      en: Yup.string().required("Sports description (English) is required"),
      ar: Yup.string().required("Sports description (Arabic) is required"),
    }),
  }),
  studentLifeStyleInUni: Yup.object({
    lifestyleDescription: Yup.object({
      en: Yup.string().required("Lifestyle description (English) is required"),
      ar: Yup.string().required("Lifestyle description (Arabic) is required"),
    }),
  }),
});

export default validationSchema;
