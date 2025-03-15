import React, { useEffect, useState } from "react";
import studentTwo from "../../assets/AboutpageImage/studentTwo.png";
import studentThree from "../../assets/AboutpageImage/studentThree.png";
import studentOne from "../../assets/AboutpageImage/studentOne.png";

const AboutStudentPlacement = () => {
  const cards = [
    {
      id: 1,
      image: studentThree,
      title: "MSc Advanced Computer Science",
      university: "TH KHONE - Cologne University of Applied Science",
      tuitionFees: "€3,867.00 / Year",
      language: "English",
      deadline: "31 July 2025",
      buttonWidths: ["w-1/2", "w-1/2"],
      marginTop: "mt-[0%]",
      marginBottom: "mb-[8%]",
      marginLeft: "ml-[0%]",
    },
    {
      id: 2,
      image: studentTwo,
      title: "MSc Advanced Computer Science",
      university: "TH KHONE - Cologne University of Applied Science",
      tuitionFees: "€3,867.00 / Year",
      language: "English",
      deadline: "31 July 2025",
      buttonWidths: ["w-[40%]", "w-[40%]"],
      marginTop: "mt-[10%]",
      marginBottom: "mb-[6%]",
      marginLeft: "ml-[5%] mmd:ml-0 lg:ml-[5%]",
    },
    {
      id: 3,
      image: studentOne,
      title: "MSc Advanced Computer Science",
      university: "TH KHONE - Cologne University of Applied Science",
      tuitionFees: "€3,867.00 / Year",
      language: "English",
      deadline: "31 July 2025",
      buttonWidths: ["w-[45%]", "w-[45%]"],
      marginTop: "mt-[20%]",
      marginBottom: "mb-[6%]",
      marginLeft: "ml-[10%] mmd:ml-0 lg:ml-[10%]",
    },
  ];

  return (
    <div className="flex mmd:flex-row flex-col justify-between items-start px-4 gap-6 mt-6">
      {/* Left: Card Section */}
      <div className="w-full mmd:w-1/2  relative h-[320px] esm:h-[350px] md:h-[400px]">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`absolute top-0 left-1/2 -translate-x-[55%] md:-translate-x-1/2 -translate-y-0 ${card.marginLeft} ${card.marginTop} ${card.marginBottom} bg-white shadow-lg rounded-lg py-3 px-5 transform scale-95 z-10 w-[18rem] esm:w-[22rem] sm:w-[27rem] p-4 sm:p-6`} // Added padding here
          >
            <div className="flex items-center gap-2">
              <img
                src={card.image}
                alt={card.title}
                className="h-auto w-auto"
              />
              <div>
                <div className="font-semibold text-black text-xs sm:text-[1rem]">
                  {card.title}
                </div>
                <div className="text-xs sm:text-sm  text-black">
                  {card.university}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-black font-medium text-[.8rem]">
                  Tuition Fees
                </p>
                <p className="text-black font-medium text-[.8rem]">
                  {card.tuitionFees}
                </p>
              </div>
              <div>
                <p className="text-black font-medium text-[.8rem]">Language</p>
                <p className="text-black font-medium text-[.8rem]">
                  {card.language}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-[.8rem]">
                  Deadline
                </p>
                <p className="text-gray-900 font-medium text-[.8rem]">
                  {card.deadline}
                </p>
              </div>
            </div>

            <div className="border-t-[2px] border-black mt-2 mb-2"></div>

            <div className="mt-6 flex justify-between">
              <button
                className={`w-[211.42px] h-[40.42px] pl-[21.76px] pr-[21.76px] text-sm text-[rgba(255,255,255,1)] bg-gradient-to-r from-[rgba(58,61,141,1)] to-[rgba(73,75,134,1)] rounded-[1.5rem] ${card.buttonWidths[0]}`}
              >
                Apply Now
              </button>
              <button
                className={`w-[211.42px] h-[40.42px] pl-[21.76px] pr-[21.76px] text-sm border border-black rounded-[1.5rem] ${card.buttonWidths[1]}`}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Text Section */}
      <div className="w-full mmd:w-1/2 h-auto esm:h-[350px] md:h-[400px]">
        <div className="w-full mmd:max-w-xl">
          <h2 className="text-3xl lg:text-5xl font-semibold text-[rgba(29,33,28,1)]">
            We make more than 20k+ successful students placement in the world
          </h2>
          <p className="mt-4 text-[rgba(29,33,28,1)] font-medium text-lg leading-[155%]">
            Investigate courses, universities and their locations. Look upon the
            teaching modules, research opportunities, campus life and employment
            prospects before you narrow down your selection.
          </p>
          <button className="mt-6 text-lg leafding-[155%] text-[rgba(29,33,28,1)] bg-[rgba(255,255,255,1)] px-6 py-3 rounded-3xl w-[175px] h-[52px] pl-[28px] pr-[28px]">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutStudentPlacement;
