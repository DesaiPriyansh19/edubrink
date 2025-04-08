"use client"

import { useRef, useState } from "react"
import { Search, X } from "lucide-react"

export const SearchDropdown = ({
  searchTerm,
  onSearch,
  onSelectResult,
  results,
  getIconForType,
  placeholder = "Search...",
  language = "en",
  isLoading = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const handleKeyDown = (e) => {
    if (!results.length) return

    if (e.key === "Enter" && selectedIndex !== null) {
      onSelectResult(results[selectedIndex])
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex === null ? 0 : Math.min(prevIndex + 1, results.length - 1)

        // Delay scrolling to ensure element exists
        setTimeout(() => {
          if (dropdownRef.current) {
            const items = dropdownRef.current.querySelectorAll(".dropdown-item")
            if (items[newIndex]) {
              items[newIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              })
            }
          }
        }, 50)

        return newIndex
      })
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : 0

        setTimeout(() => {
          if (dropdownRef.current) {
            const items = dropdownRef.current.querySelectorAll(".dropdown-item")
            if (items[newIndex]) {
              items[newIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              })
            }
          }
        }, 50)

        return newIndex
      })
    }
  }

  return (
    <div className="relative w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Search Input with enhanced styling */}
      <div className="relative group">
        <div
          className={`absolute z-10 ${language === "ar" ? "right-0 pr-4" : "left-0 pl-4"} inset-y-0  flex items-center pl-4 pointer-events-none`}
        >
          <Search
            className={`w-5 h-5 transition-colors duration-200 ${isFocused ? "text-blue-500" : "text-gray-900"}`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown} // ✅ Directly use `handleKeyDown` here
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={`
            w-full py-2.5 pl-12 pr-12
            bg-white/80 backdrop-blur-sm
            border border-gray-200
            rounded-full
            text-gray-900 placeholder:text-gray-500
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
            focus:bg-white/95
            group-hover:border-gray-300
            ${isFocused ? "shadow-lg shadow-blue-50" : "shadow-sm"}
          `}
        />
        {searchTerm && (
          <button
            onClick={() => onSearch("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 transition-opacity duration-200"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
      </div>

      {/* Enhanced Results Dropdown */}
      <div
        className={`
          absolute z-10 w-full mt-2
          overflow-x-hidden
          bg-white/95 backdrop-blur-sm
          border border-gray-200 rounded-xl
          shadow-lg shadow-gray-100/50
          transition-all duration-200 ease-in-out
          ${
            isFocused && (isLoading || results.length > 0)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* Results Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100/80">
          {isLoading ? (
            <span className="text-xs font-medium text-gray-500">Loading results...</span>
          ) : (
            <span className="text-xs font-medium text-gray-500">{results.length} results</span>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 rounded-md">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 rounded-md">↵</kbd>
            <span>to select</span>
          </span>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Results List with enhanced animations */}
        {!isLoading && (
          <div ref={dropdownRef} className="max-h-[calc(100vh-280px)] overflow-y-auto overscroll-contain">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`
                    dropdown-item group flex items-center justify-between
                    px-4 py-3 cursor-pointer
                    transition-colors duration-150 ease-in-out
                    ${index === selectedIndex ? "bg-blue-50/80" : "hover:bg-gray-50/80"}
                    ${index !== results.length - 1 ? "border-b border-gray-100/60" : ""}
                  `}
                  onClick={() => onSelectResult(result)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`
                      flex items-center justify-center
                      w-8 h-8 rounded-lg
                      ${index === selectedIndex ? "bg-blue-100/50" : "bg-gray-100/50"}
                      transition-colors duration-150
                    `}
                    >
                      {getIconForType(result.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">{result.keyword}</span>
                  </div>
                  <span
                    className={`
                    text-xs text-gray-500
                    px-2 py-1 rounded-full
                    ${index === selectedIndex ? "bg-blue-100/50" : "bg-gray-100/50"}
                    transition-colors duration-150
                  `}
                  >
                    ...{result.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No results found</p>
                <p className="text-sm mt-2">Try different keywords or check spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
