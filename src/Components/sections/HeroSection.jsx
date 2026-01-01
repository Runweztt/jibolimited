import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import CryptoConverter from '../CryptoConverter';
import { fadeInUp, slideInLeft, slideInRight, buttonHover, floating, viewportSettings } from '../../utils/animations';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleWhatsAppClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Open WhatsApp with pre-filled message
      const phoneNumber = '447533616307'; // From company info
      const message = encodeURIComponent('Hi, I want to convert my crypto to local currency and get paid instantly!');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <section className="relative pt-24 pb-20 mt-25 md:mt-16 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Parallax Background */}
      <div className="hero-gradient-parallax"></div>
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={slideInLeft}
            className="text-center md:text-left space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                P2P Crypto Payment Solution
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Accept Crypto.{' '}
              Get Paid in Local Currency.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
              Receive cryptocurrency payments and get settled in{' '}
              <strong className="text-white">Naira, Pounds, Euros, or Cedis</strong>{' '}
              through our secure P2P network. No banks required.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Instant Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Lower Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>All Cryptocurrencies</span>
              </div>
            </div>

            {/* Single CTA */}
            <div className="pt-4">
              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleWhatsAppClick}
                className="px-6 py-3 bg-[#002B5C] hover:bg-[#003d7a] text-white font-semibold rounded-lg transition-all"
              >
                Transact Now
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Dynamic Crypto Converter */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={slideInRight}
            className="hidden md:block"
          >
            <CryptoConverter />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
