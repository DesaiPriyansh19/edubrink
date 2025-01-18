import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import usa from "../assets/Flags/USAflag.png";
import germny from "../assets/Flags/GermnyFlag.png";
import Unitedarap from "../assets/Flags/UnitedAraPFlag.png";
import uae from "../assets/Flags/uae.png";
import swizrland from "../assets/Flags/SwitzerlandFlag.png";
import canada from "../assets/Flags/CanadaFlag.png";
import india from "../assets/Flags/IndiaFlag.png";
import bangladesh from "../assets/Flags/BangladeshFlag.webp";
import nigeria from "../assets/Flags/NigeriaFlag.webp";
import newzealand from "../assets/Flags/NewZealandFlag.webp";
import denmark from "../assets/Flags/DenmarkFlag.webp";
import australia from "../assets/Flags/AustraliaFlag.png";
import { useNavigate } from "react-router-dom";

function DropdownCountries({ setShowCountriesDropdown }) {
  const navigate = useNavigate();
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    });
  }, []);

  // Country data
  const countries = [
    { label: "United States of America", name: "United States", flag: usa },
    { label: "Germany", name: "Germany", flag: germny },
    { label: "United Arab Emirates", name: "United Arab Emirates", flag: Unitedarap },
    { label: "Canada", name: "Canada", flag: canada },
    { label: "United Arab Emirates", name: "United Arab Emirates", flag: uae },
    { label: "Switzerland", name: "Switzerland", flag: swizrland },
    { label: "India", name: "India", flag: india },
    { label: "Bangladesh", name: "Bangladesh", flag: bangladesh },
    { label: "Nigeria", name: "Nigeria", flag: nigeria },
    { label: "New Zealand", name: "New Zealand", flag: newzealand },
    { label: "Denmark", name: "Denmark", flag: denmark },
    { label: "Australia", name: "Australia", flag: australia },
  ];
  
  const handleNavigate = (name) => {
    navigate(`/country/${name}`);
    setShowCountriesDropdown(false);
  };

  return (
    <div
      className="absolute right-4 top-[15%] px-3 py-3 w-[38vw] h-auto z-10 mt-2 bg-white rounded-3xl shadow-lg"
      data-aos="fade-out"
      data-aos-delay="0"
      data-aos-duration="300"
    >
      <div className="my-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Top Institutions in</p>
        <button className="text-[.5rem] bg-[#f8f8f8] px-3 py-0 rounded-full font-light">
          View all
        </button>
      </div>

      <div className="bg-white flex items-center justify-center gap-2 rounded-3xl px-1 py-2 w-full">
        <div className="w-[50%]">
          {countries
            .slice(0, Math.ceil(countries.length / 2))
            .map((country, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleNavigate(country.name);
                }}
                className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
              >
                <span className="h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-6 h-6 rounded-full"
                  />
                </span>
                <p className="text-[.6rem] font-medium">{country.name}</p>
              </div>
            ))}
        </div>
        <div className=" w-[50%]">
          {countries
            .slice(Math.ceil(countries.length / 2))
            .map((country, indx) => (
              <div
                key={indx}
                onClick={() => {
                  handleNavigate(country.name);
                }}
                className="w-full mb-3 flex cursor-pointer items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
              >
                <span className="h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-6 h-6 rounded-full"
                  />
                </span>
                <p className="text-[.6rem] font-medium">{country.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownCountries;
