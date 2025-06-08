const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[#0060a1] to-[#1887c3] rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#d20a11] rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#0060a1] rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Message */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-[#0060a1] to-[#d20a11] bg-clip-text text-transparent">
            No Active Masterclasses
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-2">Amazing courses are coming soon!</p>
        <p className="text-gray-500">Stay tuned for our next batch of premium masterclasses</p>
      </div>

      {/* Animated Cards Preview */}
      <div className="relative mb-8">
        <div className="flex space-x-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-16 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse shadow-lg"
              style={{
                animationDelay: `${index * 0.5}s`,
                animationDuration: '2s'
              }}
            >
              <div className="w-full h-8 bg-gradient-to-r from-[#0060a1]/20 to-[#d20a11]/20 rounded-t-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#0060a1]/5 to-[#d20a11]/5 border border-[#0060a1]/20 rounded-xl p-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#d20a11] rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
            </svg>
          </div>
        </div>
        <p className="text-[#0060a1] font-semibold mb-2">
          🚀 Get notified when new masterclasses launch
        </p>
        <p className="text-gray-600 text-sm">
          Follow us on social media or check back regularly for updates
        </p>
      </div>
    </div>
  );
};

export default EmptyState;