import { useSelector } from "react-redux";

const MasterclassTable = () => {
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);
  console.log("AvailableMasterclass: ", allMasterclasses);
  const masterclasses = (allMasterclasses || []).map((m) => {
    const now = new Date();
    const start = new Date(m.startDate);
    const end = new Date(m.endDate);
    let status = 'upcoming';
    if (now >= start && now <= end) status = 'ongoing';
    else if (now > end) status = 'completed';
    return { ...m, status };
  });

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {masterclasses.map((masterclass) => (
            <tr key={masterclass._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-[var(--d4a-blue)]">{masterclass.title}</div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(masterclass.date).toLocaleDateString()}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{masterclass.enrolled}</div>
                    <div className="text-xs text-gray-500">
                      {10} paid • {3} partial
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[masterclass.status]}`}>
                  {masterclass.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Kes {masterclass.price * masterclass.paidStudents}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-[var(--d4a-blue)] hover:text-[#005589] mr-3">Edit</button>
                {/* <button className="text-[var(--d4a-red)] hover:text-[#b5090f]">Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterclassTable;
