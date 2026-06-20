import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, Link } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/posts", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrors({ title: ["Failed to connect to backend api."] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-6">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors group">
        <svg className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to articles
      </Link>

      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-100/80 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create New Article</h2>
          <p className="text-slate-400 text-sm">Write down your stories or insights to share with others</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="title">Article Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Mastering React Context API"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}
              required
            />
            {errors.title && (
              <p className="error">
                <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                {errors.title[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="body">Content / Body</label>
            <textarea
              id="body"
              rows="8"
              placeholder="Write your article body content here..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className={errors.body ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}
              required
            ></textarea>
            {errors.body && (
              <p className="error">
                <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                {errors.body[0]}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Article</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
