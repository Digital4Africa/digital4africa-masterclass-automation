import { useSelector } from "react-redux";

const StatsCards = () => {
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);
  const { allCohorts, loading } = useSelector((state) => state.cohorts);

  const masterclasses = allMasterclasses || [];
  const cohorts = allCohorts || [];

  // Get current date and month boundaries
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);

  // Calculate total masterclasses
  const totalMasterclasses = masterclasses.length;

  // Calculate upcoming and ongoing cohorts
  const upcoming = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    return currentDate < startDate;
  }).length;

  const ongoing = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  }).length;

  // Calculate total discounts MTD
  const totalDiscountsMTD = cohorts.reduce((total, cohort) => {
    if (cohort.discounts && cohort.discounts.length > 0) {
      const discountsThisMonth = cohort.discounts.filter((discount) => {
        const discountDate = new Date(discount.createdAt);
        return discountDate >= monthStart && discountDate <= currentDate;
      });
      const cohortDiscount = discountsThisMonth.reduce(
        (sum, discount) => sum + discount.amount,
        0
      );
      return total + cohortDiscount;
    }
    return total;
  }, 0);

  // Calculate total revenue MTD
  const totalRevenueMTD = cohorts.reduce((total, cohort) => {
    if (cohort.payments && cohort.payments.length > 0) {
      const paymentsThisMonth = cohort.payments.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
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

  const netRevenueMTD = totalRevenueMTD - totalDiscountsMTD;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="inline-flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--d4a-blue)]"></div>
    </div>
  );

  const stats = [
    {
      title: "Total Masterclasses",
      value: loading ? <LoadingSpinner /> : totalMasterclasses,
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
