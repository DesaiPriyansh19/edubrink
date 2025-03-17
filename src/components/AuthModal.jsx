"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import OtpVerificationModal from "./OtpVerificationModal";
import VerifiedModal from "./VerifiedModal";
import GoogleWrapper from "../../utils/GoogleWrapper";
import {
  Mail,
  Lock,
  Loader2,
  X,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize AOS with once:true to ensure animations only happen once
    AOS.init({
      duration: 800,
      once: true,
    });

    if (isOpen) {
      // Reset AOS animations when modal opens
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [isOpen]);

  // Effect to handle verified state changes
  useEffect(() => {
    if (verified) {
      setShowVerifiedModal(true); // Show the modal when verified is true
    } else {
      setShowVerifiedModal(false);
    }
  }, [verified]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailField =
      isSignup === "signup" ? details.signupEmail : details.email;
    if (!emailField) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(emailField)) {
      newErrors.email = t("auth.emailInvalid");
    }

    // Password validation
    const passwordField =
      isSignup === "signup" ? details.signupPassword : details.password;
    if (!passwordField) {
      newErrors.password = t("auth.passwordRequired");
    } else if (isSignup === "signup" && passwordField.length < 6) {
      newErrors.password = t("auth.passwordTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (
      errors[name === "signupEmail" || name === "email" ? "email" : "password"]
    ) {
      setErrors((prev) => ({
        ...prev,
        [name === "signupEmail" || name === "email" ? "email" : "password"]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

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
        console.log("Login response:", response.data);
        const responseData = response.data;
        if (responseData.data && responseData.data.status === "pending") {
          // OTP verification required
          setOtpVerification(true);
          const eduuserInfo = {
            userId: responseData.data.data.userId,
            email: responseData.data.data.email,
          };
          localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));
          console.log("OTP verification required.");
        }
        // Check if token exists in the response (for verified users)
        else if (responseData.token) {
          // User is verified, proceed with login
          const eduuserInfo = {
            userId: responseData.data.user._id,
            email: responseData.data.user.Email,
            token: responseData.token,
          };
          localStorage.setItem("eduuserInfo", JSON.stringify(eduuserInfo));

          setVerified(true);
          console.log("Setting verified to true");

          // Don't close the modal immediately - let the VerifiedModal show
          setTimeout(() => {
            setVerified(false);
            onClose(); // Close the modal after verification
          }, 5000); // 5 seconds
        } else {
          console.error("Unexpected response:", responseData);
          setErrors({
            general: t("auth.unexpectedError"),
          });
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrors({
          general: error.response?.data?.message || t("auth.loginFailed"),
        });
      } finally {
        setLoading(false); // Hide loader
        setDetails({
          ...details,
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
        setErrors({
          general: error.response?.data?.message || t("auth.signupFailed"),
        });
      } finally {
        setLoading(false); // Hide loader
        setDetails({
          ...details,
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
      console.log("Setting verified to true after OTP");

      // Don't close the modal immediately - let the VerifiedModal show
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
        ...details,
        email: "",
        password: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Render VerifiedModal outside the main modal container when it should be shown */}
      {showVerifiedModal && <VerifiedModal showModal={true} />}

      {/* Only render the main modal content if VerifiedModal is not showing */}
      {!showVerifiedModal && (
        <div
          className="relative bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl overflow-hidden transform transition-all duration-500"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10 bg-white/80 rounded-full p-1"
          >
            <X size={20} />
          </button>

          {/* Tab navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setIsSignup("login")}
              className={`flex-1 py-4 text-center font-medium transition-colors duration-300 ${
                isSignup === "login"
                  ? "text-[#2a2a5a] border-b-2 border-[#2a2a5a]"
                  : "text-gray-500"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              onClick={() => setIsSignup("signup")}
              className={`flex-1 py-4 text-center font-medium transition-colors duration-300 ${
                isSignup === "signup"
                  ? "text-[#2a2a5a] border-b-2 border-[#2a2a5a]"
                  : "text-gray-500"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          {!otpVerification ? (
            <div className="p-6 relative z-10">
              {/* Header */}
              <div className="text-center mb-6" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-[#2a2a5a] mb-1">
                  {isSignup === "signup"
                    ? t("auth.createAccount")
                    : t("auth.welcomeBack")}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isSignup === "signup"
                    ? t("auth.createAccountSubtext")
                    : t("auth.welcomeSubtext")}
                </p>
              </div>

              {/* General error message */}
              {errors.general && (
                <div
                  className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-start"
                  data-aos="fade-in"
                >
                  <AlertTriangle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form data-aos="fade-up">
                <div className="mb-4">
                  <label
                    htmlFor={isSignup === "signup" ? "signupEmail" : "email"}
                    className="block text-sm font-medium mb-1.5 text-gray-700"
                  >
                    {t("auth.emailAddress")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id={isSignup === "signup" ? "signupEmail" : "email"}
                      name={isSignup === "signup" ? "signupEmail" : "email"}
                      value={
                        isSignup === "signup"
                          ? details.signupEmail
                          : details.email
                      }
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2a2a5a] focus:border-[#2a2a5a] transition-all duration-200`}
                      placeholder={t("auth.emailPlaceholder")}
                      required
                    />
                    {errors.email ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <AlertTriangle size={18} className="text-red-500" />
                      </div>
                    ) : details.email || details.signupEmail ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle size={18} className="text-green-500" />
                      </div>
                    ) : null}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor={
                      isSignup === "signup" ? "signupPassword" : "password"
                    }
                    className="block text-sm font-medium mb-1.5 text-gray-700"
                  >
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id={isSignup === "signup" ? "signupPassword" : "password"}
                      name={
                        isSignup === "signup" ? "signupPassword" : "password"
                      }
                      value={
                        isSignup === "signup"
                          ? details.signupPassword
                          : details.password
                      }
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2a2a5a] focus:border-[#2a2a5a] transition-all duration-200`}
                      placeholder={
                        isSignup === "signup"
                          ? t("auth.createPasswordPlaceholder")
                          : t("auth.passwordPlaceholder")
                      }
                      required
                    />
                    {errors.password ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <AlertTriangle size={18} className="text-red-500" />
                      </div>
                    ) : details.password || details.signupPassword ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle size={18} className="text-green-500" />
                      </div>
                    ) : null}
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-6" data-aos="fade-up">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center bg-[#2a2a5a] hover:bg-[#232350]"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {isSignup === "signup" ? (
                          <>
                            <UserPlus size={18} className="mr-2" />
                            {t("auth.signUpButton")}
                          </>
                        ) : (
                          <>
                            <LogIn size={18} className="mr-2" />
                            {t("auth.signInButton")}
                          </>
                        )}
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-gray-200 absolute w-full"></div>
                    <span className="bg-white px-3 text-sm text-gray-500 relative">
                      {t("auth.orContinueWith")}
                    </span>
                  </div>

                  <div className="mt-1" data-aos="fade-up">
                    <GoogleWrapper
                      onClose={onClose}
                      setVerified={setVerified}
                    />
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center" data-aos="fade-up">
                {isSignup === "signup" ? (
                  <p className="text-gray-600 text-sm">
                    {t("auth.alreadyHaveAccount")}{" "}
                    <button
                      onClick={() => setIsSignup("login")}
                      className="font-medium text-[#2a2a5a] hover:underline transition-all duration-200 inline-flex items-center"
                    >
                      {t("auth.signIn")}
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {t("auth.dontHaveAccount")}{" "}
                    <button
                      onClick={() => setIsSignup("signup")}
                      className="font-medium text-[#2a2a5a] hover:underline transition-all duration-200 inline-flex items-center"
                    >
                      {t("auth.signUp")}
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Blurred background of the login form */}
              <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10"></div>

              {/* OTP Verification Modal */}
              <div className="relative z-20">
                <OtpVerificationModal
                  otpError={otpError}
                  handleOtpVerification={handleOtpVerification}
                  otp={otp}
                  setOtp={setOtp}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthModal;
