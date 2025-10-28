import React, { useContext, useEffect, useState } from "react";
import { Coincontext } from "../../Context/Coincontext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { FaWhatsapp } from "react-icons/fa";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Finance = () => {
  const { allCoin, Currency, setCurrency } = useContext(Coincontext);
  const [displaycoin, setDisplaycoin] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setDisplaycoin(allCoin);
    if (allCoin.length && !selectedCoin) setSelectedCoin(allCoin[0]);
  }, [allCoin]);

  const handleCurrency = (e) => {
    const value = e.target.value;
    const map = { usd: "$", gbp: "£", ngn: "₦", eur: "€" };
    setCurrency({ name: value, symbol: map[value] || "$" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const result = allCoin.find(
      (coin) =>
        coin.name.toLowerCase() === search.toLowerCase() ||
        coin.symbol.toLowerCase() === search.toLowerCase()
    );
    if (result) {
      setSelectedCoin(result);
      fetchChartData(result.id);
    } else alert("Coin not found");
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
      console.error("Chart fetch error:", error);
    }
  };

  const handleTrade = () => {
    if (!selectedCoin) return alert("Select a coin first!");
    const msg = `Hi, I want to trade ${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()}) at ${Currency.symbol}${selectedCoin.current_price.toLocaleString()}`;
    window.open(`https://wa.me/2349069937105?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#030318] text-white px-4 sm:px-8 md:px-12 py-10">
      {/* Hero */}
      <div className="text-center mt-24 mb-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-blue-400 leading-tight">
          Jibo Currency Exchange
        </h1>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Seamlessly trade and monitor your favorite cryptocurrencies in{" "}
          <span className="font-semibold text-blue-400">
            {Currency.name.toUpperCase()}
          </span>.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto w-full"
        >
          <input
            type="text"
            placeholder="Search crypto (e.g., Bitcoin)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b0b25] border border-blue-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium text-sm w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        {/* WhatsApp Trade Button */}
        <button
          onClick={handleTrade}
          className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
        >
          <FaWhatsapp className="text-xl" /> Trade on now
        </button>
      </div>

      {/* Coin Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-[#0b0b25] rounded-xl shadow-lg border border-blue-900">
          {/* Table Header */}
          <div className="grid grid-cols-3 sm:grid-cols-5 font-semibold text-gray-400 border-b border-blue-800 p-3 sm:p-4 text-[11px] sm:text-xs md:text-sm uppercase text-center">
            <p>Coin</p>
            <p>Price</p>
            <p>24h</p>
            <p className="hidden sm:block">Market Cap</p>
            <p className="hidden sm:block">Trade</p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-blue-900">
            {displaycoin.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 sm:grid-cols-5 items-center text-[11px] sm:text-xs md:text-sm text-gray-300 p-3 sm:p-4 text-center hover:bg-[#111136] transition cursor-pointer"
              >
                {/* Coin Info */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <p className="truncate">
                    {item.name}{" "}
                    <span className="text-gray-500 text-[10px] sm:text-xs">
                      ({item.symbol.toUpperCase()})
                    </span>
                  </p>
                </div>

                {/* Price */}
                <p className="truncate">
                  {Currency.symbol}
                  {item.current_price.toLocaleString()}
                </p>

                {/* 24h Change */}
                <p
                  className={`${
                    item.price_change_percentage_24h > 0
                      ? "text-green-400"
                      : "text-red-400"
                  } font-medium truncate`}
                >
                  {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                </p>

                {/* Market Cap (hide on xs) */}
                <p className="hidden sm:block truncate">
                  {Currency.symbol}
                  {item.market_cap.toLocaleString()}
                </p>

                {/* Trade (hide on xs) */}
                <div className="hidden sm:flex justify-center">
                  <button
                    onClick={handleTrade}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <FaWhatsapp /> Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Popup */}
      {selectedCoin && chartData && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-[#0b0b25] rounded-2xl p-6 max-w-lg w-full border border-blue-800 shadow-lg relative">
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
              <Line
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">
              <span className="font-semibold text-blue-400">Market Cap:</span>{" "}
              {Currency.symbol}
              {selectedCoin.market_cap.toLocaleString()}
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              <span className="font-semibold text-blue-400">Current Price:</span>{" "}
              {Currency.symbol}
              {selectedCoin.current_price.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
