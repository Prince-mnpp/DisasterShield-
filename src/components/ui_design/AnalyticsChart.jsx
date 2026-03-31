import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalyticsChart({
  rainfall,
  riverLevel,
  reportCount,
  riskLevel,
}) {
  const multiplier =
    riskLevel === "Critical" ? 1.0 :
    riskLevel === "High" ? 0.8 :
    riskLevel === "Medium" ? 0.6 : 0.4;

  const data = [
    {
      name: "3h ago",
      rainfall: Number((rainfall * 0.35 * multiplier).toFixed(1)),
      reports: Math.max(Math.floor(reportCount * 0.4), 0),
    },
    {
      name: "2h ago",
      rainfall: Number((rainfall * 0.55 * multiplier).toFixed(1)),
      reports: Math.max(Math.floor(reportCount * 0.6), 0),
    },
    {
      name: "1h ago",
      rainfall: Number((rainfall * 0.8 * multiplier).toFixed(1)),
      reports: Math.max(Math.floor(reportCount * 0.8), 0),
    },
    {
      name: "Now",
      rainfall,
      reports: reportCount,
    },
  ];

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
      <h3 className="text-2xl font-semibold mb-5 text-white">Risk Trend Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="rainfall" stroke="#22d3ee" fill="#22d3ee33" />
            <Area type="monotone" dataKey="reports" stroke="#facc15" fill="#facc1533" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}