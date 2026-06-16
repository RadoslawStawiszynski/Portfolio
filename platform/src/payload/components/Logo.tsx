"use client";

export function AdminLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        PH
      </div>
      <span style={{ fontWeight: 700, fontSize: 16 }}>
        PortfolioHub
      </span>
    </div>
  );
}

export function AdminIcon() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
      }}
    >
      PH
    </div>
  );
}
