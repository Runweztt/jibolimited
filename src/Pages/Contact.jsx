import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import { useAuth } from "../Context/AuthContext";
import { fadeInUp, staggerContainer, scaleIn, buttonHover, viewportSettings } from "../utils/animations";
import '../styles/parallax.css';

const Contact = () => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    // placeholder behaviour (replace with email API or emailjs)
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSuccess("Thanks! Your message was sent. We'll get back to you soon.");
    } catch (err) {
      setError("Something went wrong. Try again later.");
    } finally {
      setSending(false);
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
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mt-8 mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                24/7 Support
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-4">
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Touch</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We'd love to hear from you. Whether you're interested in crypto payments, partnerships, 
              or just have questions, our team is ready to help.
            </p>

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
          </motion.div>
        </div>
      </section>

      {/* Contact Methods - Using Home Feature Card Pattern */}
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
              Contact Channels
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Support: Monday–Friday, 9am–6pm. We'll respond as quickly as possible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Email Support',
                info: 'info@jiboltd.com',
                link: 'mailto:info@jiboltd.com'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: 'Phone Support',
                info: '+447533616307',
                link: 'tel:+447533616307'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'WhatsApp',
                info: 'Chat with us',
                link: 'https://wa.me/2349069937105'
              }
            ].map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300 block"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                <p className="text-blue-400 font-semibold">{method.info}</p>
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form & Office Locations Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              
              <form
                onSubmit={handleSubmit}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 space-y-4"
              >
                {success && <div className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg p-3">{success}</div>}
                {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</div>}

                <div>
                  <label className="text-sm text-gray-300 font-semibold mb-2 block">Full name</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg bg-[#0b1020] border border-[#1e293b] text-gray-200 focus:outline-none focus:border-blue-500/50 transition-colors" 
                    placeholder="Your full name" 
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 font-semibold mb-2 block">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-[#0b1020] border border-[#1e293b] text-gray-200 focus:outline-none focus:border-blue-500/50 transition-colors" 
                    placeholder="you@company.com" 
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 font-semibold mb-2 block">Message</label>
                  <textarea 
                    rows="5" 
                    className="w-full px-4 py-3 rounded-lg bg-[#0b1020] border border-[#1e293b] text-gray-200 focus:outline-none focus:border-blue-500/50 transition-colors resize-none" 
                    placeholder="How can we help?" 
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-[#002B5C] hover:bg-[#003d7a] px-6 py-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportSettings}
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Our Offices</h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Head Office (UK)',
                    address: 'Jibo Currency — 22 Fleet Street, London, EC4Y 1AA',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )
                  },
                  {
                    title: 'Nigeria Office',
                    address: '12A Adeola Odeku Street, Victoria Island, Lagos',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Ghana Office',
                    address: 'Coming Soon - Accra, Ghana',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Rwanda Office',
                    address: 'Coming Soon - Kigali, Rwanda',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  }
                ].map((office, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-5 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400">{office.icon}</div>
                      <div>
                        <h4 className="text-blue-400 font-semibold mb-1">{office.title}</h4>
                        <p className="text-gray-300 text-sm">{office.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Find Us
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div variants={scaleIn} className="rounded-2xl overflow-hidden border border-[#1e293b]">
              <iframe
                title="Jibo Currency UK Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19800.784703957086!2d-0.1082034!3d51.5113358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b95a3d1f67%3A0x34b7b197648f5c25!2sFleet%20St%2C%20London!5e0!3m2!1sen!2suk!4v1692022100821!5m2!1sen!2suk"
                className="w-full h-80"
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
            <motion.div variants={scaleIn} className="rounded-2xl overflow-hidden border border-[#1e293b]">
              <iframe
                title="Jibo Currency Nigeria Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.341620962518!2d3.426218074687793!3d6.605635822262256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53f740c7fd9%3A0x2c0e3c5b5e60c12d!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1692023100456!5m2!1sen!2sng"
                className="w-full h-80"
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Using Home Pattern */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#071224]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Tailored Solution?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Contact our enterprise team for custom integrations, partnership enquiries, 
              or high-volume merchant solutions.
            </p>
            <motion.a
              href="mailto:info@jiboltd.com"
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="inline-block bg-[#002B5C] hover:bg-[#003d7a] px-8 py-4 rounded-full text-white font-semibold transition-all"
            >
              Contact Sales
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
