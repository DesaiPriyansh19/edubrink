"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  School,
  BookOpen,
  Send,
  Globe,
  Languages,
  Award,
  Linkedin,
  Github,
  Twitter,
  ChevronDown,
  Loader2,
  Home,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useApiData from "../hooks/useApiData";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

// Initialize AOS once
const initAOS = () => {
  if (typeof window !== "undefined") {
    import("aos").then((AOS) => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
        mirror: true,
      });
    });
  }
};

export default function ApplyForm({ isDesktop = true }) {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || "University";
  const slug = searchParams.get("slug");
  console.log(slug);
  const isCourse = category === "course";
  const isMajor = category === "major";

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Initial form state
  const [formData, setFormData] = useState({
    itemId: itemId || "",
    category: category.charAt(0).toUpperCase() + category.slice(1),
    userDetails: {
      personName: "",
      personEmail: "",
      personPhone: "",
      personAddress: "",
      personDOB: "",
    },
    education: {
      highestQualification: "",
      institution: "",
      graduationYear: "",
      gpa: "",
    },
    experience: {
      yearsOfExperience: "",
      currentEmployer: "",
      jobTitle: "",
    },
    skills: {
      languages: "",
      computerSkills: "",
      certifications: "",
    },
    preferences: {
      startDate: "",
      programType: "",
    },
    userDescription: "",
    status: "Pending",
    appliedDate: new Date().toISOString(),
  });

  // Initial errors state with the same structure as formData
  const [errors, setErrors] = useState({
    userDetails: {
      personName: "",
      personEmail: "",
      personPhone: "",
      personAddress: "",
      personDOB: "",
    },
    education: {
      highestQualification: "",
      institution: "",
      graduationYear: "",
      gpa: "",
    },
    experience: {
      yearsOfExperience: "",
      currentEmployer: "",
      jobTitle: "",
    },
    skills: {
      languages: "",
      computerSkills: "",
      certifications: "",
    },
    preferences: {
      startDate: "",
      programType: "",
    },
    userDescription: "",
  });

  const { addNew } = useApiData(
    "https://edu-brink-backend.vercel.app/api/apply"
  );

  // Form field validation rules
  const validationRules = {
    "userDetails.personName": (value) => {
      if (!value.trim()) return t("applyForm.validation.nameRequired");
      if (value.trim().length < 3) return t("applyForm.validation.nameLength");
      return "";
    },
    "userDetails.personEmail": (value) => {
      if (!value.trim()) return t("applyForm.validation.emailRequired");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim()))
        return t("applyForm.validation.emailInvalid");
      return "";
    },
    "userDetails.personPhone": (value) => {
      if (!value.trim()) return t("applyForm.validation.phoneRequired");
      const phoneRegex = /^\+?[\d\s()-]{8,20}$/;
      if (!phoneRegex.test(value.trim()))
        return t("applyForm.validation.phoneInvalid");
      return "";
    },
    "userDetails.personAddress": (value) => {
      if (!value.trim()) return t("applyForm.validation.addressRequired");
      if (value.trim().length < 10)
        return t("applyForm.validation.addressLength");
      return "";
    },
    "userDetails.personDOB": (value) => {
      if (!value) return t("applyForm.validation.dobRequired");
      const dobDate = new Date(value);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      if (dobDate > today) return t("applyForm.validation.dobFuture");
      if (dobDate > minAgeDate) return t("applyForm.validation.dobAge");
      return "";
    },
    "education.highestQualification": (value) => {
      if (!value) return t("applyForm.validation.qualificationRequired");
      return "";
    },
    "education.institution": (value) => {
      if (!value.trim()) return t("applyForm.validation.institutionRequired");
      return "";
    },
    "education.graduationYear": (value) => {
      if (!value) return t("applyForm.validation.yearRequired");
      const year = Number.parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1950 || year > currentYear + 10) {
        return t("applyForm.validation.yearRange", {
          maxYear: currentYear + 10,
        });
      }
      return "";
    },
    "preferences.startDate": (value) => {
      if (!value) return t("applyForm.validation.startDateRequired");
      return "";
    },
    "preferences.programType": (value) => {
      if (!value) return t("applyForm.validation.programTypeRequired");
      return "";
    },
    userDescription: (value) => {
      if (!value.trim()) return t("applyForm.validation.descriptionRequired");
      return "";
    },
  };

  // Required fields by step
  const requiredFieldsByStep = {
    1: [
      "userDetails.personName",
      "userDetails.personEmail",
      "userDetails.personPhone",
      "userDetails.personAddress",
      "userDetails.personDOB",
    ],
    2: [
      "education.highestQualification",
      "education.institution",
      "education.graduationYear",
    ],
    4: ["preferences.startDate", "preferences.programType", "userDescription"],
  };

  // Initialize AOS once on component mount
  useEffect(() => {
    initAOS();
  }, []);

  // Refresh AOS animations when step changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("aos").then((AOS) => {
        AOS.refresh();
      });
    }
  }, [step]);

  // Handle redirect countdown after submission
  useEffect(() => {
    if (isSubmitted && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSubmitted && redirectCountdown === 0) {
      navigate(`/${language}`);
    }
  }, [isSubmitted, redirectCountdown, navigate]);

  // Handle input changes and validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validate the field
    validateField(name, value);
  };

  // Validate a specific field
  const validateField = (name, value) => {
    const validationRule = validationRules[name];
    const errorMessage = validationRule ? validationRule(value) : "";

    // Update error state
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setErrors((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: errorMessage,
        },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }

    return errorMessage === "";
  };

  // Validate all fields in the current step
  const validateStep = () => {
    const fieldsToValidate = requiredFieldsByStep[step] || [];
    let isValid = true;

    fieldsToValidate.forEach((fieldName) => {
      let value;
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        value = formData[parent][child];
      } else {
        value = formData[fieldName];
      }

      if (!validateField(fieldName, value)) {
        isValid = false;
      }
    });

    // If validation fails, scroll to the first error
    if (!isValid) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".error-message");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validate all required fields across all steps
    let isValid = true;

    // Combine all required fields from all steps
    const allRequiredFields = [
      ...requiredFieldsByStep[1],
      ...requiredFieldsByStep[2],
      ...requiredFieldsByStep[4],
    ];

    allRequiredFields.forEach((fieldName) => {
      let value;
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        value = formData[parent][child];
      } else {
        value = formData[fieldName];
      }

      if (!validateField(fieldName, value)) {
        isValid = false;
      }
    });

    if (!isValid) return false;

    setIsSubmitting(true);
    try {
      await addNew(formData);
      setIsSubmitted(true);
      setStep(6);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (step < 5) {
      if (validateStep()) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      }
    } else {
      if (validateStep()) {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // Theme colors based on category
  const theme = isCourse
    ? {
        primary: "from-indigo-500 to-indigo-300",
        button: "bg-indigo-500 hover:bg-indigo-600",
        accent: "text-indigo-600",
        border: "border-indigo-500",
        label: "text-indigo-700",
        error: "border-[#441752]",
        header: "text-indigo-600",
        stepIndicator: "bg-indigo-500",
        cardHeader: "bg-indigo-500",
      }
    : isMajor
    ? {
        primary: "from-slate-500 to-slate-400",
        button: "bg-slate-500 hover:bg-slate-600",
        accent: "text-slate-600",
        border: "border-slate-500",
        label: "text-slate-700",
        error: "border-slate-800",
        header: "text-slate-600",
        stepIndicator: "bg-slate-500",
        cardHeader: "bg-slate-500",
      }
    : {
        primary: "from-[#db5458] to-[#e87a7d]",
        button: "bg-[#db5458] hover:bg-[#c94b4f]",
        accent: "text-[#db5458]",
        border: "border-[#db5458]",
        label: "text-[#db5458]",
        error: "border-red-500",
        header: "text-[#db5458]",
        stepIndicator: "bg-[#db5458]",
        cardHeader: "bg-[#db5458]",
      };

  const handleBackToListing = () => {
    if (slug) {
      if (category === "University")
        navigate(`/${language}/university/${slug}`);
      if (category === "course") navigate(`/${language}/courses/${slug}`);
      if (category === "major") navigate(`/${language}/major/${slug}`);
    } else {
      navigate(`/${language}`);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.header} mb-2`}
              >
                {t("applyForm.personalInfo.title")}
              </h2>
              <p className="text-gray-600">
                {t("applyForm.personalInfo.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.personalInfo.fullName.label")}
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="text"
                    name="userDetails.personName"
                    value={formData.userDetails.personName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDetails.personName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDetails.personName
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t(
                      "applyForm.personalInfo.fullName.placeholder"
                    )}
                    required
                  />
                </div>
                {errors.userDetails.personName && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDetails.personName}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.personalInfo.email.label")}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="email"
                    name="userDetails.personEmail"
                    value={formData.userDetails.personEmail}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDetails.personEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDetails.personEmail
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t("applyForm.personalInfo.email.placeholder")}
                    required
                  />
                </div>
                {errors.userDetails.personEmail && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDetails.personEmail}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.personalInfo.phone.label")}
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="tel"
                    name="userDetails.personPhone"
                    value={formData.userDetails.personPhone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDetails.personPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDetails.personPhone
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t("applyForm.personalInfo.phone.placeholder")}
                    required
                  />
                </div>
                {errors.userDetails.personPhone && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDetails.personPhone}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.personalInfo.dob.label")}
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="date"
                    name="userDetails.personDOB"
                    value={formData.userDetails.personDOB}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDetails.personDOB
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDetails.personDOB
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    required
                  />
                </div>
                {errors.userDetails.personDOB && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDetails.personDOB}
                  </p>
                )}
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.personalInfo.address.label")}
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-3 ${theme.accent} h-5 w-5`}
                  />
                  <textarea
                    name="userDetails.personAddress"
                    value={formData.userDetails.personAddress}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDetails.personAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDetails.personAddress
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all min-h-[80px] resize-none`}
                    placeholder={t(
                      "applyForm.personalInfo.address.placeholder"
                    )}
                    required
                  />
                </div>
                {errors.userDetails.personAddress && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDetails.personAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.header} mb-2`}
              >
                {isCourse
                  ? t("applyForm.education.courseTitle")
                  : isMajor
                  ? t("applyForm.education.majorTitle") ||
                    "Education Background"
                  : t("applyForm.education.universityTitle")}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? t("applyForm.education.courseSubtitle")
                  : isMajor
                  ? t("applyForm.education.majorSubtitle") ||
                    "Tell us about your educational qualifications"
                  : t("applyForm.education.universitySubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {isCourse
                    ? t("applyForm.education.currentEducation")
                    : t("applyForm.education.highestQualification")}
                </label>
                <div className="relative">
                  <GraduationCap
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <select
                    name="education.highestQualification"
                    value={formData.education.highestQualification}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-10 py-4 border ${
                      errors.education.highestQualification
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 ${
                      errors.education.highestQualification
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent text-base appearance-none bg-white`}
                    required
                  >
                    <option value="">
                      {t("applyForm.education.selectQualification")}
                    </option>
                    <option value="High School">
                      {t("applyForm.education.qualifications.highSchool")}
                    </option>
                    <option value="Associate's Degree">
                      {t("applyForm.education.qualifications.associatesDegree")}
                    </option>
                    <option value="Bachelor's Degree">
                      {t("applyForm.education.qualifications.bachelorsDegree")}
                    </option>
                    <option value="Master's Degree">
                      {t("applyForm.education.qualifications.mastersDegree")}
                    </option>
                    <option value="Doctorate">
                      {t("applyForm.education.qualifications.doctorate")}
                    </option>
                    <option value="Other">
                      {t("applyForm.education.qualifications.other")}
                    </option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                </div>
                {errors.education.highestQualification && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.education.highestQualification}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.education.institutionName")}
                </label>
                <div className="relative">
                  <School
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="text"
                    name="education.institution"
                    value={formData.education.institution}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.education.institution
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.education.institution
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t(
                      "applyForm.education.institutionPlaceholder"
                    )}
                    required
                  />
                </div>
                {errors.education.institution && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.education.institution}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {isCourse
                    ? t("applyForm.education.completionYear")
                    : t("applyForm.education.graduationYear")}
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="number"
                    name="education.graduationYear"
                    value={formData.education.graduationYear}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.education.graduationYear
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.education.graduationYear
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t("applyForm.education.yearPlaceholder")}
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                {errors.education.graduationYear && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.education.graduationYear}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.education.gpaGrade")}
                </label>
                <div className="relative">
                  <Award
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="text"
                    name="education.gpa"
                    value={formData.education.gpa}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.education.gpa
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.education.gpa
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t("applyForm.education.gpaPlaceholder")}
                  />
                </div>
                {errors.education.gpa && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.education.gpa}
                  </p>
                )}
              </div>
            </div>

            {isCourse && (
              <div
                className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-700">
                      {t("applyForm.education.courseRequirements.title")}
                    </h3>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>
                        {t(
                          "applyForm.education.courseRequirements.description"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isCourse && (
              <div
                className={`bg-${
                  isMajor ? "slate" : "indigo"
                }-50 p-4 rounded-lg border border-${
                  isMajor ? "slate" : "indigo"
                }-100 mt-6`}
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BookOpen
                      className={`h-5 w-5 text-${
                        isMajor ? "slate" : "indigo"
                      }-600`}
                    />
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`text-sm font-medium text-${
                        isMajor ? "slate" : "indigo"
                      }-700`}
                    >
                      {isMajor
                        ? t("applyForm.education.majorRequirements.title") ||
                          "Major Requirements"
                        : t("applyForm.education.universityRequirements.title")}
                    </h3>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>
                        {isMajor
                          ? t(
                              "applyForm.education.majorRequirements.description"
                            ) ||
                            "Please ensure you meet all the requirements for this major."
                          : t(
                              "applyForm.education.universityRequirements.description"
                            )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.header} mb-2`}
              >
                {isCourse
                  ? t("applyForm.skills.courseTitle")
                  : isMajor
                  ? t("applyForm.skills.majorTitle") || "Skills & Experience"
                  : t("applyForm.skills.universityTitle")}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? t("applyForm.skills.courseSubtitle")
                  : isMajor
                  ? t("applyForm.skills.majorSubtitle") ||
                    "Tell us about your skills and experience relevant to this major"
                  : t("applyForm.skills.universitySubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isCourse && (
                <>
                  <div
                    className="relative"
                    data-aos="fade-right"
                    data-aos-delay="100"
                  >
                    <label
                      className={`block text-sm font-medium ${theme.header} mb-1`}
                    >
                      {t("applyForm.skills.yearsExperience")}
                    </label>
                    <div className="relative">
                      <Briefcase
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                      />
                      <select
                        name="experience.yearsOfExperience"
                        value={formData.experience.yearsOfExperience}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-10 py-4 border ${
                          errors.experience?.yearsOfExperience
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 ${
                          errors.experience?.yearsOfExperience
                            ? "focus:ring-red-500"
                            : `focus:ring-${
                                isCourse
                                  ? "indigo-500"
                                  : isMajor
                                  ? "slate-500"
                                  : "[#db5458]"
                              }`
                        } focus:border-transparent text-base appearance-none bg-white`}
                      >
                        <option value="">
                          {t("applyForm.skills.selectExperience")}
                        </option>
                        <option value="No experience">
                          {t("applyForm.skills.experienceOptions.none")}
                        </option>
                        <option value="Less than 1 year">
                          {t("applyForm.skills.experienceOptions.lessThanOne")}
                        </option>
                        <option value="1-2 years">
                          {t("applyForm.skills.experienceOptions.oneToTwo")}
                        </option>
                        <option value="3-5 years">
                          {t("applyForm.skills.experienceOptions.threeToFive")}
                        </option>
                        <option value="5+ years">
                          {t("applyForm.skills.experienceOptions.fivePlus")}
                        </option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                    </div>
                  </div>

                  <div
                    className="relative"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <label
                      className={`block text-sm font-medium ${theme.header} mb-1`}
                    >
                      {t("applyForm.skills.currentEmployer")}
                    </label>
                    <div className="relative">
                      <Briefcase
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                      />
                      <input
                        type="text"
                        name="experience.currentEmployer"
                        value={formData.experience.currentEmployer}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${
                          isCourse
                            ? "indigo-500"
                            : isMajor
                            ? "slate-500"
                            : "[#db5458]"
                        } focus:border-transparent outline-none transition-all`}
                        placeholder={t("applyForm.skills.employerPlaceholder")}
                      />
                    </div>
                  </div>

                  <div
                    className="relative"
                    data-aos="fade-right"
                    data-aos-delay="300"
                  >
                    <label
                      className={`block text-sm font-medium ${theme.header} mb-1`}
                    >
                      {t("applyForm.skills.jobTitle")}
                    </label>
                    <div className="relative">
                      <Briefcase
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                      />
                      <input
                        type="text"
                        name="experience.jobTitle"
                        value={formData.experience.jobTitle}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${
                          isCourse
                            ? "indigo-500"
                            : isMajor
                            ? "slate-500"
                            : "[#db5458]"
                        } focus:border-transparent outline-none transition-all`}
                        placeholder={t("applyForm.skills.jobTitlePlaceholder")}
                      />
                    </div>
                  </div>
                </>
              )}

              <div
                className={`relative ${isCourse ? "md:col-span-2" : ""}`}
                data-aos="fade-right"
                data-aos-delay={isCourse ? "100" : "400"}
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.skills.languages")}
                </label>
                <div className="relative">
                  <Languages
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="text"
                    name="skills.languages"
                    value={formData.skills.languages}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${
                      isCourse
                        ? "indigo-500"
                        : isMajor
                        ? "slate-500"
                        : "[#db5458]"
                    } focus:border-transparent outline-none transition-all`}
                    placeholder={t("applyForm.skills.languagesPlaceholder")}
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay={isCourse ? "200" : "500"}
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {isCourse
                    ? t("applyForm.skills.technicalSkills")
                    : isMajor
                    ? t("applyForm.skills.majorSkills") || "Relevant Skills"
                    : t("applyForm.skills.computerSkills")}
                </label>
                <div className="relative">
                  <Globe
                    className={`absolute left-3 top-3 ${theme.accent} h-5 w-5`}
                  />
                  <textarea
                    name="skills.computerSkills"
                    value={formData.skills.computerSkills}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${
                      isCourse
                        ? "indigo-500"
                        : isMajor
                        ? "slate-500"
                        : "[#db5458]"
                    } focus:border-transparent outline-none transition-all min-h-[80px] resize-none`}
                    placeholder={
                      isCourse
                        ? t("applyForm.skills.technicalSkillsPlaceholder")
                        : isMajor
                        ? t("applyForm.skills.majorSkillsPlaceholder") ||
                          "List any skills relevant to this major"
                        : t("applyForm.skills.computerSkillsPlaceholder")
                    }
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay={isCourse ? "300" : "600"}
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.skills.certifications")}
                </label>
                <div className="relative">
                  <Award
                    className={`absolute left-3 top-3 ${theme.accent} h-5 w-5`}
                  />
                  <textarea
                    name="skills.certifications"
                    value={formData.skills.certifications}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${
                      isCourse
                        ? "indigo-500"
                        : isMajor
                        ? "slate-500"
                        : "[#db5458]"
                    } focus:border-transparent outline-none transition-all min-h-[80px] resize-none`}
                    placeholder={t(
                      "applyForm.skills.certificationsPlaceholder"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.header} mb-2`}
              >
                {isCourse
                  ? t("applyForm.preferences.courseTitle")
                  : isMajor
                  ? t("applyForm.preferences.majorTitle") || "Major Preferences"
                  : t("applyForm.preferences.universityTitle")}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? t("applyForm.preferences.courseSubtitle")
                  : isMajor
                  ? t("applyForm.preferences.majorSubtitle") ||
                    "Tell us about your preferences for this major"
                  : t("applyForm.preferences.universitySubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.preferences.startDate")}
                </label>
                <div className="relative">
                  <Calendar
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <input
                    type="date"
                    name="preferences.startDate"
                    value={formData.preferences.startDate}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.preferences.startDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.preferences.startDate
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all`}
                  />
                </div>
                {errors.preferences.startDate && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.preferences.startDate}
                  </p>
                )}
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {isCourse
                    ? t("applyForm.preferences.courseFormat")
                    : isMajor
                    ? t("applyForm.preferences.majorFormat") || "Study Format"
                    : t("applyForm.preferences.programType")}
                </label>
                <div className="relative">
                  <BookOpen
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.accent} h-5 w-5`}
                  />
                  <select
                    name="preferences.programType"
                    value={formData.preferences.programType}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-10 py-4 border ${
                      errors.preferences.programType
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 ${
                      errors.preferences.programType
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent text-base appearance-none bg-white`}
                  >
                    <option value="">
                      {isCourse
                        ? t("applyForm.preferences.selectFormat")
                        : isMajor
                        ? t("applyForm.preferences.selectFormat")
                        : t("applyForm.preferences.selectType")}
                    </option>
                    {isCourse ? (
                      <>
                        <option value="Online">
                          {t("applyForm.preferences.formatOptions.online")}
                        </option>
                        <option value="In-person">
                          {t("applyForm.preferences.formatOptions.inPerson")}
                        </option>
                        <option value="Hybrid">
                          {t("applyForm.preferences.formatOptions.hybrid")}
                        </option>
                        <option value="Self-paced">
                          {t("applyForm.preferences.formatOptions.selfPaced")}
                        </option>
                        <option value="Instructor-led">
                          {t(
                            "applyForm.preferences.formatOptions.instructorLed"
                          )}
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="Full-time">
                          {t("applyForm.preferences.typeOptions.fullTime")}
                        </option>
                        <option value="Part-time">
                          {t("applyForm.preferences.typeOptions.partTime")}
                        </option>
                        <option value="Online">
                          {t("applyForm.preferences.typeOptions.online")}
                        </option>
                        <option value="On-campus">
                          {t("applyForm.preferences.typeOptions.onCampus")}
                        </option>
                        <option value="Distance Learning">
                          {t(
                            "applyForm.preferences.typeOptions.distanceLearning"
                          )}
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                </div>
                {errors.preferences.programType && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.preferences.programType}
                  </p>
                )}
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label
                  className={`block text-sm font-medium ${theme.header} mb-1`}
                >
                  {t("applyForm.preferences.aboutYourself.label")}
                </label>
                <div className="relative">
                  <FileText
                    className={`absolute left-3 top-3 ${theme.accent} h-5 w-5`}
                  />
                  <textarea
                    name="userDescription"
                    value={formData.userDescription}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.userDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors.userDescription
                        ? "focus:ring-red-500"
                        : `focus:ring-${
                            isCourse
                              ? "indigo-500"
                              : isMajor
                              ? "slate-500"
                              : "[#db5458]"
                          }`
                    } focus:border-transparent outline-none transition-all min-h-[200px] resize-none`}
                    placeholder={
                      isCourse
                        ? t(
                            "applyForm.preferences.aboutYourself.coursePlaceholder"
                          )
                        : isMajor
                        ? t(
                            "applyForm.preferences.aboutYourself.majorPlaceholder"
                          ) ||
                          "Tell us why you're interested in this major and your career goals"
                        : t(
                            "applyForm.preferences.aboutYourself.universityPlaceholder"
                          )
                    }
                  />
                </div>
                {errors.userDescription && (
                  <p className={`mt-1 text-sm ${theme.error} error-message`}>
                    {errors.userDescription}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`bg-${
                isMajor ? "slate" : "indigo"
              }-50 p-6 rounded-lg border border-${
                isMajor ? "slate" : "indigo"
              }-100`}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className={`text-lg font-semibold ${theme.header} mb-3`}>
                {t("applyForm.preferences.beforeSubmit.title")}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check
                    className={`h-5 w-5 text-${
                      isMajor ? "slate" : "indigo"
                    }-600 mr-2 mt-0.5 flex-shrink-0`}
                  />
                  <span className="text-gray-700">
                    {t("applyForm.preferences.beforeSubmit.checkFields")}
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className={`h-5 w-5 text-${
                      isMajor ? "slate" : "indigo"
                    }-600 mr-2 mt-0.5 flex-shrink-0`}
                  />
                  <span className="text-gray-700">
                    {t("applyForm.preferences.beforeSubmit.verifyContact")}
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className={`h-5 w-5 text-${
                      isMajor ? "slate" : "indigo"
                    }-600 mr-2 mt-0.5 flex-shrink-0`}
                  />
                  <span className="text-gray-700">
                    {t("applyForm.preferences.beforeSubmit.reviewApplication")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.header} mb-2`}
              >
                {t("applyForm.review.title")}
              </h2>
              <p className="text-gray-600">{t("applyForm.review.subtitle")}</p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${theme.cardHeader} text-white px-4 py-3`}>
                  <h3 className="font-medium">
                    {t("applyForm.review.sections.personalInfo")}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.fullName")}
                      </p>
                      <p className="font-medium">
                        {formData.userDetails.personName ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.email")}
                      </p>
                      <p className="font-medium">
                        {formData.userDetails.personEmail ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.phone")}
                      </p>
                      <p className="font-medium">
                        {formData.userDetails.personPhone ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.dob")}
                      </p>
                      <p className="font-medium">
                        {formData.userDetails.personDOB ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("applyForm.review.fields.address")}
                    </p>
                    <p className="font-medium">
                      {formData.userDetails.personAddress ||
                        t("applyForm.common.notProvided")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${theme.cardHeader} text-white px-4 py-3`}>
                  <h3 className="font-medium">
                    {isCourse
                      ? t("applyForm.review.sections.education.course")
                      : isMajor
                      ? t("applyForm.review.sections.education.major") ||
                        "Education Background"
                      : t("applyForm.review.sections.education.university")}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse
                          ? t("applyForm.review.fields.qualification.course")
                          : t(
                              "applyForm.review.fields.qualification.university"
                            )}
                      </p>
                      <p className="font-medium">
                        {formData.education.highestQualification ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.institution")}
                      </p>
                      <p className="font-medium">
                        {formData.education.institution ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse
                          ? t("applyForm.review.fields.year.course")
                          : t("applyForm.review.fields.year.university")}
                      </p>
                      <p className="font-medium">
                        {formData.education.graduationYear ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.gpa")}
                      </p>
                      <p className="font-medium">
                        {formData.education.gpa ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isCourse && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className={`${theme.cardHeader} text-white px-4 py-3`}>
                    <h3 className="font-medium">
                      {t("applyForm.review.sections.experience")}
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("applyForm.review.fields.yearsExperience")}
                        </p>
                        <p className="font-medium">
                          {formData.experience.yearsOfExperience ||
                            t("applyForm.common.notProvided")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("applyForm.review.fields.employer")}
                        </p>
                        <p className="font-medium">
                          {formData.experience.currentEmployer ||
                            t("applyForm.common.notProvided")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("applyForm.review.fields.jobTitle")}
                        </p>
                        <p className="font-medium">
                          {formData.experience.jobTitle ||
                            t("applyForm.common.notProvided")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${theme.cardHeader} text-white px-4 py-3`}>
                  <h3 className="font-medium">
                    {t("applyForm.review.sections.skills")}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("applyForm.review.fields.languages")}
                    </p>
                    <p className="font-medium">
                      {formData.skills.languages ||
                        t("applyForm.common.notProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isCourse
                        ? t("applyForm.review.fields.skills.technical")
                        : isMajor
                        ? t("applyForm.review.fields.skills.major") ||
                          "Relevant Skills"
                        : t("applyForm.review.fields.skills.computer")}
                    </p>
                    <p className="font-medium">
                      {formData.skills.computerSkills ||
                        t("applyForm.common.notProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("applyForm.review.fields.certifications")}
                    </p>
                    <p className="font-medium">
                      {formData.skills.certifications ||
                        t("applyForm.common.notProvided")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${theme.cardHeader} text-white px-4 py-3`}>
                  <h3 className="font-medium">
                    {isCourse
                      ? t("applyForm.review.sections.preferences.course")
                      : isMajor
                      ? t("applyForm.review.sections.preferences.major") ||
                        "Major Preferences"
                      : t("applyForm.review.sections.preferences.university")}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("applyForm.review.fields.startDate")}
                      </p>
                      <p className="font-medium">
                        {formData.preferences.startDate ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse
                          ? t("applyForm.review.fields.format.course")
                          : isMajor
                          ? t("applyForm.review.fields.format.major") ||
                            "Study Format"
                          : t("applyForm.review.fields.format.university")}
                      </p>
                      <p className="font-medium">
                        {formData.preferences.programType ||
                          t("applyForm.common.notProvided")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div data-aos="zoom-in" className="text-center py-8">
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                  </div>
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-indigo-600"
                      strokeWidth="6"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                      style={{
                        strokeDasharray: 276,
                        strokeDashoffset:
                          276 - (276 * (100 - redirectCountdown * 10)) / 100,
                        transition: "stroke-dashoffset 1s ease-in-out",
                      }}
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium text-indigo-700">
                  {t("applyForm.success.processing")}
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                    isCourse
                      ? "bg-indigo-100"
                      : isMajor
                      ? "bg-slate-100"
                      : "bg-red-100"
                  } mb-6`}
                >
                  <Check
                    className={`h-12 w-12 ${
                      isCourse
                        ? "text-indigo-600"
                        : isMajor
                        ? "text-slate-600"
                        : "text-[#db5458]"
                    }`}
                  />
                </div>
                <h2 className={`text-3xl font-bold ${theme.header} mb-4`}>
                  {t("applyForm.success.title")}
                </h2>
                <p className="text-xl text-gray-600 mb-4 max-w-lg mx-auto">
                  {t("applyForm.success.subtitle")}
                </p>
                <div className="mb-8 text-center">
                  <p
                    className={`text-${
                      isCourse ? "indigo" : isMajor ? "slate" : "red"
                    }-600 font-medium`}
                  >
                    {t("applyForm.success.redirecting", {
                      seconds: redirectCountdown,
                    })}
                  </p>
                  <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`${theme.stepIndicator} h-2 rounded-full transition-all duration-1000 ease-linear`}
                      style={{ width: `${(redirectCountdown / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  <div
                    className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <h3
                      className={`text-lg font-semibold ${theme.header} mb-3`}
                    >
                      {t("applyForm.success.nextSteps.title")}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-6 w-6 rounded-full ${
                            isCourse
                              ? "bg-indigo-100"
                              : isMajor
                              ? "bg-slate-100"
                              : "bg-red-100"
                          } flex items-center justify-center mr-3 mt-0.5`}
                        >
                          <span
                            className={`${theme.header} font-medium text-sm`}
                          >
                            1
                          </span>
                        </div>
                        <p className="text-gray-600 text-left">
                          {t("applyForm.success.nextSteps.review")}
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-6 w-6 rounded-full ${
                            isCourse
                              ? "bg-indigo-100"
                              : isMajor
                              ? "bg-slate-100"
                              : "bg-red-100"
                          } flex items-center justify-center mr-3 mt-0.5`}
                        >
                          <span
                            className={`${theme.header} font-medium text-sm`}
                          >
                            2
                          </span>
                        </div>
                        <p className="text-gray-600 text-left">
                          {t("applyForm.success.nextSteps.confirmation")}
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-6 w-6 rounded-full ${
                            isCourse
                              ? "bg-indigo-100"
                              : isMajor
                              ? "bg-slate-100"
                              : "bg-red-100"
                          } flex items-center justify-center mr-3 mt-0.5`}
                        >
                          <span
                            className={`${theme.header} font-medium text-sm`}
                          >
                            3
                          </span>
                        </div>
                        <p className="text-gray-600 text-left">
                          {t("applyForm.success.nextSteps.interview")}
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6" data-aos="fade-up" data-aos-delay="400">
                    <h3
                      className={`text-lg font-semibold ${theme.header} mb-3`}
                    >
                      {t("applyForm.success.connect.title")}
                    </h3>
                    <div className="flex space-x-4 justify-center">
                      <a
                        href="#"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                      <a
                        href="#"
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          theme.button
                        } text-white hover:${
                          isCourse
                            ? "bg-indigo-600"
                            : isMajor
                            ? "bg-slate-600"
                            : "bg-[#c94b4f]"
                        } transition-colors`}
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                      >
                        <Github className="h-6 w-6" />
                      </a>
                    </div>
                  </div>

                  <Link
                    to="/"
                    className={`flex items-center gap-2 px-6 py-3 ${theme.button} text-white rounded-lg transition-all mt-4`}
                  >
                    <Home className="h-4 w-4" />
                    {t("applyForm.success.connect.goHome")}
                  </Link>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${isDesktop ? "max-w-5xl mx-auto" : "w-full"} p-6 md:p-8`}>
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full opacity-20 blur-2xl"></div>

        {/* Header image */}
        {step < 6 && (
          <div className="mb-8 text-center" data-aos="fade-down">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleBackToListing}
                className={`flex items-center gap-2 px-4 py-2 ${theme.button} text-white rounded-lg transition-all`}
              >
                <ChevronLeft className="h-4 w-4" />
                {t("applyForm.common.backTo")}{" "}
                {isCourse
                  ? t("applyForm.common.course")
                  : isMajor
                  ? t("applyForm.common.major") || "Major"
                  : t("applyForm.common.university")}
              </button>
              <Link
                to="/"
                className={`text-4xl bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent font-bold`}
              >
                Edubrink
              </Link>
              <div className="w-[100px]"></div> {/* Empty div for balance */}
            </div>
            <h1
              className={`text-3xl md:text-4xl font-bold ${theme.header} mb-2`}
            >
              {isCourse
                ? t("applyForm.header.courseTitle")
                : isMajor
                ? t("applyForm.header.majorTitle") || "Apply for Major"
                : t("applyForm.header.universityTitle")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("applyForm.header.subtitle")}
            </p>
          </div>
        )}

        {step < 6 && (
          <div className="mb-8" data-aos="fade-down" data-aos-delay="200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                {t("applyForm.common.stepOf", { current: step, total: 5 })}
              </div>
              <div className={`text-sm font-medium ${theme.header}`}>
                {step === 1 && t("applyForm.steps.personalInfo")}
                {step === 2 &&
                  (isCourse
                    ? t("applyForm.steps.education.course")
                    : isMajor
                    ? t("applyForm.steps.education.major") ||
                      "Education Background"
                    : t("applyForm.steps.education.university"))}
                {step === 3 &&
                  (isCourse
                    ? t("applyForm.steps.skills.course")
                    : isMajor
                    ? t("applyForm.steps.skills.major") || "Skills & Experience"
                    : t("applyForm.steps.skills.university"))}
                {step === 4 &&
                  (isCourse
                    ? t("applyForm.steps.preferences.course")
                    : isMajor
                    ? t("applyForm.steps.preferences.major") || "Preferences"
                    : t("applyForm.steps.preferences.university"))}
                {step === 5 && t("applyForm.steps.review")}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${theme.stepIndicator} h-3 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">{renderStep()}</div>

          {step < 6 && (
            <div className="px-6 md:px-8 py-5 bg-gray-50 rounded-b-xl flex justify-between">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("applyForm.common.back")}
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={nextStep}
                className={`flex items-center gap-2 px-6 py-3 ${theme.button} text-white rounded-lg hover:shadow-lg transition-all`}
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {step === 5 ? (
                  <>
                    {t("applyForm.common.submit")}
                    <Send className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    {t("applyForm.common.continue")}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
