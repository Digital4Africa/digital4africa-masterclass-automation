import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/Toast";
import MasterclassFormFields from "./MasterclassFormFields";
import { fetchMasterclasses } from "../../features/masterclass/fetchAllMasterclassesSlice";
import { useDispatch, useSelector } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL;

const EditMasterclassForm = () => {
  const { allMasterclasses } = useSelector((state) => state.allMasterclasses);
  // console.log(allMasterclasses);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { masterclassId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",

    price: "",
    heroImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [masterclassNotFound, setMasterclassNotFound] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  // useEffect to find and prefill masterclass data
  useEffect(() => {
    if (allMasterclasses && allMasterclasses.length > 0 && masterclassId) {
      const masterclassToEdit = allMasterclasses.find(
        (masterclass) => masterclass._id === masterclassId
      );

      if (masterclassToEdit) {


        setFormData({
          title: masterclassToEdit.title || "",
          description: masterclassToEdit.description || "",

          price: masterclassToEdit.price.toString() || "",
          heroImage: null, // Keep as null since we can't prefill file input
        });
        setMasterclassNotFound(false);
      } else {
        setMasterclassNotFound(true);
      }
    }
  }, [allMasterclasses, masterclassId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      heroImage: e.target.files[0],
    }));
  };
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      heroImage: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);


    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);

      formDataToSend.append("price", formData.price);
      if (formData.heroImage) {
        formDataToSend.append("heroImage", formData.heroImage);
      }

      const response = await axios.put(
        `${apiUrl}/api/v1/masterclass/update-masterclass/${masterclassId}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setToast({
        isVisible: true,
        message: response.data?.message || "Masterclass created successfully!",
        type: response.data?.success ? "success" : "error",
      });

      if (response.data?.success) {
        setTimeout(() => {
          navigate("/admin-home/masterclasses");
          dispatch(fetchMasterclasses());
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating masterclass:", error);
      setToast({
        isVisible: true,
        message:
          error.response?.data?.message || "Failed to create masterclass",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Show masterclass not found message
  if (masterclassNotFound) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0A7.962 7.962 0 014.5 12.5a7.963 7.963 0 011.793-5.049m8.486 0a7.962 7.962 0 011.793 5.049"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Masterclass Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The masterclass you're trying to edit could not be found.
          </p>
          <button
            onClick={() => navigate("/admin-home/masterclasses")}
            className="btn-primary px-6 py-2"
          >
            Return to Masterclasses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--d4a-blue)]">
          Edit Masterclass
        </h1>
        <p className="text-gray-600">
          Edit masterclass below details
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <MasterclassFormFields
          formData={formData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin-home/masterclasses")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary px-4 py-2 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Editing...
              </>
            ) : (
              "Edit Masterclass"
            )}
          </button>
        </div>
      </form>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
};

export default EditMasterclassForm;