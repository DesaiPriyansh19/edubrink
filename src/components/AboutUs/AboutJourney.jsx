import React from "react";
import journey from "../../assets/AboutpageImage/journey.png";
const AboutJourney = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-[rgba(248,248,248,1)]">
      <div className="jour-layout-wrapper flex flex-col items-center justify-center max-w-[677px] h-[131px] gap-5 mx-auto">
        <h2 className="text-3xl font-bold text-center">Journey to Success</h2>
        <p className="font-sans text-[14px] font-medium leading-[21.7px] text-center">
          Easily explore global universities, discover programs suited to your
          goals, compare study options, and receive guidance throughout the
          apply.
        </p>
      </div>
      <div className="jour-layout flex justify-center items-center p-0 m-0 border-none">
        <img className="border-none mx-auto" src={journey} alt="Journey" />
      </div>
    </div>
  );
};

export default AboutJourney;
