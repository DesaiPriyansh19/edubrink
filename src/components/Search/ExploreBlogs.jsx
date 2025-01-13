import React, { useState } from "react";

function ExploreBlogs() {
  // Array of buttons and corresponding content
  const items = [
    { id:1, label: "Button", content: "Content for Button" },
    { id: 2, label: "Button", content: "Content for Button" },
    { id: 3, label: "Button", content: "Content for Button" },
    { id: 4, label: "Button", content: "Content for Button" },
    { id: 5, label: "Button", content: "Content for Button" },
    { id: 6, label: "Button", content: "Content for Button" },
    { id: 7, label: "Button", content: "Content for Button" },
    { id: 8, label: "Button", content: "Content for Button" },
    { id: 9, label: "Button", content: "Content for Button" },
    { id: 10, label: "Button", content: "Content for Button" },
  ];

  // State to track selected button
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center font-semibold mb-2">📑 Blog and resources</h1>

      {/* Description */}
      <p className="text-black font-medium text-sm text-center mb-24">
      Effortlessly explore a wide range of universities, discover the perfect <br></br> courses tailored to your goals, and compare study opportunities
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">📑 Recent blog</h3>
      <div className="flex w-full overflow-x-auto space-x-4 scrollbar-hide">
  {items.map((item) => (
    <button
      key={item.id}
      onClick={() => setActiveItem(item.id)} // Set the active item
      className={`px-5 py-2 rounded ${
        activeItem === item.id
          ? "text-sm text-white rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754]"
          : "border-gray-300 border-2 text-black rounded-full"
      }`}
    >
      {item.label}
    </button>
  ))}
</div>


      {/* Dynamic Content */}
      <div className="mt-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${
              activeItem === item.id ? "block" : "hidden"
            } p-4 border rounded bg-gray-100`}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreBlogs;
