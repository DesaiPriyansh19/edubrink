import React from 'react'
import flag from'../../assets/Flags/UKFlag.png'
import usa from'../../assets/Flags/USAflag.png'
import germny from'../../assets/Flags/GermnyFlag.png'
import Unitedarap from '../../assets/Flags/UnitedAraPFlag.png'
import swizrland from '../../assets/Flags/SwitzerlandFlag.png'
import canada from '../../assets/Flags/CanadaFlag.png'
import Calander from '../../../svg/caplogo/Logo/Calander/Index'
import bgImage from '../../assets/1293242-dual-degree.webp'
function Discover() {
    return (
        <section
          className="w-[98%] mx-auto rounded-3xl  h-[60vh] sm:h-[70vh] md:vh-[80vh] lg:h-[90vh] relative overflow-hidden"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Proper Gradient Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-[3px]"
            style={{
              background: `linear-gradient(to right, rgba(56, 12, 149, 0.8), rgba(225, 87, 84, 0.8)`,
              zIndex: 1,
            }}
          ></div>
    
          {/* Content */}
          <div className="relative z-10 text-center text-white flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              Discover your ideal<br></br> University abroad today
            </h1>
            <p className=" text-[.6rem] md:text-[1rem] px-4">
              Effortlessly explore a wide range of universities, discover the 
              perfect <br></br> courses tailored to your goals, and compare study
              opportunities.
            </p>
            <button className="px-6 rounded-full py-3 bg-gradient-to-r from-[#380C95] to-[#E15754] text-sm text-white   md:text-lg font-normal shadow-lg hover:scale-105 transition-transform">
              Get Started Now
            </button>
          </div>
    
          {/* Rounded flag divs */}
          <div className="absolute z-10 top-4 left-20 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
              src={usa}
              alt="Flag 1"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

          <div className="absolute z-10 top-40 left-10 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
              src={germny}
              alt="Flag 1"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

          <div className="absolute z-10 top-4 right-20 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
              src={canada}
              alt="Flag 2"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

          <div className="absolute z-10 top-40 right-10 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
               src={flag}
              alt="Flag 2"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

          <div className="absolute z-10 bottom-4 left-20 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
              src={Unitedarap}
              alt="Flag 3"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>
          <div className="absolute z-10 bottom-4 right-20 w-16 h-16 rounded-full border-[8px] border-transparent bg-transparent backdrop-blur-3xl hidden lg:flex items-center justify-center">
            <img
             src={swizrland}
              alt="Flag 4"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

        </section>
      );
}

export default Discover