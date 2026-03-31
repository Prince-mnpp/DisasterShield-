export default function MapPanel({ region, riskLevel }) {
  const riskStyles = {
    Critical: "bg-red-500/20 text-red-300 border-red-400/20",
    High: "bg-orange-500/20 text-orange-300 border-orange-400/20",
    Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-400/20",
    Low: "bg-green-500/20 text-green-300 border-green-400/20",
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-semibold text-white">Region Monitoring Map</h3>
        <span className={`px-4 py-2 rounded-xl text-sm border ${riskStyles[riskLevel]}`}>
          {riskLevel}
        </span>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 min-h-72 flex flex-col items-center justify-center text-center">
        <div className="w-28 h-28 rounded-full bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center mb-4">
          <span className="text-4xl">📍</span>
        </div>
        <h4 className="text-2xl font-bold text-white">{region}</h4>
        <p className="text-slate-400 mt-3 max-w-md">
          Live monitoring zone with fused environmental indicators, citizen reports,
          and government response priority analysis.
        </p>
      </div>
    </div>
  );
}