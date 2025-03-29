import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  let pathSegments = location.pathname.split("/").filter(Boolean);

  console.log("Original Path Segments:", pathSegments); // Debugging

  // Define language codes
  const languageCodes = ["en", "ar"];

  // Remove the first segment if it's a language code
  if (pathSegments.length > 0 && languageCodes.includes(pathSegments[0])) {
    pathSegments.shift(); // Removes the first element
  }

  console.log("Filtered Path Segments:", pathSegments); // Debugging

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex items-center text-sm text-gray-600 mb-6">
        {/* Home Icon */}
        <Link to="/" className="flex items-center">
          <Home className="w-4 h-4" />
          <span className="mx-2">&gt;</span>
        </Link>

        {/* Dynamic Breadcrumb */}
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <div key={path} className="flex items-center">
              {!isLast ? (
                <Link to={path} className="text-gray-600 hover:underline">
                  {decodeURIComponent(segment)}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">
                  {decodeURIComponent(segment)}
                </span>
              )}
              {!isLast && <span className="mx-2">&gt;</span>}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
