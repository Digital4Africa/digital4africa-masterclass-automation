import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const loginAdmin = async (payload) => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/auth/login`, payload, {
      withCredentials: true
    });

    if (response.data?.success) {
      localStorage.setItem('Tr9kLmXzQ', response.data.accessToken);
      localStorage.setItem('d4aAdmin', JSON.stringify(response.data.admin));


      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message || "Error logging in" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || "Error logging in" };
  }
};

export default loginAdmin;
