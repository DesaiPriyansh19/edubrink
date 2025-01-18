import React from "react";
import Loader from "../../../../utils/Loader";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import LanguageLogo from "../../../../svg/LanguageLogo";
import Master from "../../../../svg/AboutStudent/Master";
import UniversityChicago from "../../../assets/CountryPage/UniversityChicago.png";

export default function ViewCourses({ loading, handleEdit, data }) {
  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div className="text-white mx-auto p-4">
      <div className="flex justify-between">
        {" "}
        <div>
          {" "}
          <p className="text-xl font-semibold uppercase">Manage Courses</p>
          <p className="mb-6 text-sm text-gray-200">
            This Are You Added Courses
          </p>
        </div>
        <button
          onClick={() => handleEdit("Add")}
          className="bg-red-500 text-white h-8 px-5 rounded"
        >
          Add New Courses
        </button>
      </div>
      <div className="text-white grid grid-cols-3 gap-4">
        {data.map((course, index) => {
          // Define the features array for each course dynamically
          const features = [
            {
              icon: <DollerRounded width={20} height={20} color={"#ffffff"} />,
              title: "Tuition Fees",
              description: course?.CourseFees, // Use course-specific data
            },
            {
              icon: <LanguageLogo width={20} height={20} color={"#ffffff"} />,
              title: "Language",
              description: course?.Language || "English", // Fallback to "English" if not available
            },
            {
              icon: <DollerRounded width={20} height={20} color={"#ffffff"} />,
              title: "Deadline",
              description: course?.DeadLine
                ? new Date(course?.DeadLine).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not Specified", // Fallback if no deadline is provided
            },
          ];

          return (
            <div
              key={index}
              onClick={() => handleEdit("Edit", course._id)}
              className="relative mt-3 border hover:scale-[0.98] transition-transform ease-in-out duration-300 cursor-pointer shadow-md bg-transparent"
            >
              <div>
                <div className="flex flex-col items-start justify-between mt-6 sm:mt-2 mb-6 md:mb-3">
                  <div className="flex gap-4 px-4 pt-4 w-full items-start">
                    <div className="w-11 h-11 border p-1 rounded-full">
                      <img
                        src={UniversityChicago} // Update with course-specific image if available
                        alt="College Logo"
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-lg leading-6 font-semibold">
                      {course?.CourseName?.en}
                    </p>
                  </div>
                  <div className="px-4 mb-2">
                    <p className="text-[.8rem] max-w-52 font-medium text-white flex items-center my-1">
                      {course?.Institution || "Unknown Institution"}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="w-5 h-5 rounded-full mr-1">
                        <Master color={"#ffffff"} />
                      </span>
                    </div>
                  </div>
                  <div className="flex p-2 flex-wrap gap-5 items-center sm:gap-3 justify-start">
                    {features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center justify-center"
                      >
                        <span className="rounded-full w-8 h-8 flex items-center justify-center border">
                          {feature.icon}
                        </span>
                        <div className="ml-2">
                          <p className="text-xs font-medium">{feature.title}</p>
                          <p className="text-xs font-medium">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
