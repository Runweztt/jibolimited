
const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-gray-300 font-inter">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-24 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-500 mb-6 animate-fadeInUp">
          Contact Us
        </h1>
        <p className="text-gray-400 max-w-3xl text-lg md:text-xl">
          We’d love to hear from you! Whether you’re interested in financial solutions, car rental services, or partnerships — our team is here to help.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-gray-400">Our support team is available Monday to Friday, 9am–6pm. We’ll respond to your inquiry promptly.</p>
          </div>

          <div className="space-y-4 text-gray-400">
            <div>
              <h3 className="text-lg font-medium text-blue-400">Head Office (UK)</h3>
              <p>Jibo Limited, 22 Fleet Street, London, EC4Y 1AA, United Kingdom</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400">Nigeria Office</h3>
              <p>12A Adeola Odeku Street, Victoria Island, Lagos, Nigeria</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400">Email</h3>
              <p>support@jiboltd.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400">Phone</h3>
              <p>+44 20 7123 4567 | +234 803 123 4567</p>
            </div>
          </div>

          <div className="flex space-x-5 text-gray-400 text-2xl mt-4">
            <a href="#" className="hover:text-blue-400 transition-all"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-blue-400 transition-all"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-blue-400 transition-all"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Form */}
        <form className="bg-gray-800 shadow-lg rounded-2xl p-8 space-y-6 animate-fadeInUp">
          <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200" />
          <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200" />
          <textarea rows="5" placeholder="Your Message" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"></textarea>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full w-full md:w-auto transition-all font-medium">Send Message</button>
        </form>
      </section>

      {/* Maps Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16 grid md:grid-cols-2 gap-8">
        <iframe
          title="Jibo Limited UK Office"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19800.784703957086!2d-0.1082034!3d51.5113358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b95a3d1f67%3A0x34b7b197648f5c25!2sFleet%20St%2C%20London!5e0!3m2!1sen!2suk!4v1692022100821!5m2!1sen!2suk"
          className="w-full h-64 md:h-80 rounded-2xl shadow-md border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>

        <iframe
          title="Jibo Limited Nigeria Office"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.341620962518!2d3.426218074687793!3d6.605635822262256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53f740c7fd9%3A0x2c0e3c5b5e60c12d!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1692023100456!5m2!1sen!2sng"
          className="w-full h-64 md:h-80 rounded-2xl shadow-md border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    
    </div>
  );
};

export default Contact;
