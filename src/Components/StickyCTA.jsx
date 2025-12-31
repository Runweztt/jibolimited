import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleWhatsAppClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Open WhatsApp with pre-filled message
      const phoneNumber = '447533616307';
      const message = encodeURIComponent('Hi, I want to convert my crypto to local currency and get paid instantly!');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-auto md:hidden"
        >
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#002B5C] to-[#003d7a] text-white font-semibold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Transact Now</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
