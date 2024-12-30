import React from "react";
import { useLocation } from "react-router-dom";

export default function Loader() {
  const location = useLocation();

  // Check if the current route starts with `/admin`
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <span className="loader h-screen w-full flex items-center justify-center ">
        <p
          className={` text-4xl relative  font-semibold tracking-wider z-10 -rotate-45 ${
            isAdminRoute ? "text-white bg-transparent" : "text-black bg-[#f8f8f8]"
          } `}
        >
          EduBrink
        </p>
      </span>
    </div>
  );
}
