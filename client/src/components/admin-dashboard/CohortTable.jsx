import { cohorts } from "../../data/cohort";

const CohortTable = () => {
  const now = new Date();

  const cohortData = cohorts.map((cohort) => {
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);

    let status = "upcoming";
    if (now >= start && now <= end) status = "ongoing";
    else if (now > end) status = "completed";

    const revenue = cohort.price * cohort.paidStudents;
    const discountTotal = cohort.discounts.reduce((sum, d) => sum + d.amount, 0);

    return {
      ...cohort,
      status,
      revenue,
      discountTotal,
      formattedStart: start.toLocaleDateString(),
      formattedEnd: end.toLocaleDateString()
    };
  });

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounts</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cohortData.map((cohort) => (
            <tr key={cohort._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--d4a-blue)]">{cohort.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cohort.formattedStart}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cohort.formattedEnd}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{cohort.paidStudents + cohort.partialStudents}</div>
                <div className="text-xs text-gray-500">
                  {cohort.paidStudents} paid • {cohort.partialStudents} partial
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[cohort.status]}`}>
                  {cohort.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Kes {cohort.revenue}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Kes {cohort.discountTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CohortTable;
