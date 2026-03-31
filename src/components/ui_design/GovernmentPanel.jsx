export default function GovernmentPanel({ actions = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4">
        Government Action Panel
      </h3>

      <div className="space-y-3">
        {actions.length > 0 ? (
          actions.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-slate-200"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-slate-400">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}