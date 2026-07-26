"use client";

import React, { useState } from "react";
import {
  Menu, X, Bell, ChevronDown,
  User, Settings, HelpCircle, LogOut, Sparkles
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const NAV_LABEL: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#94A3B8",
  letterSpacing: "0px",
};

const NOTIFICATION_ITEMS = [
  { title: "Gemini 1.5 Flash Model Upgraded",     time: "10 minutes ago" },
  { title: "Weekly usage summary report ready",   time: "2 hours ago" },
];

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const [isProfileOpen,       setIsProfileOpen]       = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const closeAll = () => { setIsProfileOpen(false); setIsNotificationsOpen(false); };

  return (
    <header
      aria-label="App navigation"
      style={{
        position:     "sticky",
        top:          0,
        zIndex:       40,
        width:        "100%",
        height:       "64px",
        background:   "#0F172A",
        borderBottom: "1px solid #1E293B",
        display:      "flex",
        alignItems:   "center",
      }}
    >
      <div
        style={{
          width:          "100%",
          maxWidth:       "none",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 24px",
          height:         "100%",
          gap:            "16px",
        }}
      >

        {/* ── LEFT: Mobile toggle + Logo ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>

          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            className="md:hidden"
            style={{
              alignItems:      "center",
              justifyContent:  "center",
              width:           "36px",
              height:          "36px",
              borderRadius:    "8px",
              border:          "1px solid #2D3748",
              background:      "transparent",
              color:           "#94A3B8",
              cursor:          "pointer",
              transition:      "color 150ms ease, background 150ms ease",
            }}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo mark */}
          <img src="/apexium logo.png" width={"150px"} alt="Apexium AI Studio" />
          {/* <a
            href="/"
            aria-label="Apexium AI home"
            style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
          >
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          "36px",
                height:         "36px",
                borderRadius:   "10px",
                background:     "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                boxShadow:      "0 2px 8px rgba(124, 58, 237, 0.3)",
                flexShrink:     0,
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>

            <span
              style={{
                fontSize:      "16px",
                fontWeight:    600,
                color:         "#FFFFFF",
                letterSpacing: "0.3px",
                lineHeight:    1,
              }}
            >
              Apexium AI
            </span>

            <span
              style={{
                background:    "#7C3AED",
                color:         "#FFFFFF",
                fontSize:      "12px",
                fontWeight:    500,
                padding:       "4px 10px",
                borderRadius:  "4px",
                marginLeft:    "4px",
                lineHeight:    1,
                whiteSpace:    "nowrap",
              }}
            >
              Studio
            </span>
          </a> */}
        </div>

        {/* ── CENTER: Title + tagline (hidden on small screens) ── */}
        <div
          className="hidden lg:flex"
          style={{ flexDirection: "column", alignItems: "flex-start", gap: "2px" }}
        >
          <span
            style={{
              fontSize:   "18px",
              fontWeight: 600,
              color:      "#E2E8F0",
              lineHeight: 1.2,
            }}
          >
            AI Content Studio
          </span>
          <span
            style={{
              fontSize:   "12px",
              fontWeight: 400,
              color:      "#94A3B8",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
            }}
          >
            Draft and generate content with enterprise-grade models
          </span>
        </div>

        {/* ── RIGHT: Notifications + Profile ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          "36px",
                height:         "36px",
                borderRadius:   "8px",
                border:         "1px solid #2D3748",
                background:     "transparent",
                color:          "#94A3B8",
                cursor:         "pointer",
                position:       "relative",
                transition:     "color 150ms ease, border-color 150ms ease",
              }}
            >
              <Bell size={18} />
              {/* Ping badge */}
              <span
                style={{
                  position:     "absolute",
                  top:          "8px",
                  right:        "8px",
                  width:        "7px",
                  height:       "7px",
                  borderRadius: "50%",
                  background:   "#7C3AED",
                  border:       "1.5px solid #0F172A",
                }}
              />
            </button>

            {isNotificationsOpen && (
              <div
                className="animate-slide-up"
                style={{
                  position:     "absolute",
                  right:        0,
                  top:          "calc(100% + 8px)",
                  width:        "300px",
                  background:   "#1A202C",
                  border:       "1px solid #2D3748",
                  borderRadius: "10px",
                  padding:      "12px",
                  boxShadow:    "0 16px 48px rgba(0,0,0,0.4)",
                  zIndex:       100,
                }}
              >
                <div
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    paddingBottom:  "10px",
                    borderBottom:   "1px solid #2D3748",
                    marginBottom:   "10px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>Notifications</span>
                  <span
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      color:      "#A78BFA",
                      fontSize:   "11px",
                      fontWeight: 500,
                      padding:    "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    2 new
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {NOTIFICATION_ITEMS.map((n, i) => (
                    <div
                      key={i}
                      style={{
                        padding:      "10px",
                        borderRadius: "6px",
                        cursor:       "pointer",
                        transition:   "background 150ms ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#252F3F")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#E2E8F0", marginBottom: "3px" }}>{n.title}</p>
                      <p style={{ fontSize: "11px", color: "#64748B" }}>{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User avatar / profile */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "8px",
                padding:      "4px 10px 4px 4px",
                borderRadius: "8px",
                border:       "1px solid #2D3748",
                background:   "transparent",
                cursor:       "pointer",
                transition:   "border-color 150ms ease, background 150ms ease",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width:          "28px",
                  height:         "28px",
                  borderRadius:   "50%",
                  background:     "linear-gradient(135deg, #7C3AED, #5B21B6)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "11px",
                  fontWeight:     700,
                  color:          "#FFFFFF",
                  flexShrink:     0,
                }}
              >
                JD
              </div>
              <span
                className="hidden sm:inline-block"
                style={{ fontSize: "13px", fontWeight: 500, color: "#CBD5E1" }}
              >
                John Doe
              </span>
              <ChevronDown
                size={14}
                color="#94A3B8"
                style={{ transition: "transform 200ms ease", transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {isProfileOpen && (
              <div
                className="animate-slide-up"
                style={{
                  position:     "absolute",
                  right:        0,
                  top:          "calc(100% + 8px)",
                  width:        "220px",
                  background:   "#1A202C",
                  border:       "1px solid #2D3748",
                  borderRadius: "10px",
                  padding:      "6px",
                  boxShadow:    "0 16px 48px rgba(0,0,0,0.4)",
                  zIndex:       100,
                }}
              >
                {/* Profile header */}
                <div style={{ padding: "10px 12px 10px", borderBottom: "1px solid #2D3748", marginBottom: "6px" }}>
                  <p style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Signed in as</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    john.doe@apexium.com
                  </p>
                </div>

                {[
                  { icon: User,        label: "My Profile" },
                  { icon: Settings,    label: "Settings" },
                  { icon: HelpCircle,  label: "Help & Docs" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "10px",
                      width:        "100%",
                      padding:      "9px 12px",
                      borderRadius: "6px",
                      border:       "none",
                      background:   "transparent",
                      fontSize:     "13px",
                      fontWeight:   400,
                      color:        "#CBD5E1",
                      cursor:       "pointer",
                      textAlign:    "left",
                      transition:   "background 150ms ease, color 150ms ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#252F3F"; e.currentTarget.style.color = "#E2E8F0"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                  >
                    <Icon size={15} style={{ opacity: 0.7, flexShrink: 0 }} />
                    {label}
                  </button>
                ))}

                <div style={{ borderTop: "1px solid #2D3748", marginTop: "6px", paddingTop: "6px" }}>
                  <button
                    type="button"
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "10px",
                      width:        "100%",
                      padding:      "9px 12px",
                      borderRadius: "6px",
                      border:       "none",
                      background:   "transparent",
                      fontSize:     "13px",
                      fontWeight:   400,
                      color:        "#EF4444",
                      cursor:       "pointer",
                      textAlign:    "left",
                      transition:   "background 150ms ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <LogOut size={15} style={{ opacity: 0.8, flexShrink: 0 }} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close dropdowns on outside click (overlay) */}
          {(isProfileOpen || isNotificationsOpen) && (
            <div
              onClick={closeAll}
              style={{ position: "fixed", inset: 0, zIndex: 90 }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </header>
  );
}
