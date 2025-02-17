import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import WhiteHamburgerIcon from "../../../svg/WhiteHamburger";
import HomeSvg from "../../../svg/HomeSvg";

import { FaUsers, FaUniversity, FaBookOpen, FaBlog } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { MdContactMail } from "react-icons/md";

export default function SidebarAdmin() {
  const [conMaxWidth, setConMaxWidth] = useState(288);
  const location = useLocation();
  const lang = location.pathname.split("/")[1];

  const SideBarOption = [
    { name: "Dashboard", icon: <HomeSvg />, path: "/dashboard" },
    {
      name: "Manage Peoples",
      icon: <FaUsers className="text-white" />,
      path: "/manage-peoples",
    },
    // {
    //   name: "Contact Information",
    //   icon: <MdContactMail className="text-white" />,
    //   path: "/contact-info",
    // },
    // { name: "Profile Form", icon: <HiOutlineUserCircle />, path: "/profile-form" },
    {
      name: "Add Country",
      icon: <IoIosGlobe className="text-white" />,
      path: "/add-country",
    },
    {
      name: "Add Universities",
      icon: <FaUniversity className="text-white" />,
      path: "/add-universities",
    },
    {
      name: "Add Courses",
      icon: <FaBookOpen className="text-white" />,
      path: "/add-courses",
    },
    {
      name: "Add Blogs",
      icon: <FaBlog className="text-white" />,
      path: "/add-blogs",
    },
    // { name: "Bar Chart", icon: <HomeSvg />, path: "/bar-chart" },
    // { name: "Pie Chart", icon: <HomeSvg />, path: "/pie-chart" },
    // { name: "Line Chart", icon: <HomeSvg />, path: "/line-chart" },
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
              <Link to={`/${lang}/admin${category.path}`}>
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

        {/* <div
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
            <p className="mb-1 font-medium">test gmail</p>
            <p className="text-xs">test@gmail.com</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
