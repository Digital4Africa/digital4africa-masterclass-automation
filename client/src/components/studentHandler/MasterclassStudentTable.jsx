import React from 'react';
import { format } from 'date-fns';
import StudentRow from './StudentRow';
import SmartTooltip from '../../utils/SmartTooltip';

const MasterclassStudentTable = ({ cohort }) => {
  const truncateText = (text, maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatus = () => {
    const now = new Date();
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);

    if (start > now) return 'upcoming';
    if (end < now) return 'completed';
    return 'ongoing';
  };

  const status = getStatus();
  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    ongoing: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SmartTooltip content={cohort.masterclassTitle}>
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {truncateText(cohort.masterclassTitle, 15)}
            </h3>
          </SmartTooltip>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(cohort.startDate), 'MMM d')} - {format(new Date(cohort.endDate), 'MMM d, yyyy')}
        </div>
      </div>

      {/* Students Table */}
      {cohort.students && cohort.students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cohort.students.map((student, index) => {
                const payment = cohort.payments?.find(p => p.email === student.email) || {};
                const amountPaid = payment.amount || 0;
                const discount = payment.discount || 0;
                const balance = cohort.masterclassPrice - amountPaid - discount;
                const paymentStatus = amountPaid + discount >= cohort.masterclassPrice ? 'full' :
                                   amountPaid > 0 ? 'partial' : 'unpaid';

                return (
                  <StudentRow
                    key={student.email || index}
                    student={student}
                    paymentStatus={paymentStatus}
                    amountPaid={amountPaid}
                    discount={discount}
                    balance={balance}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-xs text-gray-500">
          No students enrolled
        </div>
      )}
    </div>
  );
};

export default MasterclassStudentTable;