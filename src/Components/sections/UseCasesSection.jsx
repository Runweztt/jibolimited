import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn, cardHover, viewportSettings } from '../../utils/animations';

const UseCasesSection = () => {
  const useCases = [
    {
      title: 'Local Merchants',
      description: 'Accept crypto payments at your retail store, restaurant, or shop. Get paid in local currency instantly.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      examples: ['Retail stores', 'Restaurants', 'Cafés', 'Boutiques']
    },
    {
      title: 'Freelancers & Creators',
      description: 'Receive global payments without expensive wire transfers. Perfect for remote work and digital services.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      examples: ['Designers', 'Developers', 'Writers', 'Consultants']
    },
    {
      title: 'SMEs & Businesses',
      description: 'Process B2B transactions, supplier payments, and international invoices with lower fees.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      examples: ['Import/Export', 'Wholesalers', 'Distributors', 'Agencies']
    },
    {
      title: 'Cross-Border Payments',
      description: 'Send and receive money across borders without high remittance fees or long wait times.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      examples: ['Remittances', 'International transfers', 'Family support', 'Diaspora payments']
    },
    {
      title: 'Digital Services',
      description: 'Perfect for SaaS, subscriptions, online courses, and digital products sold globally.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      examples: ['SaaS platforms', 'Online courses', 'Digital downloads', 'Subscriptions']
    },
    {
      title: 'E-commerce',
      description: 'Add crypto payment options to your online store and expand your customer base globally.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      examples: ['Online stores', 'Marketplaces', 'Dropshipping', 'Digital goods']
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#071224] to-[#0b1020]">
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
            Who Uses Jibo Currency?
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            From local merchants to global businesses, Jibo Currency powers crypto payments 
            for diverse use cases across emerging markets.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover="hover"
              initial="rest"
              className="group relative bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 overflow-hidden hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                  {useCase.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  {useCase.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default UseCasesSection;
