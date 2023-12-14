///useAuthStore.js
import create from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  login: () => {
    localStorage.setItem("isAuthenticated", "true");
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
