import React from "react";
import Loader from "../../../../utils/Loader";

export default function ViewUniversities({ data, loading, handleEdit }) {
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="text-white mx-auto p-4">
      <div className="flex items-center mb-6 justify-between">
        <div>
          <p className="text-xl font-semibold uppercase">View Universities</p>
          <p className="text-sm text-gray-200">
            Welcome to your University Portal
          </p>
        </div>
        <button
          onClick={() => handleEdit("Add")}
          className="bg-red-500 text-white h-8 px-5 rounded"
        >
          Add New University
        </button>
      </div>
      <div className="w-full grid grid-cols-4 gap-4">
        {data?.map((university, index) => (
          <div
            key={index}
            onClick={() => handleEdit("Edit", university._id)}
            className="bg-gray-800 h-[340px] p-4 cursor-pointer rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[0.98] transition duration-300 flex flex-col"
          >
            {/* Property Image */}
            <div className="h-48 w-full relative group bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={
                  "https://i.pinimg.com/736x/10/a3/ef/10a3ef4b7759520fd63be218f4cf610b.jpg"
                }
                alt={university?.uniName}
                className="w-full h-full object-cover"
              />

              <p className="absolute inset-0 text-xl font-mono backdrop-blur-sm w-full h-full ease-in-out duration-300 transition-opacity group-hover:opacity-100 flex opacity-0 justify-center items-center">
                <span>View Uni</span>{" "}
                <span className="ml-2 mt-2 transition-transform ease-in-out duration-200 group-active:translate-x-2 group-active:-translate-y-2">
                  &#8599;
                </span>
              </p>

              {/* Conditional render for study level */}
              <p
                className={`text-sm group-hover:opacity-0 ease-in-out duration-300 transition-opacity absolute top-0 right-1 bg-yellow-500 text-black inline-block p-2 my-2 rounded-md ${
                  !university?.studyLevel ? "hidden" : ""
                }`}
              >
                {university?.studyLevel || "N/A"}
              </p>
            </div>

            {/* Property Details */}
            <div className="py-2 flex flex-col justify-between h-28">
              <div>
                <h2 className="text-lg font-semibold text-white truncate">
                  {university?.uniName?.en || "Property Name"}
                </h2>
                <p className="text-sm mb-2 text-gray-400">
                  {university?.uniLocation?.uniAddress?.en ||
                    "Location not available"}
                </p>
              </div>

              <p className="text-base font-bold text-white">
                ${university?.uniTutionFees || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
