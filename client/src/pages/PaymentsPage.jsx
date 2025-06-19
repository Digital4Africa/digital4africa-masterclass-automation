import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayments, setFilters, resetPage } from '../features/payments/fetchAllPaymentsSlice';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PaymentsFilters from '../components/payments-components/PaymentsFilters';
import PaymentsTableSkeleton from '../components/payments-components/PaymentsTableSkeleton';
import PaymentsTable from '../components/payments-components/PaymentsTable';
import PaymentsPagination from '../components/payments-components/PaymentsPagination';


function PaymentsPage() {
    const {
        payments,
        loading,
        error,
        currentPage,
        totalPages,
        filters
    } = useSelector((state) => state.payments);

    console.log("payments: ", payments);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPayments({
            page: currentPage,
            limit: filters.limit,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            status: filters.status
        }));
    }, [dispatch, currentPage, filters]);

    const handlePageChange = (page) => {
        dispatch(fetchPayments({
            page,
            limit: filters.limit,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            status: filters.status
        }));
    };

    const handleRetry = () => {
        dispatch(fetchPayments({
            page: currentPage,
            limit: filters.limit,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            status: filters.status
        }));
    };

    const handleStatusChange = (e) => {
        const status = e.target.value;
        dispatch(resetPage());
        dispatch(setFilters({ status }));
    };

    const handleFromDateChange = (e) => {
        dispatch(setFilters({ fromDate: e.target.value }));
    };

    const handleToDateChange = (e) => {
        dispatch(setFilters({ toDate: e.target.value }));
    };

    const handleLimitChange = (e) => {
        dispatch(resetPage());
        dispatch(setFilters({ limit: e.target.value }));
    };

    const handleClearFilters = () => {
        dispatch(setFilters({
            fromDate: '',
            toDate: '',
            limit: '10',
            status: 'all'
        }));
        dispatch(resetPage());
        dispatch(fetchPayments({
            page: 1,
            limit: '10',
            fromDate: '',
            toDate: '',
            status: 'all'
        }));
    };

    const handleRetryPayment = (paymentId) => {
        // TODO: Implement retry payment logic
        console.log('Retrying payment:', paymentId);
        // You can dispatch a retry action here when you implement it
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4">


                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        All Payments
                    </h2>

                    {/* Filters */}
                    <PaymentsFilters
                        filters={filters}
                        onStatusChange={handleStatusChange}
                        onFromDateChange={handleFromDateChange}
                        onToDateChange={handleToDateChange}
                        onLimitChange={handleLimitChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {error ? (
                        <PaymentsError error={error} onRetry={handleRetry} />
                    ) : loading ? (
                        <PaymentsTableSkeleton />
                    ) : (
                        <>
                            <PaymentsTable
                                payments={payments}
                                onRetryPayment={handleRetryPayment}
                            />
                            <PaymentsPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                loading={loading}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentsPage;