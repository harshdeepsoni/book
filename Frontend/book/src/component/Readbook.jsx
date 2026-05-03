import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function Readbook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setError("");
      try {
        const [readData, feedbackData] = await Promise.all([
          api.readBook(id),
          api.feedback(id).catch(() => ({ feedback: [] })),
        ]);

        if (!active) return;
        setBook(readData.book);
        setReviews(feedbackData.feedback || []);
      } catch (err) {
        if (!active) return;
        setBook(err.data?.book || null);
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBook();
    return () => {
      active = false;
    };
  }, [id]);

  const readerUrl = useMemo(() => {
    if (!book?.pdf_url) return "";

    const driveIdFromUc = book.pdf_url.match(/[?&]id=([^&]+)/)?.[1];
    if (book.pdf_url.includes("drive.google.com/uc") && driveIdFromUc) {
      return `https://drive.google.com/file/d/${driveIdFromUc}/preview`;
    }

    const driveIdFromFile = book.pdf_url.match(/\/file\/d\/([^/]+)/)?.[1];
    if (book.pdf_url.includes("drive.google.com") && driveIdFromFile) {
      return `https://drive.google.com/file/d/${driveIdFromFile}/preview`;
    }

    if (book.pdf_url.includes("drive.google.com") && !book.pdf_url.includes("/preview")) {
      return book.pdf_url.replace("/view", "/preview").replace("?usp=drive_link", "");
    }
    return book.pdf_url;
  }, [book]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      return;
    }

    await document.documentElement.requestFullscreen?.();
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    setFeedbackStatus("Saving...");

    try {
      await api.submitFeedback(id, feedback);
      const data = await api.feedback(id);
      setReviews(data.feedback || []);
      setFeedback({ rating: 5, comment: "" });
      setFeedbackStatus("Thank you! Your feedback has been saved.");
      window.setTimeout(() => navigate("/course"), 900);
    } catch (err) {
      if (err.status === 401) {
        logout();
        setFeedbackStatus("Your session expired. Please login again.");
        setShowFeedbackPrompt(false);
        window.setTimeout(() => navigate("/signup"), 700);
        return;
      }
      setFeedbackStatus(err.message);
    }
  };

  const userAlreadyReviewed = Boolean(
    isLoggedIn && user?.id && reviews.some((review) => Number(review.user_id) === Number(user.id)),
  );

  const closeBook = () => {
    if (isLoggedIn && !userAlreadyReviewed) {
      setShowFeedbackPrompt(true);
      return;
    }

    navigate("/course");
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg-soft)] px-4 dark:bg-[#0F1117]">
        <p className="text-lg font-bold text-[var(--color-text-muted)]">Opening your book...</p>
      </main>
    );
  }

  if (error && !book) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg-soft)] px-4 dark:bg-[#0F1117]">
        <section className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-[#1A1D2E]">
          <h1 className="text-3xl font-bold">Book unavailable</h1>
          <p className="mt-3 text-[var(--color-text-muted)]">{error}</p>
          <Link to="/course" className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white">
            Back to Library
          </Link>
        </section>
      </main>
    );
  }

  if (error && book?.category === "paid") {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg-soft)] px-4 dark:bg-[#0F1117]">
        <section className="max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1A1D2E] md:grid md:grid-cols-[220px_1fr]">
          <img src={book.image} alt={book.title} className="h-full min-h-[280px] w-full object-cover" />
          <div className="p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Premium Book</p>
            <h1 className="mt-3 text-3xl font-bold">{book.title}</h1>
            <p className="mt-2 text-[var(--color-text-muted)]">by {book.author}</p>
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{error}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate("/course")}
                  className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
                >
                  {error.toLowerCase().includes("pending") ? "Back to Library" : `Pay Rs ${Number(book.price || 0).toFixed(0)} in Library`}
                </button>
              ) : (
                <Link to="/signup" className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white">
                  Create Account
                </Link>
              )}
              <button
                type="button"
                onClick={() => navigate("/course")}
                className="rounded-full border border-[var(--color-border)] px-6 py-3 font-bold"
              >
                Back to Library
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0C12] text-white">
      <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0A0C12]/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="min-w-0">
          <h1 className="mt-1 truncate text-xl font-bold md:text-2xl">{book.title}</h1>
          <p className="text-sm text-white/60">by {book.author}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button
              type="button"
              onClick={closeBook}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-white/20"
            >
              Exit Book
            </button>
          )}
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
            {book.category === "free" ? "Free" : "Purchased"}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0A0C12]"
          >
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </header>

      <section className="relative h-[calc(100vh-72px)] overflow-auto bg-white">
        {readerUrl ? (
          <iframe
            src={readerUrl}
            title={book.title}
            className="block h-full w-full border-0 bg-white"
            allow="fullscreen"
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center">
            <div>
              <h2 className="text-3xl font-bold">PDF link missing</h2>
              <p className="mt-3 text-white/70">Add a valid pdf_url in the books table for this book.</p>
            </div>
          </div>
        )}
      </section>

      {showFeedbackPrompt && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <form onSubmit={handleFeedbackSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 text-[var(--color-text)] shadow-2xl dark:bg-[#172033] dark:text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Before you leave
            </p>
            <h2 className="mt-3 text-3xl font-bold">How was this book?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              Your feedback helps improve the library. You will only see this once for this book.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Rating</span>
              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const active = rating <= feedback.rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedback((current) => ({ ...current, rating }))}
                      className={`grid h-12 w-12 place-items-center rounded-full border transition ${
                        active
                          ? "border-amber-300 bg-amber-50 text-amber-500"
                          : "border-[var(--color-border)] bg-[var(--color-bg-soft)] text-slate-400 dark:bg-[#0B1220]"
                      }`}
                      aria-label={`Rate ${rating} star${rating > 1 ? "s" : ""}`}
                    >
                      <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">
                {feedback.rating} star{feedback.rating > 1 ? "s" : ""}
              </p>
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Comment</span>
              <textarea
                value={feedback.comment}
                onChange={(event) => setFeedback((current) => ({ ...current, comment: event.target.value }))}
                rows="4"
                className="mt-2 w-full resize-none rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 dark:bg-[#0B1220]"
                placeholder="Share what you thought about this book..."
              />
            </label>

            {feedbackStatus && <p className="mt-4 text-sm font-bold text-[var(--color-primary)]">{feedbackStatus}</p>}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/course")}
                className="rounded-full border border-[var(--color-border)] px-5 py-2.5 font-bold text-[var(--color-text)] dark:text-white"
              >
                Skip
              </button>
              <button type="submit" className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 font-bold text-white">
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Readbook;
