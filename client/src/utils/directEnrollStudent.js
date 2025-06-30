import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const directEnrollStudent = async (data) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/enrollment/complete`,
        { ...data, isDirect: true },
        { withCredentials: true }
      );

      return {
        success: true,
        message: response.data.message || 'Direct enrollment successful',
        data: response.data.data || null,
      };
    } catch (error) {

        console.log(error);
      const errorMessage = error.response?.data?.message || 'Direct enrollment failed';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };