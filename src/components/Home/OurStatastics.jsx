import React from 'react'
import Calander from '../../../svg/caplogo/Logo/Calander/Index';
import HomeLogo from '../../../svg/caplogo/Logo/HomeLogo/Index';
import PeopleLogo from '../../../svg/caplogo/Logo/PeopleLogo';

function OurStatastics() {
    const items = [
        {
          title: '16+',
          description: 'Years of experience',
          logo: <Calander/>,
          info:'01',
        },
        {
          title: '230+',
          description: 'University partners',
          logo: <HomeLogo/>,
          info:'02',
        },
        {
          title: '1600+',
          description: 'Students required',
          logo: <PeopleLogo/>,
          info:'03',
        },
        {
          title: '180+',
          description: 'Courses we provide',
          logo: <Calander/>,
          info:'04',
        },
      ];
    
      return (
        <section className="w-full py-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-8">Our statistics over year</h1>
    
          {/* Four Divs in One Line */}
          <div className="grid grid-cols-2 gap-3 lg:flex mx-2 lg:mx-8 rounded-3xl justify-center space-x-1 sm:space-x-4 px-2 lg:px-4 py-3 bg-white ">
            {items.map((item, index) => (
              <div
                key={index}
                className=" p-4 rounded-3xl  bg-[#F8F8F8] w-auto lg:w-56 text-center"
              >
                {/* P tag and round div in one line */}
                <div className="flex items-center justify-between space-x-2 mb-4">
                  <p className="text-black font-medium">{item.info}</p>
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                    <span
                      
                   
                      className="w-8 h-8 flex items-center justify-center"
                    >{item.logo}</span>
                  </div>
                </div>
                {/* H3 Title */}
                <h3 className="text-4xl font-bold mb-2">{item.title}</h3>
                {/* P Description */}
                <p className="text-black font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    
}

export default OurStatastics