import React, { useEffect, useRef, useState } from "react";
import img1 from "../../assets/Corses1.png";
import img2 from "../../assets/Corses2.png";
import img3 from "../../assets/Corses3.png";
import Book from "../../assets/Book.png";
import ArrowTopRight from "../../../svg/ArrowTopRight/Index";
import useFetch from "../../../hooks/useFetch";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function OurCourses() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data } = useFetch(
    `https://edu-brink-backend.vercel.app/api/course/getAll/GetAllCourse/?limit=5`
  );

  const { language } = useLanguage();
  const { t } = useTranslation();
  const carouselRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Define the background colors to cycle through
  const bgColors = ["#60E38C", "#55CFFF", "#E186FF", "#fef08a"];

  // Image array for cycling through images based on index
  const images = [img1, img2, img3];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: "ease-out-cubic",
    });
    AOS.refresh();
  }, []);

  // Scroll to next/previous items

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (data && data.length > 0) {
        setActiveIndex((prev) => (prev + 1) % Math.min(5, data.length));

        if (carouselRef.current && !hoveredCard) {
          const cardWidth =
            carouselRef.current.querySelector("div").offsetWidth + 24; // 24px for gap
          const newScrollPosition = cardWidth * activeIndex;

          carouselRef.current.scrollTo({
            left: newScrollPosition,
            behavior: "smooth",
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, data,hoveredCard]);

  // Intersection Observer to trigger animations when elements come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Generate gradient backgrounds for cards based on the original colors
  const getGradientBackground = (index) => {
    const baseColor = bgColors[index % bgColors.length];

    // Create gradient pairs based on the original colors
    const gradientPairs = [
      `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(
        baseColor,
        -20
      )} 100%)`,
      `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(
        baseColor,
        -30
      )} 100%)`,
      `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(
        baseColor,
        -40
      )} 100%)`,
      `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(
        baseColor,
        -25
      )} 100%)`,
    ];

    return gradientPairs[index % gradientPairs.length];
  };

  // Helper function to darken/lighten a hex color
  function adjustColor(color, amount) {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(
              255,
              Math.max(0, Number.parseInt(color, 16) + amount)
            ).toString(16)
          ).substr(-2)
        )
    );
  }

  return (
    <div className="relative overflow-hidden max-w-[1240px] mx-auto py-10">
      {/* Header Section */}
      <div
        className={`max-w-[1240px] mb-10 mx-auto ${
          isVisible ? "animate-fadeIn" : "opacity-0"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div
          className={`text-start flex items-center ${
            language === "ar" ? "flex-row-reverse justify-end" : "justify-start"
          } mb-4 pl-4 pr-4`}
        >
          <h1 className="text-start text-3xl sm:text-4xl font-semibold">
            {t("ourCourseSection.title")}
          </h1>
          <div className="w-8 h-8 sm:w-10 sm:h-10 mr-1 ml-3 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
            <img
              src={Book || "/placeholder.svg"}
              alt="Icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <p
          className={`font-normal w-full text-sm ${
            language === "ar" ? "text-right" : "text-left"
          } sm:text-[.8rem] px-0 pl-4 pr-1`}
        >
          {t("ourCourseSection.description")}
        </p>

        <div
          className={`w-full flex mt-4 ${
            language === "ar" ? "justify-start" : "justify-end"
          } items-center px-4`}
        >
          <button className="bg-white flex justify-center items-center shadow-sm hover:shadow-xl text-black text-sm font-normal py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-300 group">
            {t("viewAll")}

            <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Courses Carousel */}
      <div
        ref={carouselRef}
        dir={language === "ar" ? "rtl" : "ltr"}
        className="flex sm:flex-row mb-20 flex-col px-4 gap-6 scrollbar-hide overflow-x-auto snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        data-aos="fade-up"
        data-aos-delay="500"
      >
        {data?.map((course, index) => {
          const isEven = index % 2 === 0;
          const imageIndex = index % images.length;
          const isHovered = hoveredCard === index;

          return (
            <div
              key={`${course._id}-${
                course.countryNameEn || course.countryNameAr
              }`}
              className={`sm:min-w-[397px] w-full flex ${
                isEven ? "flex-col" : "flex-col-reverse"
              } justify-between p-6 rounded-3xl  transition-all duration-500 snap-start transform hover:scale-[1.03] backdrop-blur-sm relative overflow-hidden`}
              style={{
                background: getGradientBackground(index),
              }}
              data-aos={index % 2 === 0 ? "zoom-in-right" : "zoom-in-left"}
              data-aos-delay={100 + index * 100}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated decorative elements */}
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl transition-all duration-700"
                style={{
                  transform: isHovered
                    ? "scale(1.5) translate(10px, -10px)"
                    : "scale(1)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl transition-all duration-700"
                style={{
                  transform: isHovered
                    ? "scale(1.5) translate(-10px, 10px)"
                    : "scale(1)",
                }}
              ></div>

              {/* Animated particle effects */}
              {isHovered && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"></div>
                  <div
                    className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-float"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </>
              )}

              {/* SVG and Image */}
              <div
                className={`group flex ${
                  isEven ? "flex-col" : "flex-col-reverse"
                }`}
              >
                <div
                  className={`flex ${isEven ? "items-start" : "items-end"} ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } justify-between space-x-4 ${
                    language === "ar" ? "space-x-reverse" : ""
                  }`}
                >
                  <span className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center  shadow-lg group cursor-pointer transform group-hover:rotate-12 transition-all duration-300 hover:bg-white">
                    <ArrowTopRight />
                  </span>
                  <div className="w-48 h-auto overflow-hidden rounded-lg ">
                    <img
                      src={images[imageIndex] || "/placeholder.svg"}
                      alt={`course ${course._id}`}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:rotate-2"
                    />
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-t rounded-lg from-black/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                    )}
                  </div>
                </div>

                {/* Content with Dynamic Direction */}
                <div
                  className={`${isEven ? "mt-6" : "mb-6"} text-white ${
                    language === "ar"
                      ? "text-right max-w-full"
                      : "text-left max-w-full"
                  } transition-all duration-300 ${
                    isHovered ? "transform translate-y-[-5px]" : ""
                  }`}
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-2 tracking-tight transition-all duration-300 group-hover:text-white">
                      {language === "ar"
                        ? course?.CourseName?.ar
                        : course?.CourseName?.en}
                    </h3>
                    {isHovered && (
                      <div className="absolute -left-2 -top-2 w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
                    )}
                  </div>

                  <p className="text-sm text-white/80 mb-3 font-medium">
                    {language === "ar"
                      ? `جامعة ${course?.countryNameAr}`
                      : `University Of ${course?.countryNameEn}`}
                  </p>

                  <div className={`flex items-center justify-between`}>
                    <p className="text-2xl font-bold transition-all duration-300 group-hover:scale-110 origin-left">
                      <span className="text-sm font-normal mr-1">$</span>
                      {course?.CourseFees}
                    </p>
                    <button
                      className={`px-4 py-2 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-all duration-300 ${
                        isHovered
                          ? "bg-white/30  transform translate-y-[-2px]"
                          : "bg-white/20 "
                      }`}
                    >
                      {language === "ar" ? "سجل الآن" : "Enroll Now"}
                      {isHovered && (
                        <ArrowRight className="inline-block ml-1 w-3 h-3 animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-5px) translateX(10px);
            opacity: 0.8;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default OurCourses;
