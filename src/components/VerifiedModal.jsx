import { useEffect, useState } from "react";
import approval from "../assets/approved.png";
import { RandomReveal } from "react-random-reveal";
import { useTranslation } from "react-i18next";

export default function VerifiedModal({ showModal }) {
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (showModal) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [showModal]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        showModal ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white rounded-3xl w-full max-w-md py-14 md:py-8 p-4 sm:p-6 flex flex-col items-center text-center">
        <p className="text-3xl mb-4 font-mono text-center inline-flex gap-1">
          <RandomReveal
            isPlaying
            duration={2}
            characters={t("loginVerifiedTitle")}
          />
        </p>
        <p className="mb-4 uppercase font-mono">{t("loginVerfiedText")}</p>
        <div
          className={`w-14 h-14 transform transition-all duration-500 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-50"
          }`}
        >
          <img
            src={approval}
            className="w-full h-full object-cover"
            alt="approval pic"
          />
        </div>
      </div>
    </div>
  );
}
