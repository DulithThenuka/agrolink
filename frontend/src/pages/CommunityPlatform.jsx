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
  ShieldCheck,
  Search,
  X,
  Zap,
  Check,
  Clock,
  Eye,
  SlidersHorizontal,
  Flame,
  BadgeCheck,
  TrendingUp,
  Tag
} from 'lucide-react';

const VIDEO_TUTORIALS = [
  {
    id: 'VID-1',
    title: 'How to Prepare 10,000 PPM Botanical Neem Bio-Extract',
    duration: '4:15 min',
    author: 'Sunil Weerasinghe (Master Organic Grower)',
    views: '1,420 views',
    thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    tag: 'Bio-Pesticide',
    description: 'Crushing fresh neem seeds with organic soap emulsifier to control armyworms and leafminers without toxic chemical residues.'
  },
  {
    id: 'VID-2',
    title: 'Trichoderma Harzianum Seed Inoculation Technique',
    duration: '6:30 min',
    author: 'Dr. K. L. Perera (DOA Agronomist)',
    views: '2,890 views',
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    tag: 'Seed Treatment',
    description: 'Biological root inoculation to prevent soil-borne damping-off and Fusarium wilt in highland vegetable nurseries.'
  },
  {
    id: 'VID-3',
    title: 'Flushing & Acid-Washing Micro-Drip Irrigation Lines',
    duration: '5:45 min',
    author: 'Lanka Hydro-Tech Solutions',
    views: '980 views',
    thumbnail: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
    tag: 'Irrigation Tech',
    description: 'Preventing emitter clogging from calcium and iron deposits using mild organic citric acid flushes.'
  }
];

const MOCK_POSTS = [
  {
    id: 1,
    title: 'Best organic method to combat Tomato Early Blight in wet weather?',
    category: 'Questions',
    district: 'Nuwara Eliya',
    authorName: 'R. K. Bandara (Welimada Farm)',
    content: 'With the sudden 80mm rainfall in Nuwara Eliya, early blight spots are appearing on lower foliage. Has anyone tried copper hydroxide vs baking soda neem spray with success?',
    upvotes: 42,
    createdAt: '2 hours ago',
    verifiedAnswer: {
      author: 'Dr. Gamini Wickramasinghe (Extension Officer)',
      text: 'Prune bottom 15cm leaves immediately to halt soil splashback. Spray Copper Hydroxide 77% WP @ 50ml per 16L tank before 08:30 AM or apply Trichoderma bio-fungicide.'
    },
    comments: [
      { authorName: 'Kamal Silva (Kandy)', text: 'Pruning lower leaves and switching to root drip irrigation saved my plot last season!' },
      { authorName: 'S. Jayasuriya', text: 'Confirmed! Copper hydroxide works wonders if sprayed before morning sunlight gets intense.' }
    ]
  },
  {
    id: 2,
    title: '🚨 Armyworm Alert: Spreading across Galewela corn & paddy fields',
    category: 'Pest Alerts',
    district: 'Matale',
    authorName: 'Priyantha Jayakody',
    content: 'Urgent notice for growers within 15km of Galewela: Fall Armyworm egg clusters spotted on young maize crops. Inspect underside of leaves immediately for fuzzy egg patches.',
    upvotes: 89,
    createdAt: '4 hours ago',
    verifiedAnswer: {
      author: 'Department of Agriculture Pest Surveillance',
      text: 'High Risk Alert: Apply Bacillus thuringiensis (Bt) @ 2g/L or Emamectin Benzoate 5% SG. Report severe clusters to District Agrarian Center.'
    },
    comments: [
      { authorName: 'Nimal Karunaratne', text: 'Detected in Dambulla border as well. Sprayed Bt yesterday.' }
    ]
  },
  {
    id: 3,
    title: 'Tip: Intercropping Marigolds with Chillies cuts Whitefly Infestation by 40%',
    category: 'Tips',
    district: 'Jaffna',
    authorName: 'T. Vigneswaran (Northern Bio-Growers)',
    content: 'Planting yellow African marigolds every 10 chilli rows acts as a natural decoy repellent against whiteflies and thrips. My pesticide usage dropped by half this season.',
    upvotes: 67,
    createdAt: 'Yesterday',
    comments: [
      { authorName: 'S. Gunawardena', text: 'Tested this in Welimada! Works exceptionally well when paired with yellow sticky traps.' }
    ]
  }
];

const PRESET_TOPIC_TEMPLATES = [
  {
    label: '🚨 Fall Armyworm Outbreak Alert',
    category: 'Pest Alerts',
    title: '🚨 Fall Armyworm egg clusters spotted in young crop batch',
    content: 'Urgent notice to neighboring farms: Armyworm larvae detected on leaf whorls. Recommend immediate leaf inspection and biological spray.'
  },
  {
    label: '🍅 Tomato Blossom End Rot Solution',
    category: 'Tips',
    title: 'Tip: Solving Blossom End Rot with Foliar Calcium & Consistent Irrigation',
    content: 'Blossom end rot is caused by calcium deficiency during rapid fruit sizing. Spray Calcium Nitrate (3g/L) and avoid root-zone moisture fluctuations.'
  },
  {
    label: '🌾 Paddy Brown Planthopper (BPH) Advice',
    category: 'Questions',
    title: 'How to manage circular BPH hopperburn patches in Maha season?',
    content: 'Observing yellowing circular patches in central paddy field. Looking for tested bio-safe control measures without killing beneficial predatory spiders.'
  }
];

export const CommunityPlatform = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [postSuccessMsg, setPostSuccessMsg] = useState('');

  // Video Lightbox Modal
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Comment State Map
  const [commentInputs, setCommentInputs] = useState({});

  const categories = ['ALL', 'Questions', 'Discussion', 'Tips', 'Pest Alerts', 'Video Guides'];
  const districts = ['ALL', 'Matale', 'Kurunegala', 'Nuwara Eliya', 'Kandy', 'Anuradhapura', 'Jaffna', 'Badulla', 'Gampaha'];

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
      authorName: user?.name || (user?.email ? user.email.split('@')[0] : 'Bandara Organic Farm'),
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
        authorName: user?.name || (user?.email ? user.email.split('@')[0] : 'Farmer'),
      });
    } catch (err) {
      // fallback
    }

    setPosts((prev) => [newPost, ...prev]);
    setTitle('');
    setContent('');
    setShowCreateForm(false);
    setSubmitting(false);
    setPostSuccessMsg('✅ Thread published to the national farmer community network!');
    setTimeout(() => setPostSuccessMsg(''), 4000);
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
            comments: [
              ...(p.comments || []),
              {
                authorName: user?.name || (user?.email ? user.email.split('@')[0] : 'Bandara Organic Farm (You)'),
                text
              }
            ]
          };
        }
        return p;
      })
    );
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleApplyTemplate = (tmpl) => {
    setCategory(tmpl.category);
    setTitle(tmpl.title);
    setContent(tmpl.content);
    setShowCreateForm(true);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* AMBIENT FROSTED GLASS BACKGROUND REFRACTION ORBS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[440px] h-[440px] bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. CLEAN WHITE & GLASSMORPHIC HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 p-6 sm:p-10 space-y-6">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200/80 shadow-xs">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>National Farmer Peer Knowledge Exchange &amp; Surveillance</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                  <span>1,840 Growers Online • Real-Time Radar</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-slate-900">
                Farmer Community &amp; Pest Network 👥🌾
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
                Connect with verified growers across Sri Lanka. Broadcast geo-fenced pest outbreaks, upvote verified organic remedies, access certified agronomist recommendations, and learn from DOA-verified masterclasses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setCategory('Pest Alerts');
                  setTitle('🚨 Localized Pest Alert: ');
                  setShowCreateForm(true);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Broadcast Pest Alert 🚨</span>
              </button>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{showCreateForm ? 'Close Studio' : 'Start Discussion Thread ✍️'}</span>
              </button>
            </div>
          </div>

          {/* COMMUNITY KEY IMPACT STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100/90">
            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-600" /> Active Peer Network
              </span>
              <p className="text-sm font-black text-slate-900 font-display">1,840 Verified Growers</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" /> Containment Rate
              </span>
              <p className="text-sm font-black text-slate-900 font-display">14 Outbreaks Flagged</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-teal-600" /> DOA Verified Advice
              </span>
              <p className="text-sm font-black text-emerald-600 font-display">98.4% Efficacy SLA</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-rose-600" /> Radar Coverage
              </span>
              <p className="text-sm font-black text-slate-900 font-display">15km Proximity Alert</p>
            </div>
          </div>
        </div>

        {/* 2. REGIONAL PROXIMITY PEST ALERT RADAR (CLEAN FROSTED WARNING CARD) */}
        {!alertDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/5 backdrop-blur-xl rounded-3xl border border-rose-300/80 shadow-lg shadow-rose-500/5 ring-1 ring-rose-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🔴 Active Outbreak • 8.4 km Proximity
                  </span>
                  <span className="text-xs text-rose-800 font-black">Galewela &amp; Dambulla Corridor</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-display">
                  Fall Armyworm Infestation Detected in Neighboring Maize &amp; Paddy Clusters
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
                  <strong>Recommended Action:</strong> Inspect underside of leaves for fuzzy egg clusters. Apply biological Bacillus thuringiensis (Bt) or 10,000 PPM botanical Neem extract immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Pest Alerts');
                  window.scrollTo({ top: 900, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition shadow-xs cursor-pointer"
              >
                View Live Field Reports
              </button>
              <button
                type="button"
                onClick={() => setAlertDismissed(true)}
                className="px-3 py-2 bg-white/80 hover:bg-white text-slate-600 text-xs font-bold rounded-xl border border-rose-200 transition cursor-pointer"
              >
                Dismiss ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. CREATE THREAD STUDIO MODAL / FORM */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-7 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" /> Start Community Discussion or Broadcast Pest Alert
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Broadcast advice or ask fellow farmers &amp; agronomists</p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">Thread Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How to prevent blossom end rot in tomatoes during sudden dry spell?"
                      required
                      className="w-full p-3 rounded-2xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">Category Tag</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-200/90 font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Questions">❓ Questions</option>
                      <option value="Discussion">💬 Discussion</option>
                      <option value="Tips">💡 Farming Tips</option>
                      <option value="Pest Alerts">🚨 Pest Alerts (Broadcast)</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">District / Location Geo-Tag</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-200/90 font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      {districts.filter((d) => d !== 'ALL').map((dist) => (
                        <option key={dist} value={dist}>
                          📍 {dist} District
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">Symptoms, Observations &amp; Advice</label>
                    <textarea
                      rows="3"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Detail symptoms, dosage, weather context, or pest observations..."
                      required
                      className="w-full p-3 rounded-2xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="md:col-span-3 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Publish Thread to National Farmer Network 🚀</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POST CREATION SUCCESS BANNER */}
        {postSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-xs flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{postSuccessMsg}</span>
          </motion.div>
        )}

        {/* 4. ONE-CLICK PRESET TEMPLATES */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/5 backdrop-blur-xl rounded-3xl border border-emerald-300/80 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/20 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
              Quick Community Topic Templates:
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_TOPIC_TEMPLATES.map((tmpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="p-3.5 bg-white/90 hover:bg-white active:scale-95 border border-emerald-200/80 hover:border-emerald-400 rounded-2xl text-left transition shadow-xs cursor-pointer space-y-1"
              >
                <span className="text-xs font-extrabold text-slate-900 block">{tmpl.label}</span>
                <span className="text-[10px] font-bold text-slate-400 line-clamp-1">{tmpl.content}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. BEST PRACTICE VIDEO GUIDES CAROUSEL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900 font-display">
                Certified Agronomy Video Masterclasses
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Department of Agriculture Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {VIDEO_TUTORIALS.map((vid) => (
              <div
                key={vid.id}
                className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:border-emerald-300 transition-all duration-300"
              >
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(vid)}
                      className="w-12 h-12 rounded-full bg-white/95 text-emerald-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-emerald-700 ml-0.5" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-sm text-emerald-300 text-[10px] font-black uppercase">
                    {vid.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-mono font-bold">
                    {vid.duration}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-black text-slate-900 text-sm leading-snug font-display">{vid.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{vid.author}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                    <span>{vid.views}</span>
                    <button
                      onClick={() => setActiveVideoModal(vid)}
                      className="text-emerald-700 font-black hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Watch Tutorial →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SEARCH & TOPIC FILTER CONTROLS */}
        <div className="p-4 sm:p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community discussions, pest names, remedies, or growers..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* TOPIC FILTER CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {cat === 'ALL' ? '🌟 All Topics' : cat}
              </button>
            ))}
          </div>

          {/* DISTRICT SELECTOR */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-emerald-500"
            >
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist === 'ALL' ? '📍 All Districts' : dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 7. COMMUNITY THREADS FEED */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Community Discussions &amp; Field Reports
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredPosts.length} Threads
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs font-bold">Synchronizing community discussions...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/80 rounded-3xl border border-slate-200/70 space-y-3 p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                🌾
              </div>
              <h4 className="text-sm font-black text-slate-900 font-display">No Discussions Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                No threads matching this category or search filter. Click "Start Discussion Thread" above to begin one.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-4 hover:shadow-2xl hover:border-emerald-200 transition-all duration-200"
                >
                  {/* POST HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border ${
                          post.category === 'Pest Alerts'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : post.category === 'Tips'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700">• 📍 {post.district}</span>
                      <span className="text-xs font-semibold text-slate-400">• By {post.authorName}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {post.createdAt}
                    </span>
                  </div>

                  {/* POST BODY */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-display leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* VERIFIED AGRONOMIST ANSWER IF PRESENT */}
                  {post.verifiedAnswer && (
                    <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/90 space-y-1.5 text-xs text-emerald-950">
                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 font-black text-emerald-900 font-display">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Official Extension Recommendation ({post.verifiedAnswer.author}):</span>
                        </div>
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" /> SLAgS Approved
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed pl-5">
                        {post.verifiedAnswer.text}
                      </p>
                    </div>
                  )}

                  {/* UPVOTE & COMMENTS FOOTER */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
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
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-emerald-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* COMMENT LIST */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 pl-4 border-l-2 border-emerald-300/60 text-xs">
                      {post.comments.map((c, i) => (
                        <div key={i} className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 space-y-0.5">
                          <strong className="text-slate-900 block text-[11px] font-extrabold">{c.authorName}:</strong>
                          <span className="text-slate-600 font-medium leading-relaxed">{c.text}</span>
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

      {/* 8. VIDEO MASTERCLASS LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 relative"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-display">
                      {activeVideoModal.title}
                    </h3>
                    <p className="text-xs text-slate-400">{activeVideoModal.author}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SIMULATED VIDEO PLAYER */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center group">
                <img
                  src={activeVideoModal.thumbnail}
                  alt={activeVideoModal.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center space-y-3 p-6 text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 animate-pulse">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <p className="text-xs font-bold bg-slate-900/80 px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-300">
                    Interactive Streaming Tutorial • {activeVideoModal.duration}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                <strong>Course Summary:</strong> {activeVideoModal.description}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Close Tutorial
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPlatform;
