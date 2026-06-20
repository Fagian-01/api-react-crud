import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AppContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getPost() {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        setPost(data.post);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          navigate("/");
        }
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-3xl mx-auto my-6">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors group">
        <svg className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to articles
      </Link>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold animate-pulse text-sm">Loading article...</p>
        </div>
      ) : post ? (
        <div className="space-y-8 bg-white border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/50">
          
          {/* Header Info */}
          <div className="space-y-6 pb-6 border-b border-slate-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="avatar-placeholder w-11 h-11 text-base font-bold">
                  {getInitials(post.user?.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{post.user?.name || "Anonymous"}</h3>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                    AUTHOR
                  </p>
                </div>
              </div>
              
              <div className="text-right text-xs text-slate-400">
                <p className="font-semibold uppercase tracking-wider mb-0.5">Published</p>
                <p className="font-medium text-slate-500">{formatDate(post.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {post.body}
            </p>
          </div>

          {/* User Controls */}
          {user && user.id === post.user_id && (
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 italic">
                You own this article
              </span>

              <div className="flex items-center gap-3">
                <Link
                  to={`/posts/update/${post.id}`}
                  className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-bold rounded-xl text-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Article
                </Link>

                <form onSubmit={handleDelete}>
                  <button className="inline-flex items-center px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold rounded-xl text-sm transition-all duration-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete Article
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-md space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Article Not Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              This article does not exist or may have been deleted by the author.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition-all text-sm"
          >
            Return to Feed
          </Link>
        </div>
      )}
    </div>
  );
}
