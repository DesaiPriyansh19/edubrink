import React from "react";
import LinkedIn from "../../../svg/Linkdin";
import YouTube from "../../../svg/Youtube";
import Facebook from "../../../svg/Facebook";
import Twitter from "../../../svg/Twitter";
import ContactUsFooter from "./ContactUsFooter";
import { useTranslation } from "react-i18next";
const ContactUs = () => {
   const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 mt-10 md:mt-14 lg:mt-24">
      <div className="wrapper">
        <div className="flex items-center justify-center">
          <div className="text-center w-full max-w-xl">
            <div className="cont-heading font-general-sans font-semibold text-4xl md:text-6xl">
              <h1>  {t("Contact us")}</h1>
            </div>
            <div className="p-wrapper font-sans text-gray-700 font-medium text-base md:text-lg mt-4">
              <p>
              {t("Effortlessly explore")}
               
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8 mb-8">
          <div className="bg-white shadow-md rounded-2xl p-6 w-[50%] text-center">
            <p className="text-gray-800 mb-4 text-sm md:text-base">
            {t("If you need support")} 
            </p>
            <div className="bg-gray-100 text-gray-800 rounded-2xl py-2 px-8 mb-4 inline-block text-sm">
              contact@example.com
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-gray-500">
              <a href="#" aria-label="Twitter" className="hover:text-blue-500 hover:scale-110">
                <Twitter />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-700 hover:scale-110">
                <LinkedIn />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-red-500 hover:scale-110">
                <YouTube />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 hover:scale-110">
                <Facebook />
              </a>
            </div>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default ContactUs;
