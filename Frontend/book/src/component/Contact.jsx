import { useState } from "react";
import { api } from "../lib/api";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });
  const [popup, setPopup] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "", error: "" });

    try {
      const data = await api.contact(form);
      setStatus({ loading: false, message: data.message || "Message sent.", error: "" });
      setForm({ name: "", email: "", subject: "", message: "" });
      setPopup("Thank you! Your message has been submitted successfully.");
      window.setTimeout(() => setPopup(""), 3500);
    } catch (error) {
      setStatus({ loading: false, message: "", error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] px-4 py-28 dark:bg-[#0F1117]">
      {popup && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm rounded-2xl border border-green-200 bg-white px-5 py-4 text-sm font-bold text-green-700 shadow-2xl">
          {popup}
        </div>
      )}
      <div className="mx-auto max-w-6xl">
        <section className="text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Get In Touch</p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">Contact BookHaven</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
            Questions, book requests, and support messages are saved in your SQL database.
          </p>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1A1D2E] md:p-8">
            <h2 className="text-2xl font-bold">Send a Message</h2>

            {status.message && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                {status.message}
              </div>
            )}
            {status.error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {status.error}
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Full Name</span>
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
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Subject</span>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
                placeholder="How can we help?"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="7"
                className="mt-2 w-full resize-none rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 outline-none focus:border-[var(--color-primary)] dark:bg-[#0F1117]"
                placeholder="Tell us about your inquiry..."
              />
            </label>

            <button
              type="submit"
              disabled={status.loading}
              className="mt-6 rounded-full bg-[var(--color-primary)] px-7 py-3 font-bold text-white hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <aside className="rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1A1D2E] md:p-8">
            <h2 className="text-2xl font-bold">Store Details</h2>
            <div className="mt-6 space-y-5 text-[var(--color-text-muted)]">
              <p>
                <span className="block font-bold text-[var(--color-text)] dark:text-white">Email</span>
                support@bookhaven.com
              </p>
              <p>
                <span className="block font-bold text-[var(--color-text)] dark:text-white">Reading Access</span>
                Free books are open to everyone. Paid books unlock after purchase.
              </p>
              <p>
                <span className="block font-bold text-[var(--color-text)] dark:text-white">Database</span>
                Login, purchase, feedback, book, and contact data use the MySQL backend.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Contact;
