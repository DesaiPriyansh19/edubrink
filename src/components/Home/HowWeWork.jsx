import React from "react";
import ManSticker from "../../assets/ManSticker.png";
import Search from "../../assets/SearchStcker.png";
import Book from "../../assets/BookSticker.png";
import Plain from "../../assets/PlanSticker.png";
import bg1 from "../../assets/HowWe1.png";
import bg2 from "../../assets/HowWe2.png";
import bg3 from "../../assets/HowWe3.png";
import bg4 from "../../assets/HowWe4.png";
function HowWeWork() {
  const cards = [
    {
      id: 1,
      bgImage: bg1,
      smallImage: Search,
      smallImagePosition: "absolute -bottom-2 -right-2",
      title: "Discover your future",
      description:
        "Discover the art of ad production, with where creativity meets strategy.",
      borderRadius: "rounded-bl-[4rem] rounded-br-[3rem] rounded-tr-[4rem]",
    },
    {
      id: 2,
      bgImage: bg2,
      smallImage: Book,
      smallImagePosition: "absolute -top-2 -left-2",
      title: "Find skilled courses",
      description:
        "Discover the art of ad production, with where creativity meets strategy.",
      borderRadius: "rounded-bl-[4rem] rounded-br-[4rem] rounded-tl-[3rem]",
    },
    {
      id: 3,
      bgImage: bg3,
      smallImage: Plain,
      smallImagePosition: "absolute -bottom-2 -left-2",
      title: "Study abroad university",
      description:
        "Discover the art of ad production, with where creativity meets strategy.",
      borderRadius: "rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem]",
    },
    {
      id: 4,
      bgImage: bg4,
      smallImage: Book,
      smallImagePosition: "absolute -top-2 -left-2",
      title: "Enrolment courses",
      description:
        "Discover the art of ad production, with where creativity meets strategy.",
      borderRadius: "rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem]",
    },
  ];

  return (
    <div className="max-w-[1240px] mb-20 px-0 md:px-4 mx-auto">
      <h1 className="text-3xl sm:text-5xl font-semibold flex items-center gap-3 justify-center text-center mb-4">
        How we work<img className="w-8 h-8 sm:w-auto sm:h-auto" src={ManSticker}></img>
      </h1>
      <p className="text-[.9rem] max-w-2xl mx-auto px-12 md:p-0 text-center mb-6">
        Effortlessly explore diverse courses, find programs tailored to your
        academic goals, compare study opportunities, and make informed decisions
      </p>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-between mb-16 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="w-auto p-4 lg:px-0 lg:w-1/4 mx-auto">
              <div className="relative">
                <img
                  src={card.bgImage}
                  alt="Main"
                  className={`w-full h-auto  object-contain ${card.borderRadius}`}
                />
                <img
                  src={card.smallImage}
                  alt="Small"
                  className={`${card.smallImagePosition} w-[30%] h-[30%]`}
                />
              </div>
              <div>
                <p className="mt-4  font-semibold sm:font-medium text-black">
                  {card.title}
                </p>
                <p className="text-black text-[.8rem] font-light ">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowWeWork;
