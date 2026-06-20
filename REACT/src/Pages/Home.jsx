import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getPosts() {
    try {
      const res = await fetch("/api/posts", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Banner / Hero section */}
      <div className="text-center py-6 max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 bg-clip-text text-transparent">
          Explore Latest Stories
        </h1>
        <p className="text-slate-500 text-base md:text-lg leading-relaxed">
          Stay updated with clean insights, technical write-ups, and developer experiences from our global creator community.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold animate-pulse text-sm">Fetching posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="post-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar-placeholder">
                    {getInitials(post.user?.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 text-sm">{post.user?.name || "Anonymous"}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Published on {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {post.body}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/posts/${post.id}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/btn"
                >
                  Read full article
                  <svg className="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m-2 3h2a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">No Posts Yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Be the first to share your thoughts, stories, and expertise with the developer community!
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm"
          >
            Write a Post
          </Link>
        </div>
      )}
    </div>
  );
}
