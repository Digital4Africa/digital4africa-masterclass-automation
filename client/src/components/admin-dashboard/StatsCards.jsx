import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const StatsCards = () => {
  const { allCohorts, loading } = useSelector((state) => state.cohorts);
  const [metrics, setMetrics] = useState({
    totalRevenueMTD: 0,
    totalDiscountsMTD: 0,
    netRevenueMTD: 0,
    loadingMetrics: true
  });

  // Fetch payment metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/enrollment/payment-metrics`, {
          withCredentials: true
        });

        console.log("Full API response:", response.data); // Debug log

        // Correctly access the nested data object
        setMetrics({
          totalRevenueMTD: response.data.data.totalRevenueMTD || 0,
          totalDiscountsMTD: response.data.data.totalDiscountsMTD || 0,
          netRevenueMTD: response.data.data.netRevenueMTD || 0,
          loadingMetrics: false
        });
      } catch (error) {
        console.error("Error fetching payment metrics:", error);
        setMetrics(prev => ({ ...prev, loadingMetrics: false }));
      }
    };

    fetchMetrics();
  }, []);

  console.log("metrics", metrics)

  const cohorts = allCohorts || [];
  const currentDate = new Date();

  // Filter upcoming and ongoing cohorts
  const upcoming = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    const [startHours, startMinutes] = cohort.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes, 0, 0);
    return currentDate < startDate;
  }).length;

  const ongoing = cohorts.filter((cohort) => {
    const startDate = new Date(cohort.startDate);
    const endDate = new Date(cohort.endDate);
    const [startHours, startMinutes] = cohort.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes, 0, 0);
    return currentDate >= startDate && currentDate <= endDate;
  }).length;

  const totalActiveMasterclasses = upcoming + ongoing;

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
      value: metrics.loadingMetrics ? (
        <LoadingSpinner />
      ) : (
        `Kes ${metrics.totalDiscountsMTD.toLocaleString()}`
      ),
    },
    {
      title: "Net Revenue MTD",
      value: metrics.loadingMetrics ? (
        <LoadingSpinner />
      ) : (
        `Kes ${metrics.netRevenueMTD.toLocaleString()}`
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
              <p className="text-sm font-semibold text-[var(--d4a-blue)]">
                {stat.title}
              </p>
              <div className="text-l font-bold text-[var(--d4a-black)]">
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