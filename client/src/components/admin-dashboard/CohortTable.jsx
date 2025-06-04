import { useSelector } from "react-redux";

const CohortTable = () => {
  const now = new Date();
  const { allCohorts = [] } = useSelector(state => state.cohorts);

  // Filter and process cohorts
  const filteredCohorts = allCohorts
    .filter(cohort => {
      const start = new Date(cohort.startDate);
      const end = new Date(cohort.endDate);
      return now <= end; // Only show cohorts that haven't ended yet
    })
    .map(cohort => {
      const start = new Date(cohort.startDate);
      const end = new Date(cohort.endDate);

      // Determine status based on dates ONLY
      const status = now >= start && now <= end ? "ongoing" : "upcoming";

      return {
        ...cohort, // Keep ALL original fields from DB
        status, // Only add status field
        formattedStart: start.toLocaleDateString(),
        formattedEnd: end.toLocaleDateString()
      };
    });

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800"
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCohorts.map((cohort) => (
            <tr key={cohort._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--d4a-blue)]">
                {cohort.masterclassTitle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {cohort.formattedStart}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {cohort.formattedEnd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {cohort.students?.length || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[cohort.status]}`}>
                  {cohort.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CohortTable;