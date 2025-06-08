const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
          {/* Hero Image Skeleton */}
          <div className="h-48 bg-gray-200 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="p-6">
            {/* Title Skeleton */}
            <div className="h-6 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg mb-4 w-3/4 animate-pulse"></div>

            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>

            {/* Dates Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Price and Button Skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;