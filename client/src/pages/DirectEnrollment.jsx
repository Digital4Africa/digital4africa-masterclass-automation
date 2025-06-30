import React from 'react';
import { useSelector } from 'react-redux';
import { directEnrollStudent } from '../utils/directEnrollStudent';
import DirectEnrollmentForm from '../components/direct-enrollment/DirectEnrollmentForm';

function DirectEnrollment() {
  const { allCohorts, loading } = useSelector((state) => state.cohorts);

  // Filter active cohorts (same logic as before)
  const activeCohorts = allCohorts.filter(({ startDate, endDate }) => {
    const now = Date.now();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return now < start || (now >= start && now <= end);
  });

  const handleEnroll = async (formData) => {
    return await directEnrollStudent(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0060a1]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">


      <DirectEnrollmentForm
        cohorts={activeCohorts}
        onSubmit={handleEnroll}
      />
    </div>
  );
}

export default DirectEnrollment;