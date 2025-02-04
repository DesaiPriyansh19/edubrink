import React from "react";
import img1 from "../../assets/Corses1.png";
import img2 from "../../assets/Corses2.png";
import img3 from "../../assets/Corses3.png";
import Book from "../../assets/Book.png";
import ArrowTopRight from "../../../svg/ArrowTopRight/Index";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import TextBlock from "../../../utils/TextBlock";
function OurCourses() {
  const { data } = useFetch(
    "https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse/?limit=5"
  );

  const { language } = useLanguage();
  const { t } = useTranslation();
  // Define the background colors to cycle through
  const bgColors = ["#60E38C", "#55CFFF", "#E186FF", "#fef08a"];

  // Image array for cycling through images based on index
  const images = [img1, img2, img3];

  return (
    <>
      <div className="max-w-[1240px] mb-10 mx-auto ">
        <div
          className={`text-start text-3xl sm:text-4xl flex ${
            language === "ar" ? "justify-end" : "justify-start"
          } mb-4 font-semibold pl-4`}
        >
          <h1 className="text-start text-3xl sm:text-4xl font-semibold ">
            {t("ourCourseSection.title")}
          </h1>
          <img
            src={Book}
            alt="Icon"
            className="w-8 h-8 sm:w-10 sm:h-10 mr-1 ml-3"
          />{" "}
        </div>
        <p
          className={` font-normal w-full text-sm ${
            language === "ar" ? "text-right" : "text-left"
          } sm:text-[.8rem] px-0 pl-4 pr-1 `}
        >
          {t("ourCourseSection.description")}
        </p>
        <div
          className={`w-full hidden sm:flex  ${
            language === "ar" ? "justify-start" : "justify-end "
          } items-center px-4`}
        >
          <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
            {t("viewAll")}
          </button>
        </div>
      </div>

      <div className="flex sm:flex-row mb-20 flex-col px-4 1xl:pl-28 gap-6 scrollbar-hide overflow-x-auto">
        {data?.map((course, index) => {
          const bgColorIndex = index % bgColors.length;
          // Cycle images based on the index
          const imageIndex = index % images.length;
          return (
            <div
              key={course._id}
              className={`sm:min-w-[397px] w-full flex ${
                index % 2 == 0 ? "flex-col" : "flex-col-reverse"
              } justify-between p-6 rounded-3xl shadow-md`}
              style={{
                backgroundColor: bgColors[bgColorIndex], // Apply bgColor from the cycle
              }}
            >
              {/* SVG and Image */}
              <div
                className={`flex ${
                  index % 2 == 0 ? "items-start" : "items-end"
                } ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                } justify-between space-x-4`}
              >
                <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <ArrowTopRight />
                </span>
                <div className="w-48 h-auto">
                  <img
                    src={images[imageIndex]}
                    alt={`course ${course._id}`}
                    className="w-full h-full object-cover rounded-b-lg"
                  />
                </div>
              </div>

              {/* Content with Dynamic Direction */}
              <div
                className={`mt-4  text-white ${
                  language === "ar"
                    ? "text-right max-w-full"
                    : "text-left max-w-72"
                } `}
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {language === "ar"
                    ? course?.CourseName?.ar
                    : course?.CourseName?.en}
                </h3>

                {course?.countryNameEn && (
                  <p className="text-[.8rem]">
                    {language === "ar"
                      ? `جامعة ${course?.countryNameAr}`
                      : `University Of ${course?.countryNameEn}`}
                  </p>
                )}

                <p className="text-lg font-semibold">${course?.CourseFees}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default OurCourses;
