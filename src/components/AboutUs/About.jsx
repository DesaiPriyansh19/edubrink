import React from "react";
import AboutTestimonal from "./AboutTestimonal";
import AboutFQA from "./AboutFQA";
import AboutGlobalJourney from "./AboutGlobalJourney";
import AboutJourney from "./AboutJourney";
import AboutStudentPlacement from "./AboutStudentPlacement";
import AboutHeader from "./AboutHeader";

const AboutPage = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <AboutHeader />

      {/* Student Placement Section */}
      <AboutStudentPlacement />

      {/* Journey Section */}
      <AboutJourney />

      {/* global  */}
      <AboutGlobalJourney />

      {/* testimonal */}

      <AboutTestimonal />

      {/* FAQ */}

      <AboutFQA />
    </div>
  );
};

export default AboutPage;
