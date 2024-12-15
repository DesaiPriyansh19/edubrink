import React from 'react';

const FindCourses = () => {
  return (
    <div className="bg-white w-[85%]  h-auto mx-auto p-6 rounded-3xl mt-5 py-14 shadow-lg">
        
      <h1 className="text-3xl font-bold mb-8 text-center">Find courses to study in all destinations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dropdown 1 */}
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
          Study Level
          </label>
          <select
            id="destination"
           className="w-full border border-gray-300 rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
             focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            <option value="">Select</option>
            <option value="usa">USA</option>
            <option value="uk">UK</option>
            <option value="canada">Canada</option>
          </select>
       
        </div>

        {/* Dropdown 2 */}
        <div className="relative">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
          Subject  preference
          </label>
          <select
            id="course"
            className="w-full border border-gray-300 rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
            focus:outline-none focus:ring-1 focus:ring-[#380C95]">
            <option value="">Select </option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="arts">Arts</option>
          </select>
         
        </div>

        {/* Dropdown 3 */}
        <div className="relative">
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <select
            id="duration"
            className="w-full border border-gray-300 rounded-xl py-2 pl-3 pr-10 text-black font-light text-[.8rem]
             focus:outline-none focus:ring-1 focus:ring-[#380C95]"
          >
            <option className='text-black' value="">Select duration</option>
            <option className='text-black' value="short-term">Short Term</option>
            <option className='text-black' value="long-term">Long Term</option>
          </select>
         
        </div>

        {/* Dropdown 4 */}
        <div className="relative">
        <label htmlFor="duration" className="block text-sm  font-medium text-white mb-2">
            Duration
          </label>
          <select
            id="language"
            className="w-full bg-gradient-to-r from-[#380C95] to-[#E15754]  rounded-full py-2 pl-3 pr-10 text-white
             focus:outline-none focus:ring-[#380C95] text-center  focus:bg-white text-[.9rem]"
          >
            <option className='text-black'value=""> Find Courses</option>
            <option className='text-black' value="english">Graduation</option>
            <option className='text-black' value="spanish">Post-Graduation</option>
         
          </select>
        
        </div>
      </div>
    </div>
  );
};

export default FindCourses;
