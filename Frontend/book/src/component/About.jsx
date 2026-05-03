import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 paper-texture">
        {/* Hero Section */}
        <div className="mt-32 mb-20 items-center justify-center text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
            <span className="text-[20rem] font-bold text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
              📖
            </span>
          </div>
          
          <div className="relative z-10 stagger-item">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-burgundy)]/40 dark:to-[var(--color-gold)]/40"></div>
              <span className="text-[var(--color-gold)] font-medium tracking-[0.3em] text-sm uppercase">
                Our Story
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-burgundy)]/40 dark:to-[var(--color-gold)]/40"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-[var(--color-burgundy)] via-[var(--color-burgundy-light)] to-[var(--color-gold)] bg-clip-text text-transparent">
                BookHaven
              </span>
            </h1>
            
            <p className="literary-quote max-w-3xl mx-auto text-xl md:text-2xl text-[var(--color-charcoal)]/80 dark:text-[var(--color-cream)]/80 leading-relaxed">
              Your sanctuary for timeless literature, modern masterpieces, and endless discovery
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-16 space-y-20">
          {/* Our Story Section */}
          <section className="stagger-item">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                  Our Story
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)]"></div>
                <p className="text-lg leading-relaxed text-[var(--color-charcoal)]/80 dark:text-[var(--color-cream)]/80">
                  BookHaven was born from a simple yet profound belief: that every person deserves access to the transformative power of literature. Founded by passionate bibliophiles, we've curated a collection that spans centuries, cultures, and genres.
                </p>
                <p className="text-lg leading-relaxed text-[var(--color-charcoal)]/80 dark:text-[var(--color-cream)]/80">
                  From timeless classics that have shaped civilizations to contemporary works pushing the boundaries of imagination, each book in our collection has been thoughtfully selected to enrich, inspire, and enlighten our community of readers.
                </p>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white dark:bg-[#2b2520] border-4 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-burgundy)] to-[var(--color-gold)] rounded-full flex items-center justify-center text-white text-3xl">
                      ✦
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">2024</p>
                      <p className="text-sm text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 font-medium uppercase tracking-wider">
                        Established
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">10K+</p>
                      <p className="text-sm text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 mt-1 uppercase tracking-wider">
                        Books
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">50K+</p>
                      <p className="text-sm text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 mt-1 uppercase tracking-wider">
                        Readers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ornamental Divider */}
          <div className="ornamental-divider">
            <span>✦</span>
          </div>

          {/* What We Offer Section */}
          <section className="stagger-item">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                What We Offer
              </h2>
              <p className="text-lg text-[var(--color-charcoal)]/70 dark:text-[var(--color-cream)]/70 max-w-2xl mx-auto">
                A comprehensive literary experience designed for modern readers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group book-spine relative bg-white dark:bg-[#2b2520] p-8 rounded-2xl shadow-xl border-2 border-[var(--color-burgundy)]/10 dark:border-[var(--color-gold)]/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-5xl mb-6">📚</div>
                <h3 className="font-bold text-2xl mb-4 text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
                  Free Library
                </h3>
                <p className="text-[var(--color-charcoal)]/70 dark:text-[var(--color-cream)]/70 leading-relaxed text-base">
                  Dive into our curated collection of classic literature, completely free. No subscriptions, no hidden costs—just pure literary joy at your fingertips.
                </p>
              </div>

              <div className="group book-spine relative bg-white dark:bg-[#2b2520] p-8 rounded-2xl shadow-xl border-2 border-[var(--color-burgundy)]/10 dark:border-[var(--color-gold)]/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-5xl mb-6">💎</div>
                <h3 className="font-bold text-2xl mb-4 text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
                  Premium Collection
                </h3>
                <p className="text-[var(--color-charcoal)]/70 dark:text-[var(--color-cream)]/70 leading-relaxed text-base">
                  Explore bestsellers, new releases, and exclusive titles. Our premium catalog brings you the finest contemporary and classic works at accessible prices.
                </p>
              </div>

              <div className="group book-spine relative bg-white dark:bg-[#2b2520] p-8 rounded-2xl shadow-xl border-2 border-[var(--color-burgundy)]/10 dark:border-[var(--color-gold)]/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="font-bold text-2xl mb-4 text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
                  Smart Discovery
                </h3>
                <p className="text-[var(--color-charcoal)]/70 dark:text-[var(--color-cream)]/70 leading-relaxed text-base">
                  Find your next literary adventure with intelligent search, personalized recommendations, and curated collections tailored to your reading preferences.
                </p>
              </div>

              <div className="group book-spine relative bg-white dark:bg-[#2b2520] p-8 rounded-2xl shadow-xl border-2 border-[var(--color-burgundy)]/10 dark:border-[var(--color-gold)]/10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-5xl mb-6">📱</div>
                <h3 className="font-bold text-2xl mb-4 text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
                  Read Everywhere
                </h3>
                <p className="text-[var(--color-charcoal)]/70 dark:text-[var(--color-cream)]/70 leading-relaxed text-base">
                  Your personal library travels with you. Seamlessly access your collection across all devices—desktop, tablet, or mobile—anytime, anywhere.
                </p>
              </div>
            </div>
          </section>

          {/* Ornamental Divider */}
          <div className="ornamental-divider">
            <span>✦</span>
          </div>

          {/* Mission Section */}
          <section className="stagger-item bg-gradient-to-br from-[var(--color-burgundy)]/5 to-[var(--color-gold)]/5 dark:from-[var(--color-burgundy)]/10 dark:to-[var(--color-gold)]/10 rounded-3xl p-12 md:p-16 border-2 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                Our Mission
              </h2>
              <p className="literary-quote text-xl md:text-2xl leading-relaxed text-[var(--color-charcoal)]/80 dark:text-[var(--color-cream)]/80 mb-8">
                We're dedicated to fostering a global community of readers, breaking down barriers to knowledge, and celebrating the transformative power of stories. Every book is a journey, and every reader deserves a passport to infinite worlds.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                <div className="flex items-center gap-3 bg-white dark:bg-[#2b2520] px-6 py-3 rounded-full shadow-lg">
                  <svg className="w-6 h-6 text-[var(--color-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                    Accessible
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#2b2520] px-6 py-3 rounded-full shadow-lg">
                  <svg className="w-6 h-6 text-[var(--color-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                    Curated
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#2b2520] px-6 py-3 rounded-full shadow-lg">
                  <svg className="w-6 h-6 text-[var(--color-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                    Community-Driven
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center mt-20 mb-20 stagger-item">
            <Link to="/">
              <button className="group relative overflow-hidden bg-gradient-to-r from-[var(--color-burgundy)] via-[var(--color-burgundy-light)] to-[var(--color-gold)] text-white px-12 py-5 rounded-full font-bold text-xl tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110">
                <span className="relative z-10 flex items-center gap-3">
                  Begin Your Journey
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-burgundy)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </Link>
            <p className="mt-6 text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 italic text-lg">
              Join our community of passionate readers today
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
