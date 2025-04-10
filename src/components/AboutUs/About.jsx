import React, { useEffect } from "react";
import AboutTestimonal from "./AboutTestimonal";
import AboutFQA from "./AboutFQA";
import AboutGlobalJourney from "./AboutGlobalJourney";
import AboutJourney from "./AboutJourney";
import AboutStudentPlacement from "./AboutStudentPlacement";
import AboutHeader from "./AboutHeader";
import ContactSection from "../ContactSection";
import AOS from "aos";
import "aos/dist/aos.css";
const AboutPage = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: "ease-in-out", // Easing for animations
      once: true, // Run animation only once
    });
  }, []);
  return (
    <div className="">
      {/* Hero Section */}
      <div data-aos="fade-in" data-aos-delay="150">
        <AboutHeader />
      </div>
      {/* Student Placement Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <AboutStudentPlacement />
      </div>

      {/* Journey Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <AboutJourney />
      </div>

      {/* global  */}
      {/* <div data-aos="fade-up" data-aos-delay="200">
        <AboutGlobalJourney />
      </div> */}
      {/* testimonal */}
      {/* <div data-aos="fade-up" data-aos-delay="200">
        <AboutTestimonal />
      </div> */}
      {/* FAQ */}
      <div data-aos="fade-up" data-aos-delay="200">
        <AboutFQA />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <ContactSection />
      </div>
    </div>
  );
};

export default AboutPage;
