import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [accepted, setAccepted] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accepted) {
      setStatus({ loading: false, error: "Please accept the terms to create an account." });
      return;
    }

    setStatus({ loading: true, error: "" });

    try {
      await register(form);
      navigate("/course");
    } catch (error) {
      setStatus({ loading: false, error: error.message });
      return;
    }

    setStatus({ loading: false, error: "" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] px-4 py-28 dark:bg-[#0F1117]">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1A1D2E] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="gradient-rainbow flex flex-col justify-between p-8 text-white md:p-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-bold">
              Back Home
            </Link>
            <h1 className="mt-16 text-4xl font-bold md:text-5xl">Create your reader account</h1>
            <p className="mt-5 text-lg leading-8 text-white/85">
              Save purchases, read premium books, and leave feedback that is stored in the SQL database.
            </p>
          </div>
          <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-white/70">
            Free books stay open for everyone
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">BookHaven</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)] dark:text-white">
              Join the library
            </h2>
          </div>

          {status.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {status.error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Full name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
              placeholder="At least 6 characters"
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>I agree to create an account and store my login details securely in the database.</span>
          </label>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-xl bg-[var(--color-primary)] px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
