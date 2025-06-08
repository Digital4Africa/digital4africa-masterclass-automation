import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CheckoutForm from "../components/checkout-components/CheckoutForm";
import CountdownTimer from "../components/checkout-components/CountdownTimer";
import MasterclassInfo from "../components/checkout-components/MasterclassInfo";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {cohortId} = useParams()
  console.log("cohortId: ", cohortId);
  const { studentsCohorts, loading } = useSelector((state) => state.studentsCohorts);

  // Find the cohort by ID from the live data
  const cohortData = studentsCohorts?.find(cohort => cohort.cohortId === cohortId);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-24 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-32 h-12 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-24 hidden md:block"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column skeleton */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
              <div className="w-3/4 h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="w-24 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Column skeleton */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-2/3 h-8 bg-gray-300 rounded animate-pulse mb-6"></div>
              <div className="w-full h-12 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-12 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Not found component
  const MasterclassNotFound = () => (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button and centered logo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[#d20a11] hover:text-[#9e0006] transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            View more
          </button>

          <div className="flex-1 flex justify-end md:justify-center">
            <img
              src="https://res.cloudinary.com/diizjejos/image/upload/v1746761694/logo_b6qvn2.png"
              alt="Digital4Africa"
              className="h-12"
            />
          </div>

          {/* Empty div for balance */}
          <div className="w-24 hidden md:block"></div>
        </div>

        {/* Not found card */}
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Masterclass Not Found</h2>
            <p className="text-gray-600 mb-6">
              The masterclass you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#d20a11] text-white px-6 py-3 rounded-lg hover:bg-[#9e0006] transition-colors"
            >
              Browse Available Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show not found card if cohort doesn't exist
  if (!cohortData) {
    return <MasterclassNotFound />;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button and centered logo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[#d20a11] hover:text-[#9e0006] transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            View more
          </button>

          <div className="flex-1 flex justify-end md:justify-center">
            <img
              src="https://res.cloudinary.com/diizjejos/image/upload/v1746761694/logo_b6qvn2.png"
              alt="Digital4Africa"
              className="h-12"
            />
          </div>

          {/* Empty div for balance */}
          <div className="w-24 hidden md:block"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Masterclass Info */}
          <div className="lg:w-1/2">
            <MasterclassInfo
              title={cohortData.masterclassTitle}
              description={cohortData.masterclassDescription}
              image={cohortData.masterclassHeroImg}
              price={cohortData.masterclassPrice}
            />
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Enrollment</h2>

              <CountdownTimer startDate={cohortData.startDate} />

              <CheckoutForm
                price={cohortData.masterclassPrice}
                startDate={cohortData.startDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;