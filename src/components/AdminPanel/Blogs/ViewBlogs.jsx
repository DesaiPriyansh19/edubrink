import React from "react";
import Loader from "../../../../utils/Loader";
import blogImage from "../../../assets/Blog2.png";
import Calander from "../../../../svg/caplogo/Logo/Calander/Index";

export default function ViewBlogs({ loading, handleEdit, data }) {
  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div className="text-white mx-auto p-4">
      <div className="flex justify-between">
        {" "}
        <div>
          {" "}
          <p className="text-xl font-semibold uppercase">Manage Blogs</p>
          <p className="mb-6 text-sm text-gray-200">This Are You Added Blogs</p>
        </div>
        <button
          onClick={() => handleEdit("Add")}
          className="bg-red-500 text-white h-8 px-5 rounded"
        >
          Add New blogs
        </button>
      </div>
      <div className="text-white grid grid-cols-3 gap-4">
        {data.map((card) => (
          <div
            key={card._id}
            onClick={() => {
              handleEdit("Edit", card._id);
            }}
            className="min-w-[300px] border border-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={blogImage || card.blogPhoto} // Assuming `blogPhoto` is the image URL
                alt={`Blog ${card._id}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] text-sm font-semibold mt-4 ">
              {card.blogCategory || "Uncategorized"}{" "}
              {/* Assuming you have a category for blog */}
            </p>

            <h4 className="font-semibold text-lg text-white mt-2 mb-1">
              {card.blogTitle.en || card.blogTitle.ar}{" "}
              {/* Display English title or fallback to Arabic */}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start">
              <Calander color="white" />{" "}
              {/* If you have a calendar component */}
              {card.blogAdded
                ? new Date(card.blogAdded).toLocaleDateString()
                : "Date not available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
