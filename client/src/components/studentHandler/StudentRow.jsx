import React from 'react';

const StudentRow = ({ student }) => {
  const paymentStatusColors = {
    full: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--d4a-blue)] flex items-center justify-center text-white font-medium">
            {student.fullName.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.email}</div>
        <div className="text-xs text-gray-500">{student.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[student.payment.status]}`}>
          {student.payment.status === 'full' ? 'Paid' :
           student.payment.status === 'partial' ? 'Partial' : 'Unpaid'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Kes {student.payment.amountPaid}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.payment.discount > 0 ? `-Kes ${student.payment.discount}` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Kes {student.payment.total}
      </td>
    </tr>
  );
};

export default StudentRow;