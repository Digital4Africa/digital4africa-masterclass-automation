import React from 'react';

function PaymentsFilters({
    filters,
    onStatusChange,
    onFromDateChange,
    onToDateChange,
    onLimitChange,
    onClearFilters
}) {
    return (
        <div className="flex flex-wrap items-end gap-3 py-1">
            {/* Status Filter */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Status:</label>
                <select
                    value={filters.status}
                    onChange={onStatusChange}
                    className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 min-w-[120px]"
                    style={{
                        focusRingColor: 'var(--d4a-blue)',
                        '--tw-ring-color': 'var(--d4a-blue)'
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* From Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">From Date:</label>
                <input
                    type="date"
                    value={filters.fromDate}
                    onChange={onFromDateChange}
                    className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1"
                    style={{
                        focusRingColor: 'var(--d4a-blue)',
                        '--tw-ring-color': 'var(--d4a-blue)'
                    }}
                />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">To Date:</label>
                <input
                    type="date"
                    value={filters.toDate}
                    onChange={onToDateChange}
                    className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1"
                    style={{
                        focusRingColor: 'var(--d4a-blue)',
                        '--tw-ring-color': 'var(--d4a-blue)'
                    }}
                />
            </div>

            {/* Clear button */}
            <button
                onClick={onClearFilters}
                className="px-2 py-1 text-xs text-gray-600 rounded transition-colors"
                style={{
                    '&:hover': {
                        color: 'var(--d4a-red)'
                    }
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--d4a-red)'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
                Clear
            </button>

            {/* Show */}
            <div className="flex items-center gap-1 ml-2">
                <label className="text-xs font-medium text-gray-600">Show:</label>
                <select
                    value={filters.limit}
                    onChange={onLimitChange}
                    className="px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1"
                    style={{
                        focusRingColor: 'var(--d4a-blue)',
                        '--tw-ring-color': 'var(--d4a-blue)'
                    }}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={70}>70</option>
                    <option value="all">All</option>
                </select>
            </div>
        </div>
    );
}

export default PaymentsFilters;