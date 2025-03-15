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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
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

export default function ApplyForm({ onClose = () => {}, isDesktop = true }) {
  const { itemId } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || "University";
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    itemId: itemId || "",
    category: category,
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
    if (step < 5) {
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

  const isCourse = category === "course";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div data-aos="fade-up" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slateBlue mb-2">
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="text"
                    name="userDetails.personName"
                    value={formData.userDetails.personName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="email"
                    name="userDetails.personEmail"
                    value={formData.userDetails.personEmail}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="tel"
                    name="userDetails.personPhone"
                    value={formData.userDetails.personPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="date"
                    name="userDetails.personDOB"
                    value={formData.userDetails.personDOB}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slateBlue h-5 w-5" />
                  <textarea
                    name="userDetails.personAddress"
                    value={formData.userDetails.personAddress}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent min-h-[80px]"
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
              <h2 className="text-2xl md:text-3xl font-bold text-slateBlue mb-2">
                {isCourse ? "Course Prerequisites" : "Educational Background"}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? "Tell us about your educational qualifications for this course"
                  : "Tell us about your educational qualifications for university admission"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  {isCourse
                    ? "Current Education Level"
                    : "Highest Qualification"}
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <select
                    name="education.highestQualification"
                    value={formData.education.highestQualification}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slateBlue focus:border-transparent text-base appearance-none bg-white"
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
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Institution Name
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="text"
                    name="education.institution"
                    value={formData.education.institution}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  {isCourse ? "Completion Year" : "Graduation Year"}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="number"
                    name="education.graduationYear"
                    value={formData.education.graduationYear}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  GPA / Grade
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="text"
                    name="education.gpa"
                    value={formData.education.gpa}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                    placeholder="Enter your GPA or grade"
                  />
                </div>
              </div>
            </div>

            {isCourse && (
              <div
                className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BookOpen className="h-5 w-5 text-slateBlue" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slateBlue">
                      Course Requirements
                    </h3>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>
                        This course requires a minimum GPA of 2.5 and completion
                        of basic prerequisites. Your educational background
                        helps us determine your eligibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isCourse && (
              <div
                className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BookOpen className="h-5 w-5 text-slateBlue" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slateBlue">
                      Why this matters
                    </h3>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>
                        Your educational background helps us determine your
                        eligibility for university admission and tailor our
                        offerings to your needs.
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
              <h2 className="text-2xl md:text-3xl font-bold text-slateBlue mb-2">
                {isCourse ? "Relevant Skills" : "Experience & Skills"}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? "Tell us about your skills relevant to this course"
                  : "Tell us about your work experience and skills"}
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
                    <label className="block text-sm font-medium text-slateBlue mb-1">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                      <select
                        name="experience.yearsOfExperience"
                        value={formData.experience.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                      >
                        <option value="">Select experience</option>
                        <option value="No experience">No experience</option>
                        <option value="Less than 1 year">
                          Less than 1 year
                        </option>
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
                    <label className="block text-sm font-medium text-slateBlue mb-1">
                      Current/Previous Employer
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                      <input
                        type="text"
                        name="experience.currentEmployer"
                        value={formData.experience.currentEmployer}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                        placeholder="Enter employer name"
                      />
                    </div>
                  </div>

                  <div
                    className="relative"
                    data-aos="fade-right"
                    data-aos-delay="300"
                  >
                    <label className="block text-sm font-medium text-slateBlue mb-1">
                      Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                      <input
                        type="text"
                        name="experience.jobTitle"
                        value={formData.experience.jobTitle}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                        placeholder="Enter your job title"
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
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Languages
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="text"
                    name="skills.languages"
                    value={formData.skills.languages}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                    placeholder="Languages you speak (e.g., English, Spanish)"
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay={isCourse ? "200" : "500"}
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  {isCourse ? "Technical Skills" : "Computer Skills"}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-slateBlue h-5 w-5" />
                  <textarea
                    name="skills.computerSkills"
                    value={formData.skills.computerSkills}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent min-h-[80px]"
                    placeholder={
                      isCourse
                        ? "List your technical skills relevant to this course"
                        : "List your computer skills and proficiency levels"
                    }
                  />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay={isCourse ? "300" : "600"}
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Certifications
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 text-slateBlue h-5 w-5" />
                  <textarea
                    name="skills.certifications"
                    value={formData.skills.certifications}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent min-h-[80px]"
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
              <h2 className="text-2xl md:text-3xl font-bold text-slateBlue mb-2">
                {isCourse ? "Course Preferences" : "Program Preferences"}
              </h2>
              <p className="text-gray-600">
                {isCourse
                  ? "Tell us about your preferences for this course"
                  : "Tell us about your university program preferences"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Preferred Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <input
                    type="date"
                    name="preferences.startDate"
                    value={formData.preferences.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent"
                  />
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  {isCourse ? "Course Format" : "Program Type"}
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slateBlue h-5 w-5" />
                  <select
                    name="preferences.programType"
                    value={formData.preferences.programType}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slateBlue focus:border-transparent text-base appearance-none bg-white"
                  >
                    <option value="">
                      Select {isCourse ? "format" : "type"}
                    </option>
                    {isCourse ? (
                      <>
                        <option value="Online">Online</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Self-paced">Self-paced</option>
                        <option value="Instructor-led">Instructor-led</option>
                      </>
                    ) : (
                      <>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Online">Online</option>
                        <option value="On-campus">On-campus</option>
                        <option value="Distance Learning">
                          Distance Learning
                        </option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
                </div>
              </div>

              <div
                className="relative md:col-span-2"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label className="block text-sm font-medium text-slateBlue mb-1">
                  Tell us about yourself and why you're interested
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slateBlue h-5 w-5" />
                  <textarea
                    name="userDescription"
                    value={formData.userDescription}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slateBlue focus:border-transparent min-h-[200px]"
                    placeholder={
                      isCourse
                        ? "Tell us why you're interested in this course, your goals, and what you hope to achieve..."
                        : "Tell us about your educational background, interests, goals, and why you're interested in this university program..."
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className="bg-slateBlue/10 p-6 rounded-lg border border-slateBlue/20"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-lg font-semibold text-slateBlue mb-3">
                Before You Submit
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-slateBlue mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Make sure all required fields are completed
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-slateBlue mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Verify your contact information is correct
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-slateBlue mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Review your application for any errors
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
              <h2 className="text-2xl md:text-3xl font-bold text-slateBlue mb-2">
                Review Your Application
              </h2>
              <p className="text-gray-600">
                Please review your information before submitting
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-slateBlue text-white px-4 py-3">
                  <h3 className="font-medium">Personal Information</h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {formData.userDetails.personName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">
                        {formData.userDetails.personEmail || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">
                        {formData.userDetails.personPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {formData.userDetails.personDOB || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {formData.userDetails.personAddress || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-slateBlue text-white px-4 py-3">
                  <h3 className="font-medium">
                    {isCourse
                      ? "Course Prerequisites"
                      : "Educational Background"}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse
                          ? "Current Education Level"
                          : "Highest Qualification"}
                      </p>
                      <p className="font-medium">
                        {formData.education.highestQualification ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Institution</p>
                      <p className="font-medium">
                        {formData.education.institution || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse ? "Completion Year" : "Graduation Year"}
                      </p>
                      <p className="font-medium">
                        {formData.education.graduationYear || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GPA / Grade</p>
                      <p className="font-medium">
                        {formData.education.gpa || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isCourse && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-slateBlue text-white px-4 py-3">
                    <h3 className="font-medium">Experience</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Years of Experience
                        </p>
                        <p className="font-medium">
                          {formData.experience.yearsOfExperience ||
                            "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Current/Previous Employer
                        </p>
                        <p className="font-medium">
                          {formData.experience.currentEmployer ||
                            "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Job Title</p>
                        <p className="font-medium">
                          {formData.experience.jobTitle || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-slateBlue text-white px-4 py-3">
                  <h3 className="font-medium">Skills</h3>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-medium">
                      {formData.skills.languages || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isCourse ? "Technical Skills" : "Computer Skills"}
                    </p>
                    <p className="font-medium">
                      {formData.skills.computerSkills || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Certifications</p>
                    <p className="font-medium">
                      {formData.skills.certifications || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-slateBlue text-white px-4 py-3">
                  <h3 className="font-medium">
                    {isCourse ? "Course Preferences" : "Program Preferences"}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Preferred Start Date
                      </p>
                      <p className="font-medium">
                        {formData.preferences.startDate || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {isCourse ? "Course Format" : "Program Type"}
                      </p>
                      <p className="font-medium">
                        {formData.preferences.programType || "Not provided"}
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
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slateBlue mb-4">
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
                <h3 className="text-lg font-semibold text-slateBlue mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slateBlue/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-slateBlue font-medium text-sm">
                        1
                      </span>
                    </div>
                    <p className="text-gray-600 text-left">
                      Our team will review your application within 3-5 business
                      days
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slateBlue/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-slateBlue font-medium text-sm">
                        2
                      </span>
                    </div>
                    <p className="text-gray-600 text-left">
                      You'll receive an email confirmation with your application
                      details
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slateBlue/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-slateBlue font-medium text-sm">
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
                <h3 className="text-lg font-semibold text-slateBlue mb-3">
                  Connect with us
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
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-slateBlue text-white hover:bg-slateBlue/80 transition-colors"
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
      className={`${isDesktop ? "max-w-5xl mx-auto" : "w-full"}  p-6 md:p-8`}
    >
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slateBlue/20 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slateBlue/10 rounded-full opacity-20 blur-2xl"></div>

        {/* Header image */}
        {step < 6 && (
          <div className="mb-8 text-center" data-aos="fade-down">
            <Link
              to="/"
              className="text-4xl w-full bg-gradient-to-r from-slateBlue to-slateBlue/70 bg-clip-text text-transparent font-bold"
            >
              Edubrink
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slateBlue mb-2">
              {isCourse ? "Apply for this Course" : "University Application"}
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
              <div className="text-sm font-medium text-slateBlue">
                {step === 1 && "Personal Information"}
                {step === 2 &&
                  (isCourse
                    ? "Course Prerequisites"
                    : "Educational Background")}
                {step === 3 &&
                  (isCourse ? "Relevant Skills" : "Experience & Skills")}
                {step === 4 &&
                  (isCourse ? "Course Preferences" : "Program Preferences")}
                {step === 5 && "Review & Submit"}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-slateBlue h-3 rounded-full transition-all duration-500 ease-in-out"
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
                className="flex items-center gap-2 px-6 py-3 bg-slateBlue text-white rounded-lg hover:shadow-lg transition-all"
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
