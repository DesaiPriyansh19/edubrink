import React from "react";

const cards = [
  {
    id: 1,
    logo: "https://via.placeholder.com/50", // Replace with actual logo URL
    title: "MSc Advanced Computer Science",
    subtitle: "TH KHON - Cologne University of Applied Science",
    type: "Master",
    fees: "$3,857.00 / Year",
    language: "English",
    deadline: "31 July 2025",
  },
  {
    id: 2,
    logo: "https://via.placeholder.com/50",
    title: "MSc Advanced Computer Science",
    subtitle: "TH KHON - Cologne University of Applied Science",
    type: "Master",
    fees: "$3,857.00 / Year",
    language: "English",
    deadline: "31 July 2025",
  },
  {
    id: 3,
    logo: "https://via.placeholder.com/50",
    title: "MSc Advanced Computer Science",
    subtitle: "TH KHON - Cologne University of Applied Science",
    type: "Master",
    fees: "$3,857.00 / Year",
    language: "English",
    deadline: "31 July 2025",
  },
];

const AboutCard = () => {
  return (
    <div className="relative flex justify-center items-center mt-8">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`absolute bg-white shadow-lg rounded-lg p-6 w-80 transition-transform duration-300 
          ${
            index === 0
              ? "z-10 translate-x-0"
              : index === 1
              ? "z-20 translate-x-6"
              : "z-30 translate-x-12"
          }`}
          style={{ top: `${index * 10}px` }}
        >
          <div className="flex items-center mb-4">
            <img
              src={card.logo}
              alt="logo"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-bold">{card.title}</h2>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">{card.type}</p>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Tuition Fees: {card.fees}</span>
            <span>Language: {card.language}</span>
          </div>
          <p className="text-sm text-gray-600">Deadline: {card.deadline}</p>
          <div className="flex justify-between mt-4">
            <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
              Apply Now
            </button>
            <button className="border border-gray-400 py-2 px-4 rounded-lg hover:bg-gray-100">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutCard;
