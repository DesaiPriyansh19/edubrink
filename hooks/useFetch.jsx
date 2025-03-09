import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    setError(null);

    try {
      // Retrieve and parse user info from localStorage dynamically
      const storedUserInfo = localStorage.getItem("eduuserInfo");
      const eduuserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      const token = eduuserInfo?.token;

      if (!token) {
        throw new Error("Authentication required. No token found.");
      }

      // Make API request with Authorization header
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      setError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (url) getData(); // Only fetch if URL is provided
  }, [url]);

  return { data, error, loading, refetch: getData }; // Add refetch function
}
