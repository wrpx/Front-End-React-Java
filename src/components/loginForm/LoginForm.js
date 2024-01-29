///LoginForm.js
import React, { useState } from "react";
import "./LoginForm.css";
import apiService from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const LoginForm = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    try {
      await apiService.login({
        username: loginUsername,
        password: loginPassword,
      });
      login();
      navigate("/products");
    } catch (error) {
      if (error.response && error.response.data) {
        setError("Login failed: " + error.response.data);
        console.error("Server Response:", error.response.data);
      } else {
        setError("Login failed: An unknown error occurred");
        console.error("Login Error:", error);
      }
    }
  };

  const handleSignup = async () => {
    try {
      const response = await apiService.register({
        username: signupUsername,
        password: signupPassword,
      });
      console.log("Signup successful", response);
    } catch (error) {
      if (error.response && error.response.data) {
        setError("Signup failed: " + error.response.data);
        console.error("Server Response:", error.response.data);
      } else {
        setError("Signup failed: An unknown error occurred");
        console.error("Signup Error:", error);
      }
    }
  };

  const handleSubmit = (event, isLogin) => {
    event.preventDefault();
    setError("");
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <>
      <div className="login-form-container flex flex-col items-center justify-center">
        <div className="main">
          <input type="checkbox" id="chk" aria-hidden="true" />

          <div className="signup">
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <label htmlFor="chk" aria-hidden="true">
                Sign up
              </label>
              <input
                type="text"
                placeholder="Username"
                required
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="submit">Sign up</button>
            </form>
          </div>

          <div className="login">
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <label htmlFor="chk" aria-hidden="true">
                Login
              </label>
              <input
                type="text"
                placeholder="Username"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        {error && (
          <div className="flex justify-center ">
            <div
              className="error-message mt-3 text-sm text-red-600 bg-red-100
             border-l-4 border-red-500 p-4 rounded-[10px]"
            >
              {error}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginForm;
