
import React, { useContext, useEffect, useState } from "react";
import { Coincontext } from "../../Context/Coincontext";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

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

  const fetchChartData = async (coinId) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${Currency.name}&days=7`
      );
      const data = await res.json();
      setChartData({
        labels: data.prices.map((p) =>
          new Date(p[0]).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        ),
        datasets: [
          {
            label: `${coinId.toUpperCase()} Price (7D)`,
            data: data.prices.map((p) => p[1]),
            borderColor: "#60a5fa",
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      });
    } catch (error) {
      toast.error("Chart data unavailable.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = (search || "").trim().toLowerCase();
    if (!term) return;

    const result = allCoin.find(
      (coin) => coin.name.toLowerCase() === term || coin.symbol.toLowerCase() === term
    );

    if (result) {
      setSelectedCoin(result);
      fetchChartData(result.id);
    } else {
      toast.error("Coin not found.");
    }
  };

  const handleTrade = (coin) => {
    const coinToUse = coin || selectedCoin;

    if (!coinToUse) {
      toast.error("Please select a coin first.");
      return;
    }

    if (!user) {
      toast("Redirecting to login...", { icon: "🔐" });
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const msg = `Hi, I want to trade ${coinToUse.name} (${coinToUse.symbol.toUpperCase()}) at ${Currency.symbol}${coinToUse.current_price.toLocaleString()}`;
    window.open(`https://wa.me/2349069937105?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-6 md:px-12 lg:px-24 py-10">

      {/* Hero Section */}
      <div className="text-center mt-20 mb-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          Jibo Currency Exchange
        </h1>

        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Seamlessly trade and monitor your favourite cryptocurrencies in{" "}
          <span className="font-semibold text-blue-400">
            {(Currency.name || "NGN").toUpperCase()}
          </span>.
        </p>

        {/* Search + Currency */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-lg mx-auto w-full"
        >
          <select
            value={Currency.name}
            onChange={(e) => {
              const selected = currencyOptions.find((c) => c.name === e.target.value);
              setCurrency(selected);
            }}
            className="w-full sm:w-1/3 bg-[#0b0b25] border border-blue-900 rounded-lg px-3 py-2"
          >
            {currencyOptions.map((cur) => (
              <option key={cur.name} value={cur.name}>
                {cur.name.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search crypto (e.g., Bitcoin)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-2/3 bg-[#0b0b25] border border-blue-900 rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        <button
          onClick={() => handleTrade(selectedCoin)}
          className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-semibold"
        >
          Trade now
        </button>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <div className="w-full bg-[#0b1020] rounded-xl shadow-lg border border-blue-900">

            {/* Header FIXED (4 columns) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 font-semibold text-gray-400 border-b border-blue-800 
                            p-3 sm:p-4 text-center">
              <p className="text-left pl-2 sm:pl-0">Coin</p>
              <p>Price</p>
              <p>24h</p>
              <p className="hidden sm:block">Market Cap</p>
            </div>

            {/* Rows FIXED (4 columns) */}
            <div className="divide-y divide-blue-900">
              {displaycoin.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 sm:grid-cols-4 items-center p-3 sm:p-4 text-center 
                            hover:bg-[#111136] transition cursor-pointer"
                  onClick={() => {
                    setSelectedCoin(item);
                    fetchChartData(item.id);
                  }}
                >
                  {/* Coin - left aligned */}
                  <div className="flex items-center gap-3 text-left pl-2 sm:pl-0">
                    <img src={item.image} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="truncate">
                      {item.name}{" "}
                      <span className="text-gray-500 text-xs">
                        ({item.symbol.toUpperCase()})
                      </span>
                    </p>
                  </div>

                  <p>{Currency.symbol}{item.current_price.toLocaleString()}</p>

                  <p className={`${item.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"} font-medium`}>
                    {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                  </p>

                  <p className="hidden sm:block">
                    {Currency.symbol}{item.market_cap.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {selectedCoin && chartData && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-[#0b0b25] rounded-2xl p-6 max-w-lg w-full border border-blue-800 relative">
            <button
              onClick={() => setSelectedCoin(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
            </h2>

            <div className="h-56 sm:h-64 mb-4">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-blue-400">Market Cap:</span>{" "}
              {Currency.symbol}{selectedCoin.market_cap.toLocaleString()}
            </p>

            <p className="text-gray-300 text-sm mt-1">
              <span className="font-semibold text-blue-400">Current Price:</span>{" "}
              {Currency.symbol}{selectedCoin.current_price.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
