import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState("");
  const libraryLink = isLoggedIn ? "/course" : "/signup";

  const handleSubscribe = (event) => {
    event.preventDefault();
    setPopup("Thank you for subscribing! We will send you book updates soon.");
    setEmail("");
    window.setTimeout(() => setPopup(""), 3500);
  };

  const exploreLinks = [
    { label: "Browse Collection", to: libraryLink },
    { label: "New Arrivals", to: libraryLink },
    { label: "Bestsellers", to: libraryLink },
    { label: "Free Books", to: libraryLink },
  ];

  const companyLinks = [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Careers", href: "mailto:careers@bookhaven.com" },
    { label: "Press Kit", href: "mailto:press@bookhaven.com" },
  ];

  return (
    <div className="mt-20">
      {popup && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm rounded-2xl border border-green-200 bg-white px-5 py-4 text-sm font-bold text-green-700 shadow-2xl">
          {popup}
        </div>
      )}

      <div className="ornamental-divider mb-12">
        <span>*</span>
      </div>

      <footer className="paper-texture border-t-4 border-[var(--color-primary)] bg-[var(--color-cream-dark)] text-[var(--color-charcoal)] dark:bg-[#111827] dark:text-[#F0E6FF]">
        <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-20">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] text-xl font-black text-white">
                  B
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-primary)]">BookHaven</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Literary Treasures
                  </p>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                Curating exceptional literature and building a simple, secure online reading experience.
              </p>
              <span className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
                Join 50K+ readers
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="mb-4 text-lg font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Explore
              </h4>
              <nav className="space-y-3">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-sm font-bold transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="mb-4 text-lg font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                Company
              </h4>
              <nav className="space-y-3">
                {companyLinks.map((link) =>
                  link.to ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="block text-sm font-bold transition-colors hover:text-[var(--color-secondary)]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm font-bold transition-colors hover:text-[var(--color-secondary)]"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="mb-4 text-lg font-bold uppercase tracking-wider text-[var(--color-accent)]">
                Stay Updated
              </h4>
              <p className="mb-4 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                Subscribe for book recommendations and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-xl border-2 border-[var(--color-primary)]/20 bg-white px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-[var(--color-primary)] dark:bg-[#0B1220]"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-[var(--color-primary-dark)]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="my-8 h-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-30"></div>

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              {[
                { label: "Twitter", href: "https://twitter.com" },
                { label: "YouTube", href: "https://youtube.com" },
                { label: "Facebook", href: "https://facebook.com" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-black text-white transition hover:scale-110"
                  aria-label={social.label}
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-bold text-[var(--color-text-muted)]">
                © 2024 <span className="text-[var(--color-primary)]">BookHaven</span>. All rights reserved.
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                Made for readers everywhere
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
