export default function NavBar({ region = "Punjab", riskLevel = "Low" }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Disaster Dashboard</h2>
        <p className="text-slate-400 mt-1">
          Monitor disaster risks, citizen reports, and government actions
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-white">
          Region: {region}
        </div>

        <div className="px-4 py-2 bg-cyan-500/15 border border-cyan-400/20 text-cyan-300 rounded-xl text-sm font-medium">
          Risk: {riskLevel}
        </div>
      </div>
    </div>
  );
}