import React from "react";
import BookLogo from "../../../svg/BookLogo/Index";
import TrakeLogo from "../../../svg/TrakeLogo/Index";
import TestLogo from "../../../svg/TestLogo/Index";
import ChatLogo from "../../../svg/ChatLogo/Index";
import ManSticker from "../../assets/ManSticker.png";
function HowToApply() {
  const items = [
    {
      title: "Study planner",
      description: "Develop and implement who effective with the business.",
      color: "#fbf9ff",
      logo: <BookLogo />,
      info: "01",
    },
    {
      title: "Document tracker",
      description: "Develop and implement who effective with the business.",
      color: "#f5fcff",
      logo: <TrakeLogo />,
      info: "02",
    },
    {
      title: "Test preparation",
      description: "Develop and implement who effective with the business.",
      color: "#fef8ff",
      logo: <TestLogo />,
      info: "03",
    },
    {
      title: "Advisor chat",
      description: "Develop and implement who effective with the business.",
      color: "#f7fef8",
      logo: <ChatLogo />,
      info: "04",
    },
  ];

  return (
    <section className="w-full py-8">
      {/* Title */}
      <h1 className="text-3xl sm:text-5xl font-semibold flex items-center gap-3 justify-center text-center mb-3">
        How to apply<img src={ManSticker}></img>
      </h1>
      <p className="text-[.9rem] max-w-2xl mx-auto px-12 md:p-0 text-center mb-16">
        Easily explore global universities, discover programs suited to your
        goals, compare study options, and receive guidance throughout the
        application.
      </p>
      {/* Four Divs in One Line */}
      <div className="grid grid-cols-2 gap-4 lg:flex max-w-[1240px] mx-auto rounded-3xl justify-between px-2  ">
        {items.map((item, index) => (
          <div
            key={index}
            className=" p-1 sm:p-4 pb-2  sm:pb-9 rounded-3xl  bg-white w-auto text-center"
          >
            {/* P tag and round div in one line */}
            <div className="mt-4 mb-5 md:mt-14 md:mb-9">
              <div
              style={{backgroundColor:`${item.color}`}}
              className="flex items-center justify-center w-24 h-24  md:w-40 md:h-40 mx-auto rounded-full">
                <span>{item.logo}</span>
              </div>
            </div>
            {/* H3 Title */}
            <h3 className="text-sm sm:text-xl px-4 sm:px-0 font-semibold mb-2">
              {item.title}
            </h3>
            {/* P Description */}
            <p className="text-black lg:max-w-max max-w-56 md:max-w-72 mx-auto text-[11px] pb-2 sm:text-[.9rem] font-normal">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowToApply;
