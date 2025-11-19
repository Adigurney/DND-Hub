import { Outlet, Link } from "react-router-dom";

export default function SideBar() {
  const buttonStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    background: "#c79f4b",
    border: "2px solid #5a3e1b",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "Cinzel, serif",
    fontSize: "1rem",
    textAlign: "left",
  };

  return (
    <div className="app-container">
      {/* SIDEBAR — ALWAYS VISIBLE */}
      <div className="sidebar">
        <h2>⚔️ Adventurer's Menu</h2>

        <Link to="/" style={{ textDecoration: "none" }}>
          <button style={buttonStyle}>🏠 Home</button>
        </Link>

        <Link to="/create" style={{ textDecoration: "none" }}>
          <button style={buttonStyle}>✏️ Create Quest</button>
        </Link>

        <Link to="/browse" style={{ textDecoration: "none" }}>
          <button style={buttonStyle}>📜 Browse Quests</button>
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet /> {/* 👈 Pages render here */}
      </main>
    </div>
  );
}