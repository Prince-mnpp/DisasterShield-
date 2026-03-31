import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          role: formData.role,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.user) {
      setMessage("Account created successfully. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-6">Join Disaster Shield today</p>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white"
        >
          <option value="citizen">Citizen</option>
          <option value="volunteer">Volunteer</option>
          <option value="authority">Authority</option>
        </select>

        {message && <p className="mb-4 text-sm text-cyan-300">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-slate-400 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}