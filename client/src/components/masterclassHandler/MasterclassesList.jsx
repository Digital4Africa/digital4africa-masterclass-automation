import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterclassCard from "./MasterclassCard";
import EditMasterclassModal from "./EditMasterclassModal";


// Sample data matching your schema
const sampleMasterclasses = [
  {
    _id: "1",
    title: "Digital Marketing Fundamentals",
    description:
      "Learn the core principles of digital marketing and how to apply them in real-world scenarios.",
    startDate: "2025-06-03T09:00:00Z", // Upcoming
    endDate: "2025-06-05T17:00:00Z",
    price: 299,
    isActive: true,
    heroImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    _id: "2",
    title: "Advanced Data Analytics",
    description:
      "Master data analysis techniques using Python and modern analytics tools.",
    startDate: "2025-05-30T09:00:00Z", // In progress
    endDate: "2025-06-02T17:00:00Z",
    price: 399,
    isActive: true,
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    _id: "3",
    title: "UX Design Mastery",
    description: "From wireframes to prototypes - become a UX design expert.",
    startDate: "2025-05-25T09:00:00Z", // Ended
    endDate: "2025-05-27T17:00:00Z",
    price: 349,
    isActive: false,
    heroImage:
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];


const MasterclassesList = () => {
  const [masterclasses, setMasterclasses] = useState(sampleMasterclasses);
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (masterclass) => {
    setSelectedMasterclass(masterclass);
    setIsModalOpen(true);
  };

  const handleSave = (updatedMasterclass) => {
    setMasterclasses(
      masterclasses.map((mc) =>
        mc._id === updatedMasterclass._id ? updatedMasterclass : mc
      )
    );

    setIsModalOpen(false);
  };

  const copyCheckoutLink = (id) => {
    const link = `${window.location.origin}/checkout/${id}`;
    navigator.clipboard.writeText(link);
    alert("Checkout link copied to clipboard!");
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
            onEdit={handleEdit}
            onCopyLink={copyCheckoutLink}
          />
        ))}
      </div>

      {isModalOpen && (
        <EditMasterclassModal
          masterclass={selectedMasterclass}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MasterclassesList;
