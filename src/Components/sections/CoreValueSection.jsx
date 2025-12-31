import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn, viewportSettings } from '../../utils/animations';

const CoreValueSection = () => {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Crypto → Local Currency',
      description: 'Accept any cryptocurrency and receive instant payouts in your local currency through our P2P network.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'No Bank Rails Required',
      description: 'Bypass traditional banking infrastructure. Our P2P network connects you directly with local liquidity providers.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Faster Settlement',
      description: 'Get paid in minutes, not days. Our P2P system settles payments instantly without waiting for bank processing.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Lower Fees',
      description: 'Save money with competitive P2P rates. No hidden charges, no intermediary fees, just transparent pricing.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Local Liquidity Network',
      description: 'Powered by trusted local payment partners across Nigeria, UK, Ghana, and Rwanda (coming soon).'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'All Cryptocurrencies',
      description: 'Support for Bitcoin, Ethereum, USDT, and all major cryptocurrencies. Your customers can pay with any coin.'
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0b1020] to-[#071224]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Why Choose Jibo Currency?
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The fastest, most affordable way to accept crypto payments and receive local currency. 
            Built for merchants, freelancers, and businesses in emerging markets.
          </p>
        </motion.div>

        {/* Value Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CoreValueSection;
