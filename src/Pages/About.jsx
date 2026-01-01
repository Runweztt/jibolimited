
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets"; 
import Breadcrumb from "../Components/Breadcrumb";
import UseCasesSection from "../Components/sections/UseCasesSection";
import { useAuth } from "../Context/AuthContext";
import { fadeInUp, staggerContainer, scaleIn, buttonHover, viewportSettings } from "../utils/animations";
import '../styles/parallax.css';

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleWhatsAppClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      const phoneNumber = '447533616307';
      const message = encodeURIComponent('Hi, I want to convert my crypto to local currency and get paid instantly!');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200 font-inter overflow-x-hidden">
      
      {/* Hero Section - Dynamic with Parallax */}
      <section className="relative pt-36 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Parallax Background */}
        <div className="hero-gradient-parallax"></div>
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center"
          >
            <Breadcrumb items={[{ label: 'About Us' }]} />
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mt-8 mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Our Story
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-4">
              About{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Jibo Currency</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Empowering businesses and individuals with innovative P2P crypto payment solutions.
              We combine modern technology with real-world services to simplify finance across emerging markets.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/register"
                  className="inline-block bg-[#002B5C] hover:bg-[#003d7a] px-8 py-4 rounded-full font-semibold transition-all"
                >
                  Create Account
                </Link>
              </motion.div>

              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleWhatsAppClick}
                className="inline-block bg-gradient-to-r from-[#002B5C] to-[#003d7a] px-8 py-4 rounded-full font-semibold transition-all"
              >
                Transact Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution - Using Home Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Problem */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                The Problem
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Traditional crypto-to-fiat conversion is slow, expensive, and complicated. 
                Merchants face high fees, long settlement times, and limited access to banking infrastructure.
              </p>
              <p className="text-gray-300 leading-relaxed">
                In emerging markets like Nigeria, Ghana, and Rwanda, these challenges are even more pronounced, 
                making it difficult for businesses to accept cryptocurrency payments.
              </p>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-[#0d1425] p-4 rounded-lg border border-[#1e293b]">
                  <div className="font-semibold text-white">₦1B+</div>
                  <div className="text-sm text-gray-400">Processed</div>
                </div>
                <div className="bg-[#0d1425] p-4 rounded-lg border border-[#1e293b]">
                  <div className="font-semibold text-white">100+</div>
                  <div className="text-sm text-gray-400">Merchants</div>
                </div>
                <div className="bg-[#0d1425] p-4 rounded-lg border border-[#1e293b]">
                  <div className="font-semibold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Solution */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Our Solution
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">Jibo Currency</strong> provides a P2P crypto payment network 
                that enables instant conversion to local currency. No banks required.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our platform connects merchants with local liquidity providers, ensuring fast settlement, 
                transparent pricing, and support for all major cryptocurrencies.
              </p>

              {/* Key Features */}
              <div className="space-y-3">
                {[
                  'Instant P2P settlement in minutes',
                  'Support for all cryptocurrencies',
                  'Lower fees than traditional methods',
                  'Operating in Nigeria, UK, Ghana, Rwanda'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mission/Vision/Values - Using Home Card Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Our Foundation
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Built on transparency, efficiency, and innovation to empower businesses worldwide.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Our Mission",
                text: "To redefine financial experiences through secure, fast, and user-friendly P2P crypto payment technology that empowers merchants in emerging markets."
              },
              {
                title: "Our Vision",
                text: "To become the leading P2P crypto payment network connecting businesses and individuals across Africa and beyond, making crypto accessible to everyone."
              },
              {
                title: "Our Values",
                text: "Integrity, innovation, and inclusivity — we believe technology should empower people and businesses to grow confidently without barriers."
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-3">{card.title}</h3>
                <p className="text-gray-300 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Uses Jibo Currency - Reuse Home Component */}
      <UseCasesSection />

      {/* Leadership & Team - Using Home Card Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#071224]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Leadership & Team
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Meet the team building the future of P2P crypto payments.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: "Jite Majemite", role: "Founder & CEO" },
              { name: "Emmanuel Amarikwa", role: "COO" },
              { name: "Salome Kenneth", role: "Research & Operations" },
              { name: "Eniola John", role: "HR & People Ops" },
            ].map((p, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 text-center hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-blue-400 border border-blue-500/20">
                  {p.name[0]}
                </div>
                <div className="font-semibold text-white text-lg">{p.name}</div>
                <div className="text-sm text-gray-400 mt-1">{p.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ - Using Home Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              {
                question: "How do I receive crypto payments?",
                answer: "Create an account, verify your identity, then use our Finance page to select your crypto and convert to local currency via our P2P network."
              },
              {
                question: "What cryptocurrencies do you support?",
                answer: "We support all major cryptocurrencies including Bitcoin, Ethereum, USDT, and many more. Your customers can pay with any cryptocurrency they prefer."
              },
              {
                question: "How fast are the payouts?",
                answer: "Payouts are typically processed within minutes through our P2P network. Once the crypto payment is confirmed on the blockchain, our liquidity providers fulfill the local currency payout immediately."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we prioritize security and use industry best practices for user data protection and authentication. All transactions are encrypted and we maintain strict compliance with data protection regulations."
              }
            ].map((faq, idx) => (
              <motion.details
                key={idx}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-xl p-5 hover:border-blue-500/50 transition-all group"
              >
                <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed">{faq.answer}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
