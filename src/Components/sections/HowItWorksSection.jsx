import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn, viewportSettings } from '../../utils/animations';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Merchant Creates Payment Request',
      description: 'Generate a payment link or QR code for your customer. Specify the amount in your local currency.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Customer Pays in Crypto',
      description: 'Your customer pays using any cryptocurrency (Bitcoin, Ethereum, USDT, etc.) from their wallet.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'P2P Provider Fulfills Payout',
      description: 'Our network of local liquidity providers instantly converts the crypto to your local currency.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'You Receive Local Currency',
      description: 'Get paid directly to your bank account in Naira, Pounds, Euros, or Cedis. Usually within minutes.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
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
            Simple, fast, and secure. Get paid in local currency for crypto payments in just 4 easy steps.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="relative"
            >
              {/* Connecting Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent -z-10"></div>
              )}

              {/* Step Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 h-full">
                {/* Number Badge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Flow Indicator (Mobile) */}
        <div className="mt-12 lg:hidden flex justify-center">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-blue-500/30"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
