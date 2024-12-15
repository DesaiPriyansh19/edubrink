import React from 'react'
import Discover from './Discover'
import CarouselSection from './CarouselSection'
import OurStatastics from './OurStatastics'
import HowToApply from './HowToApply'
import CollegeCarousel from './CollageCard'
import HowWeWork from './HowWeWork'
import OurCourses from './OurCourses'
import FindCourses from './FindCourses'
import RecentBlog from './RecentBlog'

function HomePage() {
  return (
<>
<Discover/>
<CarouselSection/>
<OurStatastics/>
<HowToApply/>
<CollegeCarousel/>
<HowWeWork/> 
<OurCourses/>
<FindCourses/>
<RecentBlog/>
</>
  )
}

export default HomePage