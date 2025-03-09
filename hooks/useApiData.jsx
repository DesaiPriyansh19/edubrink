import { useState, useEffect } from "react";
import axios from "axios";

const useApiData = (baseUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get the latest token dynamically
  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("eduuserInfo"));
    return userInfo?.token || "";
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

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(baseUrl);
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
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
      setError(err.message);
    }
  };

  const updateWithOutById = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`${baseUrl}`, updatedData);
      setData(response.data.data);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWithOutByData = async () => {
    try {
      const response = await axiosInstance.put(`${baseUrl}`);
      setData(response.data.data);
      fetchData();
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
    }
  };

  // Add new data
  const addNew = async (newData) => {
    try {
      const response = await axiosInstance.post(baseUrl, newData);
      setData((prevData) => [...prevData, response.data.data]);
      fetchData();
    } catch (err) {
      setError(err.message);
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
