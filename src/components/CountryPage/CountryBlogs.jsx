import React from "react";
import blogImage from "../../assets/Blog1.png";
import blogImage2 from "../../assets/Blog2.png";
import blogImage3 from "../../assets/Blog3.png";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
function CountryBlogs() {
  const blogCards = [
    {
      id: 1,
      image: blogImage2,
      category: "STUDY IN AUSTRALIA",
      title: "Different University types in Australia - ...",
      date: "17 March 2023",
    },
    {
      id: 2,
      image: blogImage3,
      category: "STUDY IN AUSTRALIA",
      title: "Different University types in Australia - ...",
      date: "17 March 2023",
    },
    {
      id: 3,
      image: blogImage,
      category: "STUDY IN AUSTRALIA",
      title: "Different University types in Australia - ...",
      date: "17 March 2023",
    },
    {
      id: 4,
      image: blogImage2,
      category: "STUDY IN AUSTRALIA",
      title: "Different University types in Australia - ...",
      date: "17 March 2023",
    },
  ];

  return (
    <div className="mt-11 text-black">
      <div className="max-w-[1240px] mx-auto">
        <h1 className="text-start text-3xl sm:text-4xl mb-4 font-semibold  flex justify-between">
          Popular Article related Australia
          <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
            View All<span className="mx-2">&gt;</span>
          </button>
        </h1>
      </div>
      <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto gap-6   py-6 ">
        {/* First Slide */}
        {blogCards.map((card) => (
          <div
            key={card.id}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={card.image}
                alt={`Slide ${card.id}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] text-sm font-semibold mt-4 ">
              {card.category}
            </p>

            <h4 className="font-semibold text-lg text-black mt-2 mb-1">
              {card.title}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
              <Calander />
              {card.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryBlogs;
