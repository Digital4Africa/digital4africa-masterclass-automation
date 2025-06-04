import { useSelector } from "react-redux";


const StatsCards = () => {
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);

  const masterclasses = allMasterclasses || []
  const totalMasterclasses = masterclasses.length;
  const upcoming = masterclasses.filter(m => m.status === 'upcoming').length;
  const ongoing = masterclasses.filter(m => m.status === 'ongoing').length;
  // const completed = masterclasses.filter(m => m.status === 'completed').length;

  const totalStudents = masterclasses.reduce((sum, m) => sum + (Number(m.enrolled) || 0), 0);

  const totalRevenue = 45000;

  const stats = [
    { title: 'Total Masterclasses', value: totalMasterclasses, change: '+2 from last month', icon: '🎓' },
    { title: 'Upcoming', value: upcoming, change: '1 starts next week', icon: '⏳' },
    { title: 'Ongoing', value: ongoing, change: '2 in progress', icon: '🚀' },
    { title: 'Total Students MTD', value: totalStudents, change: '+12 from last month', icon: '👥' },
    { title: 'Total Revenue MTD', value: `Kes ${totalRevenue}`, change: '+15% from last month', icon: '💰' },
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
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-l font-bold text-[var(--d4a-blue)]">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </div>
            <span className="text-l">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;