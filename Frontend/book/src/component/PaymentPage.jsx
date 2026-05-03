import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCheckout() {
      setCheckoutLoading(true);
      setError("");

      try {
        const data = await api.getCheckout(id);
        if (!active) return;
        setCheckoutData(data);
      } catch (loadError) {
        if (!active) return;

        if (loadError.status === 401) {
          logout();
          navigate("/signup");
          return;
        }

        setError(loadError.message);
      } finally {
        if (active) setCheckoutLoading(false);
      }
    }

    loadCheckout();
    return () => {
      active = false;
    };
  }, [id, logout, navigate]);

  const amountLabel = useMemo(
    () => `Rs ${Number(checkoutData?.book?.price || 0).toFixed(0)}`,
    [checkoutData],
  );

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const openGatewayCheckout = async () => {
    setPaymentStatus("");
    setProcessingPayment(true);

    try {
      if (!checkoutData.gateway.keyId) {
        throw new Error("Add your Razorpay Key ID and Key Secret in the backend .env file first.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay Checkout. Please check your internet connection.");
      }

      const orderData = await api.createGatewayOrder(id);

      const options = {
        key: orderData.gateway.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: orderData.gateway.merchantName,
        description: `Purchase ${orderData.book.title}`,
        order_id: orderData.order.id,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
        },
        notes: {
          book_id: String(orderData.book.id),
          book_title: orderData.book.title,
        },
        theme: {
          color: "#2dd4bf",
        },
        handler: async (response) => {
          try {
            setPaymentStatus("Verifying payment...");
            await api.verifyGatewayPayment(id, response);
            setPaymentStatus("Payment successful. Opening your book...");
            window.setTimeout(() => navigate(`/read/${id}`), 700);
          } catch (verifyError) {
            if (verifyError.status === 401) {
              logout();
              navigate("/signup");
              return;
            }
            setPaymentStatus(verifyError.message);
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            setPaymentStatus("Payment was cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (gatewayError) {
      if (gatewayError.status === 401) {
        logout();
        navigate("/signup");
        return;
      }

      setPaymentStatus(gatewayError.message);
      setProcessingPayment(false);
    }
  };

  if (checkoutLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0A0C12] px-4 text-white">
        <p className="text-lg font-bold">Opening payment page...</p>
      </main>
    );
  }

  if (error || !checkoutData) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0A0C12] px-4 text-white">
        <section className="max-w-xl rounded-2xl bg-[#161B2D] p-8 text-center shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Payment Unavailable
          </p>
          <h1 className="mt-4 text-3xl font-black">We could not open the payment page.</h1>
          <p className="mt-4 text-white/70">{error || "Please try again."}</p>
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
    <main className="min-h-screen bg-[#0A0C12] text-white">
      <header className="flex min-h-[82px] flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0A0C12]/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Secure Checkout
          </p>
          <h1 className="mt-2 truncate text-2xl font-black md:text-3xl">{checkoutData.book.title}</h1>
          <p className="mt-1 text-sm text-white/65">
            Pay securely with UPI apps, net banking, cards, and wallets. The book unlocks automatically after payment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            {amountLabel}
          </span>
          <button
            type="button"
            onClick={() => navigate("/course")}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
          >
            Exit Payment
          </button>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-82px)] gap-0 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="border-b border-white/10 bg-[#10172A] p-4 xl:border-b-0 xl:border-r xl:p-8">
          <div className="grid gap-6 2xl:grid-cols-[340px_1fr]">
            <div className="rounded-3xl bg-[#0B1220] p-5 shadow-2xl">
              <img
                src={checkoutData.book.image}
                alt={checkoutData.book.title}
                className="h-[420px] w-full rounded-3xl bg-[#11182C] object-cover"
              />
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl bg-[#0B1220] p-6 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Payment Provider</p>
                <p className="mt-3 text-3xl font-black">Razorpay</p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  One secure checkout for UPI apps, Net Banking, Cards, and Wallets. No manual payment proof is needed.
                </p>
              </div>

              <div className="rounded-3xl bg-[#0B1220] p-6 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Supported Methods</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {checkoutData.gateway.supportedMethods.map((method) => (
                    <span
                      key={method}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold capitalize text-white/80"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#0B1220] p-6 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">How It Works</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white/75">
                  <p>1. Click the secure payment button.</p>
                  <p>2. Choose any supported app or bank from Razorpay checkout.</p>
                  <p>3. Complete the payment.</p>
                  <p>4. Your book unlocks automatically and opens right away.</p>
                </div>
              </div>

              {checkoutData.owned && (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                  This book is already purchased and ready in your library.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#161B2D] p-4 xl:p-8">
          {checkoutData.owned ? (
            <div className="flex h-full flex-col justify-center rounded-3xl bg-[#0B1220] p-8 shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Purchased</p>
              <h2 className="mt-4 text-3xl font-black">This book is already yours.</h2>
              <p className="mt-4 max-w-xl text-white/70">
                Payment has already been verified. You can go straight to the reader.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/read/${id}`)}
                className="mt-8 w-fit rounded-full bg-emerald-500 px-6 py-3 font-bold text-white"
              >
                Read Book
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#0B1220] p-6 shadow-2xl xl:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                Real Payment Flow
              </p>
              <h2 className="mt-4 text-3xl font-black">Complete your purchase securely</h2>
              <p className="mt-4 text-white/70">
                Razorpay will open in a secure checkout window where users can choose the payment app or bank they prefer.
              </p>

              <div className="mt-6 rounded-3xl bg-[#11182C] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white/50">Book</p>
                    <p className="mt-2 text-xl font-black">{checkoutData.book.title}</p>
                    <p className="mt-1 text-sm text-white/65">by {checkoutData.book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold uppercase tracking-wide text-white/50">Amount</p>
                    <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{amountLabel}</p>
                  </div>
                </div>
              </div>

              {paymentStatus && (
                <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  {paymentStatus}
                </p>
              )}

              <div className="mt-6 rounded-2xl bg-[#11182C] p-4 text-sm leading-7 text-white/70">
                Before hosting, add your real Razorpay `key_id` and `key_secret` in the backend `.env`. Without those, checkout cannot open in production.
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/course")}
                  className="rounded-full border border-white/10 px-5 py-3 font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={openGatewayCheckout}
                  disabled={processingPayment}
                  className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processingPayment ? "Opening Secure Checkout..." : "Continue to Secure Payment"}
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default PaymentPage;
