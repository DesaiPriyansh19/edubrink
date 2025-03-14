import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

function NoResultsFound({ language }) {
  const { t } = useTranslation();
  const { setFilterProp, initialState } = useSearch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#380C95]/5 to-[#E15754]/5 rounded-full animate-pulse"></div>

          {/* Magnifying glass with animated search */}
          <div className="relative">
            <div className="w-32 h-32 border-8 border-gray-300 rounded-full"></div>
            <div className="absolute top-[70%] -right-8 w-8 h-24 bg-gray-300 rounded-full transform rotate-45"></div>

            {/* Animated question mark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-gray-400 font-bold animate-bounce">
                ?
              </span>
            </div>

            {/* Animated pulsing circles */}
            <div className="absolute inset-0 border-8 border-transparent rounded-full animate-ping opacity-20 border-t-[#380C95] border-r-[#E15754]"></div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-10 w-6 h-6 rounded-full bg-[#380C95]/20 animate-float"></div>
        <div className="absolute bottom-10 left-0 w-4 h-4 rounded-full bg-[#E15754]/20 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-[#9C27B0]/20 animate-float animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="text-center max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("noResultsFound") || "No Matches Found"}
        </h2>

        <div className="w-20 h-1 bg-gradient-to-r from-[#380C95] to-[#E15754] mx-auto rounded-full mb-4"></div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {t("noResultsDescription") ||
            "We couldn't find any matches for your current search criteria. Try adjusting your filters or search terms for better results."}
        </p>

        {/* Tips card */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#380C95]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {t("searchTips") || "Search Tips"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#380C95]/10 flex items-center justify-center mr-3">
                <span className="text-[#380C95] font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">
                {t("tryBroaderSearch") || "Try using more general keywords"}
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E15754]/10 flex items-center justify-center mr-3">
                <span className="text-[#E15754] font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">
                {t("checkSpelling") || "Check your spelling"}
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#380C95]/10 flex items-center justify-center mr-3">
                <span className="text-[#380C95] font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">
                {t("fewerFilters") || "Use fewer filters"}
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E15754]/10 flex items-center justify-center mr-3">
                <span className="text-[#E15754] font-bold">4</span>
              </div>
              <p className="text-sm text-gray-600">
                {t("differentLocation") || "Try a different location"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setFilterProp(initialState);
              navigate(`/${language}/searchresults`);
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#380C95] to-[#E15754] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {t("clearFilters") || "Clear All Filters"}
          </button>

          <Link to={`/${language}`}>
            <button className="px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {t("backToHome") || "Back to Home"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoResultsFound;
