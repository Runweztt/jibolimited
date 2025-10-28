import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b mt-39 from-gray-400 to-white text-black px-6 md:px-16 lg:px-24 py-16">
      {/* Top Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Left Section */}
        <div>
          <img
            src={assets.logo}
            alt="Jibo Limited Logo"
            className="mb-5 w-40"
          />
          <p className="text-black leading-relaxed">
            Jibo Limited empowers users with smart crypto exchange, digital finance,
            and mobility services — all in one ecosystem.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <h3 className="text-xl font-semibold text-blue-500 mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/finance" className="hover:text-blue-400 transition-colors">
                Finance
              </a>
            </li>
            <li>
              <a href="/logistics" className="hover:text-blue-400 transition-colors">
                Logistics
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-xl font-semibold text-blue-500 mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <strong className="text-black">Email:</strong> support@jiboltd.com
            </li>
            <li>
              <strong className="text-black">Phone:</strong> +44 20 7123 4567
            </li>
            <li>
              <strong className="text-black">Address:</strong> 22 Fleet Street, London, EC4Y 1AA, UK
            </li>
          </ul>

          <div className="flex space-x-5 text-xl mt-6">
            <a href="#" className="hover:text-blue-400 transition-all">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition-all">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition-all">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Jibo Limited. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
