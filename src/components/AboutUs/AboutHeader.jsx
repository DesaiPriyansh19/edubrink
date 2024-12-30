import React from "react";
import muslimgirl from "../../assets/AboutpageImage/girl.png";
const AboutHeader = () => {
  return (
    <div>
      <section className="bg-[rgba(248,248,248,1)] py-4 px-5 md:py-20 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-gray-800 md:text-5xl">
              Global education<br></br> one course away
            </h1>
            <p className="text-gray-600">
              Effortlessly explore a wide range of universities, discover the
              perfect course tailored to your goals, and compare study
              opportunities.
            </p>
            <button className="px-6 py-3 text-white bg-gradient-to-r from-[rgba(56,12,149,1)] to-[rgba(225,87,84,1)] rounded-[1.5rem]">
              Start Your Journey Today
            </button>

            <p className=" h-[28px]">
              Join 1+ million students who used Edubrink.
            </p>
          </div>
          <div className="relative">
            <div className="ab-image">
              <img src={muslimgirl} alt="Student" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutHeader;
