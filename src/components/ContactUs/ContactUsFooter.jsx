import React from "react";

const ContactUsFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-[95%] sm:w-[85%] mx-auto px-2 sm:px-4 mt-6 mb-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
          <div className="space-y-4 px-4 md:px-0 w-full md:w-[348px]">
            <div>
              <h2 className="font-semibold text-2xl sm:text-3xl">Edubrink</h2>
              <p className="text-gray-600 hidden md:block">
                2020 Holden Street, Siriya
              </p>
            </div>
            <p className="font-sans block md:hidden text-center">
              Stay updated on all things Edubrick by subscribing to us!
            </p>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="email"
                  placeholder="Your Email Here"
                  className="w-full h-12 sm:h-14 pl-4 sm:pl-6 pr-12 sm:pr-14 rounded-full bg-[rgba(248,248,248,1)] text-black focus:outline-none border border-gray-300"
                />
                <button
                  className="absolute right-1 top-1 flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-purple-500 to-red-500 rounded-full shadow-md hover:scale-105 transition-transform"
                  aria-label="Submit"
                >
                  <span className="text-white text-lg sm:text-xl">&#8594;</span>
                </button>
              </div>
            </div>
            <p className="block md:hidden font-sans text-center text-sm">
              By subscribing you agree with our Privacy Policy and provide
              consent to receive updates from us.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-[15px] md:gap-[20px] lg:gap-[50px]">
            <div>
              <h3 className="font-semibold text-black">Countries</h3>
              <ul className="text-black space-y-2 sm:space-y-5">
                <li>England</li>
                <li>Canada</li>
                <li>Germany</li>
                <li>Ireland</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black">Universities</h3>
              <ul className=" text-black space-y-2  sm:space-y-5 ">
                <li>Oxford University</li>
                <li>Daffodil University</li>
                <li>International University</li>
                <li>AIUB University</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black">Courses</h3>
              <ul className="text-black space-y-2 sm:space-y-5">
                <li>Business</li>
                <li>Medicine</li>
                <li>Marketing</li>
              </ul>
            </div>

            <div className="block md:hidden">
              <h3 className="font-semibold text-black">Pages</h3>
              <ul className="text-gray-600 space-y-2 sm:space-y-5">
                <li>University</li>
                <li>Courses</li>
                <li>Destinations</li>
              </ul>

              <div className="mt-6">
                <h3 className="font-semibold text-black">Social Media</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>Facebook</li>
                  <li>Twitter</li>
                  <li>Instagram</li>
                </ul>
              </div>
            </div>

            <div className="hidden md:block">
              <h3 className="font-semibold text-black">About Us</h3>
              <ul className="text-gray-600 space-y-2 sm:space-y-5">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="block md:hidden my-4" />
        <div className="mt-10 mb-6 pt-6 text-sm flex flex-col sm:flex-row justify-between text-center sm:text-left">
          <p>Copyright reserved© 2023</p>
          <p>Edubrink @ 2023</p>
        </div>
      </div>
    </footer>
  );
};

export default ContactUsFooter;
