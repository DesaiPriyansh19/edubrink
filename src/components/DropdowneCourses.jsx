import { useEffect, forwardRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
const DropdowneCourses = forwardRef(
  ({ setShowCoursesDropdown, navbarHeight, facultyData, data }, ref) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const API_URL = import.meta.env.VITE_API_URL;
    const { language } = useLanguage();

    // Initialize AOS
    useEffect(() => {
      AOS.init({
        duration: 800, // Default animation duration
        offset: 100, // Trigger animations 100px before the element is visible
        easing: "ease-in-out", // Easing for animations
        once: true, // Run animation only once
      });
    }, []);

    const handleNavigate = (term, type) => {
      if (type === "course") {
        const customSlug = term.customURLSlug?.[language] || term.CourseName.en;
        navigate(`${language}/courses/${customSlug}`);
      } else if (type === "faculty") {
        const customSlug =
          term.customURLSlug?.[language] || term.facultyName.en;
        navigate(`${language}/faculty/${customSlug}`);
      }
      setShowCoursesDropdown(false);
    };

    return (
      <>
        <div
          id="divshadow"
          ref={ref}
          style={{ top: `${navbarHeight}px` }} // Dynamically set top value
          className={`absolute ${
            language === "ar"
              ? " mmd:left-[20%] lg:left-[18%] xl:left-[22%] xlg:left-[19%]"
              : " mmd:right-[20%] lg:right-[18%] xl:right-[22%] xlg:right-[19%]"
          }   md:top-[5%] lg:top-[15%] xlg:top-[8%] xl:top-[0%] 2xl:top-[2%] px-3 py-4 w-[40vw] lg:max-w-[25vw]  h-auto z-10 flex gap-3  mt-2 
   bg-[#f8f8f8] rounded-xl shadow-lg`}
          data-aos="fade-out"
          data-aos-delay="0"
          data-aos-duration="300"
        >
          <div className="bg-white rounded-3xl px-4 py-2 w-[100%] ">
            <p className="mb-2 text-sm font-semibold pt-3 ">
              {t("DropDownCourse.Coursetitle")}
            </p>
            {data?.map((course, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => handleNavigate(course, "course")}
                  className="w-full mb-3 cursor-pointer flex items-center pl-3 gap-3 pr-1 py-1 rounded-xl bg-[#f8f8f8]  justify-start text-black "
                >
                  <span className=" h-auto w-auto text-sm rounded-md bg-white p-[.4rem]">
                    <img
                      src={"https://placehold.co/24x24" || course?.uniSymbol}
                      alt="flag"
                      className="w-6 h-6 "
                    />
                  </span>
                  <span className="">
                    <p className="text-[.7rem] font-medium">
                      {language === "ar"
                        ? course?.CourseName?.ar
                        : course?.CourseName?.en}
                    </p>
                    <p className="text-[.6rem] font-light">
                      {language === "ar"
                        ? course?.uniName?.ar
                        : course?.uniName?.en}
                    </p>
                  </span>
                </div>
              );
            })}
          </div>
          {/* <div className="pl-3 w-[30%]  ] ">
            <p className="mb-2 text-sm font-semibold pt-4 ">
              {t("DropDownCourse.FacultyTitle")}
            </p>
            <ul className=" flex text-start flex-col gap-5">
              {facultyData?.map((item) => (
                <li
                  onClick={() => handleNavigate(item, "faculty")}
                  key={item._id}
                  className="text-[.7rem] cursor-pointer font-medium "
                >
                  {item.facultyName[language]}
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </>
    );
  }
);

export default DropdowneCourses;
