import React from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
function RelatedBlogs({ data }) {
  return (
    <div className="mt-11 text-black">
      <div className="max-w-[1240px] mx-auto">
        <h1 className="text-start text-xl sm:text-4xl mb-4 font-semibold  flex justify-between">
        📑 More Similar  blogs
          <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
            View All<span className="mx-2">&gt;</span>
          </button>
        </h1>
      </div>
      <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto gap-6   py-6 ">
        {/* First Slide */}
        {data?.blog.map((card,idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={"https://placehold.co/260x200"}
                alt={`Slide ${card.id}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] uppercase text-sm font-semibold mt-4 ">
              STUDY IN {data?.countryName?.en || "N/A"}
            </p>

            <h4 className="font-semibold text-lg text-black mt-2 mb-1">
              {card?.blogTitle?.en}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
              <Calander />
              {new Date(card?.blogAdded).toLocaleDateString("en-US", {
                year: "numeric", // Full year (optional)
                month: "short", // Abbreviated month name
                day: "numeric", // Day of the month
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedBlogs;
