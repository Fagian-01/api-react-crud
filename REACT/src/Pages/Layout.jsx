import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout(e) {
    e.preventDefault();

    const res = await fetch("/api/logout", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      navigate("/");
    }
  }

  // Helper to determine if link is active
  const isActive = (path) => location.pathname === path;

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      <header className="shadow-sm backdrop-blur-md bg-white/80 border-b border-slate-200/50 sticky top-0 z-50">
        <nav className="flex items-center justify-between py-4 px-6 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              DevPost
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className={isActive("/") ? "nav-link-active" : "nav-link"}
            >
              Home
            </Link>

            {user ? (
              <div className="flex items-center pl-2 ml-2 border-l border-slate-200/80 space-x-4">
                <Link 
                  to="/create" 
                  className={isActive("/create") ? "nav-link-active" : "nav-link"}
                >
                  New Post
                </Link>
                
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-2xl py-1 px-3">
                  <div className="avatar-placeholder">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-700 leading-tight max-w-[120px] truncate">{user.name}</p>
                  </div>
                </div>

                <form onSubmit={handleLogout}>
                  <button className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center pl-2 ml-2 border-l border-slate-200/80 space-x-2">
                <Link 
                  to="/login" 
                  className={isActive("/login") ? "nav-link-active" : "nav-link"}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </>
  );
}
