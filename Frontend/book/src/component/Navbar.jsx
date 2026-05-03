import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [sticky, setSticky] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const element = document.documentElement;
    element.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const linkClass = ({ isActive }) =>
    `font-bold transition-colors hover:text-[var(--color-primary)] ${
      isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text)] dark:text-[#F0E6FF]"
    }`;

  const navItems = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
        Home
      </NavLink>
      <NavLink to={isLoggedIn ? "/course" : "/signup"} className={linkClass} onClick={() => setMenuOpen(false)}>
        Library
      </NavLink>
      <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>
        Contact
      </NavLink>
      <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>
        About
      </NavLink>
      {user?.role === "admin" && (
        <NavLink to="/admin/payments" className={linkClass} onClick={() => setMenuOpen(false)}>
          Payments
        </NavLink>
      )}
    </>
  );

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-all ${
          sticky
            ? "border-[var(--color-border)] bg-[var(--color-bg)]/95 shadow-lg backdrop-blur"
            : "border-transparent bg-[var(--color-bg)]/80 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 md:px-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="rounded-lg border border-[var(--color-border)] p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-xl font-black text-white">
                B
              </span>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text)] dark:text-white md:text-2xl">
                  BookHaven
                </h1>
                <p className="hidden text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] sm:block">
                  Online Book Store
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">{navItems}</nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm font-bold"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="hidden max-w-[140px] truncate text-sm font-bold text-[var(--color-text-muted)] md:block">
                  {user?.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-[var(--color-bg-soft)] px-4 py-2 text-sm font-bold text-[var(--color-text)] hover:bg-[var(--color-border)] dark:bg-[#1A1D2E]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[var(--color-primary-dark)]"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <nav className="grid gap-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-5 shadow-lg lg:hidden">
            {navItems}
          </nav>
        )}
      </header>

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

export default Navbar;
