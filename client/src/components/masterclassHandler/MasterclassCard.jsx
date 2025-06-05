import { useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";

const MasterclassCard = ({ masterclass }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      {masterclass.heroImage && (
        <div className="h-70 overflow-hidden relative group">
          <img
            src={masterclass.heroImage}
            alt={masterclass.title}
            className="w-full h-full object-cover"
          />
          {/* Floating Action Icons */}
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => navigate(`/admin-home/masterclasses/${masterclass._id}/edit`)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              title="Edit masterclass"
            >
              <Edit3 size={16} className="text-gray-700 hover:text-blue-600" />
            </button>
            <button
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              title="Delete masterclass"
            >
              <Trash2 size={16} className="text-gray-700 hover:text-red-600" />
            </button>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-[var(--d4a-blue)] flex-1 pr-3">
            {masterclass.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {masterclass.description}
        </p>

        {/* Price */}
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Ksh {masterclass.price}
        </div>
      </div>
    </div>
  );
};

export default MasterclassCard;