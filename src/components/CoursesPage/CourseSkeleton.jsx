import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CourseSkeleton = () => (
  <div className="min-h-screen font-sans">
    {/* Course Type Banner */}
  

    {/* Breadcrumb Navigation */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <Skeleton height={20} width="60%" className="mb-6" />

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton height={24} width="40%" className="mb-2" />
            <Skeleton height={32} width="80%" className="mb-4" />

            <div className="flex items-center gap-2 mb-2">
              <Skeleton circle height={28} width={28} />
              <Skeleton height={20} width="50%" />
            </div>
          </div>
          <Skeleton height={40} width={100} className="hidden md:block" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Course Description - 2/3 width on desktop */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Skeleton height={300} className="w-full rounded-xl mb-8" />

          <div className="p-6 mb-8">
            <Skeleton count={4} height={14} className="mb-2" />
            <Skeleton height={14} width="40%" />
          </div>

          {/* Requirements Section */}
          <div className="p-6">
            <Skeleton height={24} width="30%" className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton height={40} className="w-full rounded-lg" />
              <Skeleton height={40} className="w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Course Details Card - 1/3 width on desktop */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Skeleton height={150} className="w-full rounded-xl mb-6" />

          <div className="p-6 space-y-4">
            <Skeleton height={20} width="50%" />
            <Skeleton height={20} width="50%" />
            <Skeleton height={20} width="50%" />
          </div>

          {/* Apply Button */}
          <Skeleton height={40} width="100%" className="mt-4 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default CourseSkeleton;
