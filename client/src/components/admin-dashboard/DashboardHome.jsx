import MasterclassTable from "./MasterclassTable";
import StatsCards from "./StatsCards";


const DashboardHome = () => {
  // Sample data
  const masterclasses = [
    {
      id: 1,
      title: 'Digital Marketing Fundamentals',
      date: '2023-06-15',
      enrolled: 24,
      status: 'upcoming',
      price: 299,
      paidStudents: 18,
      partialPayments: 6
    },
    {
      id: 2,
      title: 'Advanced Data Analytics',
      date: '2023-05-20',
      enrolled: 32,
      status: 'ongoing',
      price: 399,
      paidStudents: 28,
      partialPayments: 4
    },
    {
      id: 3,
      title: 'UX Design Mastery',
      date: '2023-04-10',
      enrolled: 15,
      status: 'completed',
      price: 349,
      paidStudents: 15,
      partialPayments: 0
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--d4a-black)]">Dashboard Overview</h1>

      {/* Stats Cards */}
      <StatsCards masterclasses={masterclasses} />

      {/* Recent Masterclasses */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--d4a-black)]">Recent Masterclasses</h2>
          <button className="btn-primary text-sm px-4 py-2">
            + New Masterclass
          </button>
        </div>
        <MasterclassTable masterclasses={masterclasses} />
      </div>
    </div>
  );
};

export default DashboardHome;