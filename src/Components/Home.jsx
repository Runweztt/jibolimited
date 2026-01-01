import React, { useContext } from 'react';
import Navbar from '../Components/Navbar';
import { Coincontext } from '../Context/Coincontext';
import HeroSection from './sections/HeroSection';
import CoreValueSection from './sections/CoreValueSection';
import HowItWorksSection from './sections/HowItWorksSection';
import UseCasesSection from './sections/UseCasesSection';
import TrustSecuritySection from './sections/TrustSecuritySection';
import FinalCTASection from './sections/FinalCTASection';
import '../styles/parallax.css';

const Home = () => {
  const { allCoin = [], Currency = { symbol: '₦' } } = useContext(Coincontext);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white font-inter overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Crypto Ticker - Mobile Only */}
      <section className="md:hidden bg-[#071224] border-y border-[#142235] py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap items-center animate-scroll">
            {[...allCoin.slice(0, 10), ...allCoin.slice(0, 10)].map((coin, i) => (
              <div key={`${coin?.id}-${i}`} className="flex items-center gap-3 px-3">
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

      {/* Core Value Section */}
      <CoreValueSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Trust & Security Section */}
      <TrustSecuritySection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* FAQ Section */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-[#0b1020]">
        <div className="max-w-5xl mx-auto">
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h4>
          <div className="space-y-4">
            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                <span>How do I receive crypto payments?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Create an account, verify your identity, then use our Finance page to generate payment links or QR codes. 
                Your customers pay in crypto, and you receive local currency via our P2P network.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                <span>What cryptocurrencies do you support?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">
                We support all major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT, and many more. 
                Your customers can pay with any cryptocurrency they prefer.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                <span>How fast are the payouts?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Payouts are typically processed within minutes through our P2P network. 
                Once the crypto payment is confirmed on the blockchain, our liquidity providers fulfill the local currency payout immediately.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                <span>Is my data secure?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Yes, we prioritize security and use industry best practices for user data protection and authentication. 
                All transactions are encrypted and we maintain strict compliance with data protection regulations.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                <span>What are the fees?</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">
                We offer competitive P2P rates with transparent pricing. There are no hidden fees or intermediary charges. 
                The exact fee depends on the transaction amount and currency pair. Contact us for detailed pricing.
              </p>
            </details>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
