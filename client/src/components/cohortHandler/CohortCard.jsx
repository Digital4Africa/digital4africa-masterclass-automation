import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EditCohortModal from "./EditCohortModal";
import GiveDiscountModal from "./GiveDiscountModal";
import DeleteCohortModal from "./DeleteCohortModal";
import Toast from "../Toast";
import { hideOverlay, showOverlay } from "../../features/overlay/overlaySlice";

const CohortCard = ({ cohort, onCopyLink, toast, closeToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);
  const dispatch = useDispatch();

  const currentDate = new Date();
  const startDate = new Date(cohort.startDate);
  const endDate = new Date(cohort.endDate);
  const [endHours, endMinutes] = cohort.endTime.split(":").map(Number);
  endDate.setHours(endHours);
  endDate.setMinutes(endMinutes);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);

  const formatDate = (date) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getStatus = () => {
    if (currentDate < startDate) {
      return {
        status: "upcoming",
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800",
      };
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return {
        status: "inprogress",
        label: "In Progress",
        color: "bg-orange-100 text-orange-800",
      };
    } else {
      return {
        status: "ended",
        label: "Ended",
        color: "bg-gray-100 text-gray-800",
      };
    }
  };

  const handleGiveDiscount = () => {
    dispatch(showOverlay());
    setShowDiscountModal(true);
  };

  const handleCloseDiscountModal = () => {
    dispatch(hideOverlay());
    setShowDiscountModal(false);
  };

  const handleDelete = () => {
    dispatch(showOverlay());
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    dispatch(hideOverlay());
    setShowDeleteModal(false);
  };

  const statusInfo = getStatus();
  const totalStudents = cohort.students?.length || 0;
  const totalRevenue = cohort.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const totalDiscounts = cohort.payments?.reduce((sum, payment) => sum + (payment.discount || 0), 0) || 0;
  const isDisabled = currentDate > endDate;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="p-5 space-y-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-[var(--d4a-blue)] flex-1 pr-3">
            {cohort.masterclassTitle}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white/90 cursor-pointer backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              title="Edit cohort"
            >
              <Edit3 size={16} className="text-gray-600 hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white/90 cursor-pointer backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              title="Delete cohort"
            >
              <Trash2 size={16} className="text-gray-600 hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <div className="text-sm text-gray-600">
            {formatDate(startDate)} - {formatDate(new Date(cohort.endDate))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Students</div>
            <div className="font-bold text-sm">{totalStudents}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="font-bold text-sm">{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Discounts</div>
            <div className="font-bold text-sm">{totalDiscounts.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex space-x-3 pt-2">
          <button
            onClick={() => onCopyLink(cohort._id)}
            className={`flex-1 text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "btn-secondary"
            }`}
            disabled={isDisabled}
            title={isDisabled ? "Link can only be copied before the cohort ends" : "Copy link"}
          >
            Copy Link
          </button>
          <button
            onClick={handleGiveDiscount}
            className={`flex-1 text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={isDisabled}
            title={isDisabled ? "Discounts can only be given before the cohort ends" : "Give discount"}
          >
            Give Discount
          </button>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      {showModal && (
        <EditCohortModal
          onClose={() => setShowModal(false)}
          masterclasses={allMasterclasses}
          cohort={cohort}
        />
      )}
      {showDiscountModal && (
        <GiveDiscountModal
          cohort={cohort}
          onClose={handleCloseDiscountModal}
        />
      )}
      {showDeleteModal && (
        <DeleteCohortModal
          cohort={cohort}
          onClose={handleCloseDeleteModal}
        />
      )}
    </div>
  );
};

export default CohortCard;
