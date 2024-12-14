import React from 'react'
import img1 from '../../assets/Corses1.png'
import img2 from '../../assets/Corses2.png'
import img3 from '../../assets/Corses3.png'
import ArrowTopRight from '../../../svg/ArrowTopRight/Index';
function OurCourses() {
    return (
        <div className="flex overflow-x-auto text-white  space-x-6 px-4 py-8">
          {/* First Slide */}
          <div className="min-w-[300px] bg-[#60E38C] p-6 rounded-3xl shadow-md">
            {/* SVG and Image */}
            <div className="flex items-start justify-between space-x-4">
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                {/* Example SVG */}
               <ArrowTopRight/>
              </span>
              <img
                src={img1}
                alt="Slide 1"
                className="w-[60%] h-[60%] object-cover rounded-b-lg"
              />
            </div>
            {/* Content */}
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold mb-2">MSc Advanced Computer 
              Science with Business</h3>
              <p className="text-[.8rem] ">University of Australia</p>
              <p className="text-lg font-semibold ">$500.00</p>
            </div>
          </div>
    
          {/* Second Slide */}
          <div className="min-w-[300px] bg-[#55CFFF] p-6 rounded-3xl shadow-md">
            {/* Content */}
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold mb-2">
              Business strategy
              </h3>
              <p className="text-[.8rem] ">University of Australia</p>
              <p className="text-lg font-semibold mb-2">$500.00</p>
            </div>
            {/* SVG and Image */}
            <div className="flex items-start justify-between space-x-4">
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                {/* Example SVG */}
                <ArrowTopRight/>
              </span>
              <img
                src={img2}
                alt="Slide 2"
                className="w-[60%] h-[60%] object-cover rounded-b-lg"
              />
            </div>
          </div>
    
          {/* Third Slide */}
          <div className="min-w-[300px] bg-[#E186FF] p-6 rounded-3xl shadow-md">
            {/* SVG and Image */}
            <div className="flex items-start justify-between space-x-4">
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                {/* Example SVG */}
                <ArrowTopRight/>
              </span>
              <img
                src={img3}
                alt="Slide 3"
                className="w-[60%] h-[60%] object-cover rounded-b-lg"
              />
            </div>
            {/* Content */}
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold mb-2">
              Ads productions
              </h3>
              <p className="text-[.8rem] ">Discover the art of ad production, with where creativity meets strategy.</p>
              <p className="text-lg font-semibold ">$500.00</p>
            </div>
          </div>


          <div className="min-w-[300px] bg-yellow-200 p-6 rounded-3xl shadow-md">
            {/* Content */}
            <div className="mt-4 text-left">
              <h3 className="text-lg font-semibold mb-2">
              Business strategy
              </h3>
              <p className="text-[.8rem] ">University of Australia</p>
              <p className="text-lg font-semibold mb-2">$500.00</p>
            </div>
            {/* SVG and Image */}
            <div className="flex items-start justify-between space-x-4">
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                {/* Example SVG */}
                <ArrowTopRight/>
              </span>
              <img
                src={img2}
                alt="Slide 2"
                className="w-[60%] h-[60%] object-cover rounded-b-lg"
              />
            </div>
          </div>

        </div>
        
      );
}

export default OurCourses