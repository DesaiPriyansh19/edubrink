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
  FileUp,
  Clock,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import useApiData from "../hooks/useApiData";

// Initialize AOS
const initAOS = () => {
  if (typeof window !== "undefined") {
    import("aos").then((AOS) => {
      AOS.init({
        duration: 1000,
        once: false,
        easing: "ease-in-out",
        mirror: true,
      });
    });
  }
};

export default function ApplyForm({
  itemId,
  category,
  onClose,
  isDesktop = true,
}) {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [issubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    itemId: itemId || "",
    category: category || "University",
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

  const { addNew } = useApiData(
    "https://edu-brink-backend.vercel.app/api/apply"
  );

  useEffect(() => {
    initAOS();
  }, []);

  useEffect(() => {
    // Refresh AOS animations when step changes
    if (typeof window !== "undefined") {
      import("aos").then((AOS) => {
        AOS.refresh();
      });
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      addNew(formData);
      setIsSubmitted(true);
      setStep(6);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      onClose();
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Personal Information
              </h2>
              <p className="text-gray-600">
                Tell us about yourself so we can get to know you better
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="userDetails.personName"
                    value={formData.userDetails.personName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="userDetails.personEmail"
                    value={formData.userDetails.personEmail}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="userDetails.personPhone"
                    value={formData.userDetails.personPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    name="userDetails.personDOB"
                    value={formData.userDetails.personDOB}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    name="userDetails.personAddress"
                    value={formData.userDetails.personAddress}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px]"
                    placeholder="Enter your full address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Educational Background
              </h2>
              <p className="text-gray-600">
                Tell us about your educational qualifications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest Qualification
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    name="education.highestQualification"
                    value={formData.education.highestQualification}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select qualification</option>
                    <option value="High School">High School</option>
                    <option value="Associate's Degree">
                      Associate's Degree
                    </option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Name
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="education.institution"
                    value={formData.education.institution}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter institution name"
                    required
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    name="education.graduationYear"
                    value={formData.education.graduationYear}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="YYYY"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA / Grade
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="education.gpa"
                    value={formData.education.gpa}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your GPA or grade"
                  />
                </div>
              </div>
            </div>

            <div
              className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Why this matters
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      Your educational background helps us determine your
                      eligibility for the program and tailor our offerings to
                      your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Experience & Skills
              </h2>
              <p className="text-gray-600">
                Tell us about your work experience and skills
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    name="experience.yearsOfExperience"
                    value={formData.experience.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select experience</option>
                    <option value="No experience">No experience</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current/Previous Employer
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="experience.currentEmployer"
                    value={formData.experience.currentEmployer}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter employer name"
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="experience.jobTitle"
                    value={formData.experience.jobTitle}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your job title"
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="skills.languages"
                    value={formData.skills.languages}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Languages you speak (e.g., English, Spanish)"
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Computer Skills
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    name="skills.computerSkills"
                    value={formData.skills.computerSkills}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px]"
                    placeholder="List your computer skills and proficiency levels"
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    name="skills.certifications"
                    value={formData.skills.certifications}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px]"
                    placeholder="List any relevant certifications you have"
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Additional Information
              </h2>
              <p className="text-gray-600">
                Tell us more about yourself and why you're applying
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us about yourself and why you're interested
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    name="userDescription"
                    value={formData.userDescription}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px]"
                    placeholder="Tell us about your educational background, interests, goals, and why you're interested in this program..."
                  />
                </div>
              </div>

              <div
                className="bg-purple-50 p-6 rounded-lg border border-purple-100"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  Before You Submit
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-700">
                      Make sure all required fields are completed
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-700">
                      Verify your contact information is correct
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-700">
                      Ensure your documents are properly uploaded
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div data-aos="zoom-in" className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Application Submitted!
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Thank you for your application. We will review your information
              and contact you soon.
            </p>

            <div className="flex flex-col items-center space-y-6">
              <div
                className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 font-medium text-sm">
                        1
                      </span>
                    </div>
                    <p className="text-gray-600 text-left">
                      Our team will review your application within 3-5 business
                      days
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 font-medium text-sm">
                        2
                      </span>
                    </div>
                    <p className="text-gray-600 text-left">
                      You'll receive an email confirmation with your application
                      details
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 font-medium text-sm">
                        3
                      </span>
                    </div>
                    <p className="text-gray-600 text-left">
                      If selected, we'll schedule an interview or provide next
                      steps
                    </p>
                  </li>
                </ul>
              </div>

              <div className="mt-6" data-aos="fade-up" data-aos-delay="400">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Connect with us
                </h3>
                <div className="flex space-x-4 justify-center">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
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
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        isDesktop ? "max-w-5xl mx-auto" : "w-full"
      } bg-gradient-to-br from-white to-purple-50 p-6 md:p-8 rounded-xl shadow-xl`}
    >
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>

        {/* Header image */}
        {step < 6 && (
          <div className="mb-8 text-center" data-aos="fade-down">
            <Link
              to={`/${language}/`}
              className="text-4xl w-full bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] bg-clip-text text-transparent font-bold"
            >
              Edubrink
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold  mb-2">
              Begin Your Journey With Us
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete the application below to take the first step toward your
              future. Our admissions team is ready to help you succeed.
            </p>
          </div>
        )}

        {step < 6 && (
          <div className="mb-8" data-aos="fade-down" data-aos-delay="200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Step {step} of 5</div>
              <div className="text-sm font-medium text-purple-600">
                {step === 1 && "Personal Information"}
                {step === 2 && "Educational Background"}
                {step === 3 && "Experience & Skills"}
                {step === 4 && "Documents & Preferences"}
                {step === 5 && "Additional Information"}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] text-white rounded-lg hover:shadow-lg transition-all"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {step === 5 ? (
                  <>
                    Submit Application
                    <Send className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Continue
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
