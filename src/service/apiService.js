// apiService.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

const apiService = {
  baseURL: "http://localhost:5000/api",
  fetchData: async (url, method, data = null) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axiosInstance({ method, url, data, headers });
      return response.data;
    } catch (error) {
      console.error(`Error ${method} data at ${url}:`, error);
      throw error;
    }
  },

  listProducts: async () => {
    return apiService.fetchData(`${apiService.baseURL}/product/list`, "get");
  },

  deleteProduct: async (itemId) => {
    return apiService.fetchData(
      `${apiService.baseURL}/product/${itemId}/delete`,
      "delete",
      null
    );
  },
  updateProduct: async (itemId, data) => {
    return apiService.fetchData(
      `${apiService.baseURL}/product/${itemId}`,
      "put",
      data
    );
  },

  createProduct: async (data) => {
    return apiService.fetchData(
      `${apiService.baseURL}/product/create`,
      "post",
      data
    );
  },

  login: async (data) => {
    try {
      const response = await apiService.fetchData(
        `${apiService.baseURL}/login`,
        "post",
        data
      );
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
      }
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      return await apiService.fetchData(
        `${apiService.baseURL}/register`,
        "post",
        data
      );
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
};

export default apiService;
