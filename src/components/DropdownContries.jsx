import { forwardRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import usa from "../assets/Flags/USAflag.png";
// import germny from "../assets/Flags/GermnyFlag.png";
// import Unitedarap from "../assets/Flags/UnitedAraPFlag.png";
// import uae from "../assets/Flags/uae.png";
// import swizrland from "../assets/Flags/SwitzerlandFlag.png";
// import canada from "../assets/Flags/CanadaFlag.png";
// import india from "../assets/Flags/IndiaFlag.png";
// import bangladesh from "../assets/Flags/BangladeshFlag.webp";
// import nigeria from "../assets/Flags/NigeriaFlag.webp";
// import newzealand from "../assets/Flags/NewZealandFlag.webp";
// import denmark from "../assets/Flags/DenmarkFlag.webp";
// import australia from "../assets/Flags/AustraliaFlag.png";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const DropdownCountries = forwardRef(
  ({ setShowCountriesDropdown, navbarHeight, data }, ref) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    console.log(data);

    // Initialize AOS
    useEffect(() => {
      AOS.init({
        duration: 800, // Default animation duration
        offset: 100, // Trigger animations 100px before the element is visible
        easing: "ease-in-out", // Easing for animations
        once: true, // Run animation only once
      });
    }, []);

    const handleNavigate = (name) => {
      navigate(`${language}/country/${name}`);
      setShowCountriesDropdown(false);
    };

    return (
      <div
        id="divshadow"
        style={{ top: `${navbarHeight}px` }} // Dynamically set top value
        ref={ref}
        className={`absolute ${
          language === "ar"
            ? "left-[10%] 2xl:left-[15%]"
            : "right-[10%] 2xl:right-[15%]"
        }    px-3 py-3 mmd:w-[38vw]  2xl:w-[28%]  h-auto z-10 mt-2 bg-white rounded-3xl shadow-lg`}
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
          {data?.length > 5 ? (
            <>
              <div className="w-[50%]">
                {data
                  ?.slice(0, Math.ceil(data.length / 2))
                  .map((country, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleNavigate(country.countryName.en)}
                      className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                    >
                      <span className="h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                        {/* <img
                          src={
                            country?.countryPhotos?.countryFlag ||
                            "https://placehold.co/20x20"
                          }
                          alt={`${
                            language === "ar"
                              ? country?.countryName?.ar
                              : country?.countryName?.en
                          } Flag`}
                          className="w-6 h-6 rounded-full"
                        /> */}
                        <p>{country?.countryPhotos?.countryFlag}</p>
                      </span>
                      <p className="text-[.6rem] font-medium">
                        {country?.countryName?.[language]}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="w-[50%]">
                {data
                  ?.slice(Math.ceil(data.length / 2))
                  .map((country, indx) => (
                    <div
                      key={indx}
                      onClick={() => handleNavigate(country.countryName.en)}
                      className="w-full mb-3 flex cursor-pointer items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                    >
                      <span className="h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                        {/* <img
                          src={
                            country?.countryPhotos?.countryFlag ||
                            "https://placehold.co/20x20"
                          }
                          alt={`${
                            language === "ar"
                              ? country?.countryName?.ar
                              : country?.countryName?.en
                          } Flag`}
                          className="w-6 h-6 rounded-full"
                        /> */}
                        <p>{country?.countryPhotos?.countryFlag}</p>
                      </span>
                      <p className="text-[.6rem] font-medium">
                        {country?.countryName?.[language]}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              {data?.map((country, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNavigate(country.countryName.en)}
                  className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                >
                  <span className="h-auto w-auto text-sm rounded-md bg-white p-[.3rem]">
                    {/* <img
                      src={
                        country?.countryPhotos?.countryFlag ||
                        "https://placehold.co/20x20"
                      }
                      alt={`${
                        language === "ar"
                          ? country?.countryName?.ar
                          : country?.countryName?.en
                      } Flag`}
                      className="w-6 h-6 rounded-full"
                    /> */}
                    <p>{country?.countryPhotos?.countryFlag}</p>
                  </span>

                  <p className="text-[.6rem] font-medium">
                    {country?.countryName?.[language]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default DropdownCountries;
