import { useState } from "react";
import CohortCard from "./CohortCard"; // your card
import { useSelector } from "react-redux";

const CohortList = () => {
  const { allCohorts, loading } = useSelector((state) => state.cohorts);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  const getCohortStatus = (cohort) => {
    const now = new Date();
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "inprogress";
    return "ended";
  };

  const groupByMonth = (cohorts) => {
    return cohorts.reduce((groups, cohort) => {
      const date = new Date(cohort.endDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(cohort);
      return groups;
    }, {});
  };

  const upcoming = allCohorts.filter((c) => getCohortStatus(c) === "upcoming");
  const inprogress = allCohorts.filter(
    (c) => getCohortStatus(c) === "inprogress"
  );
  const ended = allCohorts.filter((c) => getCohortStatus(c) === "ended");
  const endedGrouped = groupByMonth(ended);
  const copyCheckoutLink = (id) => {
    const link = `${window.location.origin}/checkout/${id}`;
    navigator.clipboard.writeText(link);
    setToast({
      message: "Link copied to clipboard!",
      type: "success",
      isVisible: true,
    });
  };
  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (loading) return <div>Loading cohorts...</div>;

  return (
    <div className="space-y-10">
      {/* Top Section: Upcoming + In Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ongoing Cohorts
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {inprogress.map((cohort) => (
            <CohortCard
              key={cohort._id}
              cohort={cohort}
              onCopyLink={copyCheckoutLink}
              toast={toast}
              closeToast={closeToast}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Upcoming Cohorts
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcoming.map((cohort) => (
            <CohortCard
              key={cohort._id}
              cohort={cohort}
              onCopyLink={copyCheckoutLink}
              toast={toast}
              closeToast={closeToast}
            />
          ))}
        </div>
      </div>

      {/* Table Section: Ended */}
      <div className="pt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ended Cohorts</h2>
        {Object.entries(endedGrouped).map(([monthYear, cohorts]) => (
          <div key={monthYear} className="mb-10">
            <h3 className="text-xl font-semibold mb-2">{monthYear}</h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full text-left text-sm border border-gray-200">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                    <th className="px-4 py-3">Students</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th className="px-4 py-3">Discounts</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((cohort) => {
                    const revenue =
                      cohort.payments?.reduce((sum, p) => sum + p.amount, 0) ||
                      0;
                    const discounts =
                      cohort.discounts?.reduce((sum, d) => sum + d.amount, 0) ||
                      0;

                    return (
                      <tr key={cohort._id} className="border-t">
                        <td className="px-4 py-2">{cohort.masterclassTitle}</td>
                        <td className="px-4 py-2">
                          {new Date(cohort.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(cohort.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {cohort.students?.length || 0}
                        </td>
                        <td className="px-4 py-2">Ksh {revenue}</td>
                        <td className="px-4 py-2">Ksh {discounts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CohortList;
