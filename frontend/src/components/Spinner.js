import React from "react";
import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="spinner-wrap" role="status" aria-label="Loading">
      <div className="spinner" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
