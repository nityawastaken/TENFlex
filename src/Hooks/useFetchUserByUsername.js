import axios from "axios";
import React from "react";

const useFetchUserByUsername = () => {
  const fetchUser = async (userName) => {
    if (!userName) return null;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/base/get_user_by_username/${userName}`
      );

      if (response.status === 200) {
        return response.data; // return full user data (id, is_freelancer, etc.)
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  return fetchUser;
};

export default useFetchUserByUsername;