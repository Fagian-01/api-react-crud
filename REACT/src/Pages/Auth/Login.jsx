import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrors({ email: ["Unable to connect to the server. Please try again."] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-100/80 space-y-8">
        
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-indigo-50 text-indigo-600 p-3 rounded-2xl mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Please enter your credentials to login</p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email">Email Address</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}
                required
              />
            </div>
            {errors.email && (
              <p className="error">
                <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={errors.password ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}
              required
            />
            {errors.password && (
              <p className="error">
                <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                {errors.password[0]}
              </p>
            )}
          </div>

          <button className="primary-btn mt-6" disabled={loading}>
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </span>
            ) : "Log In"}
          </button>
        </form>

        {/* Card Footer */}
        <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
