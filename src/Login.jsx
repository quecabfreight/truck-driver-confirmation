import React, { useState } from "react";
import "./styles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    alert(`Logging in as ${email} with code ${accessCode}`);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <label>Access Code</label>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
        />
        <div className="remember-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <span>Remember this device</span>
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
