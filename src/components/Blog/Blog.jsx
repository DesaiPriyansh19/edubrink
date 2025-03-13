import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import UniversityRightLayoutCard from "../UniversityPage/UniversityRightLayoutCard";
import RelatedBlogs from "./RelatedBlogs";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearch } from "../../../context/SearchContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import ShareCard from "../../../utils/ShareCard";
import useDropdownData from "../../../hooks/useDropdownData";
const MoreInfo = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { slug } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { data } = useFetch(
    `https://edu-brink-backend.vercel.app/api/blog/name/${encodeURIComponent(
      slug
    )}`
  );

  const { setFilterProp, setSearchState } = useSearch();
  const [filters, setFilters] = useState({
    studyLevel: "",
    subjectPreference: "",
    duration: "",
  });
  const navigate = useNavigate();
  const blogUrl = typeof window !== "undefined" ? window.location.href : "";

  const { addTags } = useDropdownData();
  console.log(addTags);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchState((prev) => ({
      ...prev,
      searchTerm: filters.subjectPreference,
      filteredResults: [],
      selectedIndex: null,
    }));

    setFilterProp((prev) => ({
      ...prev,
      CourseDuration: filters.duration,
      StudyLevel: filters.studyLevel,
      searchQuery: { ...prev.searchQuery, en: filters.subjectPreference },
    }));

    navigate(`/${language}/searchresults`);
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Header Section */}
        <div className="flex items-center space-x-2">
          {/* <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24"></svg>*/}
          <Calander />
          <p className="text-[#1D211C] text-sm font-medium">
            {data?.blogAdded
              ? new Date(data.blogAdded).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </p>
          <div>
            <button
              className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-all"
              aria-label="Share course"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <h1
          className={`text-2xl md:text-3xl lg:text-4xl font-semibold flex justify-start items-start ${
            language === "ar" ? "md:pl-24 lg:pl-40" : "md:pr-24 lg:pr-40"
          }  text-start`}
        >
          <span>📚</span> {data?.blogTitle[language]}
        </h1>
        <p
          className={`text-gray-700 ${
            language === "ar" ? "md:pl-24 lg:pl-56" : "md:pr-24 lg:pr-56"
          }   font-medium`}
        >
          {data?.blogSubtitle[language]}
        </p>

        {/* Content 2ndSection */}
        <div className="md:flex justify-center w-full h-auto gap-6 items-center">
          {/* Left Image Section */}
          <div className="w-full md:w-[60%] mb-auto">
            <div className=" w-full m-0 lg:h-[450px] ">
              <img
                src={"https://placehold.co/580x400" || data?.blogPhoto}
                alt="Blog Image"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="h-auto ">
              <div className=" flex flex-wrap gap-3 py-3 text-[0.8rem] font-medium">
                {data?.blogRelated?.map((item) => (
                  <span
                    key={item._id}
                    className="bg-[#F3F4F6] rounded-xl py-1 px-2"
                  >
                    {item[language]}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">
                {" "}
                {t("BlogInnerPage.Intro")}
              </h3>
              <div
                className="text-sm font-medium mt-2 mb-3"
                dangerouslySetInnerHTML={{
                  __html: data?.blogDescription?.[language],
                }}
              />
            </div>
          </div>

          {/* Right Form Section */}
          <div className="  w-full md:w-[40%]  ">
            <div className="w-full space-y-6 bg-white px-5 py-8 rounded-3xl h-[450px]">
              <h4 className="text-lg font-semibold mb-4">
                {t("findCourses.title")}
              </h4>
              {/* Dropdowns */}
              <span className="w-full ">
                <label className="text-sm font-medium">
                  {" "}
                  {t("findCourses.studyLevel")}
                </label>
                <select
                  id="studyLevel"
                  name="studyLevel"
                  value={filters.studyLevel}
                  onChange={handleChange}
                  className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white"
                >
                  {t("studyLevels", { returnObjects: true }).map(
                    (option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </span>
              <span className="w-full ">
                <label
                  htmlFor="subjectPreference"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("findCourses.subjectPreference")}
                </label>
                <select
                  id="subjectPreference"
                  name="subjectPreference"
                  value={filters.subjectPreference}
                  onChange={handleChange}
                  className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white"
                >
                  <option value="">{t("findCourses.select")}</option>
                  {addTags[0]?.tags?.[language]?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </span>
              <span className="w-full">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("findCourses.duration")}
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleChange}
                  className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white"
                >
                  <option value="">{t("findCourses.select")}</option>
                  <option value="1-12">{t("findCourses.shortTerm")}</option>
                  <option value="12-24">{t("findCourses.longTerm")}</option>
                </select>
              </span>
              {/* Button */}
              <button
                onClick={handleSubmit}
                className="w-full px-6 rounded-full py-3 bg-gradient-to-r from-[#380C95] to-[#E15754] text-sm text-white"
              >
                {t("findCourses.findCoursesBtn")}
              </button>
            </div>
            <UniversityRightLayoutCard />
          </div>
        </div>
      </div>
      <div className="px-4">
        {" "}
        <RelatedBlogs data={data?.blogCountry} />
      </div>
      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={data?.blogTitle?.[language] || "blog"}
        contentType={"blog"}
        contentUrl={blogUrl}
      />
    </div>
  );
};

export default MoreInfo;
