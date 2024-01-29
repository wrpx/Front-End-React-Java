// apiService.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
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
    if (axios.isCancel(error)) {
      throw new Error("คำขอถูกยกเลิก");
    } else if (!error.response) {
      throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } else {
      throw new Error(
        error.response.data.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
      );
    }
  }
};

const apiService = {
  listProducts: () => handleRequest("/products", "get"),
  deleteProduct: (itemId) => handleRequest(`/products/${itemId}`, "delete"),
  updateProduct: (itemId, data) =>
    handleRequest(`/products/${itemId}`, "put", data),
  createProduct: (data) => handleRequest("/products", "post", data),
  login: async (data) => {
    const response = await handleRequest("/auth/login", "post", data);
    if (response && response.token) {
      localStorage.setItem("authToken", response.token);
    }
    return response;
  },
  register: (data) => handleRequest("/auth/register", "post", data),
};

export default apiService;
