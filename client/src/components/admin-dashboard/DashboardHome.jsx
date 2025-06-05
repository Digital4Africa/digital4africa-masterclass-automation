// DashboardHome.js
import { useState } from "react";

import StatsCards from "./StatsCards";
import CohortTable from "./CohortTable";
import { useSelector } from "react-redux";
import AddCohortModal from "./AddCohortModal";


const DashboardHome = () => {
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);

  const [showModal, setShowModal] = useState(false);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--d4a-black)]">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <StatsCards />

      {/* Recent Cohorts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-l font-semibold text-[var(--d4a-black)]">
            Recent Cohorts
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-sm px-4 py-2"
          >
            + New Cohort
          </button>
        </div>
        <CohortTable />
      </div>

      {showModal && (
        <AddCohortModal
          onClose={() => setShowModal(false)}
          masterclasses={allMasterclasses}
        />
      )}
    </div>
  );
};

export default DashboardHome;