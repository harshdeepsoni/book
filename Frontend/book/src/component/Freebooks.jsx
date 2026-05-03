import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Cards from "./Cards.jsx";
import { api } from "../lib/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Freebooks() {
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    api.books("?category=free")
      .then((data) => { setFilterData(data.books || []); })
      .catch(() => setFilterData([]));
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
      { breakpoint: 600,  settings: { slidesToShow: 2, slidesToScroll: 1, initialSlide: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 py-16">
        {/* Header */}
        <div className="mb-12 stagger-item text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]"></div>
            <span className="fun-badge bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30">
              🎁 Complimentary Collection
            </span>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-secondary)] to-[var(--color-primary)]"></div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Free Literary Treasures! 🎉
            </span>
          </h1>

          <p className="text-center text-base md:text-lg text-[var(--color-text-muted)] dark:text-[#A78BCD] max-w-3xl mx-auto leading-relaxed font-medium">
            Discover timeless classics and exceptional reads at absolutely no cost. Immerse yourself in literature
            that has shaped minds and inspired generations — completely free, forever! ✨
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            {[
              { value: `${filterData.length}+`, label: "Free Books", emoji: "📚" },
              { value: "100%",                  label: "No Cost",    emoji: "🆓" },
              { value: "∞",                     label: "Access",     emoji: "♾️" },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-12 bg-[var(--color-primary)]/20 dark:bg-[var(--color-primary-light)]/20"></div>}
                <div className="text-center pop-in" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                    {s.emoji} {s.value}
                  </div>
                  <div className="text-xs md:text-sm text-[var(--color-text-muted)] dark:text-[#A78BCD] font-bold uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative stagger-item">
          <style>{`
            .slick-slider { padding: 20px 0; }
            .slick-dots { bottom: -40px; }
            .slick-dots li button:before { font-size: 14px; color: #7C3AED; opacity: 0.35; }
            .dark .slick-dots li button:before { color: #A855F7; }
            .slick-dots li.slick-active button:before { opacity: 1; color: #EC4899; }
            .dark .slick-dots li.slick-active button:before { color: #F59E0B; }
            .slick-prev, .slick-next { width: 50px; height: 50px; z-index: 10; }
            .slick-prev:before, .slick-next:before { font-size: 50px; opacity: 0.5; color: #7C3AED; }
            .dark .slick-prev:before, .dark .slick-next:before { color: #A855F7; }
            .slick-prev:hover:before, .slick-next:hover:before { opacity: 1; color: #EC4899; }
            .slick-prev { left: -60px; }
            .slick-next { right: -60px; }
            @media (max-width: 768px) { .slick-prev { left: -30px; } .slick-next { right: -30px; } }
          `}</style>
          <Slider {...settings}>
            {filterData.map((item) => (
              <Cards item={item} key={item.id} />
            ))}
          </Slider>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 stagger-item">
          <div className="inline-block bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-secondary)]/10 to-[var(--color-accent)]/10 dark:from-[var(--color-primary)]/20 dark:via-[var(--color-secondary)]/20 dark:to-[var(--color-accent)]/20 rounded-3xl p-8 border-2 border-[var(--color-primary)]/20 dark:border-[var(--color-primary-light)]/20">
            <p className="text-lg md:text-xl text-[var(--color-text-muted)] dark:text-[#A78BCD] font-bold mb-6 max-w-2xl">
              Love what you see? Explore our complete collection of premium and free books! 🚀
            </p>
            <a href="/course">
              <button className="group gradient-rainbow text-white px-10 py-4 rounded-full font-extrabold text-lg tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-1">
                <span className="flex items-center gap-3">
                  🏛️ Explore Full Library
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Freebooks;
