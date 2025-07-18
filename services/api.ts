"use client";

import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

// GET
export const getData = async (endpoint: string, config = {}) => {
  try {
    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST
export const postData = async (endpoint: string, data: any, config = {}) => {
  try {
    const response = await axiosInstance.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// PUT
export const updateData = async (endpoint: string, data: any, config = {}) => {
  try {
    const response = await axiosInstance.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deleteData = async (endpoint: string, config = {}) => {
  try {
    const response = await axiosInstance.delete(endpoint, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

//  Common error handler
function handleError(error: any) {
  const err = error as AxiosError;

  if (err.response) {
    // Server responded with a status outside 2xx
    console.error("Response Error:", err.response.data);
    throw err.response.data as any;
  } else if (err.request) {
    // Request made but no response
    console.error("Request Error:", err.request);
    throw new Error("No response received from server");
  } else {
    // Other error
    console.error("Unknown Error:", err.message);
    throw new Error(err.message);
  }
}
