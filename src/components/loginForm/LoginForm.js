import React from "react";
import "./LoginForm.css";
import apiService from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import formProductStore from "../../store/formProductStore";

const LoginForm = () => {
  const {
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    signupUsername,
    setSignupUsername,
    signupPassword,
    setSignupPassword,
  } = formProductStore();

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (event, isLogin) => {
    event.preventDefault();

    const username = isLogin ? loginUsername : signupUsername;
    const password = isLogin ? loginPassword : signupPassword;
    const apiMethod = isLogin ? apiService.login : apiService.register;

    try {
      const response = await apiMethod({ username, password });
      if (isLogin) {
        login();
        navigate("/products");
      } else {
        console.log("Signup successful", response);
      }
    } catch (error) {
      console.error(isLogin ? "Login failed" : "Signup failed", error);
    }
  };

  return (
    <div className="login-form-container">
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
    </div>
  );
};

export default LoginForm;
