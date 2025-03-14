import React from 'react'
import FacultyRightLayout from './FacultyRightLayout'
import mony from "../../assets/money.png"
function FacultyPage() {
//   return(
//   <>
//   </>
// )

  return (<>
    
   
          <div className="w-full px-3 md:px-9">
            {/* big image section */}
          <div className="w-full h-[38vh] lg:h-[70vh] ">
  <img
    src="src/assets/image (15).png"
    alt="Descriptive Alt Text"
    className="w-full h-full object-cover rounded-xl"
  />
</div>
<h1 className="text-4xl font-semibold pl-2 py-5">Artificial Intelligence Courses Abroad</h1>
{/* COntent */}
<div className='md:flex '>
  
  {/* Right side  */}
<div className=''>
  
      {/* Main Content */}
      <div className=" px-8 py-6">
        {/* Left Section (Text) */}
     
        <div className="w-full ">
        
          <p className="mt-2 text-sm text-gray-700">Explore top AI programs worldwide and advance your skills.</p>
          <p className="mt-1 text-sm text-gray-600">Get insights on curriculum, fees, and career opportunities.Get insights on
             curriculum, fees, and career opportunities.Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          </p><br></br>
          <p className="mt-1 text-sm text-gray-600">Get insights on curriculum, fees, and career opportunities.Get insights on
             curriculum, fees, and career opportunities.Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          </p><br></br>
          <p className="mt-1 text-sm text-gray-600">Get insights on curriculum, fees, and career opportunities.Get insights on
             curriculum, fees, and career opportunities.Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          </p><br></br>
          <p className="mt-1 text-sm text-gray-600">Get insights on curriculum, fees, and career opportunities.Get insights on
             curriculum, fees, and career opportunities.Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          </p><br></br>
          <p className="mt-1 text-sm text-gray-600">Get insights on curriculum, fees, and career opportunities.Get insights on
             curriculum, fees, and career opportunities.Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          Get insights on curriculum, fees, and career opportunities.
          </p><br></br>
        </div>

      
      </div>

      {/* Cards Section */}
      <div className=" px-4">
        {/* Left - Cards */}
        <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="px-4 py-5 border rounded-xl shadow-lg">
              {/* Top - Image & Title cards */}
              <div className="flex items-center gap-3">
                <img className="w-16 h-16 rounded-full" src="src/assets/image (15).png" alt="profile" />
           <div>   
           <p className="font-semibold">
  {(() => {
    const text = "MSC Advanced Computer";
    return text.split(" ").length > 2 ? text.split(" ").slice(0, 2).join(" ") + "..." : text;
  })()}
</p>

                   {/* Description */}
              <p className="text-[.7rem]  text-gray-800  mt-2">Location, Country</p>
              <p className="font-medium text-sm  flex items-center gap-2">
              <img src={mony} alt="logo" className="w-4 h-4 " />$34,0000.00
              </p>
              </div>
             
              </div>

           
              <div className='bg-slate-300 h-[1px] w-full my-2'></div>
              {/* Button */}
              <button className="mt-4 text-sm bg-[#3A3D8D] w-full text-white px-4 py-2 rounded-full">
                Express Offer
              </button>
            </div>
          ))}
        </div>

    <div className='flex flex-wrap mt-3 text-[.8rem] font-medium gap-3'>  <p className=' rounded-full bg-white px-3 py-2'>Business Administration</p>
    <p className=' rounded-full bg-white px-3 py-2'>Business Administration</p> <p className=' rounded-full bg-white px-3 py-2'>Business Administration</p>
    <p className=' rounded-full bg-white px-3 py-2'>Business Administration</p>
    <p className=' rounded-full bg-white px-3 py-2'>Business Administration</p>
    </div> </div>
      </div>

{/* Left side */}
<div className=''>
  <FacultyRightLayout/>
</div>
      </div>


    </div>
    


    </>

  )
}

export default FacultyPage