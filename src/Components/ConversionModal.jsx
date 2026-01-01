import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coincontext } from '../Context/Coincontext';

const ConversionModal = ({ isOpen, onClose }) => {
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
  }, [allCoin]);

  // Calculate fiat amount when crypto amount or selected crypto changes
  useEffect(() => {
    if (selectedCrypto && cryptoAmount && !loading) {
      const amount = parseFloat(cryptoAmount) || 0;
      const price = selectedCrypto.current_price || 0;
      const total = amount * price;
      setFiatAmount(total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b1020] border border-[#1e293b] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Convert Crypto</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* You Receive Section */}
              <div className="bg-[#0d1425]/50 border border-[#1e293b] rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">You receive</span>
                  {selectedCrypto && (
                    <div className="flex items-center gap-2 bg-[#1e293b]/50 px-3 py-1.5 rounded-full">
                      <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-5 h-5 rounded-full" />
                      <span className="text-white font-semibold text-sm">{selectedCrypto.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={cryptoAmount}
                    onChange={handleCryptoAmountChange}
                    className="flex-1 bg-transparent text-white text-4xl font-bold focus:outline-none"
                    placeholder="0.0"
                  />
                  <span className="text-white text-2xl font-semibold">
                    {selectedCrypto?.symbol?.toUpperCase() || 'BTC'}
                  </span>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center my-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* You Get Paid Section */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">You get paid</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={Currency.name}
                      onChange={(e) => {
                        const currencies = [
                          { name: 'usd', symbol: '$' },
                          { name: 'ngn', symbol: '₦' },
                          { name: 'gbp', symbol: '£' },
                          { name: 'eur', symbol: '€' },
                          { name: 'ghs', symbol: '₵' }
                        ];
                        const selected = currencies.find(c => c.name === e.target.value);
                        if (selected && setCurrency) {
                          setCurrency(selected);
                        }
                      }}
                      className="bg-green-500/20 text-white font-semibold text-sm px-3 py-1.5 rounded-full border border-green-500/30 focus:outline-none focus:border-green-500/50 cursor-pointer"
                    >
                      <option value="usd" className="bg-[#0b1020]">🇺🇸 USD</option>
                      <option value="ngn" className="bg-[#0b1020]">🇳🇬 Naira</option>
                      <option value="gbp" className="bg-[#0b1020]">🇬🇧 Pounds</option>
                      <option value="eur" className="bg-[#0b1020]">🇪🇺 Euros</option>
                      <option value="ghs" className="bg-[#0b1020]">🇬🇭 Cedis</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-2">
                  {loading ? (
                    <div className="h-12 bg-green-500/20 rounded animate-pulse"></div>
                  ) : (
                    <div className="text-green-400 text-4xl font-bold">
                      {Currency.symbol}{fiatAmount}
                    </div>
                  )}
                </div>
                
                <div className="text-gray-400 text-sm">
                  via P2P • Instant
                </div>
              </div>

              {/* Crypto Selector */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-3 block">Select Cryptocurrency</label>
                <div className="grid grid-cols-5 gap-2">
                  {topCryptos.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedCrypto?.id === crypto.id
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-[#0d1425] border-[#1e293b] hover:border-blue-500/30'
                      }`}
                      title={crypto.name}
                    >
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mx-auto rounded-full" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Rate */}
              {selectedCrypto && (
                <div className="pt-6 border-t border-[#1e293b]">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Current Rate</span>
                    <span className="text-white font-semibold">
                      1 {selectedCrypto.symbol?.toUpperCase()} = {Currency.symbol}{selectedCrypto.current_price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
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

              {/* Convert Button */}
              <button
                onClick={onClose}
                className="w-full mt-6 bg-[#002B5C] hover:bg-[#003d7a] text-white font-semibold py-4 rounded-xl transition-all"
              >
                Proceed to Convert
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConversionModal;
