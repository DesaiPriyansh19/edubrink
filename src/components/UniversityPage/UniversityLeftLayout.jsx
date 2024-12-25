import React from "react";
import CoursesLogo from "../../../svg/CorsesLogo/Index";

const UniversityLeftLayout = () => {
  const subjects = [
    [
      "Computer Science",
      "Data Sciences and Big Data",
      "Artificial Intelligence",
    ],
    [
      "Business Administration",
      "Business",
      "Cyber Security",
      "Information Technology",
    ],
    ["Finance", "Health Care", "Manufacturing Engineering", "Search Subjects"],
  ];

  return (
    <div className="container mx-auto py-4 mt-5">
      <div className="px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          IUBH - International University of Applied Sciences
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-purple-800 mt-2">
          Germany
        </p>
      </div>
      <div className="px-4 mt-6">
        <div className="flex items-center gap-3">
          <CoursesLogo />
          <h3 className="text-xl font-bold">Courses</h3>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold">STUDY LEVEL</p>
          <div className="flex flex-wrap gap-2 mt-8 mb-8">
            <span className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
              Undergraduate
            </span>
            <span className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm">
              Postgraduate
            </span>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold">SUBJECTS</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {subjects.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-2 w-full mt-2">
                {row.map((subject) => (
                  <span
                    key={subject}
                    className="bg-[rgba(243,244,246,1)] px-3 py-1 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityLeftLayout;
