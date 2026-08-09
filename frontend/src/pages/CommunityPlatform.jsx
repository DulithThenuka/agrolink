import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, MessageSquare, ThumbsUp, Sparkles, Filter, MapPin, PlusCircle, AlertTriangle, Send, Loader2, Award, HelpCircle, Lightbulb, Bell } from 'lucide-react';

export const CommunityPlatform = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New Post State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Questions');
  const [district, setDistrict] = useState('Matale');
  const [content, setContent] = useState('');

  // Comment State Map { postId: commentText }
  const [commentInputs, setCommentInputs] = useState({});
  const [aiSummarizing, setAiSummarizing] = useState({});

  const categories = ['ALL', 'Questions', 'Discussion', 'Tips', 'Success Stories', 'Local Alerts'];
  const districts = ['ALL', 'Matale', 'Kurunegala', 'Nuwara Eliya', 'Kandy', 'Anuradhapura'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await communityAPI.getPosts(selectedCategory, selectedDistrict);
      if (res && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedDistrict]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await communityAPI.createPost({
        title,
        category,
        district,
        content,
        authorEmail: user?.email || 'farmer@agrolink.com',
        authorName: user?.email ? user.email.split('@')[0] : 'Farmer',
      });

      if (res && res.data) {
        setTitle('');
        setContent('');
        setShowCreateForm(false);
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await communityAPI.likePost(postId);
      if (res && res.data) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? res.data : p)));
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await communityAPI.addComment(postId, text);
      if (res && res.data) {
        setCommentInputs({ ...commentInputs, [postId]: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleGenerateAiSummary = async (postId) => {
    setAiSummarizing({ ...aiSummarizing, [postId]: true });
    try {
      const res = await communityAPI.getAiSummary(postId);
      if (res && res.data) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? res.data : p)));
      }
    } catch (err) {
      console.error('Failed to generate AI summary:', err);
    } finally {
      setAiSummarizing({ ...aiSummarizing, [postId]: false });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> FARMER COMMUNITY &amp; LOCAL ALERT NETWORK
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• PEER-TO-PEER KNOWLEDGE</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
              Farmer Community Forum 👥
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
              Ask questions, discuss crop disease alerts, share farming tips, and read AI-summarized community discussions across districts in Sri Lanka.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showCreateForm ? 'Close Form' : 'Post Question / Local Alert 📝'}</span>
          </button>
        </div>
      </div>

      {/* CREATE POST COLLAPSIBLE CARD */}
      {showCreateForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            📝 Post to Community Forum
          </h3>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Has anyone seen this disease around Matale?"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="Questions">❓ Questions</option>
                  <option value="Discussion">💬 Discussion</option>
                  <option value="Tips">💡 Tips</option>
                  <option value="Success Stories">🏆 Success Stories</option>
                  <option value="Local Alerts">🚨 Local Alerts</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="Matale">Matale</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Discussion Content / Symptoms</label>
              <textarea
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your question, leaf symptoms, or local alert details for nearby farmers..."
                required
                className="w-full p-3 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Publish Post to Community 🚀</span>
            </button>
          </form>
        </motion.div>
      )}

      {/* DUAL FILTERS (CATEGORY & DISTRICT) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? '💬 All Posts' : cat}
            </button>
          ))}
        </div>

        {/* District Dropdown */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> District:
          </span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? '📍 All Districts' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMMUNITY DISCUSSIONS FEED */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading community discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Discussions Found</p>
            <p className="text-xs text-slate-500">Be the first to start a conversation in your district!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="premium-card p-6 bg-white border border-slate-100/90 shadow-md rounded-3xl space-y-4">
              
              {/* POST HEADER */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-sm">{post.authorName}</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {post.district}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-display">{post.title}</h3>
                </div>

                <button
                  onClick={() => handleGenerateAiSummary(post.id)}
                  disabled={aiSummarizing[post.id]}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  {aiSummarizing[post.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>Generate AI Summary 🤖</span>
                </button>
              </div>

              {/* POST CONTENT */}
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                {post.content}
              </p>

              {/* AI DISCUSSION SUMMARY BANNER */}
              {post.aiSummary && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white space-y-1 border border-indigo-800/80 shadow-md">
                  <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AgroLink AI Discussion Synthesizer
                  </span>
                  <p className="text-xs text-indigo-100 font-bold leading-normal">
                    {post.aiSummary}
                  </p>
                </div>
              )}

              {/* LIKES & REPLIES BAR */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 font-extrabold transition"
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>{post.likesCount} Helpful Votes</span>
                </button>

                <span className="text-slate-400 font-semibold">
                  💬 {post.comments.length} Farmer Responses
                </span>
              </div>

              {/* COMMENTS THREAD */}
              <div className="space-y-3 pt-2">
                {post.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <span className="font-extrabold text-slate-900 block">{c.authorName}</span>
                    <p className="text-slate-700 font-medium">{c.commentText}</p>
                  </div>
                ))}

                {/* ADD COMMENT INPUT */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    placeholder="Reply with local observation or agronomy advice..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
                  >
                    Reply 💬
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
