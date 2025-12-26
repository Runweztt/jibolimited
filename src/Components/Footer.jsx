
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-[#071224] text-gray-300">
      {/* === CTA Section === */}
      <section className="py-10 px-6 md:px-12 lg:px-24 border-b border-[#142235]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Ready to get started?
            </h2>
            <p className="text-[#cbd8f2] text-sm mt-1">
              Join Jibo today  trade crypto or book your first ride instantly.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
            <a
              href="#register"
              className="bg-[#002B5C] hover:bg-[#003d7a] px-5 py-2.5 rounded-full text-sm font-medium text-white transition"
            >
              Create Account
            </a>
            <a
              href="#Booking"
              className="border border-[#002B5C] hover:bg-[#002B5C] hover:text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
            >
              Book a Ride
            </a>
          </div>
        </div>
      </section>

      {/* === Main Footer === */}
      <div className="px-6 md:px-12 lg:px-24 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section */}
          <div>
            <img
              src={assets.jibo_currency_logo}
              alt="Jibo Currency Logo"
              className="mb-3 h-16 w-auto"
            />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Jibo Limited empowers users with smart crypto exchange, digital
              finance, and mobility services all in one ecosystem.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold text-blue-400 mb-3">
              Company
            </h3>
            <ul className="space-y-1.5 text-sm">
              {["Home", "About Us", "Crypto", "Book Ride", "Contact"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a
                      href={`/${item.toLowerCase().replace(" ", "")}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-base font-semibold text-blue-400 mb-3">
              Get in Touch
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <strong className="text-gray-200">Email:</strong>{" "}
                support@jiboltd.com
              </li>
              <li>
                <strong className="text-gray-200">Phone:</strong> +447533616307
              </li>
              <li>
                <strong className="text-gray-200">Address:</strong> Suite 910, 9th Floor, 8/10 Broad Street, Western House, Lagos Island, Lagos
              </li>
            </ul>

            <div className="flex space-x-3 text-lg mt-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-[#142235] pt-4 mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jibo Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
