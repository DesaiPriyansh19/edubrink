import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const LanguageRedirect = () => {
  const { language, setLanguage } = useLanguage(); // Get and set the language from the context
  const location = useLocation();

  useEffect(() => {
    const currentLang = location.pathname.split("/")[1]; // Extract language from the URL

    // If the language in the URL is valid and doesn't match the current language context, update the context
    if (currentLang && currentLang !== language) {
      setLanguage(currentLang);
    }
  }, [location.pathname, language, setLanguage]);

  return null; // This component doesn't render anything
};

export default LanguageRedirect;