import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import SmartTooltip from '../../utils/SmartTooltip';

const StudentsOverview = () => {
  const { allCohorts, loading } = useSelector((state) => state.cohorts);
  console.log("allCohorts", allCohorts);

  if (loading) return <div className="text-center py-8">Loading cohorts...</div>;

  const truncateText = (text, maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Categorize cohorts
  const now = new Date();

  const ongoingCohorts = allCohorts.filter(cohort => {
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);
    return start <= now && end >= now;
  });

  const upcomingCohorts = allCohorts.filter(cohort =>
    new Date(cohort.startDate) > now
  );

  const allRelevantCohorts = [...ongoingCohorts, ...upcomingCohorts];

  const getStatus = (cohort) => {
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);

    if (start > now) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (end < now) return { text: 'Completed', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Ongoing', color: 'bg-green-100 text-green-800' };
  };

  const getPaymentStatus = (student, cohort) => {
    const payment = cohort.payments?.find(p => p.email === student.email) || {};
    const amountPaid = payment.amount || 0;
    const discount = payment.discount || 0;
    const balance = cohort.masterclassPrice - amountPaid - discount;

    let paymentStatus = 'unpaid';
    if (amountPaid + discount >= cohort.masterclassPrice) paymentStatus = 'full';
    else if (amountPaid > 0) paymentStatus = 'partial';

    return { paymentStatus, amountPaid, discount, balance };
  };

  const paymentStatusColors = {
    full: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-red-100 text-red-800'
  };

  const paymentStatusLabels = {
    full: 'Paid',
    partial: 'Partial',
    unpaid: 'Unpaid'
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Students</h1>

      {allRelevantCohorts.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Single Table Header */}
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Amount Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Balance</th>
              </tr>
            </thead>
            <tbody>
              {allRelevantCohorts.map((cohort, cohortIndex) => {
                const status = getStatus(cohort);

                return (
                  <React.Fragment key={cohort._id}>
                    {/* Masterclass Header Row */}
                    <tr className="bg-gray-25 border-t-2 border-gray-200">
                      <td colSpan="6" className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <SmartTooltip content={cohort.masterclassTitle}>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {truncateText(cohort.masterclassTitle, 50)}
                              </h3>
                            </SmartTooltip>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(cohort.startDate), 'MMM d')} - {format(new Date(cohort.endDate), 'MMM d, yyyy')} |
                            Price: Kes {cohort.masterclassPrice?.toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Students Rows */}
                    {cohort.students && cohort.students.length > 0 ? (
                      cohort.students.map((student, studentIndex) => {
                        const { paymentStatus, amountPaid, discount, balance } = getPaymentStatus(student, cohort);

                        return (
                          <tr key={`${cohort._id}-${student.email || studentIndex}`} className="hover:bg-gray-50 border-l-4 border-l-transparent hover:border-l-blue-200">
                            <td className="px-4 py-3 w-1/4">
                              <div className="flex items-center space-x-3">

                                <SmartTooltip content={student.fullName}>
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {truncateText(student.fullName, 20)}
                                  </div>
                                </SmartTooltip>
                              </div>
                            </td>
                            <td className="px-4 py-3 w-1/4">
                              <div className="space-y-1">
                                <SmartTooltip content={student.email}>
                                  <div className="text-sm text-gray-900 truncate">
                                    {truncateText(student.email, 35)}
                                  </div>
                                </SmartTooltip>
                                <div className="text-xs text-gray-500">
                                  {student.phone || '-'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 w-16">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[paymentStatus]}`}>
                                {paymentStatusLabels[paymentStatus]}
                              </span>
                            </td>
                            <td className="px-4 py-3 w-20 text-sm font-medium text-gray-900">
                              Kes {amountPaid.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 w-20 text-sm text-gray-900">
                              {discount > 0 ? `Kes ${discount.toLocaleString()}` : '0'}
                            </td>
                            <td className="px-4 py-3 w-20 text-sm font-medium text-gray-900">
                              {balance > 0 ? `Kes ${balance.toLocaleString()}` : 'Paid'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-l-4 border-l-transparent">
                        <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500 italic">
                          No students enrolled
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No ongoing or upcoming cohorts
        </div>
      )}
    </div>
  );
};

export default StudentsOverview;