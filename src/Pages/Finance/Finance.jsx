
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coincontext } from "../../Context/Coincontext";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import Breadcrumb from "../../Components/Breadcrumb";
import { fadeInUp, staggerContainer, scaleIn, buttonHover, viewportSettings } from "../../utils/animations";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Finance = () => {
  const { allCoin = [], Currency = { name: "usd", symbol: "$" }, setCurrency } = useContext(Coincontext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [displaycoin, setDisplaycoin] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  const currencyOptions = [
    { name: "usd", symbol: "$" },
    { name: "eur", symbol: "€" },
    { name: "gbp", symbol: "£" },
    { name: "ngn", symbol: "₦" },
  ];

  useEffect(() => {
    setDisplaycoin(allCoin);
    if (allCoin.length && !selectedCoin) setSelectedCoin(allCoin[0]);
  }, [allCoin]);

  useEffect(() => {
    if (Currency?.name) {
      fetchCoinData(Currency.name).catch(() => {});
    }
  }, [Currency]);

  const fetchCoinData = async (currency) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      );
      const data = await res.json();
      setDisplaycoin(data);
      if (data.length) setSelectedCoin(data[0]);
    } catch (error) {
      toast.error("Failed to load market data.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setDisplaycoin(allCoin);
      return;
    }
    const filtered = allCoin.filter((c) =>
      c?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setDisplaycoin(filtered);
  };

  const handleConvert = (coin) => {
    if (!user) {
      toast.error("Please log in to convert crypto.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const coinToUse = coin || selectedCoin;
    if (!coinToUse) {
      toast.error("No coin selected.");
      return;
    }
    const msg = `Hi, I want to convert ${coinToUse.name} (${coinToUse.symbol.toUpperCase()}) at ${Currency.symbol}${coinToUse.current_price.toLocaleString()} to local currency`;
    const whatsappUrl = `https://wa.me/2349069937105?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
  };

  // P2P Flow Steps
  const p2pSteps = [
    {
      number: '01',
      title: 'Select Cryptocurrency',
      description: 'Choose from Bitcoin, Ethereum, USDT, or any supported cryptocurrency you want to convert.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Get Live Rate',
      description: 'View real-time conversion rates to your local currency (Naira, Pounds, Euros, or Cedis).',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'P2P Conversion',
      description: 'Our network of local liquidity providers instantly converts your crypto to local currency.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Receive Payment',
      description: 'Get paid directly to your bank account in minutes. Fast, secure, and transparent.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1020] text-white font-inter overflow-x-hidden">
      
      {/* Hero Section - Matching Home */}
      <section className="pt-36 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center"
          >
            <Breadcrumb items={[{ label: 'Finance' }]} />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-4 mt-8">
              Convert Crypto to{' '}
                Local Currency
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get real-time rates and convert your cryptocurrency to Naira, Pounds, Euros, or Cedis 
              through our secure P2P network. Fast, transparent, and reliable.
            </p>

            {/* Currency Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {currencyOptions.map((cur) => (
                <button
                  key={cur.name}
                  onClick={() => setCurrency(cur)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    Currency.name === cur.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                >
                  {cur.symbol} {cur.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Transact Now CTA */}
            <motion.button
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleConvert(null)}
              className="inline-block bg-gradient-to-r from-[#002B5C] to-[#003d7a] px-8 py-4 rounded-full font-semibold transition-all"
            >
              Transact Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How P2P Conversion Works - Using Home Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Simple, fast, and secure. Convert your crypto to local currency in just 4 easy steps.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {p2pSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Crypto Rates - Improved Styling */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Live Conversion Rates
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Real-time cryptocurrency prices in {Currency.symbol} {Currency.name.toUpperCase()}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-3">
              <input
                type="text"
                placeholder="Search cryptocurrency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-[#0d1425] border border-[#1e293b] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Crypto Table */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="bg-[#0d1425] border border-[#1e293b] rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#071224] border-b border-[#1e293b]">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-semibold">#</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Coin</th>
                    <th className="text-right p-4 text-gray-400 font-semibold">Price</th>
                    <th className="text-right p-4 text-gray-400 font-semibold">24h Change</th>
                    <th className="text-right p-4 text-gray-400 font-semibold">Market Cap</th>
                    <th className="text-center p-4 text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displaycoin.slice(0, 10).map((coin, idx) => (
                    <tr
                      key={coin?.id || idx}
                      className="border-b border-[#1e293b] hover:bg-[#111827] transition-colors cursor-pointer"
                      onClick={() => setSelectedCoin(coin)}
                    >
                      <td className="p-4 text-gray-400">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={coin?.image} alt={coin?.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="font-semibold text-white">{coin?.name}</div>
                            <div className="text-sm text-gray-400">{coin?.symbol?.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold text-white">
                        {Currency.symbol}{coin?.current_price?.toLocaleString()}
                      </td>
                      <td className={`p-4 text-right font-semibold ${
                        coin?.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin?.price_change_percentage_24h?.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right text-gray-400">
                        {Currency.symbol}{(coin?.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="p-4 text-center">
                        <motion.button
                          variants={buttonHover}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConvert(coin);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                        >
                          Convert
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Security - Reusing Home Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Safe & Secure
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Your security is our priority. Every conversion is protected and transparent.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Escrow Protection',
                description: 'Funds held securely until both parties confirm the transaction.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Instant Verification',
                description: 'Real-time blockchain confirmation for all transactions.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Transparent Rates',
                description: 'Live market rates with no hidden fees or charges.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Finance;
