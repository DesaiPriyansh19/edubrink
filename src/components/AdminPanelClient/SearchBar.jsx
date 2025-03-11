import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  BarChart2,
  ShoppingCart,
  FileText,
  UserPlus,
  Mail,
  LogIn,
  PieChart,
  Search,
  X,
  Landmark,
} from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const SearchBar = ({ searchBar, setSearchBar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null); // Ref for the entire search bar container

  useEffect(() => {
    const handleEvent = (event) => {
      // Close if Escape key is pressed

      if (searchBar && inputRef.current) {
        inputRef.current.focus(); // Auto-focus the input when searchBar is true
      }

      if (event.type === "keydown" && event.key === "Escape") {
        setSearchBar(false);
      }

      // Close if clicked outside the container
      if (
        event.type === "mousedown" &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearchBar(false);
      }
    };

    if (searchBar) {
      document.addEventListener("keydown", handleEvent);
      document.addEventListener("mousedown", handleEvent);
    }

    return () => {
      document.removeEventListener("keydown", handleEvent);
      document.removeEventListener("mousedown", handleEvent);
    };
  }, [searchBar]);

  const SearchBarOptions = [
    {
      title: "POPULAR SEARCHES",
      items: [
        {
          name: "Add University",
          icon: <Calendar className="w-4 h-4 text-gray-400" />,
        },
        {
          name: "Add Countries",
          icon: <BarChart2 className="w-4 h-4 text-gray-400" />,
        },
        {
          name: "Add Faculty",
          icon: <ShoppingCart className="w-4 h-4 text-gray-400" />,
        },
        {
          name: "Add Major",
          icon: <FileText className="w-4 h-4 text-gray-400" />,
        },
        {
          name: "Add Article",
          icon: <FileText className="w-4 h-4 text-gray-400" />,
        },
        {
          name: "Add User",
          icon: <UserPlus className="w-4 h-4 text-gray-400" />,
        }, // Changed to UserPlus
      ],
    },
    {
      title: "APPS & PAGES",
      items: [
        {
          name: "Universities",
          icon: <Landmark className="w-4 h-4 text-gray-400" />,
        }, // Chat icon
        { name: "Emails", icon: <Mail className="w-4 h-4 text-gray-400" /> },
        { name: "Sign Out", icon: <LogIn className="w-4 h-4 text-gray-400" /> },
        {
          name: "Analytics",
          icon: <PieChart className="w-4 h-4 text-gray-400" />,
        },
      ],
    },
  ];

  // Filter items based on search query
  const filteredOptions = SearchBarOptions.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-in-out", // Easing type
      once: false, // Whether animation should happen only once
    });
  }, []);

  if (!searchBar) {
    return null;
  }

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-md fixed inset-0 flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-[600px] bg-white rounded-lg shadow-lg p-6"
        data-aos={searchBar ? "fade-up" : "fade-out"} // Add AOS animation
        data-aos-duration="300" // Animation duration
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-300 pb-2">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            ref={inputRef}
            type="text"
            className="w-full outline-none text-lg"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end items-center gap-1 ">
            <p className="text-gray-500 text-sm">[esc]</p>
            <button onClick={() => setSearchBar(false)}>
              <X className="text-gray-500 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
          {filteredOptions.map((search, idx) => (
            <div key={idx}>
              <h3 className="text-gray-500 font-semibold mb-2">
                {search.title}
              </h3>
              <ul className="space-y-1">
                {search.items.map((item, itemidx) => (
                  <li
                    key={itemidx}
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
                  >
                    {item.icon} {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
