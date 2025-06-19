import React from 'react';
import SmartTooltip from '../../utils/SmartTooltip';

const StudentRow = ({ student, paymentStatus, amountPaid, discount, balance }) => {
  const paymentStatusConfig = {
    full: {
      label: 'Paid',
      className: 'bg-green-100 text-green-800'
    },
    partial: {
      label: 'Partial',
      className: 'bg-yellow-100 text-yellow-800'
    },
    unpaid: {
      label: 'Unpaid',
      className: 'bg-red-100 text-red-800'
    }
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const config = paymentStatusConfig[paymentStatus];

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <SmartTooltip content={student.fullName}>
            <span className="text-sm text-gray-900 font-medium">
              {truncateText(student.fullName)}
            </span>
          </SmartTooltip>
        </div>
      </td>
      <td className="px-4 py-3">
        <SmartTooltip content={student.email}>
          <span className="text-sm text-gray-600">
            {truncateText(student.email, 25)}
          </span>
        </SmartTooltip>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">
        {amountPaid.toLocaleString()}
        {discount > 0 && (
          <span className="text-xs text-green-600 ml-1">
            (-{discount.toLocaleString()})
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">
        {balance > 0 ? balance.toLocaleString() : '0'}
      </td>
    </tr>
  );
};

export default StudentRow;