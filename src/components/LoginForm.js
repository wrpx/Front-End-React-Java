import React, { useState } from "react";
import "./LoginForm.css";
import apiService from "../service/apiService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const LoginForm = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      await apiService.login({
        username: loginUsername,
        password: loginPassword,
      });

      login();
      navigate("/products");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await apiService.register({
        username: signupUsername,
        password: signupPassword,
      });
      console.log("Signup successful", response);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="login-form-container">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleSubmitSignup}>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              placeholder="Username"
              required
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button type="submit">Sign up</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleSubmitLogin}>
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
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
