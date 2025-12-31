import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coincontext } from '../Context/Coincontext';
import Breadcrumb from '../Components/Breadcrumb';
import ConversionModal from '../Components/ConversionModal';
import { fadeInUp, staggerContainer, scaleIn, buttonHover, viewportSettings } from '../utils/animations';

const Dashboard = () => {
  const { user } = useAuth();
  const { Currency = { symbol: '₦' } } = useContext(Coincontext);
  const navigate = useNavigate();
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  const stats = [
    {
      label: 'Total Converted',
      value: `${Currency.symbol}0`,
      change: '+0%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Transactions',
      value: '0',
      change: 'This month',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: 'Account Status',
      value: 'Active',
      change: 'Verified',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      title: 'Convert Crypto',
      description: 'Convert cryptocurrency to local currency',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      action: () => setIsConversionModalOpen(true)
    },
    {
      title: 'Transaction History',
      description: 'View all your past transactions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      action: () => {}
    },
    {
      title: 'Get Support',
      description: 'Contact our support team',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      action: () => navigate('/contact')
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1020] text-white font-inter overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="pt-36 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
          >
            <Breadcrumb items={[{ label: 'Dashboard' }]} />
            
            <div className="mt-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-4">
                Welcome back, {user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">
                Manage your crypto conversions and track your transactions all in one place.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    {stat.icon}
                  </div>
                  <span className="text-xs text-gray-400">{stat.change}</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Get started with common tasks
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="relative group"
              >
                <div className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-8 hover:border-blue-500/50 hover:bg-[#111827] transition-all duration-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                    {action.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {action.title}
                  </h3>

                  <p className="text-gray-400 mb-6 flex-grow">
                    {action.description}
                  </p>

                  <motion.button
                    variants={buttonHover}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={action.action}
                    className="w-full py-4 rounded-xl font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Account Info */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#071224]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            variants={fadeInUp}
            className="bg-[#0d1425] border border-[#1e293b] rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-[#1e293b]">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-semibold">{user?.email || 'Not available'}</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-[#1e293b]">
                <span className="text-gray-400">Account Type</span>
                <span className="text-white font-semibold">Standard</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-[#1e293b]">
                <span className="text-gray-400">Status</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-semibold">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conversion Modal */}
      <ConversionModal 
        isOpen={isConversionModalOpen} 
        onClose={() => setIsConversionModalOpen(false)} 
      />

    </div>
  );
};

export default Dashboard;
