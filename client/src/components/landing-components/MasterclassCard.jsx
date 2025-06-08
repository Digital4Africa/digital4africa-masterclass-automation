import { useNavigate } from "react-router-dom";
import scrollToTop from "../../utils/scrollToTop";

const MasterclassCard = ({ cohort }) => {
  const navigate = useNavigate();

  const getStatus = () => {
    const today = new Date();
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);

    if (today < startDate) {
      return { status: 'upcoming', label: 'UPCOMING', color: 'blue' };
    } else if (today >= startDate && today <= endDate) {
      return { status: 'ongoing', label: 'ONGOING', color: 'green' };
    } else {
      return { status: 'completed', label: 'COMPLETED', color: 'gray' };
    }
  };

  const { status, label, color } = getStatus();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleEnrollClick = () => {
    navigate(`/checkout/${cohort.cohortId}`);
    scrollToTop()
  };

  const getStatusStyles = () => {
    switch (color) {
      case 'blue':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          button: 'bg-[#0060a1] hover:bg-[#005589] text-white', // Changed to D4A blue
          accent: 'border-blue-200'
        };
      case 'green':
        return {
          badge: 'bg-green-100 text-green-800 border-green-200',
          button: 'bg-gray-400 cursor-not-allowed text-white',
          accent: 'border-green-200'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          button: 'bg-gray-400 cursor-not-allowed text-white',
          accent: 'border-gray-200'
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${styles.accent} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full`}>
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={cohort.masterclassHeroImg}
          alt={cohort.masterclassTitle}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
          {cohort.masterclassTitle}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {cohort.masterclassDescription}
        </p>

        {/* Dates */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Start:</span> {formatDate(cohort.startDate)}
          </div>
          <div>
            <span className="font-medium">End:</span> {formatDate(cohort.endDate)}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#d20a11]">
            {formatPrice(cohort.masterclassPrice)}
          </div>

          <button
            onClick={handleEnrollClick}
            disabled={status === 'ongoing' || status === 'completed'}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${styles.button} ${
              status === 'ongoing' || status === 'completed'
                ? 'transform-none'
                : 'hover:transform hover:scale-105'
            }`}
          >
            {status === 'ongoing' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterclassCard;