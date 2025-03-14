import React from 'react'
import FacultyRightLayout from './FacultyRightLayout'

function FacultyPage() {
//   return(
//   <>
//   </>
// )
  return (<>
    
   
          <div className="w-full px-9">
            {/* big image section */}
          <div className="w-full h-[70vh] ">
  <img
    src="src/assets/image (15).png"
    alt="Descriptive Alt Text"
    className="w-full h-full object-cover rounded-xl"
  />
</div>
<h1 className="text-4xl font-semibold pl-2 py-5">Artificial Intelligence Courses Abroad</h1>
{/* COntent */}
<div className='flex'>
  
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
      <div className=" px-8">
        {/* Left - Cards */}
        <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-lg">
              {/* Top - Image & Title */}
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 rounded-full" src="profile.jpg" alt="profile" />
                <p className="font-bold">University Name</p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2">Location, Country</p>
              <p className="font-semibold text-gray-700 flex items-center gap-2">
                AI & Machine Learning <img src="logo.png" alt="logo" className="w-4 h-4" />
              </p>

              {/* Button */}
              <button className="mt-4 text-sm bg-[#3A3D8D] w-full text-white px-4 py-2 rounded-full">
                Express Offer
              </button>
            </div>
          ))}
        </div>

      
      </div>
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