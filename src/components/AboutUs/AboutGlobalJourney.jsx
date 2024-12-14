import React from "react";
import global from "../../assets/AboutpageImage/global.png";
import VseuaxPeople from "../../../svg/AboutGlobalCOne";
import VuesaxBuilding from "../../../svg/AboutGlobalCTwo";
import VseuaxUser from "../../../svg/AboutGlobalCThree";

const AboutGlobalJourney = () => {
  return (
    <div class="container mx-auto px-4 py-16 bg-[rgba(248,248,248,1)]">
      <div className="jour-layout-wrapper flex flex-col items-center justify-center max-w-[677px] h-[131px] gap-5 mx-auto">
        <h2 className="text-3xl font-bold text-center">Global Coverage</h2>
        <p className="font-sans text-[14px] font-medium leading-[21.7px] text-center">
          Easily explore global universities, discover programs suited to your
          goals, compare study options, and receive guidance throughout the
          apply.
        </p>
      </div>

      <div class="relative w-full max-w-[90%] aspect-[1240/634] mx-auto bg-[rgba(248,248,248,1)] flex justify-center items-center p-0 m-0 border-none mt-10">
        <img
          src={global}
          class="object-cover rounded-tl-[5%] rounded-tr-[5%]"
          alt="World Map"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4 py-6 px-4">
        {/* Card 1 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold flex justify-between w-full">
            1,00,00+
            <span>
              <VseuaxPeople />
            </span>
          </h2>
          <p className=" font-general-sans font-medium  leading-7">
            Total Students
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold flex justify-between w-full">
            3230+
            <span>
              <VuesaxBuilding />
            </span>
          </h2>
          <p className=" font-general-sans font-medium  leading-7">
            Partners University
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white flex flex-col w-full sm:w-[300px] md:w-[320px] lg:w-[341px] rounded-3xl p-6">
          <h2 className="font-semibold flex justify-between w-full">
            160+
            <span>
              <VseuaxUser />
            </span>
          </h2>
          <p className="font-general-sans font-medium  leading-7">
            Students Ambassadors
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutGlobalJourney;
