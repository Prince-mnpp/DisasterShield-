const colors = {
  red: "bg-red-500/10 text-red-400 border-red-400/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-400/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
  green: "bg-green-500/10 text-green-400 border-green-400/20",
};

export default function RiskCard({ title, value, color, subtitle }) {
  return (
    <div className={`p-5 rounded-2xl border ${colors[color]}`}>
      <h3 className="text-sm text-slate-400">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-sm text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
}