import React, { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  Search, 
  User, 
  LogOut, 
  PlusCircle, 
  Star, 
  AlertTriangle, 
  Menu, 
  X, 
  Home as HomeIcon,
  CheckCircle,
  MapPin,
  MessageSquare,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface User {
  id: number;
  email: string;
  name: string;
  province: string;
  role: string;
}

interface Listing {
  id: number;
  name: string;
  type: string;
  address: string;
  suburb: string;
  province: string;
  avg_rating: number;
  review_count: number;
}

// --- Mock Data ---
const MOCK_LISTINGS: Listing[] = [
  { id: 1, name: "City Property", type: "Company", address: "123 Main St", suburb: "Pretoria Central", province: "Gauteng", avg_rating: 4.2, review_count: 156 },
  { id: 2, name: "Trafalgar", type: "Company", address: "456 Oak Ave", suburb: "Sandton", province: "Gauteng", avg_rating: 3.8, review_count: 89 },
  { id: 3, name: "Redefine Properties", type: "Company", address: "789 Pine Rd", suburb: "Cape Town CBD", province: "Western Cape", avg_rating: 4.5, review_count: 210 },
  { id: 4, name: "Ithala", type: "Company", address: "101 Palm Blvd", suburb: "Umhlanga", province: "KwaZulu-Natal", avg_rating: 3.5, review_count: 45 },
  { id: 5, name: "John Smith (Private)", type: "Landlord", address: "12 Rose St", suburb: "Stellenbosch", province: "Western Cape", avg_rating: 4.8, review_count: 12 },
  { id: 6, name: "Urban Living", type: "Company", address: "55 Market St", suburb: "Johannesburg", province: "Gauteng", avg_rating: 4.0, review_count: 67 },
];

const MOCK_REVIEWS = [
  { id: 1, user_name: "Thabo M.", is_verified: true, created_at: new Date().toISOString(), responsiveness: 5, maintenance: 4, deposit_return: 5, professionalism: 5, comment: "Excellent service from start to finish. Highly recommended!" },
  { id: 2, user_name: "Sarah J.", is_verified: false, created_at: new Date().toISOString(), responsiveness: 3, maintenance: 2, deposit_return: 4, professionalism: 3, comment: "Maintenance was a bit slow, but overall a decent experience." },
];

const MOCK_ALERTS = [
  { id: 1, property_details: "Blue Heights Complex", suburb: "Sunnyside", province: "Gauteng", issue_description: "Reported rental scam. Multiple people paid deposits for the same unit that doesn't exist.", user_name: "Thabo M.", created_at: new Date().toISOString() },
  { id: 2, property_details: "Green Valley Apartments", suburb: "Bellville", province: "Western Cape", issue_description: "Severe maintenance neglect. Mold issues and broken plumbing ignored for 6 months.", user_name: "Sarah J.", created_at: new Date().toISOString() },
];

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Tenant Watch", path: "/tenant-watch", icon: AlertTriangle },
    { name: "Listings", path: "/listings", icon: Search },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight text-zinc-900">Rental <span className="text-brand-600">Rate</span></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-600 flex items-center gap-1.5",
                  location.pathname === link.path ? "text-brand-600" : "text-zinc-600"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-brand-600">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                    {user.name[0]}
                  </div>
                  {user.name}
                </Link>
                <button onClick={onLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Log in</Link>
                <Link to="/register" className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium"
                >
                  <link.icon className="w-5 h-5 text-brand-600" />
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 text-zinc-700 font-medium">
                    <User className="w-5 h-5 text-brand-600" />
                    Dashboard
                  </Link>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium">
                    <LogOut className="w-5 h-5" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-3 rounded-xl border border-zinc-200 text-zinc-700 font-medium">Log in</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-3 rounded-xl bg-zinc-900 text-white font-medium">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const Home = () => {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setListings(MOCK_LISTINGS.slice(0, 6));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-50 via-white to-white opacity-70"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider"
          >
            <Award className="w-4 h-4" />
            Empowering South African Renters
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Know your <span className="text-brand-600">Landlord</span> before you sign.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 max-w-2xl mx-auto"
          >
            The most trusted platform for rating rental experiences in South Africa. 
            Real reviews from real tenants to help you find a better home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-brand-600/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white p-2 rounded-[2rem] shadow-2xl shadow-zinc-200 border border-zinc-100">
              <div className="pl-4 text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search by company, landlord, or suburb..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-900 px-4 py-3 text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/listings?search=${search}`)}
              />
              <button 
                onClick={() => navigate(`/listings?search=${search}`)}
                className="bg-brand-600 text-white px-8 py-3 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all active:scale-95"
              >
                Search
              </button>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-50 grayscale">
             <span className="font-bold text-xl tracking-tighter italic">City Property</span>
             <span className="font-bold text-xl tracking-tighter italic">Trafalgar</span>
             <span className="font-bold text-xl tracking-tighter italic">Redefine</span>
             <span className="font-bold text-xl tracking-tighter italic">Ithala</span>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Top Rated Companies</h2>
            <p className="text-zinc-500">Highly recommended by the community</p>
          </div>
          <Link to="/listings" className="text-brand-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, idx) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl border border-zinc-200 p-6 hover:shadow-xl hover:shadow-zinc-200 transition-all cursor-pointer"
              onClick={() => navigate(`/listings/${listing.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-zinc-100 p-3 rounded-2xl group-hover:bg-brand-50 transition-colors">
                  <HomeIcon className="w-6 h-6 text-zinc-600 group-hover:text-brand-600" />
                </div>
                <div className="flex items-center gap-1 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-bold">
                  <Star className="w-4 h-4 fill-brand-600" />
                  {listing.avg_rating.toFixed(1)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-brand-600 transition-colors">{listing.name}</h3>
              <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                {listing.suburb}, {listing.province}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{listing.type}</span>
                <span className="text-sm font-medium text-zinc-600">{listing.review_count} reviews</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-zinc-900 py-20 text-white rounded-[3rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-black text-brand-500">15k+</div>
            <div className="text-zinc-400 font-medium uppercase tracking-widest text-sm">Verified Reviews</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-brand-500">2.4k</div>
            <div className="text-zinc-400 font-medium uppercase tracking-widest text-sm">Landlords Listed</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-brand-500">98%</div>
            <div className="text-zinc-400 font-medium uppercase tracking-widest text-sm">Tenant Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Tenant Watch CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-red-50 border border-red-100 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="bg-red-100 p-6 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-zinc-900">Tenant Watch</h2>
            <p className="text-zinc-600 text-lg">
              Spotted a rental scam or a dangerous property? Share an alert with the community 
              to protect fellow South Africans. Verified reports only.
            </p>
            <Link to="/tenant-watch" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all">
              View Safety Alerts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    setSearch(s);
    
    // Simulate filtering
    const filtered = MOCK_LISTINGS.filter(l => 
      l.name.toLowerCase().includes(s.toLowerCase()) || 
      l.suburb.toLowerCase().includes(s.toLowerCase())
    );
    setListings(filtered);
  }, [location.search]);

  const provinces = [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", 
    "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-zinc-900">Browse Listings</h1>
        <div className="flex flex-wrap gap-4">
          <select 
            className="bg-white border border-zinc-200 rounded-2xl px-4 py-2 text-sm font-medium focus:ring-brand-500"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value="">All Provinces</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-brand-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.filter(l => !province || l.province === province).map((listing) => (
          <Link 
            key={listing.id} 
            to={`/listings/${listing.id}`}
            className="group bg-white rounded-3xl border border-zinc-200 p-6 hover:shadow-xl hover:shadow-zinc-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-zinc-100 p-3 rounded-2xl group-hover:bg-brand-50 transition-colors">
                <HomeIcon className="w-6 h-6 text-zinc-600 group-hover:text-brand-600" />
              </div>
              <div className="flex items-center gap-1 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-bold">
                <Star className="w-4 h-4 fill-brand-600" />
                {listing.avg_rating.toFixed(1)}
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-brand-600 transition-colors">{listing.name}</h3>
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              {listing.suburb}, {listing.province}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{listing.type}</span>
              <span className="text-sm font-medium text-zinc-600">{listing.review_count} reviews</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ListingDetails = ({ user }: { user: User | null }) => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
    responsiveness: 5,
    maintenance: 5,
    deposit_return: 5,
    professionalism: 5,
    comment: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    const found = MOCK_LISTINGS.find(l => l.id === Number(id));
    if (found) {
      setListing({ ...found, reviews: MOCK_REVIEWS });
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    // Simulate review submission
    const newReview = {
      id: Math.random(),
      user_name: user.name,
      is_verified: true,
      created_at: new Date().toISOString(),
      ...review
    };

    setListing((prev: any) => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
      review_count: prev.review_count + 1
    }));
    
    setShowReviewForm(false);
    setReview({
      responsiveness: 5,
      maintenance: 5,
      deposit_return: 5,
      professionalism: 5,
      comment: ""
    });
  };

  if (!listing) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link to="/listings" className="text-zinc-400 hover:text-zinc-600"><ChevronRight className="w-5 h-5 rotate-180" /></Link>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">{listing.type}</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900">{listing.name}</h1>
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5" />
              {listing.address}, {listing.suburb}, {listing.province}
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] text-center space-y-2 min-w-[200px]">
          <div className="text-5xl font-black text-zinc-900">{listing.avg_rating.toFixed(1)}</div>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-5 h-5", i < Math.round(listing.avg_rating) ? "fill-brand-500 text-brand-500" : "text-zinc-200")} />
            ))}
          </div>
          <div className="text-sm font-medium text-zinc-500">{listing.review_count} verified reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-zinc-900">Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Write a Review
            </button>
          </div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmitReview}
                className="bg-zinc-50 border border-zinc-200 p-8 rounded-[2rem] space-y-6"
              >
                <h3 className="text-xl font-bold">Rate your experience</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['responsiveness', 'maintenance', 'deposit_return', 'professionalism'].map((cat) => (
                    <div key={cat} className="space-y-2">
                      <label className="text-sm font-bold text-zinc-600 capitalize">{cat.replace('_', ' ')}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setReview({ ...review, [cat]: val })}
                            className={cn(
                              "w-10 h-10 rounded-xl font-bold transition-all",
                              (review as any)[cat] === val ? "bg-brand-600 text-white" : "bg-white border border-zinc-200 text-zinc-400 hover:border-brand-300"
                            )}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600">Your Review</label>
                  <textarea
                    required
                    className="w-full bg-white border border-zinc-200 rounded-2xl p-4 min-h-[120px] focus:ring-brand-500"
                    placeholder="Tell us about your experience..."
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 rounded-full font-bold text-zinc-500">Cancel</button>
                  <button type="submit" className="bg-brand-600 text-white px-8 py-2.5 rounded-full font-bold hover:bg-brand-700">Submit Review</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {listing.reviews.map((rev: any) => (
              <div key={rev.id} className="bg-white border border-zinc-100 p-8 rounded-[2rem] space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500">
                      {rev.user_name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                        {rev.user_name}
                        {rev.is_verified && <CheckCircle className="w-4 h-4 text-brand-500" />}
                      </div>
                      <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-50 px-3 py-1 rounded-full text-sm font-bold text-zinc-700">
                    <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                    {((rev.responsiveness + rev.maintenance + rev.deposit_return + rev.professionalism) / 4).toFixed(1)}
                  </div>
                </div>
                <p className="text-zinc-600 leading-relaxed">{rev.comment}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                   {['Responsiveness', 'Maintenance', 'Deposit', 'Professionalism'].map((cat, i) => {
                     const val = [rev.responsiveness, rev.maintenance, rev.deposit_return, rev.professionalism][i];
                     return (
                       <div key={cat} className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                         {cat}: {val}/5
                       </div>
                     );
                   })}
                </div>
              </div>
            ))}
            {listing.reviews.length === 0 && (
              <div className="text-center py-20 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-bold">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="w-5 h-5 text-brand-500" />
                <span className="text-sm">{listing.address}</span>
              </div>
            </div>
            <button className="w-full bg-white text-zinc-900 py-3 rounded-2xl font-bold hover:bg-zinc-100 transition-all">
              Contact Company
            </button>
          </div>

          <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 space-y-4">
            <TrendingUp className="w-8 h-8 text-brand-600" />
            <h3 className="text-xl font-bold text-zinc-900">Trust Score</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              This company has a high trust score based on consistent responsiveness and maintenance quality over the last 6 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TenantWatch = ({ user }: { user: User | null }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    property_details: "",
    issue_description: "",
    province: "Gauteng",
    suburb: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setAlerts(MOCK_ALERTS);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    // Simulate alert submission
    const alert = {
      id: Math.random(),
      user_name: user.name,
      created_at: new Date().toISOString(),
      ...newAlert
    };

    setAlerts(prev => [alert, ...prev]);
    setShowForm(false);
    setNewAlert({
      property_details: "",
      issue_description: "",
      province: "Gauteng",
      suburb: ""
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Community Safety
          </div>
          <h1 className="text-5xl font-black text-zinc-900">Tenant Watch</h1>
          <p className="text-zinc-500 max-w-xl">
            A space for verified tenants to share warnings about scams, dangerous properties, or illegal evictions.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Post an Alert
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="bg-white border border-red-100 p-8 rounded-[2.5rem] shadow-xl shadow-red-100/50 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600">Property Details (Address/Complex)</label>
                <input
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-red-500"
                  value={newAlert.property_details}
                  onChange={(e) => setNewAlert({ ...newAlert, property_details: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600">Suburb</label>
                <input
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-red-500"
                  value={newAlert.suburb}
                  onChange={(e) => setNewAlert({ ...newAlert, suburb: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600">Describe the Issue</label>
              <textarea
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 min-h-[120px] focus:ring-red-500"
                placeholder="What happened? Be specific but stick to the facts..."
                value={newAlert.issue_description}
                onChange={(e) => setNewAlert({ ...newAlert, issue_description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full font-bold text-zinc-500">Cancel</button>
              <button type="submit" className="bg-red-600 text-white px-8 py-2.5 rounded-full font-bold hover:bg-red-700">Post Alert</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white border-l-4 border-l-red-500 border border-zinc-100 p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900">{alert.property_details}</h3>
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  {alert.suburb}, {alert.province}
                </div>
              </div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                {new Date(alert.created_at).toLocaleDateString()}
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed bg-red-50/50 p-4 rounded-2xl border border-red-50">
              {alert.issue_description}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <User className="w-4 h-4" />
              Posted by {alert.user_name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Auth = ({ type, onLogin }: { type: 'login' | 'register', onLogin: (u: User, t: string) => void }) => {
  const [formData, setFormData] = useState({ email: "", password: "", name: "", province: "Gauteng" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      province: formData.province,
      role: 'Tenant'
    };
    const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(7);

    onLogin(mockUser, mockToken);
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-zinc-200 p-10 rounded-[3rem] shadow-2xl shadow-zinc-200 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-zinc-900">{type === 'login' ? 'Welcome Back' : 'Join Rental Rate'}</h1>
          <p className="text-zinc-500">{type === 'login' ? 'Enter your details to access your account' : 'Start sharing your rental experiences today'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-brand-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Province</label>
                <select
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-brand-500"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                >
                  {["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-brand-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <input
              required
              type="password"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-brand-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200">
            {type === 'login' ? 'Log in' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-4">
          <Link to={type === 'login' ? '/register' : '/login'} className="text-sm font-bold text-brand-600 hover:text-brand-700">
            {type === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User, token: string) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails user={user} />} />
            <Route path="/tenant-watch" element={<TenantWatch user={user} />} />
            <Route path="/login" element={<Auth type="login" onLogin={handleLogin} />} />
            <Route path="/register" element={<Auth type="register" onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<div className="p-20 text-center font-bold">User Dashboard (Coming Soon)</div>} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-zinc-200 py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">Rental Rate</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Empowering South African tenants through transparency and community-driven insights.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="/listings" className="hover:text-brand-600">Browse Listings</Link></li>
                <li><Link to="/tenant-watch" className="hover:text-brand-600">Tenant Watch</Link></li>
                <li><Link to="/register" className="hover:text-brand-600">Join Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-brand-600">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-600">Report Abuse</a></li>
                <li><a href="#" className="hover:text-brand-600">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-zinc-500">
                Questions? Email us at<br />
                <span className="font-bold text-zinc-900">hello@rentalrate.co.za</span>
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-12 mt-12 border-t border-zinc-100 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
            © 2026 Rental Rate. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}
