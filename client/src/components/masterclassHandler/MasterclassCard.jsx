import React from 'react';

const MasterclassCard = ({ masterclass, onEdit, onCopyLink }) => {
  const startDate = new Date(masterclass.startDate);
  const endDate = new Date(masterclass.endDate);
  const currentDate = new Date();

  const enrolledStudents = Math.floor(Math.random() * 50) + 10;

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getStatus = () => {
    if (currentDate < startDate) {
      return {
        status: 'upcoming',
        label: 'Upcoming',
        dateText: `Starts on ${formatDate(startDate)}`,
        color: 'bg-blue-100 text-blue-800'
      };
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return {
        status: 'inprogress',
        label: 'In Progress',
        dateText: `Ends on ${formatDate(endDate)}`,
        color: 'bg-orange-100 text-orange-800'
      };
    } else {
      return {
        status: 'ended',
        label: 'Ended',
        dateText: `Ended on ${formatDate(endDate)}`,
        color: 'bg-gray-100 text-gray-800'
      };
    }
  };

  const statusInfo = getStatus();
  const isCopyDisabled = statusInfo.status === 'inprogress' || statusInfo.status === 'ended';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      {masterclass.heroImage && (
        <div className="h-40 overflow-hidden">
          <img
            src={masterclass.heroImage}
            alt={masterclass.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex flex-col h-full">
        {/* Upper content - will grow to push lower content down */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-[var(--d4a-blue)]">{masterclass.title}</h2>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{masterclass.description}</p>
        </div>

        {/* Lower content - will stay at bottom */}
        <div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {statusInfo.dateText}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ksh {masterclass.price}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {enrolledStudents} students enrolled
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(masterclass)}
              className="btn-primary text-sm px-3 py-1 flex-1"
            >
              Edit
            </button>
            <button
              onClick={() => onCopyLink(masterclass._id)}
              disabled={isCopyDisabled}
              className={`text-sm px-3 py-1 flex-1 ${
                isCopyDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-secondary'
              }`}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterclassCard;