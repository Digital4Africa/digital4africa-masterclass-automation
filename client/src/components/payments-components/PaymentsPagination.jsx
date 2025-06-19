import React from 'react';

function PaymentsPagination({ currentPage, totalPages, onPageChange, loading }) {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages || totalPages === 0;

    console.log("isFirstPage: ", isFirstPage);
    console.log("isLastPage: ", isLastPage);
    console.log("currentPage: ", currentPage);
    console.log("totalPages: ", totalPages);
    console.log("loading: ", loading);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600">
                Page {currentPage} of {totalPages || 1}
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirstPage || loading}
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                        ${isFirstPage || loading
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                        }
                    `}
                >
                    Previous
                </button>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLastPage || loading}
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                        ${isLastPage || loading
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-white border-transparent hover:shadow-lg transform hover:scale-105'
                        }
                    `}
                    style={!isLastPage && !loading ? { backgroundColor: 'var(--d4a-blue)' } : {}}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PaymentsPagination;