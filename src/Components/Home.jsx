// src/Pages/Home.jsx
import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import { Coincontext } from "../Context/Coincontext";
import { assets } from "../assets/assets";


const Home = () => {
  const { allCoin = [], Currency = { symbol: "₦" } } = useContext(Coincontext);

  const cryptoStats = [
    { id: "c1", value: "₦300M+", label: "Transactions processed", icon: "₦" },
    { id: "c2", value: "100+", label: "Trusted clients", icon: "👥" },
    { id: "c3", value: "24/7", label: "Support", icon: "🕑" },
    { id: "c4", value: "99.9%", label: "Success rate", icon: "✓" },
  ];

  const cryptoFeatures = [
    { id: "cf1", title: "Fast Payouts", desc: "Move money quickly — payout speed designed for traders." },
    { id: "cf2", title: "Free Registration", desc: "Sign up in minutes. Secure and simple." },
    { id: "cf3", title: "Trusted Exchange", desc: "Reliable and secure platform trusted by thousands." },
  ];

  const rideFeatures = [
    { id: "rf1", title: "Instant Booking", desc: "Book a ride instantly with guaranteed pickups." },
    { id: "rf2", title: "Verified Drivers", desc: "Professional, rated, and trusted drivers." },
    { id: "rf3", title: "City & Airport", desc: "Fast, reliable city and airport transfers." },
  ];

  const rideCities = [
    { id: "r1", city: "Lagos", img: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg" },
    { id: "r2", city: "Abuja", img: "https://images.pexels.com/photos/21014/pexels-photo.jpg" },
    { id: "r3", city: "Kano", img: "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg" },
    { id: "r4", city: "Port Harcourt", img: "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg" },
  ];

  return (
    <div className="min-h-screen bg-[#0b1020] text-white font-inter overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floaty {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .fade-up { animation: fadeInUp 0.8s ease both; }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        .ticker-scroll { animation: scrollLeft 18s linear infinite; }
      `}</style>

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-40 bg-[#0b1020]/90 backdrop-blur-md border-b">
        <Navbar />
      </div>

      {/* HERO SECTION */}
      <header className="pt-36 pb-16 mt-20 px-5 sm:px-8 md:px-16 lg:px-24 fade-up">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20">
          {/* Text Side */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Trade Crypto & Book Rides Effortlessly
            </h1>
            <p className="text-[#cfd8ea] text-lg sm:text-xl max-w-md mx-auto md:mx-0">
              Experience the fusion of <strong>crypto trading</strong> and
              <strong> smart ride booking</strong> — secure, fast, and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
              <a
                href="#Booking"
                className="border border-[#3b82f6] px-6 py-3 rounded-full hover:bg-[#3b82f6] hover:text-white transition font-medium text-center"
              >
                Book a Ride
              </a>
              <a
                href="#Crypto"
                className="bg-[#3b82f6] px-6 py-3 rounded-full text-white hover:bg-[#2563eb] transition font-medium text-center"
              >
                Crypto Exchange
              </a>
            </div>
          </div>

          {/* Hero Image (hidden on mobile) */}
          <div className="flex-1 hidden md:flex justify-center">
            <img
              src={assets.crypto_img}
              alt="Crypto Illustration"
              className="w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] floaty"
            />
          </div>
        </div>
      </header>

      {/* CRYPTO TICKER */}
      <section className="bg-[#0d132a] border-y border-[#142235] py-4 fade-up">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 lg:px-24 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap items-center ticker-scroll">
            {[...allCoin.slice(0, 10), ...allCoin.slice(0, 10)].map((coin, i) => (
              <div key={coin?.id ?? i} className="flex items-center gap-3 px-3">
                <img src={coin?.image} alt={coin?.name} className="w-6 h-6 rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">{coin?.symbol?.toUpperCase()}</p>
                  <p className="text-[#9fb0d4]">
                    {Currency.symbol}
                    {coin?.current_price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRYPTO SECTION */}
      <section id="Crypto" className="px-5 sm:px-8 md:px-16 lg:px-24 mt-20 fade-up">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold">Crypto Trading Highlights</h2>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {cryptoStats.map((s, idx) => (
              <div
                key={s.id}
                className="bg-[#071224] border border-[#142235] p-6 rounded-xl hover:shadow-lg transition-all"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#08182b] text-[#3b82f6] font-bold text-xl">
                  {s.icon}
                </div>
                <p className="text-2xl font-semibold">{s.value}</p>
                <p className="text-sm text-[#cbd8f2]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {cryptoFeatures.map((f, i) => (
              <div
                key={f.id}
                className="bg-[#071224] border border-[#142235] rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all"
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#cbd8f2] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDE SECTION */}
      <section id="Booking" className="px-5 sm:px-8 md:px-16 lg:px-24 mt-20 mb-20 fade-up">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold">Book Your Ride</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rideFeatures.map((f, i) => (
              <div
                key={f.id}
                className="bg-[#071224] border border-[#142235] rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all"
              >
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#cbd8f2] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mt-12">Explore Ride Cities</h3>
          <div className="overflow-x-auto flex gap-6 pb-4 justify-center">
            {rideCities.map((c) => (
              <div key={c.id} className="min-w-[220px] bg-[#071224] rounded-lg p-4 shadow-md hover:shadow-lg transition">
                <div className="w-full h-40 rounded-md overflow-hidden mb-3">
                  <img src={c.img} alt={c.city} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-lg">{c.city}</h4>
                <p className="text-sm text-[#9fb0d4]">Popular destinations & airports</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Home;
