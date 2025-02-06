import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useState } from "react";
import GoogleIconSvg from "../svg/GoogleIconSvg";

export default function GoogleButton({ onClose, setVerified }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const googleRespone = async (authResult) => {
    try {
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/google/auth/google?code=${authResult["code"]}`
      );

      if (response.data && response.data.data.user) {
        const eduuserInfo = {
          userId: response.data.data.user._id,
          email: response.data.data.user.Email,
          MobileNumber: response.data.data.user.MobileNumber,
          token: response.data.token,
        };
        localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
        setVerified(true);
        setTimeout(() => {
          setVerified(false);
          onClose(); // Close the modal after verification
        }, 3000);
        console.log("User Data:", response.data);
      } else if (response.data && response.data.message) {
        console.warn("Message from backend:", response.data.message);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error authenticating with Google:", error);
    }
  };

  const handleError = (error) => {
    console.error("Google Login Error:", error);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleRespone,
    onError: handleError,
    flow: "auth-code",
  });

  return (
    <div>
      <button
        className=" py-2 border w-full rounded-full flex items-center justify-center  text-sm sm:text-base cursor-pointer font-medium hover:underline"
        style={{ gap: "5px" }}
        onClick={googleLogin}
      >
        <span>
          <GoogleIconSvg />
        </span>
        <span>Sign Up with Google</span>
      </button>
    </div>
  );
}
