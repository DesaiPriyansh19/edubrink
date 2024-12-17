import React from "react";
import img1 from "../../assets/Corses1.png";
import img2 from "../../assets/Corses2.png";
import img3 from "../../assets/Corses3.png";
import Book from "../../assets/Book.png";
import ArrowTopRight from "../../../svg/ArrowTopRight/Index";
function OurCourses() {
  const slides = [
    {
      id: 1,
      bgColor: "#60E38C",
      imgSrc: img1,
      title: "MSc Advanced Computer Science with Business",
      subtitle: "University of Australia",
      updirection: true,
      price: "$500.00",
      description: null, // Optional, for slides without descriptions
    },
    {
      id: 2,
      bgColor: "#55CFFF",
      imgSrc: img2,
      title: "Business strategy",
      updirection: false,
      subtitle: "University of Australia",
      price: "$500.00",
      description: null,
    },
    {
      id: 3,
      bgColor: "#E186FF",
      imgSrc: img3,
      title: "Ads productions",
      updirection: true,
      subtitle: null,
      price: "$500.00",
      description:
        "Discover the art of ad production, with where creativity meets strategy.",
    },
    {
      id: 4,
      bgColor: "#fef08a",
      imgSrc: img2,
      title: "Business strategy",
      updirection: false,
      subtitle: "University of Australia",
      price: "$500.00",
      description: null,
    },
  ];

  return (
    <>
      <div className="max-w-[1240px] mb-10 mx-auto ">
        <div className="flex mb-4 items-center">
          <h1 className="text-start text-3xl sm:text-4xl font-semibold pl-4">Our courses</h1>
          <img src={Book} alt="Icon" className="w-8 h-8 sm:w-10 sm:h-10 mr-1 ml-3" />{" "}
        </div>
        <p className="text-start font-normal text-[.8rem]  pl-4 pr-9 md:pr-[50%]">
          Effortlessly explore diverse courses, find programs tailored to your
          academic goals, compare study opportunities, and make informed
          decisions.
        </p>
        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
            View All
          </button>
        </div>
      </div>

      <div className="flex sm:flex-row mb-20 flex-col px-4 1xl:pl-28 gap-6 scrollbar-hide overflow-x-auto">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`sm:min-w-[397px]  w-full flex ${slide.updirection?"flex-col":"flex-col-reverse"} justify-between p-6 rounded-3xl shadow-md`}
            style={{ backgroundColor: slide.bgColor }}
          >
            {/* SVG and Image */}
            <div className={`flex ${slide.updirection?"items-start":"items-end"} justify-between space-x-4`}>
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                {/* Example SVG */}
                <ArrowTopRight />
              </span>
              <div className={`w-48 h-auto`}>
                <img
                  src={slide.imgSrc}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover rounded-b-lg"
                />
              </div>
            </div>
            {/* Content */}
            <div className="mt-4 max-w-72 text-white text-left">
              <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
              {slide.subtitle && (
                <p className="text-[.8rem]">{slide.subtitle}</p>
              )}
              {slide.description && (
                <p className="text-[.8rem]">{slide.description}</p>
              )}
              <p className="text-lg font-semibold">{slide.price}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default OurCourses;
