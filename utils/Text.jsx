import React from "react";
import { useTranslation } from "react-i18next";

const Text = ({ valueKey, className }) => {
  const { i18n } = useTranslation();
  const language = i18n.language; // Get current language (en or ar)

  return (
    <p
      className={` ${
        language === "ar" ? "text-end" : "text-start"
      } ${className}`}
    >
      {language === "ar" ? valueKey.ar : valueKey.en}
    </p>
  );
};

export default Text;
