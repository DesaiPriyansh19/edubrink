import React from 'react';
import ManSticker from "../../assets/ManSticker.png";
import Search from '../../assets/SearchStcker.png';
import Book from '../../assets/BookSticker.png';
import Plain from '../../assets/PlanSticker.png'
import bg1 from '../../assets/HowWe1.png';
import bg2 from '../../assets/HowWe2.png';
import bg3 from '../../assets/HowWe3.png';
import bg4 from '../../assets/HowWe4.png'
function HowWeWork() {
  
  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center justify-center text-center mb-1">How we work<img src={ManSticker}></img></h1>
      <p className='text-[.9rem] px-12 md:p-0 text-center mb-6'>Effortlessly explore diverse courses, find programs tailored to 
        your academic <br></br> goals, compare study opportunities, and make informed decisions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:px-auto sm:mx-auto  px-0 lg:flex flex-nowrap justify-between gap-4 mx-auto w-[90%]">
      {/* Card 1 */}
      <div className="w-[80%] mx-auto  lg:w-1/4 sm::mx-0">
        <div className="relative overflow-hidden">
          <img
            src={bg1}
            alt="Main"
            className="w-full h-auto object-contain rounded-bl-[4rem] rounded-br-[3rem] rounded-tr-[4rem]"
          />
          <img
            src={Search}
            alt="Small"
            className="absolute bottom-[0] right-0 w-[30%] h-[30%] "
          />
        </div>
        <p className="mt-2 font-semibold sm:font-medium text-black">Discover your future</p>
        <p className="text-black  text-[.8rem] font-light px-1">Discover the art of ad production, with where creativity meets strategy.</p>
      </div>

      {/* Card 2 */}
      <div className="w-[80%] mx-auto  lg:w-1/4 sm::mx-0">
        <div className="relative overflow-hidden">
          <img
            src={bg2}
            alt="Main"
            className="w-full h-auto object-contain  rounded-bl-[4rem] rounded-br-[4rem] rounded-tl-[3rem]"
          />
          <img
            src={Book}
            alt="Small"
            className="absolute top-0 left-0 w-[30%] h-[30%] "
          />
        </div>
        <p className="mt-2 font-semibold sm:font-medium text-black">Find skilled courses</p>
        <p className="text-black  text-[.8rem] font-light px-1">Discover the art of ad production, with where creativity meets strategy.</p>
      </div>

      {/* Card 3 */}
      <div className="w-[80%] mx-auto   lg:w-1/4 sm::mx-0">
        <div className="relative overflow-hidden">
          <img
            src={bg3}
            alt="Main"
            className="w-full h-auto object-contain  rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem]"
          />
          <img
            src={Plain}
            alt="Small"
            className="absolute bottom-0 left-0 w-[30%] h-[30%] "
          />
        </div>
        <p className="mt-2 font-semibold sm:font-medium text-black">Study abroad university</p>
        <p className="text-black  text-[.8rem] font-light px-1">Discover the art of ad production, with where creativity meets strategy.</p>
      </div>

      {/* Card 4 */}
      <div className="w-[80%] mx-auto  lg:w-1/4 sm:mx-0 ">
        <div className="relative overflow-hidden">
          <img
            src={bg4}
            alt="Main"
            className="w-full h-auto object-contain rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem] "
          />
          <img
            src={Book}
            alt="Small"
            className="absolute top-0 left-0 w-[30%] h-[30%] "
          />
        </div>
        <p className="mt-2 font-semibold sm:font-medium text-black ">Enrolment courses</p>
        <p className="text-black  text-[.8rem] font-light px-1">Discover the art of ad production, with where creativity meets strategy.</p>
      </div>
    </div>

    </div>
  )
}

export default HowWeWork;