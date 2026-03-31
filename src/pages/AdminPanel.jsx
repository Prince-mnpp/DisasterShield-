import { useEffect, useState } from "react";
import Sidebar from "../components/ui_design/Sidebar";
import { supabase } from "../lib/supabase";

export default function AdminPanel() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    const { data, error } = await supabase
      .from("fused_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setResults(data || []);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2">Authority Control Panel</h1>
        <p className="text-slate-400 mb-8">
          Monitor high-risk zones and response recommendations
        </p>

        <div className="grid gap-4">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h3 className="text-2xl font-semibold">{item.region}</h3>
                  <span className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-medium">
                    {item.risk_level}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-5">
                  <div className="bg-slate-900/70 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Rainfall</p>
                    <p className="text-lg font-semibold mt-2">{item.rainfall}</p>
                  </div>

                  <div className="bg-slate-900/70 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">River Level</p>
                    <p className="text-lg font-semibold mt-2">{item.river_level}</p>
                  </div>

                  <div className="bg-slate-900/70 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Reports</p>
                    <p className="text-lg font-semibold mt-2">{item.report_count}</p>
                  </div>

                  <div className="bg-slate-900/70 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Risk Score</p>
                    <p className="text-lg font-semibold mt-2">{item.risk_score}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-cyan-400">
                    Recommended Actions
                  </h4>

                  <div className="space-y-2">
                    {item.recommendations?.map((action, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-slate-900/70 border border-white/5"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-400">
              No fused disaster results found yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}