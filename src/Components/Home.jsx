// src/Pages/Home.jsx
import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Coincontext } from "../Context/Coincontext";
import { assets } from "../assets/assets";

/**
 * Landing Page - Crypto Trading & Car Ride Booking
 * - Mobile-first, responsive, animated
 * - Sections spaced out with proper visual hierarchy
 * - Smooth crypto ticker animation
 * - Separate Footer component
 */

const Home = () => {
  const { allCoin = [], Currency = { symbol: "₦" } } = useContext(Coincontext);

  // Crypto stats
  const cryptoStats = [
    { id: "c1", value: "₦300M+", label: "Transactions processed", icon: "₦" },
    { id: "c2", value: "100+", label: "Trusted clients", icon: "👥" },
    { id: "c3", value: "24/7", label: "Support", icon: "🕑" },
    { id: "c4", value: "99.9%", label: "Success rate", icon: "✓" },
  ];

  const cryptoFeatures = [
    { id: "cf1", title: "Fast Payouts", desc: "Move money quickly — payout speed designed for businesses and traders." },
    { id: "cf2", title: "Free Registration", desc: "Sign up in minutes. Registration is free, safe and secure." },
    { id: "cf3", title: "Trusted Trading", desc: "Reliable and secure crypto exchange trusted by thousands of users." },
  ];

  const rideFeatures = [
    { id: "rf1", title: "Instant Booking", desc: "Book a ride in seconds with guaranteed pickups." },
    { id: "rf2", title: "Trusted Drivers", desc: "Professional drivers with verified ratings and reviews." },
    { id: "rf3", title: "City & Airport", desc: "Seamless rides to airports and popular city locations." },
  ];

  const rideCities = [
    { id: "r1", city: "Lagos", img: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg" },
    { id: "r2", city: "Abuja", img: "https://images.pexels.com/photos/21014/pexels-photo.jpg" },
    { id: "r3", city: "Kano", img: "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg" },
    { id: "r4", city: "Port Harcourt", img: "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0b1020] text-white font-inter">
      {/* Animations */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floaty { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .fade-in-up { animation: fadeInUp 560ms ease both; }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        .ticker-scroll { animation: scrollLeft 18s linear infinite; }
      `}</style>

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-40">
        <Navbar />
      </div>

      {/* HERO */}
      <header className="pt-28 pb-16 px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left: Hero Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white fade-in-up">
              Trade Crypto & Book Rides Seamlessly
            </h1>
            <p className="mt-6 text-[#cfd8ea] text-lg sm:text-xl max-w-xl mx-auto md:mx-0">
              Jibo combines <strong className="text-[#3b82f6]">crypto trading</strong> with
              <strong className="text-[#3b82f6]"> ride bookings</strong>. Secure, fast, and trusted by thousands.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 justify-center md:justify-start">
              <a
                href="#Booking"
                className="w-full sm:w-auto text-center border border-[#3b82f6] px-6 py-4 rounded-full hover:bg-[#3b82f6] hover:text-white transition font-medium"
              >
                Book Ride
              </a>
              <a
                href="#Crypto"
                className="w-full sm:w-auto text-center bg-[#3b82f6] px-6 py-4 rounded-full text-white hover:bg-[#2563eb] transition font-medium"
              >
                Crypto Exchange
              </a>
            </div>

            <div className="mt-6 text-sm text-[#9fb0d4] space-y-1 max-w-lg">
              <p>Secure crypto trading and trusted city/airport pickups.</p>
              <p>Fast payouts and 99.9% service reliability.</p>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="w-full md:w-1/2 hidden md:flex justify-center items-center">
            <div className="w-full max-w-md floaty">
              <img
                src={assets.crypto_img}
                alt="Jibo illustration"
                className="w-full object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CRYPTO TICKER */}
      <section className="mt-12 bg-[#0d132a] border-y border-[#142235] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="overflow-hidden">
            <div className="flex gap-8 whitespace-nowrap items-center ticker-scroll">
              {[...allCoin.slice(0, 8), ...allCoin.slice(0, 8)].map((coin, i) => (
                <div key={coin?.id ?? i} className="flex items-center gap-3 px-3">
                  <img src={coin?.image} alt={coin?.name} className="w-6 h-6 rounded-full" />
                  <div className="text-sm">
                    <div className="font-medium">{coin?.symbol?.toUpperCase()}</div>
                    <div className="text-[#9fb0d4]">{Currency.symbol}{coin?.current_price?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CRYPTO SECTION */}
      <section id="Crypto" className="px-4 sm:px-6 md:px-12 lg:px-20 mt-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Crypto Trading Highlights</h2>

          {/* Crypto Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cryptoStats.map((s, idx) => (
              <article
                key={s.id}
                className="bg-[#071224] border border-[#142235] p-6 rounded-xl flex items-start gap-4 shadow-md hover:shadow-lg transition"
                style={{ animation: `fadeInUp 560ms ease ${idx * 150}ms both` }}
              >
                <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-[#08182b] text-[#3b82f6] font-bold text-xl">
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-semibold leading-none">{s.value}</p>
                  <p className="text-sm text-[#cbd8f2]">{s.label}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Crypto Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {cryptoFeatures.map((f, i) => (
              <div
                key={f.id}
                className="bg-[#071224] border border-[#142235] rounded-2xl p-6 hover:shadow-lg transform hover:-translate-y-2 transition"
                style={{ animation: `fadeInUp 560ms ease ${i * 150}ms both` }}
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#cbd8f2] text-sm">{f.desc}</p>
                <div className="mt-5">
                  {/* <a className="text-[#3b82f6] text-sm hover:underline" href="#Crypto"></a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDE BOOKING SECTION */}
      <section id="Booking" className="px-4 sm:px-6 md:px-12 lg:px-20 mt-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Car Ride Booking</h2>

          {/* Ride Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {rideFeatures.map((f, i) => (
              <div
                key={f.id}
                className="bg-[#071224] border border-[#142235] rounded-2xl p-6 hover:shadow-lg transform hover:-translate-y-2 transition"
                style={{ animation: `fadeInUp 560ms ease ${i * 150}ms both` }}
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#cbd8f2] text-sm">{f.desc}</p>
                <div className="mt-5">
                  {/* <a className="text-[#3b82f6] text-sm hover:underline" href="#Booking"> </a> */}
                </div>
              </div>
            ))}
          </div>

          {/* Ride Cities Carousel */}
          <h3 className="text-2xl font-semibold mb-6">Explore Ride Cities</h3>
          <div className="overflow-x-auto -mx-4 px-4 pb-10">
            <div className="flex gap-6">
              {rideCities.map((c) => (
                <div key={c.id} className="min-w-[220px] bg-[#071224] rounded-lg p-4 shadow-md hover:shadow-lg transition">
                  <div className="w-full h-40 rounded-md overflow-hidden mb-3">
                    <img src={c.img} alt={c.city} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{c.city}</h4>
                    <p className="text-sm text-[#9fb0d4]">Popular pickup locations & airport transfers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
