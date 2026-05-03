import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

function Course() {
  const [list, setList] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All"); // All, free, paid

  useEffect(() => {
    api.books()
      .then((data) => setList(data.books || []))
      .catch((error) => setLoadError(error.message));
  }, []);

  // Get unique genres
  const genres = ["All", ...new Set(list.map((item) => item.genre))];

  // Filter books
  const filteredBooks = list.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || item.genre === selectedGenre;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesGenre && matchesCategory;
  });

  // Count books by category
  const freeCount = list.filter(item => item.category === "free").length;
  const paidCount = list.filter(item => item.category === "paid").length;

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 paper-texture">
        {/* Hero Section */}
        <div className="mt-32 mb-16 items-center justify-center text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
            <span className="text-[20rem] font-bold text-[var(--color-burgundy)] dark:text-[var(--color-gold)]">
              📚
            </span>
          </div>

          <div className="relative z-10 stagger-item">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-burgundy)]/40 dark:to-[var(--color-gold)]/40"></div>
              <span className="text-[var(--color-gold)] font-medium tracking-[0.3em] text-sm uppercase">
                Our Collection
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-burgundy)]/40 dark:to-[var(--color-gold)]/40"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to Our{" "}
              <span className="bg-gradient-to-r from-[var(--color-burgundy)] via-[var(--color-burgundy-light)] to-[var(--color-gold)] bg-clip-text text-transparent">
                Literary Haven
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-[var(--color-charcoal)]/80 dark:text-[var(--color-cream)]/80 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of books across all genres. From timeless classics to contemporary bestsellers, find your next great read among thousands of carefully selected titles.
            </p>
            
            <Link to="/">
              <button className="mt-8 group relative overflow-hidden bg-gradient-to-r from-[var(--color-burgundy)] via-[var(--color-burgundy-light)] to-[var(--color-gold)] text-white px-8 py-4 rounded-full font-bold text-base tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Home
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-burgundy)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 stagger-item">
          <div className="bg-white dark:bg-[#2b2520] rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-14 bg-[var(--color-cream)] dark:bg-[#1a1410] border-2 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20 rounded-xl outline-none focus:border-[var(--color-burgundy)] dark:focus:border-[var(--color-gold)] transition-all duration-300 text-[var(--color-charcoal)] dark:text-[var(--color-cream)] font-medium text-lg"
                />
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--color-burgundy)] dark:text-[var(--color-gold)] opacity-60 group-focus-within:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)] uppercase tracking-wider mb-4">
                Book Type
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                    selectedCategory === "All"
                      ? "bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white"
                      : "bg-[var(--color-cream)] dark:bg-[#1a1410] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] border-2 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20 hover:border-[var(--color-burgundy)] dark:hover:border-[var(--color-gold)]"
                  }`}
                >
                  All Books ({list.length})
                </button>
                <button
                  onClick={() => setSelectedCategory("free")}
                  className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                    selectedCategory === "free"
                      ? "bg-gradient-to-r from-[var(--color-forest)] to-[var(--color-forest-light)] text-white"
                      : "bg-[var(--color-cream)] dark:bg-[#1a1410] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] border-2 border-[var(--color-forest)]/20 dark:border-[var(--color-forest-light)]/20 hover:border-[var(--color-forest)] dark:hover:border-[var(--color-forest-light)]"
                  }`}
                >
                  📚 Free Books ({freeCount})
                </button>
                <button
                  onClick={() => setSelectedCategory("paid")}
                  className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                    selectedCategory === "paid"
                      ? "bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white"
                      : "bg-[var(--color-cream)] dark:bg-[#1a1410] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] border-2 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20 hover:border-[var(--color-burgundy)] dark:hover:border-[var(--color-gold)]"
                  }`}
                >
                  💎 Premium Books ({paidCount})
                </button>
              </div>
            </div>

            {/* Genre Filters */}
            <div>
              <p className="text-sm font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)] uppercase tracking-wider mb-4">
                Filter by Genre
              </p>
              <div className="flex gap-3 flex-wrap">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                      selectedGenre === genre
                        ? "bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white"
                        : "bg-[var(--color-cream)] dark:bg-[#1a1410] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] border-2 border-[var(--color-burgundy)]/20 dark:border-[var(--color-gold)]/20 hover:border-[var(--color-burgundy)] dark:hover:border-[var(--color-gold)]"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-6 border-t-2 border-[var(--color-burgundy)]/10 dark:border-[var(--color-gold)]/10">
              <p className="text-sm text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 font-medium">
                Showing <span className="text-[var(--color-burgundy)] dark:text-[var(--color-gold)] font-bold text-lg">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'book' : 'books'}
                {selectedGenre !== "All" && (
                  <span> in <span className="text-[var(--color-burgundy)] dark:text-[var(--color-gold)] font-bold">{selectedGenre}</span></span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-20">
          {loadError && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-center font-bold text-red-700">
              {loadError}. Make sure the backend server and MySQL database are running.
            </div>
          )}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((item, index) => (
                <div key={item.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <Cards item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 opacity-30">📚</div>
              <h3 className="text-3xl font-bold text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-4">
                No Books Found
              </h3>
              <p className="text-lg text-[var(--color-charcoal)]/60 dark:text-[var(--color-cream)]/60 mb-8">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("All");
                  setSelectedCategory("All");
                }}
                className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white px-8 py-4 rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Course;
