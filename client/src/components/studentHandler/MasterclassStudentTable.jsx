import React from 'react';
import { format } from 'date-fns';
import StudentRow from './StudentRow';

const MasterclassStudentTable = ({ masterclass }) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    inprogress: 'bg-green-100 text-green-800',
    past: 'bg-gray-100 text-gray-800'
  };

  const getStatus = () => {
    const now = new Date();
    const start = new Date(masterclass.startDate);
    const end = new Date(masterclass.endDate);

    if (start > now) return { text: 'Upcoming', color: statusColors.upcoming };
    if (end < now) return { text: 'Completed', color: statusColors.past };
    return { text: 'In Progress', color: statusColors.inprogress };
  };

  const status = getStatus();

  // Calculate totals
  const totalStudents = masterclass.students.length;
  const totalPaid = masterclass.students.reduce((sum, student) => sum + student.payment.amountPaid, 0);
  const totalDiscounts = masterclass.students.reduce((sum, student) => sum + student.payment.discount, 0);
  const expectedRevenue = masterclass.students.reduce((sum, student) => sum + student.payment.total, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      {/* Masterclass Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
        <div>
          <h3 className="text-lg font-medium text-[var(--d4a-blue)]">{masterclass.title}</h3>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-600">
              {format(new Date(masterclass.startDate), 'MMM d, yyyy')} - {format(new Date(masterclass.endDate), 'MMM d, yyyy')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
            <span className="text-sm text-gray-600">
              {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Paid: <span className="font-medium">Kes {totalPaid}</span></div>
          {status.text !== 'Completed' && (
            <div className="text-sm text-gray-600">Balance: <span className="font-medium">Kes {expectedRevenue - totalPaid}</span></div>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {masterclass.students.map(student => (
              <StudentRow key={student._id} student={student} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterclassStudentTable;