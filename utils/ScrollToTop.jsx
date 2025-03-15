import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress and update visibility
  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const dashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="scroll-to-top"
        >
          {/* SVG Progress Circle */}
          <svg className="progress-circle" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={circleRadius} className="circle-bg" />
            <circle
              cx="24"
              cy="24"
              r={circleRadius}
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              transform="rotate(-90 24 24)"
              className="circle-progress"
            />
          </svg>

          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-icon"
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
    </>
  );
};

export default ScrollToTop;
