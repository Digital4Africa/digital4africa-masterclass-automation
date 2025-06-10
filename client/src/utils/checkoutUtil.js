import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const validateEnrollment = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/enrollment/validate`,
      data,
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      message: response.data.message || 'Validation successful',
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to validate enrollment';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const completeEnrollment = async (data) => {
 try {
   const response = await axios.post(
     `${apiUrl}/api/v1/enrollment/complete`,
     data,
     {
       withCredentials: true,
     }
   );

   return {
     success: true,
     message: response.data.message || 'Enrollment completed successfully',
     data: response.data.data || null,
   };
 } catch (error) {
	console.log(error);
   const errorMessage = error.response?.data?.message || 'Failed to complete enrollment';

   return {
     success: false,
     message: errorMessage,
   };
 }
};