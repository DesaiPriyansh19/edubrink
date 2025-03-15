"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url, requiresAuth = true) {
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

      // Check if authentication is required but no token exists
      if (requiresAuth && !token) {
        throw new Error("Authentication required. No token found.");
      }

      // Configure request headers
      const headers = {};

      // Add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Make API request with or without Authorization header
      const response = await axios.get(url, { headers });

      setData(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error?.response?.data || error.message
      );
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
