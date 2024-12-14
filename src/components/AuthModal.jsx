import React, { useState } from "react";
import GoogleWrapper from "../../utils/GoogleWrapper";
import axios from "axios";

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const [createUser, setCreateUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isSignup) {
      setDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setCreateUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignup) {
      // Login logic
      const userData = {
        Email: details.email,
        Password: details.password,
      };

      try {
        const response = await axios.post(
          "https://edu-brink-backend.vercel.app/api/users",
          userData
        );
        console.log("Login successful:", response.data);
        const userInfo = {
          userId: response.data.data.user._id,
          email: response.data.data.user.Email,
          MobileNumber: response.data.data.user.MobileNumber,
          token: response.data.token,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } catch (error) {
        console.error("Error during login:", error);
      } finally {
        setDetails({
          email: "",
          password: "",
        });
        onClose();
      }
    } else {
      // Signup logic
      const userData = {
        Email: createUser.email,
        Password: createUser.password,
      };

      try {
        const response = await axios.post(
          "https://edu-brink-backend.vercel.app/api/users",
          userData
        );
        console.log("Signup successful:", response.data);
        const userInfo = {
          userId: response.data.data.user._id,
          email: response.data.data.user.Email,
          token: response.data.token,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        onClose();
      } catch (error) {
        console.error("Error during signup:", error);
      } finally {
        setCreateUser({
          email: "",
          password: "",
        });
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-black bg-transparent backdrop-blur-[2px] bg-opacity-5 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md py-14 md:py-8 p-4 sm:p-6 shadow-lg relative mx-3 sm:mx-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute font-medium top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form>
          {/* Email Field */}
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
              name="email"
              value={isSignup ? createUser.email : details.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E15754]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
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
              name="password"
              value={isSignup ? createUser.password : details.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E15754]"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 text-white font-normal rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l hover:from-[#380C95] hover:to-[#E15754]"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
            <GoogleWrapper onClose={onClose} />
          </div>
        </form>

        {/* Toggle Between Login/Signup */}
        <div className="mt-4 text-center font-normal text-base sm:text-lg">
          {isSignup ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignup(false)}
                className="text-[#E15754] text-sm sm:text-base cursor-pointer font-medium hover:underline"
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                className="text-[#E15754] text-sm sm:text-base cursor-pointer font-medium hover:underline"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
