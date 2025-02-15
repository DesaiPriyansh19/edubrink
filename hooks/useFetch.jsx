import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    setError(null);

    // Retrieve and parse user info from localStorage
    const storedUserInfo = localStorage.getItem("eduuserInfo");
    const eduuserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    const token = eduuserInfo?.token; // Extract the token safely

    if (!token) {
      console.error("No token found! User may not be authenticated.");
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token correctly
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error.response || error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [url]);

  return { data, error, loading };
}
