import { useState } from "react";
import Sidebar from "../components/ui_design/Sidebar";
import { supabase } from "../lib/supabase";

export default function Reports() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    region: "",
    reportType: "",
    description: "",
    severity: "medium",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("user_reports").insert([
      {
        user_id: userData?.user?.id || null,
        region: formData.region,
        report_type: formData.reportType,
        description: formData.description,
        severity: formData.severity,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Report submitted successfully.");
    setFormData({
      region: "",
      reportType: "",
      description: "",
      severity: "medium",
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2">Citizen Report Center</h1>
        <p className="text-slate-400 mb-8">
          Submit field conditions to improve disaster analysis
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6"
        >
          <input
            type="text"
            name="region"
            placeholder="Enter region"
            value={formData.region}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
            required
          />

          <input
            type="text"
            name="reportType"
            placeholder="Report type"
            value={formData.reportType}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
            required
          />

          <textarea
            name="description"
            placeholder="Describe current conditions"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
            required
          />

          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {message && <p className="mb-4 text-sm text-cyan-300">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </main>
    </div>
  );
}