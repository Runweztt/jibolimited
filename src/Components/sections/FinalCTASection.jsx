import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, buttonHover, scaleIn, viewportSettings } from '../../utils/animations';

const FinalCTASection = () => {
  const navigate = useNavigate();

  const ctaOptions = [
    {
      title: 'For Merchants',
      description: 'Start accepting crypto payments and get paid in local currency',
      buttonText: 'Create Merchant Account',
      buttonAction: () => { navigate('/register'); window.scrollTo(0, 0); },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-blue-600 to-cyan-600',
      isPrimary: true
    },
    {
      title: 'Become a Partner',
      description: 'Join our network of local liquidity providers',
      buttonText: 'Partner With Us',
      buttonAction: () => { navigate('/contact'); window.scrollTo(0, 0); },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-green-600 to-emerald-600',
      isPrimary: false
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#071224] to-[#0b1020] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>
        <div className="floating-shape floating-shape-3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main CTA Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Join the future of payments. Accept crypto, receive local currency, 
            and grow your business across borders.
          </p>
        </motion.div>

        {/* CTA Options Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {ctaOptions.map((option, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={scaleIn}
              custom={index}
              className={`relative group ${option.isPrimary ? 'md:scale-105' : ''}`}
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border ${option.isPrimary ? 'border-blue-500/50' : 'border-white/10'} rounded-2xl p-8 hover:border-white/30 transition-all duration-300 h-full flex flex-col`}>
                
                {/* Primary Badge */}
                {option.isPrimary && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {option.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {option.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 flex-grow">
                  {option.description}
                </p>

                {/* CTA Button */}
                <motion.button
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={option.buttonAction}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    option.isPrimary
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg shadow-blue-500/30`
                      : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white'
                  }`}
                >
                  {option.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Support Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={fadeInUp}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">
            Have questions? Our team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="mailto:support@jibo.com.ng" className="text-blue-400 hover:text-blue-300 transition-colors">
              📧 support@jibo.com.ng
            </a>
            <a href="tel:+447533616307" className="text-blue-400 hover:text-blue-300 transition-colors">
              📞 +447533616307
            </a>
            <a href="https://wa.me/2349069937105" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              💬 WhatsApp Support
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FinalCTASection;
