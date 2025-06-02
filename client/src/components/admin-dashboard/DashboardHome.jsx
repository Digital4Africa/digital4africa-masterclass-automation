import { useNavigate } from "react-router-dom";
import MasterclassTable from "./MasterclassTable";
import StatsCards from "./StatsCards";


const DashboardHome = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--d4a-black)]">Dashboard Overview</h1>

      {/* Stats Cards */}
      <StatsCards  />

      {/* Recent Masterclasses */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--d4a-black)]">Recent Masterclasses</h2>
          <button onClick={() => navigate("/admin-home/masterclasses/new")} className="btn-primary text-sm px-4 py-2">
            + New Masterclass
          </button>
        </div>
        <MasterclassTable  />
      </div>
    </div>
  );
};

export default DashboardHome;