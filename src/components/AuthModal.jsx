import React, { useEffect, useState } from "react";
import axios from "axios";
import OtpVerificationModal from "./OtpVerificationModal";
import VerifiedModal from "./VerifiedModal";
import GoogleWrapper from "../../utils/GoogleWrapper";

const AuthModal = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSignup, setIsSignup] = useState("login");
  const [details, setDetails] = useState({
    email: "",
    password: "",
    signupEmail: "",
    signupPassword: "",
  });
  const [otpVerification, setOtpVerification] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    if (isSignup === "login") {
      const userData = {
        Email: details.email,
        Password: details.password,
      };

      try {
        const response = await axios.post(
          `https://edu-brink-backend.vercel.app/api/users/login`,
          userData
        );
        console.log("Login successful:", response);

        if (response.data.data.status) {
          setOtpVerification(true);
          const eduuserInfo = {
            userId: response.data.data.data.userId,
            email: response.data.data.data.email,
          };
          localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
          setVerified(true);
          setTimeout(() => {
            setVerified(false);
            onClose(); // Close the modal after verification
          }, 3000); // 5 seconds
        } else {
          const eduuserInfo = {
            userId: response.data.data.user._id,
            email: response.data.data.user.Email,
            token: response.data.token,
          };
          localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
          setVerified(true);
          setTimeout(() => {
            setVerified(false);
            onClose(); // Close the modal after verification
          }, 3000); // 5 seconds
        }
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setLoading(false); // Hide loader
        setDetails({
          email: "",
          password: "",
        });
      }
    } else {
      // Signup logic
      const userData = {
        Email: details.signupEmail,
        Password: details.signupPassword,
      };

      try {
        const response = await axios.post(
          `https://edu-brink-backend.vercel.app/api/users`,
          userData
        );
        console.log("Signup successful:", response.data.data.data);
        setOtpVerification(true);
        const eduuserInfo = {
          userId: response.data.data.data.userId,
          email: response.data.data.data.email,
        };
        localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
      } catch (error) {
        console.error("Error during signup:", error);
      } finally {
        setLoading(false); // Hide loader
        setDetails({
          signupEmail: "",
          signupPassword: "",
        });
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    const pendingotp = otp.join("");
    console.log(pendingotp);

    // Retrieve userId from localStorage
    const userId = JSON.parse(localStorage.getItem("eduuserInfo"))?.userId;

    if (!userId) {
      console.error("User ID not found in localStorage.");
      setLoading(false); // Hide loader
      return;
    }

    try {
      const requestBody = {
        userId: userId,
        otp: pendingotp,
      };
      const response = await axios.post(
        `https://edu-brink-backend.vercel.app/api/users/verifyotp`,
        requestBody
      );
      console.log(response.data);

      const eduuserInfo = {
        userId: response.data.data.user._id,
        email: response.data.data.user.Email,
        token: response.data.token,
      };
      localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
      setOtpVerification(false);
      setOtpError(false);
      setVerified(true);
      setTimeout(() => {
        setVerified(false);
        onClose(); // Close the modal after verification
      }, 5000); // 5 seconds
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setOtpError(true);
    } finally {
      setLoading(false); // Hide loader
      setDetails({
        email: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    if (verified) {
      setShowVerifiedModal(true); // Show the modal when verified is true

      const timeout = setTimeout(() => {
        setShowVerifiedModal(false); // Hide the modal after animation completes
      }, 3000); // Match the animation duration

      return () => clearTimeout(timeout); // Cleanup timeout on unmount or state change
    }
  }, [verified]);

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-black bg-transparent backdrop-blur-[2px] bg-opacity-5 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md py-14 md:py-8 p-4 sm:p-6 shadow-lg relative mx-3 sm:mx-0">
        {showVerifiedModal ? (
          <VerifiedModal showModal={verified} /> // Show loader when loading
        ) : !otpVerification ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">
              {isSignup === "signup" ? "Sign Up" : "Login"}
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-normal text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name={isSignup === "signup" ? "signupEmail" : "email"}
                  value={
                    isSignup === "signup" ? details.signupEmail : details.email
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E15754]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-normal text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name={isSignup === "signup" ? "signupPassword" : "password"}
                  value={
                    isSignup === "signup"
                      ? details.signupPassword
                      : details.password
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E15754]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full py-3 text-white font-normal rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l hover:from-[#380C95] hover:to-[#E15754]"
                >
                  {isSignup === "signup" ? "Sign Up" : "Login"}
                </button>
              </div>
              <div className="h-full w-full mt-4">
                <GoogleWrapper onClose={onClose} setVerified={setVerified} />
              </div>
            </form>

            <div className="mt-4 text-center font-normal text-base sm:text-lg">
              {isSignup === "signup" ? (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsSignup("login")}
                    className="text-[#E15754] text-sm sm:text-base cursor-pointer font-medium hover:underline"
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setIsSignup("signup")}
                    className="text-[#E15754] text-sm sm:text-base cursor-pointer font-medium hover:underline"
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <OtpVerificationModal
            otpError={otpError}
            handleOtpVerification={handleOtpVerification}
            otp={otp}
            setOtp={setOtp}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
