import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutFQA = () => {
  const { t } = useTranslation();
  const [openQuestion, setOpenQuestion] = useState(1);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: false,
    });
    AOS.refresh();
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqItems = [
    {
      id: 1,
      question: t("questions.q1.question"),
      answer: t("questions.q1.answer"),
    },
    {
      id: 2,
      question: t("questions.q2.question"),
      answer: t("questions.q2.answer"),
    },
    {
      id: 3,
      question: t("questions.q3.question"),
      answer: t("questions.q3.answer"),
    },
    {
      id: 4,
      question: t("questions.q4.question"),
      answer: t("questions.q4.answer"),
    },
    {
      id: 5,
      question: t("questions.q5.question"),
      answer: t("questions.q5.answer"),
    },
  ];

  return (
    <>
      <div className="faq-outer-text w-[90%] mx-auto" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-semibold mb-2 mt-5">
          {t("faq_title")}
        </h2>
        <p className="text-gray-600 text-sm leading-6 md:text-base max-w-2xl mb-8">
          {t("faq_description")}
        </p>
      </div>

      <div
  className="w-[90%] rounded-2xl mb-12 mx-auto bg-white p-3 md:p-4 shadow-sm"
  data-aos="fade-up"
  data-aos-delay="100"
>
  <div className="space-y-3 bg-white">
    {faqItems.map((item, index) => (
      <div
        key={item.id}
        className={`p-3 rounded-md transition-all duration-300 ease-in-out ${
          openQuestion === item.id
            ? "shadow-sm bg-gradient-to-r from-gray-100 to-gray-50"
            : "bg-gray-100 hover:bg-gray-50"
        }`}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleQuestion(item.id)}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 text-xs rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                openQuestion === item.id
                  ? "bg-gradient-to-r from-[#380C95] to-[#E15754] text-white"
                  : "bg-white text-black"
              }`}
            >
              {item.id}
            </div>
            <h3
              className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                openQuestion === item.id ? "text-[#380C95]" : "text-black"
              }`}
            >
              {item.question}
            </h3>
          </div>
          <div
            className={`text-black bg-white rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
              openQuestion === item.id ? "rotate-90" : ""
            }`}
          >
            {openQuestion === item.id ? (
              <ChevronDown className="w-4 h-4 text-[#E15754]" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            openQuestion === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.answer && (
            <div className="text-gray-600 mt-2 pl-8 pr-2 text-xs">
              {item.answer}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  );
};

export default AboutFQA;
