import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useApiData = (baseUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to get the latest token dynamically
  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("eduuserInfo"));
    return userInfo?.token || "";
  };

  // Handle auth errors
  const handleAuthError = (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      // Clear localStorage
      localStorage.removeItem("eduuserInfo");
      // Redirect to home page
      navigate("/");
      return true;
    }
    return false;
  };

  // Create axios instance with interceptor for Authorization
  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle auth errors globally
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (handleAuthError(error)) {
        // If it was an auth error and handled, return a rejected promise
        return Promise.reject(new Error("Authentication failed"));
      }
      // For other errors, just pass through
      return Promise.reject(error);
    }
  );

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(baseUrl);
      setData(response.data.data);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data by ID
  const fetchById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`${baseUrl}/${id}`);
      return response.data.data;
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete by ID
  const deleteById = async (id) => {
    try {
      await axiosInstance.delete(`${baseUrl}/${id}`);
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    }
  };

  const updateWithOutById = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`${baseUrl}`, updatedData);
      setData(response.data.data);
      fetchData();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    }
  };

  const updateWithOutByData = async () => {
    try {
      const response = await axiosInstance.put(`${baseUrl}`);
      setData(response.data.data);
      fetchData();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    }
  };

  // Update data by ID
  const updateById = async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${baseUrl}/${id}`, updatedData);
      setData((prevData) =>
        prevData.map((item) => (item._id === id ? response.data.data : item))
      );
      fetchData();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
    }
  };

  // Add new data
  const addNew = async (newData) => {
    try {
      const response = await axiosInstance.post(baseUrl, newData);
      setData((prevData) => [...prevData, response.data.data]);
      fetchData();
      return response.data.data;
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message);
      }
      throw err; // Re-throw the error for the component to handle
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [baseUrl]);

  return {
    data,
    loading,
    error,
    fetchData,
    fetchById,
    updateWithOutById,
    deleteById,
    updateById,
    addNew,
  };
};

export default useApiData;
