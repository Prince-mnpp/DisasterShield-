export default function AlertBanner({ riskLevel = "Low", region = "Punjab" }) {
  const config = {
    Critical: {
      box: "bg-red-500/15 border-red-400/20 text-red-200",
      title: "Critical Alert",
      text: `Severe conditions detected in ${region}. Immediate precautions and government intervention advised.`,
    },
    High: {
      box: "bg-orange-500/15 border-orange-400/20 text-orange-200",
      title: "High Alert",
      text: `High-risk conditions detected in ${region}. Stay prepared and follow official updates.`,
    },
    Medium: {
      box: "bg-yellow-500/15 border-yellow-400/20 text-yellow-200",
      title: "Moderate Alert",
      text: `Moderate risk detected in ${region}. Monitor conditions and keep safety measures ready.`,
    },
    Low: {
      box: "bg-green-500/15 border-green-400/20 text-green-200",
      title: "Stable Conditions",
      text: `Current conditions in ${region} are stable. Continue monitoring for changes.`,
    },
  };

  const current = config[riskLevel] || config.Low;

  return (
    <div className={`mb-6 p-4 rounded-2xl border ${current.box}`}>
      <p className="font-semibold">{current.title}</p>
      <p className="text-sm mt-1">{current.text}</p>
    </div>
  );
}