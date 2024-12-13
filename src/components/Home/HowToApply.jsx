import React from 'react'
import BookLogo from '../../../svg/BookLogo/Index';
import TrakeLogo from '../../../svg/TrakeLogo/Index';
import TestLogo from '../../../svg/TestLogo/Index';
import ChatLogo from '../../../svg/ChatLogo/Index';
import ManSticker from '../../assets/ManSticker.png'
function HowToApply() {
    const items = [
        {
          title: 'Study planner',
          description: 'Develop and implement who effective with the business.',
          logo:<BookLogo/>,
          info:'01',
        },
        {
          title: 'Document tracker',
          description: 'Develop and implement who effective with the business.',
          logo: <TrakeLogo/>,
          info:'02',
        },
        {
          title: 'Test preparation',
          description: 'Develop and implement who effective with the business.',
          logo: <TestLogo/>,
          info:'03',
        },
        {
          title: 'Advisor chat',
          description: 'Develop and implement who effective with the business.',
          logo: <ChatLogo/>,
          info:'04',
        },
      ];
    
      return (
        <section className="w-full py-8">
          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center justify-center text-center mb-1">
            How to apply<image src={ManSticker}></image></h1>
    <p className='text-[.9rem] px-12 md:p-0 text-center mb-6'>Easily explore global universities, discover programs suited to your goals, <br></br> 
    compare study options, and receive guidance throughout the application.</p>
          {/* Four Divs in One Line */}
          <div className="grid grid-cols-2 gap-3 lg:flex mx-2 lg:mx-8 rounded-3xl justify-center space-x-1 sm:space-x-4 px-2  ">
            {items.map((item, index) => (
              <div
                key={index}
                className=" p-1 sm:p-4 pb-9 rounded-3xl  bg-white w-auto lg:w-56 text-center"
              >
                {/* P tag and round div in one line */}
                <div className=" mb-4">
                
                  <div className="p-10  flex items-center justify-center bg-white rounded-full">
                    <span
                      
                   
                      className="w-8 h-8 mb-4 md:mb-8 flex items-center justify-center"
                    >{item.logo}</span>
                  </div>
                </div>
                {/* H3 Title */}
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                {/* P Description */}
                <p className="text-black text-[.9rem] font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    
}

export default HowToApply