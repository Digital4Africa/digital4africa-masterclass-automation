import React from 'react';
import { Calendar, Hash, Users, GraduationCap, DollarSign, CheckCircle, FileText, Settings } from 'lucide-react';

function PaymentsTableSkeleton() {
  const skeletonRows = Array(5).fill(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200" style={{ backgroundColor: 'rgba(0, 96, 161, 0.02)' }}>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'var(--d4a-blue)' }} />
                Date
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <Hash size={16} style={{ color: 'var(--d4a-blue)' }} />
                Reference
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: 'var(--d4a-blue)' }} />
                Contact
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} style={{ color: 'var(--d4a-blue)' }} />
                Cohort
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <DollarSign size={16} style={{ color: 'var(--d4a-blue)' }} />
                Amount
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} style={{ color: 'var(--d4a-blue)' }} />
                Status
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <FileText size={16} style={{ color: 'var(--d4a-blue)' }} />
                Remarks
              </div>
            </th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                <Settings size={16} style={{ color: 'var(--d4a-blue)' }} />
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="border-b border-gray-100 animate-pulse">
              <td className="py-4 px-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </td>
              <td className="py-4 px-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-36"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsTableSkeleton;