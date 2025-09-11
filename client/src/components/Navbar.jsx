export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated, setUser, isLoading, user } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (isLoading) return null; 
  if (!isAuthenticated) return null;

  return (
<nav style={{
  padding: "10px 20px",
  background: "#f5f5f5",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto", // left | center | spacer
  alignItems: "center",
  gap: "10px"
}}>
  {/* Left: links + logout button */}
  <div style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"          // wrap if viewport gets very small
  }}>
    <Link to="/">Home</Link>
    <Link to="/my-ratings">My Ratings</Link>
    <Link to="/recommendations">For You</Link>
    <Link to="/dashboard">Dashboard</Link>

    {/* Logout moved here with links */}
    <button onClick={handleLogout} style={{
      padding: "5px 10px",
      cursor: "pointer",
      borderRadius: "5px",
      border: "1px solid #ccc",
      background: "#fff",
      whiteSpace: "nowrap"
    }}>
      Logout
    </button>
  </div>

  {/* Center: logged-in text (stays centered) */}
  <h2 style={{
    margin: 0,
    fontSize: "16px",
    fontWeight: "normal",
    justifySelf: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: 0                // allow ellipsis in tight spaces
  }}>
    Logged In as: {user.name}
  </h2>

  {/* Right spacer (keeps center truly centered) */}
  <div />
</nav>
  );
}
