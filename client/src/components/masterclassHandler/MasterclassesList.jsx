import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterclassCard from "./MasterclassCard";
// import EditMasterclassModal from "./EditMasterclassModal";
import { useSelector } from "react-redux";


const MasterclassesList = () => {
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);
  const masterclasses = allMasterclasses || []

  const navigate = useNavigate();


  const copyCheckoutLink = (id) => {
    const link = `${window.location.origin}/checkout/${id}`;
    navigator.clipboard.writeText(link);
    setToast({
        message: 'Link copied to clipboard!',
        type: 'success',
        isVisible: true
      });
  };
   const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--d4a-black)]">
          Masterclasses
        </h1>
        <button
          className="btn-primary flex items-center"
          onClick={() => navigate("/admin-home/masterclasses/new")}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Masterclass
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterclasses.map((masterclass) => (
          <MasterclassCard
            key={masterclass._id}
            masterclass={masterclass}
            
            onCopyLink={copyCheckoutLink}
            toast={toast}
            closeToast={closeToast}
          />
        ))}
      </div>


    </div>
  );
};

export default MasterclassesList;
