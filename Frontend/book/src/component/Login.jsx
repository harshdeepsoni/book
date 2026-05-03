import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login({ open, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  if (!open) return null;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      await login(form);
      setForm({ email: "", password: "" });
      onClose();
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      return;
    }

    setStatus({ loading: false, error: "" });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl dark:border-[#2D3145] dark:bg-[#1A1D2E]">
        <div className="gradient-rainbow flex items-start justify-between p-6 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Reader Login</p>
            <h3 className="mt-2 text-3xl font-bold">Enter BookHaven</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 px-3 py-1.5 text-lg font-bold hover:bg-white/25"
            aria-label="Close login"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {status.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {status.error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              Email
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 font-medium outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
              placeholder="reader@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              Password
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 font-medium outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-xl bg-[var(--color-primary)] px-5 py-3 font-bold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            New reader?{" "}
            <Link onClick={onClose} to="/signup" className="font-bold text-[var(--color-primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
