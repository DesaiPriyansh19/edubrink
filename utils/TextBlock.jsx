import React from "react";

export default function TextBlock({ children, className = "", language }) {
  return (
    <p
      className={`${
        language === "ar" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </p>
  );
}
