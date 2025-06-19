import React from 'react';
import SmartTooltip from '../../utils/SmartTooltip';
import { RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';

function PaymentsTable({ payments, onRetryPayment }) {
    const { allCohorts } = useSelector((state) => state.cohorts);

    const truncateText = (text, maxLength = 30) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return '';
        const options = { month: 'short', day: 'numeric' };
        const start = new Date(startDate).toLocaleDateString('en-US', options);
        const end = new Date(endDate).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;
    };

    const getCohortDisplay = (cohortId) => {
        const cohort = allCohorts.find(c => c._id === cohortId);
        if (!cohort) return 'Unknown Cohort';

        const title = cohort.masterclassTitle || 'Untitled Cohort';
        const dates = formatDateRange(cohort.startDate, cohort.endDate);
        return `${truncateText(title, 15)} | ${dates}`;
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status.toLowerCase()) {
            case 'success':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'failed':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Cohort</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => {
                        const cohortDisplay = getCohortDisplay(payment.cohortId);
                        const fullCohortInfo = allCohorts.find(c => c._id === payment.cohortId) || {};

                        return (
                            <tr key={payment._id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 whitespace-nowrap">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <SmartTooltip content={payment.reference}>
                                        <span className="text-sm text-gray-900 cursor-help font-mono">
                                            {truncateText(payment.reference, 5)}
                                        </span>
                                    </SmartTooltip>
                                </td>
                                <td className="px-3 py-3">
                                    <div className="text-sm">
                                        <div className="text-sm font-medium text-gray-900">{payment.customer.email}</div>
                                        <div className="text-sm text-gray-500">{payment.customer.phone}</div>
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <SmartTooltip content={`${fullCohortInfo.masterclassTitle || ''} | ${formatDateRange(fullCohortInfo.startDate, fullCohortInfo.endDate)}`}>
                                        <span className="text-sm text-gray-900 cursor-help">
                                            {cohortDisplay}
                                        </span>
                                    </SmartTooltip>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className="text-sm font-medium" style={{ color: 'var(--d4a-blue)' }}>
                                        {payment.amount.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className={getStatusBadge(payment.status)}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap max-w-xs">
                                    <SmartTooltip content={payment.remarks}>
                                        <span className="text-sm text-gray-900 cursor-help transition-colors">
                                            {truncateText(payment.remarks, 10)}
                                        </span>
                                    </SmartTooltip>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    {payment.status.toLowerCase() === 'failed' ? (
                                        <button
                                            onClick={() => onRetryPayment(payment._id)}
                                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                            style={{ color: 'var(--d4a-blue)', borderColor: 'var(--d4a-blue)' }}
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Retry
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default PaymentsTable;