"use client";

import { useEffect } from "react";
import FacultyRightLayout from "./FacultyRightLayout";
import mony from "../../assets/money.png";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

function FacultyPage() {
  const { slug } = useParams();
  const apiUrl = `https://edu-brink-backend.vercel.app/api/faculty/${slug}`;
  const { data: FacultyData, loading } = useFetch(apiUrl);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Function to safely truncate text
  const truncateText = (text, wordLimit = 2) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="w-full px-3 md:px-9 pb-12 animate-fadeIn">
      {/* Hero image section with overlay */}
      <div className="relative w-full h-[38vh] lg:h-[70vh] mb-6 overflow-hidden rounded-xl shadow-lg">
        <img
          src={
            FacultyData?.universities?.[0]?.uniMainImage ||
            "https://placehold.co/1376x426" ||
            "/placeholder.svg"
          }
          alt={FacultyData?.facultyName?.[language] || "Faculty image"}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Faculty name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-slideUp">
            {FacultyData?.facultyName?.[language]}
          </h1>
          <p className="text-sm md:text-base text-gray-200 animate-slideUp animation-delay-200">
            {FacultyData?.universities?.[0]?.uniName?.[language]}
          </p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Main content */}
        <div className="w-full lg:w-2/3 animate-fadeIn animation-delay-300">
          {/* Faculty description */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              {language === "ar" ? "نظرة عامة" : "Overview"}
            </h2>
            <div className="prose max-w-none">
              {FacultyData?.facultyDescription?.[language] ? (
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: FacultyData?.facultyDescription?.[language],
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">
                  {language === "ar"
                    ? "لا يوجد وصف متاح"
                    : "No description available"}
                </p>
              )}
            </div>
          </div>

          {/* Majors section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {language === "ar" ? "التخصصات المتاحة" : "Available Majors"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FacultyData?.major?.length > 0 ? (
                FacultyData.major.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-5">
                      {/* Major header */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              FacultyData?.universities?.[0]?.uniSymbol ||
                              "https://placehold.co/64x64" ||
                              "/placeholder.svg"
                            }
                            alt="University logo"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-blue-700 transition-colors duration-300">
                            {item?.majorName?.[language] || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {FacultyData?.universities?.[0]?.uniCountry
                              ?.countryName?.[language] || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <img
                              src={mony || "/placeholder.svg"}
                              alt="Tuition fees"
                              className="w-4 h-4"
                            />
                            <span className="font-medium text-sm">
                              {item?.majorTuitionFees || "Contact for pricing"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gray-200 my-4"></div>

                      {/* Action button */}
                      <button className="w-full bg-[#3A3D8D] hover:bg-[#2a2d7d] text-white py-2.5 px-4 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                        {language === "ar" ? "طلب عرض" : "Express Offer"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-10 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">
                    {language === "ar"
                      ? "لا توجد تخصصات متاحة حاليًا"
                      : "No majors available at this time"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related faculties */}
          {FacultyData?.universities?.[0]?.faculty?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 animate-fadeIn animation-delay-500">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {language === "ar" ? "كليات ذات صلة" : "Related Faculties"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {FacultyData.universities[0].faculty.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      navigate(
                        `/${language}/faculty/${item?.customURLSlug?.[language]}`
                      )
                    }
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200 shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105"
                  >
                    {item?.facultyName[language]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="w-full lg:w-1/3 animate-fadeIn animation-delay-400">
          <div className="sticky top-24">
            <FacultyRightLayout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyPage;
