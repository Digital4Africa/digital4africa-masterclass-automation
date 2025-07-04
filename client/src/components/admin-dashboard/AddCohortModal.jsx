import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../features/overlay/overlaySlice";
import Toast from "../Toast";
import axios from "axios";
import { fetchCohorts } from "../../features/cohorts/cohortsSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const AddCohortModal = ({ onClose, masterclasses }) => {
  const dispatch = useDispatch();
  const [selectedMasterclass, setSelectedMasterclass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("17:00");
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    dispatch(showOverlay());
    return () => dispatch(hideOverlay());
  }, [dispatch]);

  const emailTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: '7day', label: '7 Day Reminder' },
    { value: '2day', label: '2 Day Reminder' },
    { value: 'dayOf', label: 'Day Of Event' },
    { value: 'lastDay', label: 'Last Day Reminder' }
  ];

  const addEmailContent = () => {
    const newEmail = {
      id: Date.now(), // temporary ID for frontend management
      type: 'welcome',
      subject: '',
      content: '',
      links: ['']
    };
    setAdditionalEmails([...additionalEmails, newEmail]);
  };

  const removeEmailContent = (id) => {
    setAdditionalEmails(additionalEmails.filter(email => email.id !== id));
  };

  const updateEmailContent = (id, field, value) => {
    setAdditionalEmails(additionalEmails.map(email =>
      email.id === id ? { ...email, [field]: value } : email
    ));
  };

  const addLinkToEmail = (emailId) => {
    setAdditionalEmails(additionalEmails.map(email =>
      email.id === emailId ? { ...email, links: [...email.links, ''] } : email
    ));
  };

  const updateEmailLink = (emailId, linkIndex, value) => {
    setAdditionalEmails(additionalEmails.map(email =>
      email.id === emailId
        ? {
            ...email,
            links: email.links.map((link, index) =>
              index === linkIndex ? value : link
            )
          }
        : email
    ));
  };

  const removeLinkFromEmail = (emailId, linkIndex) => {
    setAdditionalEmails(additionalEmails.map(email =>
      email.id === emailId
        ? {
            ...email,
            links: email.links.filter((_, index) => index !== linkIndex)
          }
        : email
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMasterclass || !startDate || !endDate) {
      setToast({
        isVisible: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setToast({
        isVisible: true,
        message: "End date must be after start date",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    dispatch(showOverlay());

    try {
      const masterclass = masterclasses.find(
        (m) => m._id === selectedMasterclass
      );

      // Clean up additional emails - remove temporary IDs and empty links
      const cleanedAdditionalEmails = additionalEmails.map(email => ({
        type: email.type,
        subject: email.subject,
        content: email.content,
        links: email.links.filter(link => link.trim() !== '')
      })).filter(email => email.subject.trim() !== '' && email.content.trim() !== '');

      await axios.post(
        `${apiUrl}/api/v1/cohort/create-cohort`,
        {
          title: masterclass.title,
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          additionalEmailContent: cleanedAdditionalEmails
        },
        {
          withCredentials: true,
        }
      );

      setToast({
        isVisible: true,
        message: "Cohort created successfully!",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        dispatch(hideOverlay());
        dispatch(fetchCohorts());
      }, 1500);
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.response?.data?.message || "Error creating cohort",
        type: "error",
      });
      dispatch(hideOverlay());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-xl font-bold text-[var(--d4a-black)]">
                Create New Cohort
              </h3>
              <button
                onClick={onClose}
                className="text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    Masterclass *
                  </label>
                  <select
                    value={selectedMasterclass}
                    onChange={(e) => setSelectedMasterclass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    required
                  >
                    <option value="">Select Masterclass</option>
                    {masterclasses.map((masterclass) => (
                      <option key={masterclass._id} value={masterclass._id}>
                        {masterclass.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Email Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-[var(--d4a-black)]">
                    Additional Email Content
                  </h4>
                  <button
                    type="button"
                    onClick={addEmailContent}
                    className="px-3 py-2 text-sm font-medium text-white bg-[var(--d4a-blue)] rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Email
                  </button>
                </div>

                {additionalEmails.map((email) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                            Email Type
                          </label>
                          <select
                            value={email.type}
                            onChange={(e) => updateEmailContent(email.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                          >
                            {emailTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={email.subject}
                            onChange={(e) => updateEmailContent(email.id, 'subject', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                            placeholder="Email subject"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeEmailContent(email.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                        Content
                      </label>
                      <textarea
                        value={email.content}
                        onChange={(e) => updateEmailContent(email.id, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                        placeholder="Email content"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-[var(--d4a-black)]">
                          Links
                        </label>
                        <button
                          type="button"
                          onClick={() => addLinkToEmail(email.id)}
                          className="text-sm text-[var(--d4a-blue)] hover:text-opacity-80 transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>

                      {email.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2 mb-2">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => updateEmailLink(email.id, linkIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                            placeholder="https://example.com"
                          />
                          {email.links.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLinkFromEmail(email.id, linkIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {additionalEmails.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No additional emails configured</p>
                    <p className="text-sm">Click "Add Email" to create custom email content</p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-sm font-medium text-white bg-[var(--d4a-blue)] rounded-md hover:bg-opacity-90 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Creating Cohort..." : "Create Cohort"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
};

export default AddCohortModal;