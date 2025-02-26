import { useEffect, useRef } from "react";

const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setTimeout(() => handler(), 100); // Small delay before closing
        }
      };
  

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
};

export default useClickOutside;
