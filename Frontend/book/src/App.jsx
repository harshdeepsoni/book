import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import Banner from "./component/Banner";
import Footer from "./component/Footer";
import Course from "./component/Course";
import Signup from "./component/Signup";
import Contact from "./component/Contact";
import About from "./component/About";
import Home from "./component/Home";
import Readbook from "./component/Readbook";
import PaymentPage from "./component/PaymentPage";
import AdminPayments from "./component/AdminPayments";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return children;

  return (
    <>
      <Navbar />
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg-soft)] px-4 py-28 dark:bg-[#0B1220]">
        <section className="max-w-xl rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-[#172033]">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Login Required
          </p>
          <h1 className="mt-4 text-4xl font-bold">Please login or sign up first</h1>
          <p className="mt-4 leading-7 text-[var(--color-text-muted)]">
            The Library is only available after you create an account or login.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex rounded-full bg-[var(--color-primary)] px-7 py-3 font-bold text-white hover:bg-[var(--color-primary-dark)]"
          >
            Sign Up / Login
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="dark:bg-[#0F0520] dark:text-[#F0E6FF]">
      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Banner />
              <Footer />
            </>
          }
        />

        {/* 🔥 IMPORTANT: Read Page */}
        <Route
          path="/read/:id"
          element={
            <>
              <Readbook />
            </>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <RequireAuth>
              <AdminPayments />
            </RequireAuth>
          }
        />

        {/* Course Page */}
        <Route
          path="/course"
          element={
            <RequireAuth>
              <Navbar />
              <div className="min-h-screen">
                <Course />
              </div>
              <Footer />
            </RequireAuth>
          }
        />

        {/* Contact Page */}
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <div className="min-h-screen">
                <Contact />
              </div>
              <Footer />
            </>
          }
        />

        {/* About Page */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <div className="min-h-screen">
                <About />
              </div>
              <Footer />
            </>
          }
        />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </div>
  );
}

export default App;
