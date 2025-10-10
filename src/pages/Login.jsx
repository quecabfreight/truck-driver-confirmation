import React from "react";
import "./login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/logo.png"
          alt="QueCab AdbS Logo"
          className="logo"
        />
        <h1 className="login-title">QueCab AdbS Login</h1>
        <form className="login-form">
          <input type="text" placeholder="Broker or Shipper ID" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
