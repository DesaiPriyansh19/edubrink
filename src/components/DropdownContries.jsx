import { forwardRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getEmoji } from "../../libs/countryFlags";
import { useTranslation } from "react-i18next";

const isWindows = navigator.userAgent.includes("Windows");

const DropdownCountries = forwardRef(
  ({ setShowCountriesDropdown, navbarHeight, data }, ref) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation();

    // Initialize AOS
    useEffect(() => {
      AOS.init({
        duration: 800,
        offset: 100,
        easing: "ease-in-out",
        once: true,
      });
    }, []);

    const handleNavigate = (term) => {
      const customSlug = term.customURLSlug?.[language] || term.countryName.en;
      navigate(`${language}/country/${customSlug}`);
      setShowCountriesDropdown(false);
    };

    // Helper function to render flag
    const renderFlag = (country) => {
      if (isWindows) {
        if (country?.countryCode) {
          return (
            <img
              src={`https://flagcdn.com/w320/${country.countryCode.toLowerCase()}.png`}
              alt="Country Flag"
              className="w-4 h-4 rounded-full mr-1"
            />
          );
        }
      } else if (country?.countryPhotos?.countryFlag) {
        return (
          <span className="text-base font-medium">
            {country.countryPhotos.countryFlag}
          </span>
        );
      }
      
      // Fallback
      return <span className="text-[.6rem] font-medium">🏳️</span>;
    };

    return (
      <div
        id="divshadow"
        style={{ top: `${navbarHeight}px` }}
        ref={ref}
        className={`absolute ${
          language === "ar"
            ? "left-[10%] 2xl:left-[15%]"
            : "right-[10%] 2xl:right-[15%]"
        } px-3 py-3 mmd:w-[38vw] 2xl:w-[28%] h-auto z-10 mt-2 bg-white rounded-3xl shadow-lg`}
        data-aos="fade-out"
        data-aos-delay="0"
        data-aos-duration="300"
      >
        <div className="my-2 flex items-center justify-between">
          <p className="text-sm font-semibold">{t("DropDownCountry.title")}</p>
          <button className="text-[.5rem] bg-[#f8f8f8] px-3 py-0 rounded-full font-light">
            {t("viewAll")}
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
                      onClick={() => handleNavigate(country)}
                      className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                    >
                      {renderFlag(country)}
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
                      onClick={() => handleNavigate(country)}
                      className="w-full mb-3 flex cursor-pointer items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                    >
                      {renderFlag(country)}
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
                  onClick={() => handleNavigate(country)}
                  className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-1 pr-1 py-1 rounded-xl bg-[#f8f8f8] justify-start text-black"
                >
                  {renderFlag(country)}
                  <p className="text-[.6rem] font-medium">
                    {country?.countryName?.[language] || "Unknown"}
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
