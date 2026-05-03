import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function AdminPayments() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getPaymentRequests();
        if (!active) return;
        setRequests(data.requests || []);
      } catch (loadError) {
        if (!active) return;

        if (loadError.status === 401) {
          logout();
          navigate("/signup");
          return;
        }

        setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRequests();
    return () => {
      active = false;
    };
  }, [logout, navigate]);

  const handleStatusUpdate = async (requestId, status) => {
    setActiveRequestId(requestId);
    setStatusMessage("");

    try {
      const response = await api.updatePaymentRequestStatus(requestId, status);
      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? { ...request, status } : request,
        ),
      );
      setStatusMessage(response.message);
    } catch (updateError) {
      if (updateError.status === 401) {
        logout();
        navigate("/signup");
        return;
      }
      setStatusMessage(updateError.message);
    } finally {
      setActiveRequestId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0A0C12] px-4 text-white">
        <section className="max-w-xl rounded-3xl bg-[#161B2D] p-8 text-center shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Admin Only
          </p>
          <h1 className="mt-4 text-3xl font-black">This page is only for admins.</h1>
          <button
            type="button"
            onClick={() => navigate("/course")}
            className="mt-8 rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white"
          >
            Back to Library
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0C12] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Payment Requests</h1>
            <p className="mt-2 text-white/65">
              Approve or reject premium-book payment requests. Approved payments unlock the book automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/course")}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-bold text-white"
          >
            Back to Library
          </button>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[320px] place-items-center rounded-3xl bg-[#161B2D]">
            <p className="text-lg font-bold text-white/70">Loading payment requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="grid min-h-[320px] place-items-center rounded-3xl bg-[#161B2D] text-center">
            <div>
              <h2 className="text-2xl font-black">No payment requests yet</h2>
              <p className="mt-3 text-white/65">New premium-book payments will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl bg-[#161B2D] p-6 shadow-2xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black">{request.book_title}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                          request.status === "approved" || request.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : request.status === "rejected"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-amber-500/20 text-amber-200"
                        }`}
                      >
                        {request.status === "completed" ? "paid" : request.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">by {request.book_author}</p>
                    <p className="text-sm text-white/65">
                      Buyer: <span className="font-bold text-white">{request.user_name}</span> ({request.user_email})
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/55">Amount</p>
                    <p className="text-2xl font-black text-[var(--color-primary)]">
                      Rs {Number(request.amount || 0).toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-[#0D1324] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Method</p>
                    <p className="mt-2 text-sm font-bold text-white/80">{request.payment_method}</p>
                  </div>

                  <div className="rounded-2xl bg-[#0D1324] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Transaction ID / UTR</p>
                    <p className="mt-2 break-all text-sm font-bold text-white/80">{request.reference_id}</p>
                  </div>

                  <div className="rounded-2xl bg-[#0D1324] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Buyer Contact</p>
                    <p className="mt-2 text-sm font-bold text-white/80">{request.payer_contact || "Not provided"}</p>
                  </div>

                  <div className="rounded-2xl bg-[#0D1324] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Buyer UPI ID</p>
                    <p className="mt-2 break-all text-sm font-bold text-white/80">{request.payer_upi_id || "Not provided"}</p>
                  </div>
                </div>

                {request.note && (
                  <div className="mt-4 rounded-2xl bg-[#0D1324] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Note</p>
                    <p className="mt-2 text-sm leading-7 text-white/75">{request.note}</p>
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-[#0D1324] px-4 py-3 text-sm font-bold text-white/70">
                  Razorpay payments are verified automatically. This page is now a payment history and audit view.
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPayments;
