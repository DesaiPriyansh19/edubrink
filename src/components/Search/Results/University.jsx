import React from "react";
import uniLogo from "../../../assets/UniversityBoston.png";
import uk from "../../../assets/Flags/UKFlag.png";
import DollerRounded from "../../../../svg/DollerRounded/Index";
import ScholerShipLogo from "../../../../svg/ScolerShipLogo/Index";
import DiscountLogo from "../../../../svg/DiscountLogo/Index";
import PrivetUniLogo from "../../../../svg/PriUniLogo/Index";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import TickMark from "../../../../svg/TickMark";

const CollegeCard = ({ data }) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-4">
      {data?.map((university, idx) => {
        const dynamicFeatures = [
          {
            icon: <DollerRounded />,
            title: "Tuition Fees",
            description: university?.uniTutionFees || "N/A",
          },
          {
            icon: <ScholerShipLogo />,
            title: "Scholarship Available",
            description:
              university?.scholarshipAvailability === true
                ? "Available"
                : "Not-Available", // Assuming language is not dynamic
          },
          {
            icon: <DiscountLogo />,
            title: "Discount",
            description: university?.DeadLine
              ? new Date(university?.DeadLine).toLocaleDateString("en-US", {
                  year: "numeric", // Full year (optional)
                  month: "short", // Abbreviated month name
                  day: "numeric", // Day of the month
                })
              : "N/A",
          },
        ];
        return (
          <div
            key={idx}
            className="relative mt-6 border rounded-xl shadow-md bg-white max-w-sm sm:max-w-md md:max-w-lg"
          >
            <div className="p-4 sm:p-6">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-bl-md rounded-tr-xl">
                Most Popular
              </div>

              <div className="flex gap-3 sm:gap-4 items-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20">
                  <img
                    src={"https://placehold.co/80x80"}
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold gap-1 flex">
                    {university?.uniName?.en || "N/A"}{" "}
                    <span>
                      <TickMark />
                    </span>
                  </h1>

                  <p className="text-sm font-medium text-gray-700 flex items-center mt-1">
                    <img
                      src={"https://placehold.co/20x20"}
                      alt="Flag"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2"
                    />
                    {data?.countryName?.en || "N/A"}
                  </p>

                  <div className="flex items-center mt-1">
                    <span className="w-5 h-5 rounded-full mr-2">
                      <PrivetUniLogo />
                    </span>

                    <p className="text-sm font-medium text-gray-700">
                      Private University
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                {dynamicFeatures.flat().map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 justify-center"
                  >
                    <span className="rounded-full w-10 flex items-center justify-center h-10 border ">
                      {feature.icon}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{feature.title}</p>
                      <p className="text-xs font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
              <button className="bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l text-white text-sm py-2 px-3 rounded-full">
                Apply Now
              </button>
              <button className="text-black text-sm px-3 py-2 hover:font-medium rounded-full border-2 border-gray-800">
                Learn More
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
function Univrsiry() {
  const { data } = useFetch(
    "https://edu-brink-backend.vercel.app/api/university"
  );

  return (
    <>
      <div className="max-w-[1240px]  mt-20 ">
        <div className="  mt-6 mb-1">
          <h1 className="text-start text-3xl sm:text-4xl font-semibold ">
            🏫 Favourite Universities
          </h1>
          <p className="text-sm mt-3 font-medium ">
            Discover top study abroad destinations, each offering unique
            cultural <br></br> experiences, academic excellence, and career
            opportunities. From vibrant cities.
          </p>
        </div>

        <div className="w-full hidden sm:flex justify-end items-center px-4">
          <Link to={"/searchresults/AllUniversity"}>
            {" "}
            <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
              View All
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide whitespace-nowrap">
        <CollegeCard data={data} />
      </div>
    </>
  );
}

export default Univrsiry;
