import React, { useState } from 'react';
import MasterclassStudentTable from './MasterclassStudentTable';
import masterclasses from '../../data/masterclasses';

// Sample data structure
const sampleMasterclasses = masterclasses

const StudentsOverview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Categorize masterclasses
  const now = new Date();

  const inProgressMasterclasses = sampleMasterclasses.filter(mc =>
    new Date(mc.startDate) <= now && new Date(mc.endDate) >= now
  );

  const upcomingMasterclasses = sampleMasterclasses.filter(mc =>
    new Date(mc.startDate) > now
  );

  const pastMasterclasses = sampleMasterclasses.filter(mc =>
    new Date(mc.endDate) < now
  );

  const paginatedPastMasterclasses = pastMasterclasses.slice(
    0, currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--d4a-black)]">Students Management</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search students..."
            className="input-field pl-10 pr-4 py-2 w-full"
          />
          <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* In Progress Masterclasses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--d4a-blue)]">Currently Running Masterclasses</h2>
        {inProgressMasterclasses.length > 0 ? (
          inProgressMasterclasses.map(masterclass => (
            <MasterclassStudentTable
              key={masterclass._id}
              masterclass={masterclass}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No masterclasses currently in progress
          </div>
        )}
      </div>

      {/* Upcoming Masterclasses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--d4a-blue)]">Upcoming Masterclasses</h2>
        {upcomingMasterclasses.length > 0 ? (
          upcomingMasterclasses.map(masterclass => (
            <MasterclassStudentTable
              key={masterclass._id}
              masterclass={masterclass}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No upcoming masterclasses
          </div>
        )}
      </div>

      {/* Past Masterclasses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--d4a-blue)]">Past Masterclasses</h2>
          {pastMasterclasses.length > itemsPerPage && (
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="text-sm text-[var(--d4a-blue)] hover:text-[#005589] font-medium"
              disabled={currentPage * itemsPerPage >= pastMasterclasses.length}
            >
              Load More
            </button>
          )}
        </div>
        {paginatedPastMasterclasses.length > 0 ? (
          paginatedPastMasterclasses.map(masterclass => (
            <MasterclassStudentTable
              key={masterclass._id}
              masterclass={masterclass}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No past masterclasses
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsOverview;