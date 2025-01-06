import React from 'react'
import ResultUnivrsiry from './University'
import ResultsCorses from './Resultscorse'
import RecentBlog from '../../Home/RecentBlog'



function Results() {
  return (
    <div className='bg-transparent'>
      <ResultsCorses/>
<ResultUnivrsiry/>
<RecentBlog/>
    </div>
  )
}

export default Results