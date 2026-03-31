import { Link } from "react-router-dom";
import { ShieldAlert, Activity, BellRing, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide text-cyan-400">
          Disaster Shield
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="px-8 py-16 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 mb-6">
            AI-Powered Disaster Intelligence Platform
          </p>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Predict risks. Protect people. Guide government action.
          </h2>

          <p className="text-slate-300 text-lg mb-8 leading-8">
            Disaster Shield combines weather signals, field reports, and
            intelligent risk scoring to detect unsafe conditions early and
            recommend fast response actions for citizens and authorities.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
            >
              Get Started
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
            <ShieldAlert className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Prediction</h3>
            <p className="text-slate-300">
              Identify high-risk conditions using fused environmental signals.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
            <Activity className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Monitoring</h3>
            <p className="text-slate-300">
              Continuously track critical indicators and citizen activity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
            <BellRing className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Citizen Alerts</h3>
            <p className="text-slate-300">
              Send warnings and protective guidance to affected communities.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
            <Building2 className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Govt Response</h3>
            <p className="text-slate-300">
              Recommend rescue, shelter, evacuation, and emergency support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 