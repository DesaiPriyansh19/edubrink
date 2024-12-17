import { useState } from "react";

function SideBar() {
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  return (
    
    <div>
            <div className="w-full z-10 bg-[#f8f8f8] p-4 absolute top-full left-0">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-1/5">
                <img src="/path/to/sm-logo1.png" alt="Small Logo 1" className="w-full" />
              </div>
              <p className="ml-4">Text for logo 1</p>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setOpenDropdown(openDropdown === 1 ? null : 1)}
            >
              <div className="w-1/5">
                <img src="/path/to/sm-logo2.png" alt="Small Logo 2" className="w-full" />
              </div>
              <p className="ml-4">Text for logo 2</p>
            </div>
            {openDropdown === 1 && (
              <div className="ml-8 bg-gray-600 p-2 rounded">
                <p>Dropdown content for logo 2</p>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-1/5">
                <img src="/path/to/sm-logo3.png" alt="Small Logo 3" className="w-full" />
              </div>
              <p className="ml-4">Text for logo 3</p>
            </div>
            {openDropdown === 3 && (
              <div className="ml-8  p-2 rounded">
                <p>Dropdown content for logo 3</p>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default SideBar