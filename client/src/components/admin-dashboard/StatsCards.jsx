import { useSelector } from "react-redux";

const StatsCards = () => {
  const { allCohorts, loading } = useSelector((state) => state.cohorts);
  

  const cohorts = allCohorts || [];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);

  // Filter upcoming and ongoing cohorts
  const upcoming = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    return currentDate < startDate;
  }).length;

  const ongoing = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  }).length;

  const totalActiveMasterclasses = upcoming + ongoing;

  // Calculate total discounts MTD (sum of all discounts in payments array)
  const totalDiscountsMTD = cohorts.reduce((total, cohort) => {
    if (cohort.payments && cohort.payments.length > 0) {
      const paymentsThisMonth = cohort.payments.filter((payment) => {
        const paymentDate = new Date(cohort.createdAt); // Using cohort creation date as payment date
        return paymentDate >= monthStart && paymentDate <= currentDate;
      });
      const cohortDiscount = paymentsThisMonth.reduce(
        (sum, payment) => sum + (payment.discount || 0),
        0
      );
      return total + cohortDiscount;
    }
    return total;
  }, 0);

  // Calculate total potential revenue (sum of all cohort prices)
  const totalPotentialRevenue = cohorts.reduce(
    (total, cohort) => total + cohort.masterclassPrice,
    0
  );

  // Calculate net revenue MTD (sum of all payment amounts)
  const totalRevenueMTD = cohorts.reduce((total, cohort) => {
    if (cohort.payments && cohort.payments.length > 0) {
      const paymentsThisMonth = cohort.payments.filter((payment) => {
        const paymentDate = new Date(cohort.createdAt); // Using cohort creation date as payment date
        return paymentDate >= monthStart && paymentDate <= currentDate;
      });
      const cohortRevenue = paymentsThisMonth.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      return total + cohortRevenue;
    }
    return total;
  }, 0);

  const netRevenueMTD = totalRevenueMTD;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="inline-flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--d4a-blue)]"></div>
    </div>
  );

  const stats = [
    {
      title: "Active Masterclasses",
      value: loading ? <LoadingSpinner /> : totalActiveMasterclasses,
    },
    {
      title: "Upcoming",
      value: loading ? <LoadingSpinner /> : upcoming,
    },
    {
      title: "Ongoing",
      value: loading ? <LoadingSpinner /> : ongoing,
    },
    {
      title: "Total Discounts MTD",
      value: loading ? (
        <LoadingSpinner />
      ) : (
        `Kes ${totalDiscountsMTD.toLocaleString()}`
      ),
    },
    {
      title: "Net Revenue MTD",
      value: loading ? (
        <LoadingSpinner />
      ) : (
        `Kes ${netRevenueMTD.toLocaleString()}`
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--d4a-black)]">
                {stat.title}
              </p>
              <div className="text-l font-bold text-[var(--d4a-blue)]">
                {stat.value}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;