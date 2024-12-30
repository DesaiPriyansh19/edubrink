import React, { useState } from "react";

const AboutFQA = () => {
  const [openQuestion, setOpenQuestion] = useState(1); // State for toggling FAQ items

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqItems = [
    {
      id: 1,
      question: "How do I choose the best study destination?",
      answer:
        "Our customization process is designed to be seamless. Simply reach out to us with your requirements, and our dedicated team will work closely with you to understand your brand, objectives, and preferences.",
    },
    {
      id: 2,
      question: "What are the basic application requirements?",
      answer: "",
    },
    {
      id: 3,
      question: "How do I adapt to a new culture with me?",
      answer: "",
    },
    {
      id: 4,
      question: "Can I work part-time while studying abroad?",
      answer: "",
    },
    {
      id: 5,
      question: "Can I work part-time while studying abroad?",
      answer: "",
    },
  ];

  return (<>
   <div className="faq-outer-text w-[90%] mx-auto  ">
        <h2 className="text-4xl md:text-5xl font-semibold mb-2 mt-5 ">FAQ</h2>
        <p className="text-gray-600 text-sm leading-6 md:text-base max-w-2xl mb-8 ">
          Our Study Abroad FAQ covers everything you need to know—from choosing
          the right destination and applying to universities, to visa
          requirements.
        </p>
      </div>
    <div className=" w-[90%] rounded-3xl mb-16 mx-auto bg-white p-4 md:p-6">
     
      <div className="space-y-4  bg-white">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg shadow-sm bg-gray-100 ${
              openQuestion === item.id ? "shadow-md" : ""
            }`}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleQuestion(item.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                  {item.id}
                </div>
                <h3
                  className={`text-base md:text-lg font-semibold ${
                    openQuestion === item.id ? "text-black" : ""
                  }`}
                >
                  {item.question}
                </h3>
              </div>
              <div className="text-black bg-white rounded-full w-8 h-8 pl-[0.7rem]">
                {openQuestion === item.id ? "↓" : "→"}
              </div>
            </div>
            {openQuestion === item.id && item.answer && (
              <p className="text-gray-600 mt-3">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AboutFQA;
