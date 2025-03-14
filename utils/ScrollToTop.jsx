import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress and update visibility
  const handleScroll = () => {
    // Show button when page is scrolled down
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate scroll progress percentage
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate how much has been scrolled as a percentage
    const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(scrolled);
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate the stroke-dasharray and stroke-dashoffset for the progress circle
  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const dashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white text-[#652986] shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 animate-fade-in"
          style={{
            boxShadow: "0 4px 15px rgba(101, 41, 134, 0.2)",
          }}
        >
          {/* SVG Progress Circle */}
          <svg className="absolute w-14 h-14" viewBox="0 0 48 48">
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              fill="none"
              stroke="#f0e6f5"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              fill="none"
              stroke="#652986"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              transform="rotate(-90 24 24)"
              className="transition-all duration-200 ease-out"
            />
          </svg>

          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;
