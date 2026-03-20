import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <img src="/qc-logo.png" style={styles.logo} />
      </div>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/how-it-works" style={styles.link}>How It Works</Link>
        <Link to="/control-center" style={styles.link}>Control Center</Link>
        <Link to="/login" style={styles.link}>Log In</Link>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "#0c121c",
    borderBottom: "1px solid rgba(255,255,255,.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000
  },
  left: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    height: 40
  },
  right: {
    display: "flex",
    gap: 20
  },
  link: {
    color: "#e6edf5",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14
  }
};
