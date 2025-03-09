import React, { useState } from "react";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import InputField from "../../../../utils/InputField";

const FaqSection = ({ formData, setFormData }) => {
  const [activeFAQ, setActiveFAQ] = useState(0);

  const addFAQ = () => {
    setFormData((prevData) => ({
      ...prevData,
      faq: [
        ...prevData.faq,
        {
          faqQuestions: { en: "", ar: "" },
          faqAnswers: { en: "", ar: "" },
        },
      ],
    }));
    setActiveFAQ(formData.faq?.length);
  };

  const removeFAQ = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      faq: prevData.faq.filter((_, i) => i !== index),
    }));
    if (activeFAQ === index) {
      setActiveFAQ(Math.max(0, index - 1));
    } else if (activeFAQ > index) {
      setActiveFAQ(activeFAQ - 1);
    }
  };

  const handleFAQChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedFAQs = [...prevData.faq];
      const [parent, child] = field.split(".");

      updatedFAQs[index][parent][child] = value;

      return { ...prevData, faq: updatedFAQs };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Frequently Asked Questions (FAQs)
        </h2>
        <button
          type="button"
          onClick={addFAQ}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </button>
      </div>

      {formData.faq.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {formData.faq.map((faq, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveFAQ(index)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeFAQ === index
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {faq.faqQuestions.en || `FAQ ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {formData.faq.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {formData.faq[activeFAQ].faqQuestions.en
                ? formData.faq[activeFAQ].faqQuestions.en
                : `FAQ ${activeFAQ + 1}`}
            </h3>
            <button
              type="button"
              onClick={() => removeFAQ(activeFAQ)}
              className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question English */}
            <InputField
              label="FAQ Question (English)"
              type="text"
              name="faqQuestions.en"
              placeholder="Enter question in English"
              value={formData.faq[activeFAQ].faqQuestions.en}
              onChange={(e) =>
                handleFAQChange(activeFAQ, "faqQuestions.en", e.target.value)
              }
              variant={3}
            />

            {/* Question Arabic */}
            <InputField
              label="سؤال (عربي)"
              type="text"
              name="faqQuestions.ar"
              placeholder="أدخل السؤال بالعربية"
              value={formData.faq[activeFAQ].faqQuestions.ar}
              onChange={(e) =>
                handleFAQChange(activeFAQ, "faqQuestions.ar", e.target.value)
              }
              variant={3}
            />

            {/* Answer English */}
            <InputField
              label="FAQ Answer (English)"
              type="textarea"
              name="faqAnswers.en"
              placeholder="Enter answer in English"
              value={formData.faq[activeFAQ].faqAnswers.en}
              onChange={(e) =>
                handleFAQChange(activeFAQ, "faqAnswers.en", e.target.value)
              }
              variant={3}
            />

            {/* Answer Arabic */}
            <InputField
              label="إجابة (عربي)"
              type="textarea"
              name="faqAnswers.ar"
              placeholder="أدخل الإجابة بالعربية"
              value={formData.faq[activeFAQ].faqAnswers.ar}
              onChange={(e) =>
                handleFAQChange(activeFAQ, "faqAnswers.ar", e.target.value)
              }
              variant={3}
            />
          </div>
        </div>
      )}

      {formData.faq.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No FAQs added yet</p>
          <button
            type="button"
            onClick={addFAQ}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add First FAQ
          </button>
        </div>
      )}
    </div>
  );
};

export default FaqSection;
