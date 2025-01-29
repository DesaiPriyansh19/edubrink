import React from "react";
import Calander from "../../../../svg/caplogo/Logo/Calander/Index";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../utils/Loader";
import { useSearch } from "../../../../context/SearchContext";
function ResultsBlog({ filteredData, loading }) {

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-11 text-black">
      <div className="max-w-[1240px] mx-auto">
        <h1 className="text-start text-3xl sm:text-4xl mb-4 font-semibold pl-4">
          📑 Recent blog
        </h1>

        <p className="text-start font-normal text-sm sm:text-[.8rem] px-0 pl-4 pr-1 md:pr-[39%]">
          Stay informed with our study abroad blog, featuring expert tips,
          destination guides, student experiences, and the latest updates on
          scholarships, visas.
        </p>
        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <Link to={"AllBlogs"}>
            {" "}
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
              View All
            </button>
          </Link>{" "}
        </div>
      </div>
      <div className="flex flex-col scrollbar-hide em:flex-row overflow-x-auto  gap-6   py-6 ">
        {filteredData?.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={"https://placehold.co/260x220" || card?.blogPhoto}
                alt={`Slide ${idx + 1}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] text-sm font-semibold mt-4 ">
              Study in {card?.countryName?.en}
            </p>

            <h4 className="font-semibold text-lg text-black mt-2 mb-1">
              {card?.blogTitle?.en}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
              <Calander />
              {card?.blogAdded
                ? new Date(card.blogAdded).toLocaleDateString()
                : "Date not available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsBlog;
