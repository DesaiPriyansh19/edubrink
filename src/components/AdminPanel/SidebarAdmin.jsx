import React, { useState } from "react";
import { Link, Links } from "react-router-dom"; // Import Link for routing
import WhiteHamburgerIcon from "../../../svg/WhiteHamburger";
import HomeSvg from "../../../svg/HomeSvg";

export default function SidebarAdmin() {
  const [conMaxWidth, setConMaxWidth] = useState(288);

  const SideBarOption = [
    { name: "Dashboard", icon: <HomeSvg />, path: "/dashboard" },
    { name: "Manage Peoples", icon: <HomeSvg />, path: "/manage-peoples" },
    { name: "Contact Information", icon: <HomeSvg />, path: "/contact-info" },
    { name: "Profile Form", icon: <HomeSvg />, path: "/profile-form" },
    { name: "Add Universities", icon: <HomeSvg />, path: "/add-universities" },
    { name: "Bar Chart", icon: <HomeSvg />, path: "/bar-chart" },
    { name: "Pie Chart", icon: <HomeSvg />, path: "/pie-chart" },
    { name: "Line Chart", icon: <HomeSvg />, path: "/line-chart" },
  ];

  const handleMinimise = () => {
    setConMaxWidth((prev) => (prev === 288 ? 72 : 288));
  };

  return (
    <div
      style={{ maxWidth: `${conMaxWidth}px` }}
      className="sticky top-0 w-full min-h-screen bg-[#161f30] transition-all duration-300"
    >
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div
          className={`flex items-center ${
            conMaxWidth === 288 ? "justify-between" : "justify-center"
          } pt-4 mb-10 px-4`}
        >
          {conMaxWidth === 288 && (
            <Link
              to="/"
              className="text-2xl font-bold cursor-pointer text-white"
            >
              EDUBRINK
            </Link>
          )}
          <div
            onClick={handleMinimise}
            className="cursor-pointer active:scale-95"
          >
            <WhiteHamburgerIcon />
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="pb-10">
          {SideBarOption.map((category, index) => (
            <div key={index} className="mb-8">
              <Link to={`/admin${category.path}`}>
                <div
                  className={`flex ${
                    conMaxWidth === 288 ? "ml-4 mb-4" : "justify-center mb-8"
                  } cursor-pointer text-base font-light items-center gap-4`}
                >
                  <div className="relative group">
                    {category.icon}
                    <div
                      className={`absolute top-[-1px] ${
                        conMaxWidth === 72
                          ? "left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          : "left-4 mb-1"
                      } text-white ml-2 text-sm whitespace-nowrap rounded-md`}
                    >
                      {category.name}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div
          className={`absolute w-full flex ${
            conMaxWidth === 72 ? "justify-center" : "justify-between"
          } items-center h-auto bottom-8`}
        >
          <div
            className={`rounded-lg ${
              conMaxWidth === 72 ? "ml-0 w-10 h-10" : "ml-4 w-14 h-14"
            } bg-gray-500`}
          ></div>
          <div
            className={`absolute text-xl text-white  ${
              conMaxWidth === 72 ? "left-full hidden" : "left-14 top-0"
            } ml-6 text-sm whitespace-nowrap rounded-md`}
          >
            <p className="mb-1 font-medium">Karan Jangde</p>
            <p className="text-xs">jangdekaran4@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
