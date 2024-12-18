import React from "react";

const Footer = () => {
  return (
    <div className="relative w-[85%] mx-auto px-1 md:px-4 rounded-2xl overflow-hidden">
      <div className="bg-white py-8 text-gray-800 px-4 mt-[5%] mb-[5%] rounded-2xl ">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Edubrink</h2>
          <div className="relative w-full max-w-md">
            <input
              type="email"
              placeholder="Your Email Here"
              className="w-full h-12 pl-4 pr-12 rounded-full bg-gray-100 text-black border border-gray-300"
            />
            <button
              className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-purple-500 to-red-500 rounded-full shadow-md hover:scale-105 transition-transform"
              aria-label="Submit"
            >
              <span className="text-white text-xl">&#8594;</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center space-x-4">
          <p className="mb-8 text-sm mt-8">
            Stay updated on all things Edubrink by subscribing to us!
          </p>
          <p className="text-sm mb-8 mt-8">
            By subscribing you agree with our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>{" "}
            and provide consent to receive updates.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:text-left mt-8">
          <div>
            <h3 className="font-semibold text-base mb-2">Universities</h3>
            <ul>
              <li>Oxford University</li>
              <li>Daffodil University</li>
              <li>International University</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Countries</h3>
            <ul>
              <li>England</li>
              <li>Canada</li>
              <li>Germany</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Courses</h3>
            <ul>
              <li>Business</li>
              <li>Medicine</li>
              <li>Marketing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Social Media</h3>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Pages</h3>
            <ul>
              <li>University</li>
              <li>Courses</li>
              <li>Destination</li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright */}
        <hr className="mt-8 border-t border-gray-300" />

        <div className="mt-4 text-sm flex flex-col sm:flex-row justify-between items-center text-black">
          <p className="mb-2 sm:mb-0">Copyright reserved@ 2023</p>
          <p>Edubrink @ 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;