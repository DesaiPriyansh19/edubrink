const CountrySkeletonLoader = () => (
    <div className="max-w-[1240px] mx-auto px-5 py-8 font-sans">
      {/* Breadcrumb */}
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
  
      {/* Image */}
      <div className="w-full rounded-lg overflow-hidden mb-6">
        <div className="w-full h-64 bg-gray-200 rounded"></div>
      </div>
  
      {/* Title & Button */}
      <div className="mb-8 flex items-center">
        <div className="w-64 h-8 bg-gray-200 rounded"></div>
        <div className="ml-4 w-32 h-10 bg-gray-200 rounded"></div>
      </div>
  
      {/* Overview Text */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
  
      {/* Key Facts */}
      <div className="text-sm mb-4 flex items-center">
        <div className="flex items-center me-4">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
  
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-gray-200">
          <div className="mr-3 w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-gray-200">
          <div className="mr-3 w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-gray-200">
          <div className="mr-3 w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-gray-200">
          <div className="mr-3 w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
  
      {/* Additional Text Sections */}
      <div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
      </div>
    </div>
  );
  
  export default CountrySkeletonLoader;
  