import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Cards({ item }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [message, setMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const openReader = () => navigate(`/read/${item.id}`);

  const handlePurchaseClick = () => {
    setMessage("");

    if (!isLoggedIn) {
      setMessage("Please login first to purchase premium books.");
      return;
    }

    navigate(`/payment/${item.id}`);
  };

  const coverUrl = item.image || item.coverImage || "";
  const hasUsableCover = !imageFailed && /^(https?:\/\/|data:image\/|\/)/i.test(coverUrl);

  return (
    <article className="my-3 h-full p-3">
      <div className="bubble-card flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-lg dark:border-[#2D3145] dark:bg-[#1A1D2E]">
        <div className="relative">
          {item.category === "free" && (
            <span className="absolute right-3 top-3 rounded-full bg-[var(--color-success)] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              Free
            </span>
          )}
          {item.category === "paid" && (
            <span className="absolute right-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              Premium
            </span>
          )}
          {hasUsableCover ? (
            <img
              src={coverUrl}
              alt={item.title}
              className="h-72 w-full bg-[var(--color-bg-soft)] object-cover"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-72 w-full flex-col justify-between bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-secondary)] p-6 text-white">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">{item.genre || "Book"}</p>
                <h3 className="mt-5 text-3xl font-black leading-tight">{item.title}</h3>
              </div>
              <p className="text-sm font-bold text-white/80">by {item.author}</p>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full bg-[var(--color-bg-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)] dark:bg-[#0F1117]">
              {item.genre}
            </span>
            <span className="text-sm font-bold text-[var(--color-text-muted)]">
              {Number(item.rating || 0).toFixed(1)} / 5
            </span>
          </div>

          <h2 className="text-xl font-bold leading-tight text-[var(--color-text)] dark:text-white">
            {item.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">by {item.author}</p>
          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-[var(--color-text-muted)]">
            {item.description}
          </p>

          {message && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
              {message}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            {item.category === "free" ? (
              <>
                <span className="font-black text-[var(--color-success)]">Read free</span>
                <button
                  type="button"
                  onClick={openReader}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Read Now
                </button>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-[var(--color-primary)]">
                  Rs {Number(item.price || 0).toFixed(0)}
                </span>
                <button
                  type="button"
                  onClick={handlePurchaseClick}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-primary-dark)]"
                >
                  {isLoggedIn ? "Buy with QR / UPI" : "Login to Buy"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default Cards;
