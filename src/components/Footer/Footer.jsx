import React from "react";
import RightArrowWhite from "../../../svg/RightArrowWhite";
import useDropdownData from "../../../hooks/useDropdownData";
import { useLanguage } from "../../../context/LanguageContext";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";

const Footer = () => {
  const { filteredData, addTags } = useDropdownData();
  const { setFilterProp, setSearchState, searchState } = useSearch();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const slugMaker = (item) => {
    return item.toLowerCase().replace(/ /g, "-");
  };

  const handleNavigate = (item, type) => {
    const customSlug = slugMaker(item);
    if (type === "universities") {
      navigate(`/${language}/university/${customSlug}`);
    } else if (type === "countries") {
      navigate(`/${language}/country/${customSlug}`);
    } else if (type === "tags") {
      setFilterProp((prev) => ({
        ...prev,
        searchQuery: {
          en: language === "en" ? item : prev.searchQuery.en, // Update only relevant language
          ar: language === "ar" ? item : prev.searchQuery.ar,
        },
      }));
      setSearchState({
        ...searchState,
        searchTerm: item, // Keep the selected keyword in search input
        filteredResults: [],
        selectedIndex: null,
      });
      navigate(`/${language}/searchresults`);
    }
  };

  console.log(filteredData);
  return (
    <div className="relative  max-w-[1240px] w-[95%]  my-3 mx-auto  ">
      <div className="bg-white rounded-[40px] w-full py-8 text-gray-800 px-10 mt-[5%] mb-[5%]  ">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Edubrink</h2>
          <div className="relative w-full max-w-md">
            <input
              type="email"
              placeholder={t("Footer.YourEmailPlaceholder")}
              className="w-full h-12 pl-4 pr-12 rounded-full bg-[#F8F8F8] text-black placeholder:text-black"
            />
            <button
              className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#380C95] to-[#E15754] rounded-full shadow-md hover:scale-105 transition-transform"
              aria-label="Submit"
            >
              <span className="text-white text-xl">
                <RightArrowWhite />
              </span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center space-x-4">
          <p className="mb-8 text-sm mt-8">{t("Footer.SubscribeMessage")}</p>
          <p className="text-sm mb-8 mt-8">
            <Trans
              i18nKey="Footer.PrivacyConsent"
              components={{
                1: <a href="#" className="underline" />,
              }}
            />
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:text-left mt-8">
          <div>
            <h3 className="font-semibold text-base mb-2">
              {t("Footer.Universities")}
            </h3>
            <ul>
              {filteredData.universities.slice(0, 3).map((item) => (
                <li
                  onClick={() =>
                    handleNavigate(item.uniName[language], "universities")
                  }
                >
                  {item?.uniName?.[language]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">
              {t("Footer.Countries")}
            </h3>
            <ul>
              {filteredData.countries.slice(0, 3).map((item) => (
                <li
                  onClick={() =>
                    handleNavigate(item.countryName[language], "countries")
                  }
                >
                  {item?.countryName?.[language]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">
              {t("Footer.Courses")}
            </h3>
            <ul>
              {addTags?.[0]?.tags?.[language]?.slice(0, 3).map((item) => (
                <li onClick={() => handleNavigate(item, "tags")}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">
              {t("Footer.SocialMedia")}
            </h3>
            <ul>
              <li>{t("Footer.SocialLinks.Facebook")}</li>
              <li>{t("Footer.SocialLinks.Twitter")}</li>
              <li>{t("Footer.SocialLinks.Instagram")}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">
              {t("Footer.Pages")}
            </h3>
            <ul>
              <li>{t("Footer.University")}</li>
              <li>{t("Footer.Courses")}</li>
              <li>{t("Footer.Destination")}</li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright */}
        <hr className="mt-8 border-t border-gray-300" />

        <div className="mt-4 text-sm flex flex-col sm:flex-row justify-between items-center text-black">
          <p className="mb-2 sm:mb-0">{t("Footer.Copyright")}</p>
          <p>{t("Footer.EdubrinkYear")}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
