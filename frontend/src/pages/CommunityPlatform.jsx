import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Filter,
  MapPin,
  PlusCircle,
  AlertTriangle,
  Send,
  Loader2,
  Award,
  HelpCircle,
  Lightbulb,
  Bell,
  CheckCircle2,
  Video,
  Play,
  Share2,
  Radio,
  BookOpen,
  ArrowUp,
  ShieldCheck
} from 'lucide-react';

export const CommunityPlatform = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Proximity Alert Dismiss state
  const [alertDismissed, setAlertDismissed] = useState(false);

  // New Post State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Questions');
  const [district, setDistrict] = useState('Matale');
  const [content, setContent] = useState('');

  // Comment State Map
  const [commentInputs, setCommentInputs] = useState({});

  const categories = ['ALL', 'Questions', 'Discussion', 'Tips', 'Pest Alerts', 'Video Guides'];
  const districts = ['ALL', 'Matale', 'Kurunegala', 'Nuwara Eliya', 'Kandy', 'Anuradhapura', 'Jaffna', 'Badulla'];

  const VIDEO_TUTORIALS = [
    {
      id: 'VID-1',
      title: 'How to Prepare 10,000 PPM Botanical Neem Extract',
      duration: '4:15 min',
      author: 'Sunil Weerasinghe (Master Organic Grower)',
      views: '1,420 views',
      thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      tag: 'Bio-Pesticide'
    },
    {
      id: 'VID-2',
      title: 'Trichoderma Harzianum Seed Inoculation Technique',
      duration: '6:30 min',
      author: 'Dr. K. L. Perera (Agronomist)',
      views: '2,890 views',
      thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      tag: 'Seed Treatment'
    },
    {
      id: 'VID-3',
      title: 'Flushing & Acid-Washing Micro-Drip Irrigation Lines',
      duration: '5:45 min',
      author: 'Lanka Hydro-Tech Solutions',
      views: '980 views',
      thumbnail: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
      tag: 'Irrigation Maintenance'
    }
  ];

  const MOCK_POSTS = [
    {
      id: 1,
      title: 'Best organic method to combat Tomato Early Blight in wet weather?',
      category: 'Questions',
      district: 'Nuwara Eliya',
      authorName: 'R. K. Bandara',
      content: 'With the sudden 80mm rainfall in Nuwara Eliya, early blight spots are appearing on lower foliage. Has anyone tried copper hydroxide vs baking soda neem spray with success?',
      upvotes: 42,
      createdAt: '2 hours ago',
      verifiedAnswer: {
        author: 'Dr. K. L. Perera (Extension Officer)',
        text: 'Prune the bottom 15cm leaves immediately to stop soil splashback. Spray Copper Hydroxide 77% WP @ 50ml per 16L tank before 08:30 AM.'
      },
      comments: [
        { authorName: 'Kamal Silva', text: 'Pruning lower leaves and switching to drip helped my plot last season.' }
      ]
    },
    {
      id: 2,
      title: '🚨 Armyworm Alert: Spreading across Galewela corn and paddy fields',
      category: 'Pest Alerts',
      district: 'Matale',
      authorName: 'Priyantha Jayakody',
      content: 'Urgent notice for farmers within 15km of Galewela: Fall Armyworm egg clusters spotted on young maize crops. Inspect underside of leaves immediately.',
      upvotes: 89,
      createdAt: '4 hours ago',
      comments: []
    },
    {
      id: 3,
      title: 'Tip: Intercropping Marigolds with Chillies cuts Whitefly Infestation by 40%',
      category: 'Tips',
      district: 'Jaffna',
      authorName: 'T. Vigneswaran',
      content: 'Planting yellow African marigolds every 10 chilli rows acts as a natural decoy repellent against whiteflies and thrips. My pesticide usage dropped by half.',
      upvotes: 67,
      createdAt: 'Yesterday',
      comments: [
        { authorName: 'S. Gunawardena', text: 'Tested this in Welimada! Works very well with sticky traps.' }
      ]
    }
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await communityAPI.getPosts(selectedCategory, selectedDistrict);
      if (res && res.data && res.data.length > 0) {
        setPosts(res.data);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch (err) {
      console.warn('Community API offline. Loading fallback data:', err);
      setPosts(MOCK_POSTS);
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
    const newPost = {
      id: Date.now(),
      title,
      category,
      district,
      content,
      authorName: user?.email ? user.email.split('@')[0] : 'Farmer',
      upvotes: 1,
      createdAt: 'Just now',
      comments: []
    };

    try {
      await communityAPI.createPost({
        title,
        category,
        district,
        content,
        authorEmail: user?.email || 'farmer@agrolink.com',
        authorName: user?.email ? user.email.split('@')[0] : 'Farmer',
      });
    } catch (err) {
      // fallback
    }

    setPosts((prev) => [newPost, ...prev]);
    setTitle('');
    setContent('');
    setShowCreateForm(false);
    setSubmitting(false);
  };

  const handleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), { authorName: user?.email ? user.email.split('@')[0] : 'You', text }]
          };
        }
        return p;
      })
    );
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>National Farmer Peer Knowledge Exchange</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Farmer Community &amp; Pest Network 👥🌾
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Connect with fellow growers across Sri Lanka. Ask agronomy questions, upvote verified organic pest remedies, broadcast localized proximity alerts, and watch practical video tutorials.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showCreateForm ? 'Close Form' : 'Start Community Thread ✍️'}</span>
          </button>
        </div>
      </div>

      {/* REGIONAL PROXIMITY PEST ALERT BANNER (15KM RADIUS) */}
      {!alertDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-600/60 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
              <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Proximity Alert • 8.4 km Away
                </span>
                <span className="text-xs text-rose-300 font-bold">Galewela &amp; Dambulla Corridor</span>
              </div>
              <h3 className="text-base font-extrabold text-white font-display mt-0.5">
                Fall Armyworm Infestation Detected in Neighboring Maize &amp; Paddy Fields
              </h3>
              <p className="text-xs text-slate-300">
                Recommended Action: Inspect underside of leaves for fuzzy egg clusters. Apply biological Neem spray if spotted.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAlertDismissed(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer self-end md:self-auto shrink-0"
          >
            Dismiss Alert ✕
          </button>
        </motion.div>
      )}

      {/* CREATE POST FORM MODAL */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4"
        >
          <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
            ✍️ Post Question, Pest Alert or Farming Tip
          </h3>

          <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Thread Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to prevent blossom end rot in tomatoes?"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
              >
                <option value="Questions">❓ Questions</option>
                <option value="Discussion">💬 Discussion</option>
                <option value="Tips">💡 Farming Tips</option>
                <option value="Pest Alerts">🚨 Pest Alerts</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">District Location</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
              >
                {districts.filter(d => d !== 'ALL').map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Content &amp; Symptoms</label>
              <textarea
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your question, observation, or remedy..."
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Publish to National Farmer Community 🚀</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* BEST PRACTICE VIDEO GUIDES CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Step-by-Step Agronomy Video Tutorials
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">DOA Verified Masterclasses</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VIDEO_TUTORIALS.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl transition"
            >
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-emerald-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer">
                    <Play className="w-5 h-5 fill-emerald-700 ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-emerald-300 text-[10px] font-black uppercase">
                  {vid.tag}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                  {vid.duration}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{vid.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{vid.author}</p>
                <span className="text-[10px] font-bold text-slate-400 block">{vid.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> District:
          </span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 cursor-pointer"
          >
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist === 'ALL' ? '📍 All Districts' : dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMMUNITY THREADS FEED */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading community threads...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-lg transition"
              >
                {/* POST HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] uppercase border border-emerald-200">
                      {post.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• 📍 {post.district}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold">{post.createdAt}</span>
                </div>

                {/* POST BODY */}
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900 font-display">{post.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{post.content}</p>
                </div>

                {/* VERIFIED AGRONOMIST ANSWER IF PRESENT */}
                {post.verifiedAnswer && (
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified Agronomist Recommendation ({post.verifiedAnswer.author}):</span>
                    </div>
                    <p className="text-slate-700 font-medium pl-5">{post.verifiedAnswer.text}</p>
                  </div>
                )}

                {/* UPVOTE & COMMENTS FOOTER */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{post.upvotes || 0} Upvotes</span>
                    </button>

                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {(post.comments || []).length} Replies
                    </span>
                  </div>

                  {/* COMMENT INPUT */}
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write advice or reply..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {/* COMMENT LIST */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-1.5 pt-2 pl-4 border-l-2 border-slate-200 text-xs">
                    {post.comments.map((c, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl">
                        <strong className="text-slate-900 block text-[11px]">{c.authorName}:</strong>
                        <span className="text-slate-600">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CommunityPlatform;
