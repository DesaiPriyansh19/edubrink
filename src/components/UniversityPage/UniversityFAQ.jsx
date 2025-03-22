"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, HelpCircle } from "lucide-react";

const UniversityFAQ = ({ data, language, themeColor = "#3b3d8d" }) => {
  const { t } = useTranslation();
  const [openFAQs, setOpenFAQs] = useState({});

  // Toggle FAQ open/closed state
  const toggleFAQ = (index) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check if FAQs exist
  if (!data?.faq || data.faq.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:shadow-lg">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("faq_title") || "Frequently Asked Questions"}
        </h2>
      </div>

      <div className="space-y-5">
        {data.faq.map((faq, index) => (
          <div
            key={index}
            className={`bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 ${
              openFAQs[index]
                ? "ring-1 ring-[#3b3d8d]/20 shadow-md"
                : "hover:bg-gray-100"
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#3b3d8d]/30 focus:ring-inset rounded-xl ${
                openFAQs[index] ? "bg-[#3b3d8d]/5" : ""
              }`}
              aria-expanded={openFAQs[index]}
              aria-controls={`faq-content-${index}`}
            >
              <h3
                className={`font-semibold text-lg ${
                  openFAQs[index] ? "text-[#3b3d8d]" : "text-gray-800"
                }`}
              >
                {faq.faqQuestions?.[language] || "N/A"}
              </h3>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  openFAQs[index]
                    ? "bg-[#3b3d8d] text-white rotate-180"
                    : "bg-white text-[#3b3d8d] shadow-sm"
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <div
              id={`faq-content-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openFAQs[index]
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 pt-2">
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: faq.faqAnswers?.[language] || "No answer available",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional help section */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <p className="text-[#3b3d8d] font-medium ml-1 hover:underline">
          {t("faq_description")}
        </p>
      </div>
    </div>
  );
};

export default UniversityFAQ;
