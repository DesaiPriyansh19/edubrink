import React, { useState } from "react";
import Loader from "../../../utils/Loader";
import { FiEdit } from "react-icons/fi";

export default function ViewCountry({ loading, handleEdit, data }) {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const handleCheckboxChange = (id) => {
    if (selectedPeople.includes(id)) {
      setSelectedPeople(selectedPeople.filter((countryId) => countryId !== id));
    } else {
      setSelectedPeople([...selectedPeople, id]);
    }
  };

  if (loading || !data) {
    return <Loader />;
  }

  console.log(data);
  return (
    <div className="text-white mx-auto p-4">
      <div className="flex justify-between">
        {" "}
        <div>
          {" "}
          <p className="text-xl font-semibold uppercase">Manage Countries</p>
          <p className="mb-6 text-sm text-gray-200">
            This Are You Added Countries
          </p>
        </div>
        <button
          onClick={() => handleEdit("Add")}
          className="bg-red-500 text-white h-8 px-5 rounded"
        >
          Add New University
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left text-gray-300 uppercase text-sm">
              <th className="px-4 py-2 ">
                <div
                  className={`w-5 h-5 rounded-md flex justify-center items-center cursor-pointer border-2 border-gray-300 `}
                  onClick={() => {
                    if (selectedPeople.length === people.length) {
                      setSelectedPeople([]);
                    } else {
                      setSelectedPeople(people.map((country) => country.id));
                    }
                  }}
                ></div>
              </th>
              <th className="px-4 py-2">
                No <span className="text-gray-400"> (رقم)</span>
              </th>
              <th className="px-4 py-2">
                Flag <span className="text-gray-400"> (العلم)</span>
              </th>
              <th className="px-4 py-2">
                Country Name{" "}
                <span className="text-gray-400"> (اسم الدولة)</span>
              </th>
              <th className="px-4 py-2">
                Univeristy Enrolled{" "}
                <span className="text-gray-400"> (الجامعات المسجلة)</span>
              </th>
              <th className="px-4 py-2">
                Edit<span className="text-gray-400"> (يحرر)</span>{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((country, peridx) => (
              <tr
                key={country._id}
                onClick={() => handleCheckboxChange(country.id)}
                className={`border-b border-gray-600 hover:bg-gray-700 cursor-pointer ${
                  selectedPeople.includes(country.id) ? "bg-gray-700" : ""
                }`}
              >
                <td className="px-4 py-2">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex justify-center items-center font-bold border-gray-300 ${
                      selectedPeople.includes(country.id)
                        ? "bg-white text-[#41a494]"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleCheckboxChange(country.id)}
                  >
                    {selectedPeople.includes(country.id) ? "-" : "+"}
                  </div>
                </td>
                <td className="px-4 py-2">{peridx + 1}</td>
                <td className="px-4 py-2">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={country.countryPhotos.countryFlag}
                  />
                </td>
                <td className="px-4 py-2">{`${country.countryName.en} - (${country.countryName.ar})`}</td>
                <td className="px-4 py-2">{country.universities.length}</td>
                <td
                  onClick={() => {
                    handleEdit("Edit", country._id);
                  }}
                  className="px-4 py-2 text-green-400"
                >
                  <FiEdit />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
