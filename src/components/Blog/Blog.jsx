import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import img from '../../../src/assets/image 3.png'
import UniversityRightLayoutCard from "../UniversityPage/UniversityRightLayoutCard";
import RelatedBlogs from "./RelatedBlogs";
const MoreInfo = () => {
  return (<>
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-2">
        {/* <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24"></svg>*/}<Calander/> 
        <p className="text-[#1D211C] text-sm font-medium">17 March 2023</p>
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold flex justify-start items-start md:pr-24 lg:pr-40 text-start"><span>📚</span> Empowering students through project-based learning</h1>
      <p className="text-gray-700 md:pr-24 lg:pr-56 font-medium">
        In the ever-evolving landscape of education, it's crucial to explore innovative teaching methodologies
         that go beyond traditional approaches.</p>

      {/* Content 2ndSection */}
      <div className="md:flex justify-center w-full h-auto gap-6 items-center">
        {/* Left Image Section */}
<div className="w-full md:w-[60%] mb-auto">
        <div className=" w-full m-0 lg:h-[450px] ">
          <img
            src={img}
            alt="Blog Image"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="h-auto ">
          <div className=" flex flex-wrap gap-3 py-3 text-[0.8rem] font-medium">
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Computer Sciences</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Data Sciences and Big Data</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Artificial Intelligence</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Business Administration</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Business</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2">Cyber Security</span>
            <span className="bg-[#F3F4F6] rounded-xl py-1 px-2"> Information Technology</span>
          </div>

        </div>
        <div>
          <h3 className="text-2xl font-semibold"> Introduction:</h3>
          <p className="text-sm font-medium mt-2 mb-3">In 2020, I read a book called the Power of Habit and challenged myself to 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">In 2020, I read a book called the Power of Habit and challenged myself to 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">In 2020, I read a book called the Power of Habit and challenged myself to 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">the Power of Habit and challenged myself to 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">o 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">, I read a book 
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
             <p className="text-sm font-medium mt-2 mb-3">In 2020, I read a book called the Power of Habit and challenged myself to 
            try something new. As someone who’s an introvert and felt shy about sharing my
             thoughts, one of the habits I wanted to work on was speaking up more.</p>
        </div>
        </div>  

        {/* Right Form Section */}
        <div className="  w-full md:w-[40%]  ">
       <div className="w-full space-y-6 bg-white px-5 py-8 rounded-3xl h-[450px]"> 
        <h4 className="text-lg font-semibold mb-4">Find courses to study in all destinations</h4>
          {/* Dropdowns */}
       <span className="w-full ">  
         <label className="text-sm font-medium">Study Level</label>
          <select className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white">
            <option value="">Select</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select></span>
          <span className="w-full ">  
         <label className="text-sm font-medium">Subject  preference</label>
          <select className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white">
            <option value="">Select your subject here</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select></span>
          <span className="w-full">  
         <label className="text-sm font-medium">Subject  preference</label>
          <select className="w-full mb-5 border-[1.5px] py-2 text-[.755rem] text-gray-700 rounded-xl px-3 bg-white">
            <option value="">Select your subject here</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select></span>
          {/* Button */}
          <button className="w-full px-6 rounded-full py-3 bg-gradient-to-r from-[#380C95] to-[#E15754] text-sm text-white">
            Find Courses
          </button>
          </div> 
          <UniversityRightLayoutCard/> 
        </div>

      </div>
      
    </div>
   <div className="px-4"> <RelatedBlogs/></div>
    
    </>

  );
};

export default MoreInfo;
