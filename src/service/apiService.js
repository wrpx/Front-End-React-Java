// apiService.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

const setupInterceptors = () => {
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
};
setupInterceptors();

const prepareHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleRequest = async (url, method, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      headers: prepareHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error ${method} data at ${url}:`, error);
    throw error;
  }
};

const apiService = {
  // Product Operations
  listProducts: () => handleRequest("/product/list", "get"),
  deleteProduct: (itemId) =>
    handleRequest(`/product/${itemId}/delete`, "delete"),
  updateProduct: (itemId, data) =>
    handleRequest(`/product/${itemId}`, "put", data),
  createProduct: (data) => handleRequest("/product/create", "post", data),

  // Authentication
  login: async (data) => {
    const response = await handleRequest("/login", "post", data);
    if (response && response.token) {
      localStorage.setItem("authToken", response.token);
    }
    return response;
  },
  register: (data) => handleRequest("/register", "post", data),
};

export default apiService;
