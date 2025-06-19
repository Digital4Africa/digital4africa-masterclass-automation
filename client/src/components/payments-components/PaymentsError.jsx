import React from 'react';

function PaymentsError({ error, onRetry }) {
    return (
        <div className="p-4">
            <div className="mb-2" style={{ color: 'var(--d4a-red)' }}>
                Error fetching payments: {error}
            </div>
            <button
                onClick={onRetry}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
            >
                Retry
            </button>
        </div>
    );
}

export default PaymentsError;