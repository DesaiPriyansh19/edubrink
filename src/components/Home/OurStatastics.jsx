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
        <section className="w-full mb-20">
          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-semibold text-center mb-8 sm:mb-16">Our statistics over year</h1>
    
          {/* Four Divs in One Line */}
          <div className="grid grid-cols-2 lg:flex  rounded-3xl justify-between gap-4 max-w-[1242px] py-4 px-4 mx-auto bg-white ">
            {items.map((item, index) => (
              <div
                key={index}
                className=" p-4 rounded-3xl  bg-[#F8F8F8] w-auto lg:w-72 text-center"
              >
                {/* P tag and round div in one line */}
                <div className="flex items-center justify-between space-x-2 mb-4">
                  <p className="text-black font-medium">{item.info}</p>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full">
                    <span
                      
                   
                      className="w-8 h-8 flex items-center justify-center"
                    >{item.logo}</span>
                  </div>
                </div>
                {/* H3 Title */}
                <h3 className="text-2xl sm:text-4xl md:text-5xl text-start font-semibold mb-2 md:mb-5">{item.title}</h3>
                {/* P Description */}
                <p className="text-black text-xs sm:text-sm md:text-base text-start font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    
}

export default OurStatastics