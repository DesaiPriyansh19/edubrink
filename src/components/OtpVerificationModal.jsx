import React, { useEffect, useRef, useState } from "react";
import image from "../assets/verfication.png";

export default function OtpVerificationModal({
  handleOtpVerification,
  otp,
  setOtp,
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const inRef = useRef([]);

  useEffect(() => {
    // Automatically focus on the first input when the component mounts
    inRef.current[0]?.focus();
  }, []);

  const handleKeyDown = (e, idx) => {
    const arrayCopy = [...otp];

    if (e.key === "Backspace") {
      // Clear current input and move focus to the previous one
      if (arrayCopy[idx] !== "") {
        arrayCopy[idx] = "";
        setOtp(arrayCopy);
      } else if (idx > 0) {
        inRef.current[idx - 1]?.focus();
        arrayCopy[idx - 1] = "";
        setOtp(arrayCopy);
      }
    } else if (e.key < "0" || e.key > "9") {
      // Prevent non-numeric input
      e.preventDefault();
    }
  };

  const handleChange = (e, idx) => {
    const value = e.target.value.slice(0, 1); // Only take the first character
    if (value) {
      const arrayCopy = [...otp];
      arrayCopy[idx] = value;
      setOtp(arrayCopy);

      // Move focus to the next input
      if (idx < 3) {
        inRef.current[idx + 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
    const arrayCopy = [...otp];

    pastedData.forEach((char, idx) => {
      if (idx < 4) {
        arrayCopy[idx] = char;
      }
    });

    setOtp(arrayCopy);

    // Move focus to the last filled input
    const lastFilledIndex = Math.min(pastedData.length, 4) - 1;
    inRef.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6">
      <div className="w-40 h-40">
        <img className="w-full h-full object-cover" src={image} />
      </div>
      <div>
        <p className="text-xl">Verfiy Email</p>
      </div>
      {/* Timer Display */}

      <div className="flex flex-col ">
        <div className="flex justify-center mb-4 gap-4">
          {otp.map((value, idx) => (
            <input
              key={idx}
              type="text"
              value={value}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onChange={(e) => handleChange(e, idx)}
              onPaste={handlePaste}
              ref={(el) => (inRef.current[idx] = el)}
              className="w-16 h-16 text-center text-2xl font-bold text-black rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent focus:ring-transparent bg-clip-border"
              style={{
                borderImage: "linear-gradient(90deg, #380C95, #E15754) 1",
              }}
              disabled={isDisabled} // Disable inputs when timer runs out
            />
          ))}
        </div>
        <button
          className=" text-gray-500 mb-4 text-lg hover:text-gray-400 transition-colors ease-in-out duration-300  rounded-lg"
          onClick={() => {
            setOtp(new Array(4).fill("")); // Clear OTP fields
            setIsDisabled(false); // Re-enable inputs
            inRef.current[0]?.focus(); // Focus on the first input
          }}
        >
          Resend
        </button>
        <p className="text-xs max-w-72 mb-4 text-center mx-auto w-full">
          By clicking on Verify button you agree to our Terms & Conditions
        </p>
        <button
          onClick={handleOtpVerification}
          className="w-full max-w-sm px-6 py-3 text-lg font-semibold text-white rounded-lg bg-gradient-to-r from-[#380C95] to-[#E15754] hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#380C95]/70"
        >
          Verify
        </button>
      </div>
      {/* Resend OTP Button */}
    </div>
  );
}
