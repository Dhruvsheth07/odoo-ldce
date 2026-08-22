import { Link } from 'react-router-dom';
import { Globe, Map, Calendar, DollarSign, Share2 } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    { icon: <Map className="text-blue-400" size={24} />, title: 'Multi-City Itineraries', desc: 'Seamlessly plan complex trips across multiple destinations with smart routing.' },
    { icon: <Globe className="text-emerald-400" size={24} />, title: 'Discover & Explore', desc: 'Find hidden gems, top attractions, and local experiences with built-in discovery tools.' },
    { icon: <Calendar className="text-orange-400" size={24} />, title: 'Visual Timeline', desc: 'See your entire trip at a glance with beautiful, interactive calendar and timeline views.' },
    { icon: <DollarSign className="text-purple-400" size={24} />, title: 'Smart Budgeting', desc: 'Track expenses, compare estimated costs vs actual spending, and stay on budget.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-sm font-medium text-blue-300 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            GlobeTrotter 2.0 is live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Plan your next <br className="hidden md:block" />
            <span className="gradient-text">masterpiece journey.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            The ultimate multi-city travel planner. Manage itineraries, track budgets, and discover new experiences—all in one beautifully designed workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg w-full sm:w-auto">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg w-full sm:w-auto">
                  Start Planning Free
                </Link>
                <a href="#features" className="btn btn-ghost btn-lg w-full sm:w-auto">
                  Explore Features
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Everything you need for the perfect trip</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Stop juggling spreadsheets and multiple tabs. GlobeTrotter brings all your travel planning tools into one cohesive experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="card p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl glass-light flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-200">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
      </footer>
    </div>
  );
}
