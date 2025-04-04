import React from "react";

const LanguageLogo = ({ color, width, height }) => {
  return (
    <div>
      <svg
        width={width ? width : "24"}
        height={height ? height : "24"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9917 8.96002H7.01172"
          stroke={`${color ? color : "#1D211C"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7.28003V8.96002"
          stroke={`${color ? color : "#1D211C"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 8.94C14.5 13.24 11.14 16.72 7 16.72"
          stroke={`${color ? color : "#1D211C"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9992 16.72C15.1992 16.72 13.5992 15.76 12.4492 14.25"
          stroke={`${color ? color : "#1D211C"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
          stroke={`${color ? color : "#1D211C"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LanguageLogo;
