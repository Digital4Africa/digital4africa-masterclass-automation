import { useSelector, useDispatch } from "react-redux";

import { fetchCohorts } from "../../features/cohorts/cohortsSlice";

const CohortTable = () => {
  const dispatch = useDispatch();
  const now = new Date();
  const cohortsState = useSelector((state) => state.cohorts);
  const { allCohorts, loading, error } = cohortsState;
  console.log(allCohorts);

  // Filter and process cohorts
  const filteredCohorts = allCohorts
    .filter((cohort) => {
      const start = new Date(cohort.startDate);
      const end = new Date(cohort.endDate);
      return now <= end; // Only show cohorts that haven't ended yet
    })
    .map((cohort) => {
      const start = new Date(cohort.startDate);
      const end = new Date(cohort.endDate);

      // Determine status based on dates ONLY
      const status = now >= start && now <= end ? "ongoing" : "upcoming";

      return {
        ...cohort, // Keep ALL original fields from DB
        status, // Only add status field
        formattedStart: start.toLocaleDateString(),
        formattedEnd: end.toLocaleDateString(),
      };
    });

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-center">
          <p>Error loading cohorts</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={() => dispatch(fetchCohorts())}
          className="px-4 py-2 bg-[var(--d4a-blue)] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Students
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCohorts.length > 0 ? (
            filteredCohorts.map((cohort) => (
              <tr key={cohort._id} className="hover:bg-gray-50">
                <td
                  className="px-6 py-4 whitespace-nowrap font-medium text-[var(--d4a-blue)]"
                  title={cohort.masterclassTitle}
                >
                  {cohort.masterclassTitle.length > 40
                    ? `${cohort.masterclassTitle.substring(0, 40)}...`
                    : cohort.masterclassTitle}
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
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[cohort.status]
                    }`}
                  >
                    {cohort.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No ongoing or upcoming cohorts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CohortTable;
