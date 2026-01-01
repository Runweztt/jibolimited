import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Coincontext } from '../Context/Coincontext';
import { scaleIn, viewportSettings } from '../utils/animations';

const CryptoConverter = () => {
  const { allCoin = [], Currency = { name: "usd", symbol: "$" }, setCurrency, loading = false } = useContext(Coincontext);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoAmount, setCryptoAmount] = useState('0.0125');
  const [fiatAmount, setFiatAmount] = useState('0');

  // Set default crypto to Bitcoin when coins load and update when currency changes
  useEffect(() => {
    if (allCoin.length > 0) {
      const currentSymbol = selectedCrypto?.symbol || 'btc';
      const updatedCrypto = allCoin.find(coin => coin.symbol === currentSymbol) || allCoin[0];
      setSelectedCrypto(updatedCrypto);
    }
  }, [allCoin, Currency.name]);

  // Calculate fiat amount when crypto amount or selected crypto changes
  useEffect(() => {
    if (selectedCrypto && cryptoAmount && !loading) {
      const amount = parseFloat(cryptoAmount) || 0;
      const price = selectedCrypto.current_price || 0;
      const total = amount * price;
      setFiatAmount(total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [selectedCrypto, cryptoAmount, Currency.name, loading, allCoin]);

  const handleCryptoAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCryptoAmount(value);
    }
  };

  const topCryptos = allCoin.slice(0, 10);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={scaleIn}
      className="max-w-lg mx-auto"
    >
      <div className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-4 shadow-2xl">
        
        {/* You Receive Section */}
        <div className="bg-[#0d1425]/50 border border-[#1e293b] rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">You receive</span>
            {selectedCrypto && (
              <div className="flex items-center gap-1.5 bg-[#1e293b]/50 px-2 py-1 rounded-full">
                <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-4 h-4 rounded-full" />
                <span className="text-white font-semibold text-xs">{selectedCrypto.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cryptoAmount}
              onChange={handleCryptoAmountChange}
              className="flex-1 bg-transparent text-white text-2xl font-bold focus:outline-none"
              placeholder="0.0"
            />
            <span className="text-white text-lg font-semibold">
              {selectedCrypto?.symbol?.toUpperCase() || 'BTC'}
            </span>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="flex justify-center my-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* You Get Paid Section */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">You get paid</span>
            <div className="flex items-center gap-1.5">
              <select
                value={Currency.name}
                onChange={(e) => {
                  const currencies = [
                    { name: 'usd', symbol: '$' },
                    { name: 'ngn', symbol: '₦' },
                    { name: 'gbp', symbol: '£' },
                    { name: 'eur', symbol: '€' }
                  ];
                  const selected = currencies.find(c => c.name === e.target.value);
                  if (selected && setCurrency) {
                    setCurrency(selected);
                  }
                }}
                className="bg-green-500/20 text-white font-semibold text-xs px-2 py-1 rounded-full border border-green-500/30 focus:outline-none focus:border-green-500/50 cursor-pointer"
              >
                <option value="usd" className="bg-[#0d1425]">🇺🇸 USD</option>
                <option value="ngn" className="bg-[#0d1425]">🇳🇬 Naira</option>
                <option value="gbp" className="bg-[#0d1425]">🇬🇧 Pounds</option>
                <option value="eur" className="bg-[#0d1425]">🇪🇺 Euros</option>
              </select>
            </div>
          </div>
          
          <div className="mb-1">
            {loading ? (
              <div className="h-8 bg-green-500/20 rounded animate-pulse"></div>
            ) : (
              <div className="text-green-400 text-2xl font-bold">
                {Currency.symbol}{fiatAmount}
              </div>
            )}
          </div>
          
          <div className="text-gray-400 text-xs">
            via P2P • Instant
          </div>
        </div>

        {/* Crypto Selector */}
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-2 block">Select Cryptocurrency</label>
          <div className="grid grid-cols-5 gap-1.5">
            {topCryptos.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className={`p-2 rounded-lg border transition-all ${
                  selectedCrypto?.id === crypto.id
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-[#0d1425] border-[#1e293b] hover:border-blue-500/30'
                }`}
                title={crypto.name}
              >
                <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mx-auto rounded-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Current Rate */}
        {selectedCrypto && (
          <div className="pt-3 border-t border-[#1e293b]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Current Rate</span>
              <span className="text-white font-semibold">
                1 {selectedCrypto.symbol?.toUpperCase()} = {Currency.symbol}{selectedCrypto.current_price?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">24h Change</span>
              <span className={`font-semibold ${
                selectedCrypto.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedCrypto.price_change_percentage_24h > 0 ? '+' : ''}
                {selectedCrypto.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CryptoConverter;
