import React from "react";
import "./Toast.css";

export default function Toast({ message, type = "success" }) {
  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}
