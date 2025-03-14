import React from 'react'

function FacultyPage() {
  return (<>
    
    <div>
          <div className="w-full px-9">
      {/* Full-width Image */}
      <div className="w-full h-[60vh] bg-gray-300"></div>

      {/* Main Content */}
      <div className="flex flex-wrap px-8 py-6">
        {/* Left Section (Text) */}
        <h1 className="text-3xl font-bold">Artificial Intelligence Courses Abroad</h1>
        <div className="w-full md:w-3/5">
        
          <p className="mt-2 text-gray-700">Explore top AI programs worldwide and advance your skills.</p>
          <p className="mt-1 text-gray-600">Get insights on curriculum, fees, and career opportunities.</p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/5 bg-gray-100 p-4">Right Side Content</div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-wrap px-8">
        {/* Left - Cards */}
        <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <button className="mt-4 bg-[#3A3D8D] text-white px-4 py-2 rounded-md">
                Express Offer
              </button>
            </div>
          ))}
        </div>

        {/* Right - Another Div */}
        <div className="w-full md:w-2/5 bg-gray-200 p-4">Right Side Content</div>
      </div>
    </div>
    
    </div>

    </>

  )
}

export default FacultyPage