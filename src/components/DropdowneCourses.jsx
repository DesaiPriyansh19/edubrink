"use client"

import { useEffect, forwardRef } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTranslation } from "react-i18next"
import { BookOpen } from "lucide-react"

const DropdowneCourses = forwardRef(({ setShowCoursesDropdown, navbarHeight, data }, ref) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const API_URL = import.meta.env.VITE_API_URL
  const { language } = useLanguage()

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    })
  }, [])

  const handleNavigate = (term, type) => {
    if (type === "course") {
      const customSlug = term.customURLSlug?.[language] || term.CourseName?.en
      navigate(`${language}/courses/${customSlug}`)
    } else if (type === "faculty") {
      const customSlug = term.customURLSlug?.[language] || term.facultyName?.en
      navigate(`${language}/faculty/${customSlug}`)
    }
    setShowCoursesDropdown(false)
  }

  return (
    <>
      <div
        id="divshadow"
        ref={ref}
        style={{ top: `${navbarHeight}px` }} // Dynamically set top value
        className={`absolute ${
          language === "ar"
            ? "right-[20%] lg:right-[18%] xl:right-[22%] xlg:right-[19%]"
            : "mmd:right-[20%] lg:right-[18%] xl:right-[22%] xlg:right-[19%]"
        }   md:top-[5%] lg:top-[15%] xlg:top-[8%] xl:top-[0%] 2xl:top-[2%]  w-[40vw] lg:max-w-[30vw]  h-auto z-10 flex gap-3  mt-2 
bg-[#f8f8f8] rounded-xl`}
        data-aos="fade-out"
        data-aos-delay="0"
        data-aos-duration="300"
      >
        <div className="bg-white rounded-3xl px-4 py-2 w-full">
          <p className="mb-2 text-sm font-semibold pt-3 ">{t("DropDownCourse.Coursetitle")}</p>

          <div className="flex flex-wrap items-start justify-center gap-3 rounded-xl p-4 w-full bg-gray-50">
            {data?.length > 0 ? (
              <div className="w-full grid grid-cols-1 gap-3">
                {data.map((course, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavigate(course, "course")}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-100 shadow-sm transition-colors duration-200 text-gray-800"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full">
                      {course?.uniSymbol ? (
                        <img
                          src={course.uniSymbol || "https://placehold.co/24x24"}
                          alt="University Symbol"
                          className="w-4 h-4 object-contain"
                        />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate">
                        {language === "ar" ? course?.CourseName?.ar : course?.CourseName?.en}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {language === "ar" ? course?.uniName?.ar : course?.uniName?.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-500">{t("noCoursesFound") || "No courses available"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
})

// Add display name for forwardRef component
DropdowneCourses.displayName = "DropdowneCourses"

export default DropdowneCourses
