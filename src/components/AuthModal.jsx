import React, { useState } from "react";

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);

  if (!isOpen) return null;

  return (
<div  className="fixed  inset-0 flex items-center justify-center bg-black bg-transparent backdrop-blur-[2px] bg-opacity-5 z-50">
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
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E15754]"
          placeholder="Enter your password"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 text-white font-normal rounded-full bg-gradient-to-r from-[#380C95] to-[#E15754] hover:bg-gradient-to-l hover:from-[#380C95] hover:to-[#E15754]"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>
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
