"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <div
      style={{
        background: "#1A202C",
        border: "1px solid #2D3748",
        borderRadius: "8px",
        padding: "20px",
        width: "100%"
      }}
    >
      {/* Header title skeleton */}
      <div 
        className="pulse-opacity"
        style={{
          width: "40%",
          height: "20px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "24px"
        }}
      />

      {/* Line 1 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "100%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "12px"
        }}
      />

      {/* Line 2 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "92%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "12px"
        }}
      />

      {/* Line 3 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "85%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "12px"
        }}
      />

      {/* Line 4 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "60%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "24px"
        }}
      />

      {/* Subheading skeleton */}
      <div 
        className="pulse-opacity"
        style={{
          width: "30%",
          height: "18px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "16px",
          marginTop: "16px"
        }}
      />

      {/* Line 5 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "95%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "12px"
        }}
      />

      {/* Line 6 */}
      <div 
        className="pulse-opacity"
        style={{
          width: "75%",
          height: "16px",
          background: "#2D3748",
          borderRadius: "4px",
          marginBottom: "12px"
        }}
      />
    </div>
  );
}
