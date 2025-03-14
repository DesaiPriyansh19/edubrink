"use client"

import { useEffect } from "react"
import AlbertFlores from "../../assets/AboutpageImage/AlbertFlores.png"
import WadeWarren from "../../assets/AboutpageImage/WadeWarren.png"
import DSG from "../../assets/AboutpageImage/DSG.png"
import RS from "../../assets/AboutpageImage/RS.png"
import RobertFox from "../../assets/AboutpageImage/RobertFox.png"
import AOS from "aos"
import "aos/dist/aos.css"

const AboutTestimonal = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    })
    AOS.refresh()
  }, [])

  return (
    <div className="container mx-auto py-12 bg-[rgba(248,248,248,1)]">
      <div className="testi-wrapper flex flex-col items-center">
        <div className="header text-center mb-4" data-aos="fade-down">
          <h1 className="text-3xl font-semibold leading-[55.2px] font-['General Sans']">Testimonial</h1>
        </div>
        <div className="text text-center mb-10" data-aos="fade-up" data-aos-delay="100">
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Hear from students who've successfully navigated their study abroad journeys. From cultural immersion to
            academic growth, our testimonials
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Card 1 */}
              <div
                className="bg-white rounded-[32px] shadow-md hover:shadow-lg transition-all duration-300 p-6"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={AlbertFlores || "/placeholder.svg"}
                    alt="Albert Flores"
                    className="w-20 h-20 rounded-full object-cover mb-4"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                  />
                  <div className="flex justify-center mb-2" data-aos="fade-up" data-aos-delay="500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1" data-aos="fade-up" data-aos-delay="550">
                    Albert Flores
                  </h5>
                  <p className="text-gray-600 text-sm mb-4" data-aos="fade-up" data-aos-delay="600">
                    Head of Training & Dev, at Global Tech
                  </p>
                  <p className="text-gray-700 text-center" data-aos="fade-up" data-aos-delay="650">
                    ProctorTech has revolutionized our employee certification process. We can now deliver secure
                    assessments has revolutionized our employee certification process now deliver secure assessments.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="bg-white rounded-[32px] shadow-md hover:shadow-lg transition-all duration-300 p-6"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={WadeWarren || "/placeholder.svg"}
                    alt="Wade Warren"
                    className="w-20 h-20 rounded-full object-cover mb-4"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  />
                  <div className="flex justify-center mb-2" data-aos="fade-up" data-aos-delay="600">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1" data-aos="fade-up" data-aos-delay="650">
                    Wade Warren
                  </h5>
                  <p className="text-gray-600 text-sm mb-4" data-aos="fade-up" data-aos-delay="700">
                    Head of Training & Dev, at Global Tech
                  </p>
                  <p className="text-gray-700 text-center" data-aos="fade-up" data-aos-delay="750">
                    ProctorTech has revolutionized our employee certification process. We can now deliver secure
                    assessments has revolutionized our employee certification process now deliver secure assessments.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Column - Featured Testimonial */}
            <div className="flex items-center justify-center">
              <div
                className="bg-white rounded-[32px] shadow-lg hover:shadow-xl transition-all duration-300 p-7 relative"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 text-gray-700 rounded-full px-4 py-1 text-sm font-medium shadow-sm flex items-center"
                  data-aos="fade-down"
                  data-aos-delay="400"
                >
                  <span className="inline-block w-2 h-2 bg-[rgba(248,145,1,1)] rounded-full mr-2"></span>
                  Student
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={DSG || "/placeholder.svg"}
                    alt="Darlene Kane Robertson"
                    className="w-28 h-28 rounded-full object-cover mb-6"
                    data-aos="flip-left"
                    data-aos-delay="300"
                  />
                  <div className="flex justify-center mb-3" data-aos="fade-up" data-aos-delay="400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <h5 className="font-semibold text-gray-800 text-lg mb-2" data-aos="fade-up" data-aos-delay="450">
                    Darlene Kane Robertson
                  </h5>
                  <div
                    className="bg-white border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm flex items-center mb-6"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <span className="inline-block w-2 h-2 bg-[rgba(248,145,1,1)] rounded-full mr-2"></span>
                    University of Windsor
                  </div>

                  <p className="text-gray-700 text-center mb-6" data-aos="fade-up" data-aos-delay="550">
                    EduBrink made my dream of studying abroad a reality. Their personalized guidance helped me navigate
                    the complex application process and secure admission to my dream university.
                  </p>

                  <button
                    className="bg-gradient-to-r from-[#380C95] to-[#E15754] text-white px-5 py-2 rounded-full hover:shadow-md transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Card 3 */}
              <div
                className="bg-white rounded-[32px] shadow-md hover:shadow-lg transition-all duration-300 p-6"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={RS || "/placeholder.svg"}
                    alt="Darlene Robertson"
                    className="w-20 h-20 rounded-full object-cover mb-4"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                  />
                  <div className="flex justify-center mb-2" data-aos="fade-up" data-aos-delay="500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1" data-aos="fade-up" data-aos-delay="550">
                    Darlene Robertson
                  </h5>
                  <p className="text-gray-600 text-sm mb-4" data-aos="fade-up" data-aos-delay="600">
                    Head of Training & Dev, at Global Tech
                  </p>
                  <p className="text-gray-700 text-center" data-aos="fade-up" data-aos-delay="650">
                    ProctorTech has revolutionized our employee certification process. We can now deliver secure
                    assessments has revolutionized our employee certification process now deliver secure assessments.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div
                className="bg-white rounded-[32px] shadow-md hover:shadow-lg transition-all duration-300 p-6"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={RobertFox || "/placeholder.svg"}
                    alt="Robert Fox"
                    className="w-20 h-20 rounded-full object-cover mb-4"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  />
                  <div className="flex justify-center mb-2" data-aos="fade-up" data-aos-delay="600">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <h5 className="font-semibold text-gray-800 mb-1" data-aos="fade-up" data-aos-delay="650">
                    Robert Fox
                  </h5>
                  <p className="text-gray-600 text-sm mb-4" data-aos="fade-up" data-aos-delay="700">
                    Head of Training & Dev, at Global Tech
                  </p>
                  <p className="text-gray-700 text-center" data-aos="fade-up" data-aos-delay="750">
                    ProctorTech has revolutionized our employee certification process. We can now deliver secure
                    assessments has revolutionized our employee certification process now deliver secure assessments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutTestimonal

