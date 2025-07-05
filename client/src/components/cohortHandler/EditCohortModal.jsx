import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../features/overlay/overlaySlice";
import Toast from "../Toast";
import axios from "axios";
import { fetchCohorts } from "../../features/cohorts/cohortsSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const EditCohortModal = ({ onClose, masterclasses, cohort }) => {
  const dispatch = useDispatch();
  const [selectedMasterclass, setSelectedMasterclass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("17:00");
  const [price, setPrice] = useState(0);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState({
    type: '',
    subject: '',
    content: '',
    links: [{ name: '', link: '' }]
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const emailTypes = [
    { value: '', label: 'Select Email Type' },
    { value: 'welcome', label: 'Welcome Email' },
    { value: '7day', label: '7 Day Reminder' },
    { value: '2day', label: '2 Day Reminder' },
    { value: 'dayOf', label: 'Day Of Event' },
    { value: 'lastDay', label: 'Last Day Reminder' }
  ];

  useEffect(() => {
    dispatch(showOverlay());
    return () => dispatch(hideOverlay());
  }, [dispatch]);

  useEffect(() => {
    if (cohort) {
      const matching = masterclasses.find((m) => m._id === cohort.masterclassId);
      setSelectedMasterclass(cohort.masterclassId);
      setStartDate(cohort.startDate?.substring(0, 10) || "");
      setEndDate(cohort.endDate?.substring(0, 10) || "");
      setStartTime(cohort.startTime || "08:30");
      setEndTime(cohort.endTime || "17:00");
      setPrice(cohort.masterclassPrice || 0);
      setAdditionalEmails(cohort.additionalEmailContent || []);
    }
  }, [cohort, masterclasses]);

  const startAddingEmail = () => {
    setIsAddingEmail(true);
    setNewEmail({
      type: '',
      subject: '',
      content: '',
      links: [{ name: '', link: '' }]
    });
  };

  const cancelAddingEmail = () => {
    setIsAddingEmail(false);
  };

  const addNewEmail = () => {
    if (!newEmail.type || !newEmail.subject || !newEmail.content) {
      setToast({
        isVisible: true,
        message: "Please fill all required email fields",
        type: "error",
      });
      return;
    }

    const emailToAdd = {
      id: Date.now(),
      type: newEmail.type,
      subject: newEmail.subject,
      content: newEmail.content,
      links: newEmail.links.filter(link => link.name.trim() !== '' && link.link.trim() !== '')
    };

    setAdditionalEmails([...additionalEmails, emailToAdd]);
    setIsAddingEmail(false);
  };

  const updateNewEmail = (field, value) => {
    setNewEmail({ ...newEmail, [field]: value });
  };

  const addLinkToNewEmail = () => {
    setNewEmail({
      ...newEmail,
      links: [...newEmail.links, { name: '', link: '' }]
    });
  };

  const updateNewEmailLink = (linkIndex, field, value) => {
    const updatedLinks = newEmail.links.map((link, index) =>
      index === linkIndex ? { ...link, [field]: value } : link
    );
    setNewEmail({ ...newEmail, links: updatedLinks });
  };

  const removeLinkFromNewEmail = (linkIndex) => {
    const updatedLinks = newEmail.links.filter((_, index) => index !== linkIndex);
    setNewEmail({ ...newEmail, links: updatedLinks });
  };

  const removeEmailContent = (id) => {
    setAdditionalEmails(additionalEmails.filter(email => email.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMasterclass || !startDate || !endDate || !price) {
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

    const masterclass = masterclasses.find((m) => m._id === selectedMasterclass);
    const masterclassName = masterclass?.title || 'Unknown Masterclass';

    const confirmationMessage = `Please confirm these details:\n\nMasterclass: ${masterclassName}\nPrice: KES ${price.toLocaleString()}\nStart Date: ${startDate} at ${startTime}\nEnd Date: ${endDate}\nAdditional Emails: ${additionalEmails.length}\n\nAre these details correct?`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    setIsSubmitting(true);
    dispatch(showOverlay());

    try {
      const cleanedAdditionalEmails = additionalEmails.map(email => ({
        type: email.type,
        subject: email.subject,
        content: email.content,
        links: email.links.filter(linkObj => linkObj.name.trim() !== '' && linkObj.link.trim() !== '')
      })).filter(email => email.subject.trim() !== '' && email.content.trim() !== '');

      await axios.put(
        `${apiUrl}/api/v1/cohort/update`,
        {
          cohortId: cohort._id,
          masterclassId: selectedMasterclass,
          masterclassPrice: price,
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
        message: "Cohort updated successfully!",
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
        message: error.response?.data?.message || "Error updating cohort",
        type: "error",
      });
      dispatch(hideOverlay());
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmailTypeLabel = (value) => {
    const type = emailTypes.find(t => t.value === value);
    return type ? type.label : 'Unknown Type';
  };

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[98vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-xl font-bold text-[var(--d4a-black)]">
                Edit Cohort
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    Masterclass <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedMasterclass}
                    onChange={(e) => setSelectedMasterclass(e.target.value)}
                    className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm cursor-not-allowed"
                    required
                    disabled={true}
                  >
                    <option value="" disabled>Select Masterclass</option>
                    {masterclasses.map((masterclass) => (
                      <option key={masterclass._id} value={masterclass._id}>
                        {masterclass.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                    required
                    min="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
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
                      className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
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
                      className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-[var(--d4a-black)]">
                    Additional Email Content
                  </h4>
                  {!isAddingEmail && (
                    <button
                      type="button"
                      onClick={startAddingEmail}
                      className="px-1.5 py-1.5 text-sm font-medium text-white bg-[var(--d4a-blue)] rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Email content
                    </button>
                  )}
                </div>

                {additionalEmails.map((email) => (
                  <div key={email._id || email.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-700">
                          {getEmailTypeLabel(email.type)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEmailContent(email._id || email.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <strong>{email.subject}</strong>
                      <p className="whitespace-pre-line">{email.content}</p>
                    </div>

                    {email.links.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-500 mb-1">LINKS</div>
                        <div className="space-y-1">
                          {email.links.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[var(--d4a-blue)] hover:underline"
                              >
                                {link.name || link.link}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isAddingEmail && (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                          Email Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newEmail.type}
                          onChange={(e) => updateNewEmail('type', e.target.value)}
                          className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                          required
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
                          Subheading <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newEmail.subject}
                          onChange={(e) => updateNewEmail('subject', e.target.value)}
                          className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                          placeholder="Email subheading"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={newEmail.content}
                        onChange={(e) => updateNewEmail('content', e.target.value)}
                        rows={4}
                        className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                        placeholder="Email content"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-[var(--d4a-black)]">
                          Links (Optional)
                        </label>
                        <button
                          type="button"
                          onClick={addLinkToNewEmail}
                          className="text-sm text-[var(--d4a-blue)] hover:text-opacity-80 transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>

                      {newEmail.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="space-y-2 mb-3 p-3 bg-gray-50 rounded-md">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-[var(--d4a-black)] mb-1">
                                Link Name
                              </label>
                              <input
                                type="text"
                                value={link.name}
                                onChange={(e) => updateNewEmailLink(linkIndex, 'name', e.target.value)}
                                className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                                placeholder="Link display name"
                              />
                            </div>

                            <div className="flex-1">
                              <label className="block text-xs font-medium text-[var(--d4a-black)] mb-1">
                                URL
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  value={link.link}
                                  onChange={(e) => updateNewEmailLink(linkIndex, 'link', e.target.value)}
                                  className="w-full px-1.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent text-sm"
                                  placeholder="https://example.com"
                                />
                                {newEmail.links.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLinkFromNewEmail(linkIndex)}
                                    className="self-end text-red-500 hover:text-red-700 transition-colors mb-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={cancelAddingEmail}
                        className="px-4 py-2 text-sm font-medium text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addNewEmail}
                        disabled={!newEmail.type || !newEmail.subject || !newEmail.content}
                        className={`px-6 py-2 text-sm font-medium text-white bg-[var(--d4a-blue)] rounded-md hover:bg-opacity-90 transition-colors ${!newEmail.type || !newEmail.subject || !newEmail.content
                            ? "opacity-80 cursor-not-allowed"
                            : ""
                          }`}
                      >
                        Add content
                      </button>
                    </div>
                  </div>
                )}

                {additionalEmails.length === 0 && !isAddingEmail && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No additional emails configured</p>
                    <p className="text-sm">Click "Add content" to create custom email content</p>
                  </div>
                )}
              </div>

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
                  className={`px-6 py-2 text-sm font-medium text-white bg-[var(--d4a-red)] rounded-md hover:bg-opacity-90 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Updating Cohort..." : "Update Cohort"}
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

export default EditCohortModal;