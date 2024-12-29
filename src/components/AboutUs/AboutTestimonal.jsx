import React from "react";
import AlbertFlores from "../../assets/AboutpageImage/AlbertFlores.png";
import WadeWarren from "../../assets/AboutpageImage/WadeWarren.png";
import DSG from "../../assets/AboutpageImage/DSG.png";
import RS from "../../assets/AboutpageImage/RS.png";
import RobertFox from "../../assets/AboutpageImage/RobertFox.png";
import Testimonial from "../../assets/AboutpageImage/Testimonial.png";
const AboutTestimonal = () => {
  return (
    <div className="container mx-auto  bg-[rgba(248,248,248,1)] col-md-12 row">
      <div className="testi-wrapper flex flex-col items-center">
        <div className="header text-center mb-4 max-w-[677px] h-[171px] mx-auto">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-5">
              <h1 className="text-[48px] font-[600] leading-[55.2px] font-[\'General Sans\']">
                Testimonial
              </h1>
              <div>
                <img src={Testimonial} alt="Testimonial Icon" />
              </div>
            </div>
            <p className="text-black font-sans font-normal text-lg mb-6">
              Hear from students who’ve successfully navigated their study
              abroad journeys. From cultural immersion to academic growth, our
              testimonials
            </p>
          </div>
        </div>

        <div className="container mx-auto p-4 col-md-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 ">
            <div className="flex flex-col gap-4 md:ml-16">
              <div className="border shadow-lg  w-full h-full rounded-[32px] pt-[20px] pb-[20px] text-center">
                <img
                  src={AlbertFlores}
                  alt="Robert Fox"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h5 className="font-semibold font-general-sans">Robert Fox</h5>
                <p className="font-general-sans font-normal mt-[4%] mb-[4%]">
                  Head of Training & Dev, at Global Tech
                </p>
                <p className="font-general-sans font-normal">
                  ProctorTech has revolutionized our employee certification
                  process. We can now deliver secure assessments has
                  revolutionized our employee certification process now deliver
                  deliver secure assessments has
                </p>
              </div>
              <div className="border shadow-lg  w-full h-full rounded-[32px] pt-[20px] pb-[20px] text-center">
                <img
                  src={WadeWarren}
                  alt="Robert Fox"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h5 className="font-semibold font-general-sans">Robert Fox</h5>
                <p className="font-general-sans font-normal mt-[4%] mb-[4%]">
                  Head of Training & Dev, at Global Tech
                </p>
                <p className="font-general-sans font-normal">
                  ProctorTech has revolutionized our employee certification
                  process. We can now deliver secure assessments has
                  revolutionized our employee certification process now deliver
                  deliver secure assessments has
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center col-md-4 ">
              <div className="text-center border pt-[28px] pb-[28px] pr-[26px] pl-[26px] gap-[25px] shadow-lg relative  h-[729px] rounded-[32px]">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm font-medium shadow flex items-center mt-[6%] mb-[6%]">
                  <span className="inline-block w-2 h-2 bg-[rgba(248,145,1,1)] rounded-full mr-2"></span>
                  Student
                </div>
                <img
                  src={DSG}
                  alt="Darlene Kane Robertson"
                  className=" mx-auto mt-[8%] mb-[8%]"
                />
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h5 className="font-semibold font-general-sans">
                  Darlene Kane Robertson
                </h5>
                <div className="flex items-center justify-center mt-2">
                  <div className="bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm font-medium inline-flex items-center shadow">
                    <span className="inline-block w-2 h-2 bg-[rgba(248,145,1,1)] rounded-full mr-2"></span>
                    University of Windsor
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:mr-16  col-md-4">
              <div className="border shadow-lg  w-full h-full rounded-[32px] pt-[20px] pb-[20px] text-center">
                <img
                  src={RS}
                  alt="Darlene Robertson"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h5 className="font-semibold font-general-sans">
                  Darlene Robertson
                </h5>
                <p className="font-general-sans font-normal mt-[4%] mb-[4%]">
                  Head of Training & Dev, at Global Tech
                </p>
                <p className="font-general-sans font-normal">
                  ProctorTech has revolutionized our employee certification
                  process. We can now deliver secure assessments has
                  revolutionized our employee certification process now deliver
                  deliver secure assessments has
                </p>
              </div>
              <div className="border shadow-lg  w-full h-full rounded-[32px] pt-[20px] pb-[20px] text-center">
                <img
                  src={RobertFox}
                  alt="Robert Fox"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <h5 className="font-semibold font-general-sans">Robert Fox</h5>
                <p className="font-general-sans font-normal mt-[4%] mb-[4%]">
                  Head of Training & Dev, at Global Tech
                </p>
                <p className="font-general-sans font-normal">
                  ProctorTech has revolutionized our employee certification
                  process. We can now deliver secure assessments has
                  revolutionized our employee certification process now deliver
                  deliver secure assessments has
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTestimonal;
