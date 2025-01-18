import React from 'react'

function Calander({color}) {
  return (
    <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V5" stroke={color?color:"#1D211C"}/>
    <path d="M16 2V5" stroke={color?color:"#1D211C"}/>
    <path d="M3.5 9.08997H20.5" stroke={color?color:"#1D211C"}/>
    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke={color?color:"#1D211C"} />
    <path d="M15.6947 13.7H15.7037" stroke={color?color:"#1D211C"}/>
    <path d="M15.6947 16.7H15.7037" stroke={color?color:"#1D211C"}/>
    <path d="M11.9955 13.7H12.0045" stroke={color?color:"#1D211C"}/>
    <path d="M11.9955 16.7H12.0045" stroke={color?color:"#1D211C"}/>
    <path d="M8.29431 13.7H8.30329" stroke={color?color:"#1D211C"}/>
    <path d="M8.29431 16.7H8.30329" stroke={color?color:"#1D211C"}/>
    </svg>
    </div>
  )
}

export default Calander