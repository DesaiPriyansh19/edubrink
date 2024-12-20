import React, { useState } from "react";

export default function ManagePeoples() {
  const [selectedPeople, setSelectedPeople] = useState([]);

  const people = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Sam Wilson", email: "sam@example.com", role: "Viewer" },
    { id: 4, name: "Lisa Ray", email: "lisa@example.com", role: "Contributor" },
  ];

  const handleCheckboxChange = (id) => {
    if (selectedPeople.includes(id)) {
      setSelectedPeople(selectedPeople.filter((personId) => personId !== id));
    } else {
      setSelectedPeople([...selectedPeople, id]);
    }
  };

  return (
    <div className="text-white mx-auto p-4">
      <p className="text-xl font-semibold uppercase">Manage Peoples</p>
      <p className="mb-6 text-sm text-gray-200">Manage Your Peoples</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left text-gray-300 uppercase text-sm">
              <th className="px-4 py-2 ">
                <div
                  className={`w-5 h-5 rounded-md flex justify-center items-center cursor-pointer border-2 border-gray-300 ${
                    selectedPeople.length === people.length
                      ? "bg-[#41a494]"
                      : "bg-transparent"
                  }`}
                  onClick={() => {
                    if (selectedPeople.length === people.length) {
                      setSelectedPeople([]);
                    } else {
                      setSelectedPeople(people.map((person) => person.id));
                    }
                  }}
                >{
                  selectedPeople.length === people.length
                    ? "-"
                    : "+"
                }</div>
              </th>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr
                key={person.id}
                onClick={()=>handleCheckboxChange(person.id)}
                className={`border-b border-gray-600 hover:bg-gray-700 cursor-pointer ${
                  selectedPeople.includes(person.id) ? "bg-gray-700" : ""
                }`}
              >
                <td className="px-4 py-2">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex justify-center items-center font-bold border-gray-300 ${
                      selectedPeople.includes(person.id)
                        ? "bg-white text-[#41a494]"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleCheckboxChange(person.id)}
                  >{
                    selectedPeople.includes(person.id)
                      ? "-"
                      : "+"
                  }</div>
                </td>
                <td className="px-4 py-2">{person.id}</td>
                <td className="px-4 py-2">{person.name}</td>
                <td className="px-4 py-2">{person.email}</td>
                <td className="px-4 py-2">{person.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
