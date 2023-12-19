///App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import FormProduct from "./components/formProduct/FormProduct";
import LoginForm from "./components/loginForm/LoginForm";
import useAuthStore from "./store/useAuthStore";

function ProtectedRoute({ children }) {
  const authStore = useAuthStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/") {
      authStore.logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, authStore.logout]);
  return children;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/products"
            element={isAuthenticated ? <FormProduct /> : <Navigate to="/" />}
          />
        </Routes>
      </ProtectedRoute>
    </Router>
  );
}

export default App;
