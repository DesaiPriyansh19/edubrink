import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Discover from './Discover';
import CarouselSection from './CarouselSection';
import OurStatastics from './OurStatastics';
import HowToApply from './HowToApply';
import CollegeCarousel from './CollageCard';
import HowWeWork from './HowWeWork';
import OurCourses from './OurCourses';
import FindCourses from './FindCourses';
import RecentBlog from './RecentBlog';
import ContactSection from '../ContactSection';


function HomePage() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Default animation duration
      offset: 100, // Trigger animations 100px before the element is visible
      easing: 'ease-in-out', // Easing for animations
      once: true, // Run animation only once
    });
  }, []);

  return (
    <>
    <div className="space-y-12">
   
      <div data-aos="fade-in" data-aos-delay="150">
        <Discover />
      </div>

      <div data-aos="fade-up" data-aos-delay="300">
        <CarouselSection />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <OurStatastics />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <HowToApply />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <CollegeCarousel />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <HowWeWork />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <OurCourses />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <FindCourses />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <RecentBlog />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
      <ContactSection/>
      </div>
    </div></>
  );
}

export default HomePage;
