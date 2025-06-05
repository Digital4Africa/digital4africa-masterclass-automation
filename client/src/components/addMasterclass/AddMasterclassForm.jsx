import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";
import MasterclassFormFields from "./MasterclassFormFields";
import { fetchMasterclasses } from "../../features/masterclass/fetchAllMasterclassesSlice";
import { useDispatch } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL;

const AddMasterclassForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    description: "",

    price: "",
    heroImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

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
    if (!formData.heroImage) {
      setToast({
        isVisible: true,
        message: "Please upload a hero image before submitting.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      
      formDataToSend.append("price", formData.price);
      if (formData.heroImage) {
        formDataToSend.append("heroImage", formData.heroImage);
      }

      const response = await axios.post(
        `${apiUrl}/api/v1/masterclass/add-masterclass`,
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--d4a-blue)]">
          Create New Masterclass
        </h1>
        <p className="text-gray-600">
          Fill in the details below to add a new masterclass
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
                Creating...
              </>
            ) : (
              "Create Masterclass"
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

export default AddMasterclassForm;
