import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Banner() {
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    setPopup("Thank you for subscribing! We will send book updates soon.");
    setEmail("");
    window.setTimeout(() => setPopup(""), 3500);
  };

  return (
    <>
      {popup && (
        <div className="fixed bottom-6 right-6 z-[90] max-w-sm rounded-2xl border border-green-200 bg-white px-5 py-4 text-sm font-bold text-green-700 shadow-2xl">
          {popup}
        </div>
      )}
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row items-center my-10 md:my-20 gap-12 dot-bg pt-20 md:pt-24">
        {/* Left Side */}
        <div className="w-full md:w-1/2 order-2 md:order-1 mt-12 md:mt-0">
          <div className="space-y-8">

            {/* Fun Tag */}
            <div className="flex items-center gap-3 stagger-item">
              <span className="fun-badge bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[var(--color-primary-light)]/20 dark:text-[var(--color-primary-light)] border border-[var(--color-primary)]/30">
                🎉 Est. 2024
              </span>
              <span className="fun-badge bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] dark:bg-[var(--color-secondary)]/20 border border-[var(--color-secondary)]/30">
                📖 10K+ Books
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight stagger-item">
              Discover Your Next
              <span className="block mt-2 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent wavy-underline relative">
                Literary Adventure!
              </span>
            </h1>

            {/* Description */}
            <div className="literary-quote stagger-item text-lg md:text-xl text-[var(--color-text-muted)] dark:text-[#A78BCD] leading-relaxed">
              Immerse yourself in a curated collection of timeless classics and contemporary masterpieces.
              Each book is a doorway to new worlds, perspectives, and transformative ideas.
            </div>

            {/* Email Signup */}
            <div className="stagger-item">
              <form onSubmit={handleSubscribe} className="relative group max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center bg-white dark:bg-[#1A0A33] border-2 border-[var(--color-primary)]/30 dark:border-[var(--color-primary-light)]/30 rounded-full overflow-hidden shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 ml-5 text-[var(--color-primary)] dark:text-[var(--color-accent)]">
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="flex-1 px-4 py-4 bg-transparent outline-none text-[var(--color-text)] dark:text-[#F0E6FF] placeholder-[var(--color-text-muted)] font-bold"
                    placeholder="Enter your email for book updates"
                  />
                  <button
                    type="submit"
                    className="mr-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-primary-dark)]"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-6 stagger-item flex-wrap">
              <Link to={isLoggedIn ? "/course" : "/signup"} className="group relative overflow-hidden gradient-rainbow text-white px-10 py-4 rounded-full font-extrabold text-lg tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-rotate-1">
                <span className="relative z-10 flex items-center gap-3">
                  🎯 Begin Reading
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">10K+</div>
                  <div className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Books</div>
                </div>
                <div className="w-px h-12 bg-[var(--color-primary)]/20 dark:bg-[var(--color-primary-light)]/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-[var(--color-secondary)] dark:text-[var(--color-secondary-light)]">50K+</div>
                  <div className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Readers</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 stagger-item">
              <div className="flex -space-x-3">
                {["A","B","C","+"].map((l, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-[#0F0520] flex items-center justify-center text-white font-extrabold text-sm ${
                    i === 0 ? "bg-[var(--color-primary)]" :
                    i === 1 ? "bg-[var(--color-secondary)]" :
                    i === 2 ? "bg-[var(--color-accent)]" : "bg-[var(--color-mint)]"
                  }`}>{l}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[var(--color-accent)] sparkle" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[var(--color-text-muted)] dark:text-[#A78BCD] font-bold">
                  Trusted by thousands of readers 🥳
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 order-1 md:order-2 relative">
          <div className="relative float-animation">
            {/* Colourful Blobs */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[var(--color-primary)]/15 dark:bg-[var(--color-primary)]/25 blob rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-[var(--color-secondary)]/15 dark:bg-[var(--color-secondary)]/25 blob rounded-full blur-2xl" style={{animationDelay:'2s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[var(--color-accent)]/10 blob rounded-full blur-2xl" style={{animationDelay:'4s'}}></div>

            {/* Main Image */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--color-primary)]/30 dark:border-[var(--color-primary-light)]/30 transform hover:scale-105 transition-transform duration-500 bubble-card">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 mix-blend-multiply"></div>
              <img
                src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg"
                className="w-full h-auto"
                alt="Stack of Books"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1A0A33] rounded-2xl shadow-2xl p-5 border-2 border-[var(--color-primary)]/20 dark:border-[var(--color-primary-light)]/20 max-w-[200px] bounce-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 gradient-rainbow rounded-full flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">100%</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Curated</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] dark:text-[#A78BCD] leading-relaxed font-medium">
                Every book handpicked by experts! 🎓
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
