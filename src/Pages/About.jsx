

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-gray-300 font-inter">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-24 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-500 mb-6 animate-fadeInUp">
          About Jibo Limited
        </h1>
        <p className="text-gray-400 max-w-3xl text-lg md:text-xl">
          Empowering businesses and individuals with innovative financial and mobility solutions.
          We combine modern technology with real-world services to simplify finance, logistics, and everyday transactions.
        </p>
      </section>

      {/* Who We Are Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Who We Are</h2>
          <p className="text-gray-400 leading-relaxed">
            Founded on transparency, efficiency, and innovation, <strong>Jibo Limited</strong> provides digital finance and logistics
            services that empower users to manage assets, make payments, and access transportation seamlessly.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Our platform bridges the gap between <strong>crypto finance</strong> and <strong>real-world mobility</strong>,
            offering users a unique ecosystem where technology meets convenience.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="/about_office.jpg"
            alt="Jibo Limited office"
            className="rounded-2xl shadow-lg w-full object-cover animate-floaty"
          />
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16 grid md:grid-cols-3 gap-10 text-center">
        {[
          {
            title: "Our Mission",
            text: "To redefine financial and mobility experiences through secure, fast, and user-friendly technology."
          },
          {
            title: "Our Vision",
            text: "To become the leading digital ecosystem connecting finance, logistics, and lifestyle — making innovation accessible to everyone."
          },
          {
            title: "Our Values",
            text: "Integrity, innovation, and inclusivity — technology should empower people and businesses to grow confidently."
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all animate-fadeInUp"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-3">{item.title}</h3>
            <p className="text-gray-400">{item.text}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to experience the future of finance and mobility?
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all font-medium">
          Get Started with Jibo
        </button>
      </section>

    
    </div>
  );
};

export default About;
