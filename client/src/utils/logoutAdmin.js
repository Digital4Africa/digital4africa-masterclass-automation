import axios from "axios";
import { unsetUser } from "../features/auth/authSlice";

const apiUrl = import.meta.env.VITE_API_URL;

export const logoutAdmin = async (dispatch) => {

  try {
    await axios.post(`${apiUrl}/api/v1/auth/logout`, null, {
      withCredentials: true,
    });

    localStorage.removeItem("Tr9kLmXzQ");
    localStorage.removeItem("d4aAdmin");
	dispatch(unsetUser());

    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
