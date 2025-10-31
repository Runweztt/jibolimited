import React, { useState } from "react";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    // placeholder behaviour (replace with email API or emailjs)
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSuccess("Thanks — your message was sent. We'll get back to you soon.");
    } catch (err) {
      setError("Something went wrong. Try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200 font-inter">
      {/* HERO */}
      <section className="pt-28 pb-12 px-6 md:px-12 lg:px-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl mt-20 md:text-6xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            We’d love to hear from you. Whether you're interested in finance, rentals or partnerships — our team is ready.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT: INFO */}
          <div className="space-y-6">
            <div className="bg-[#071224] border border-[#142235] rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Get in touch</h3>
              <p className="text-gray-300">Support: Monday — Friday, 9am–6pm. We'll respond as quickly as possible.</p>
            </div>

            <div className="grid gap-4">
              <div className="bg-[#0b0b25] border border-[#142235] rounded-2xl p-5">
                <h4 className="text-blue-400 font-semibold">Head Office (UK)</h4>
                <p className="text-gray-300 mt-1">Jibo Limited — 22 Fleet Street, London, EC4Y 1AA</p>
              </div>

              <div className="bg-[#0b0b25] border border-[#142235] rounded-2xl p-5">
                <h4 className="text-blue-400 font-semibold">Nigeria Office</h4>
                <p className="text-gray-300 mt-1">12A Adeola Odeku Street, Victoria Island, Lagos</p>
              </div>

              <div className="bg-[#0b0b25] border border-[#142235] rounded-2xl p-5">
                <h4 className="text-blue-400 font-semibold">Email & Phone</h4>
                <p className="text-gray-300 mt-1">support@jiboltd.com<br/>+44 20 7123 4567 | +234 803 123 4567</p>
              </div>

              <div className="flex gap-3">
                <a className="bg-[#071224] border border-[#142235] rounded-full px-4 py-2 text-gray-300 hover:text-blue-400">Facebook</a>
                <a className="bg-[#071224] border border-[#142235] rounded-full px-4 py-2 text-gray-300 hover:text-blue-400">Twitter</a>
                <a className="bg-[#071224] border border-[#142235] rounded-full px-4 py-2 text-gray-300 hover:text-blue-400">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-[#071224] border border-[#142235] rounded-2xl p-6 space-y-4"
            >
              {success && <div className="text-green-400 text-sm">{success}</div>}
              {error && <div className="text-red-400 text-sm">{error}</div>}

              <div>
                <label className="text-sm text-gray-300">Full name</label>
                <input className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0b0b25] border border-[#142235] text-gray-200 focus:outline-none" placeholder="Your full name" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input type="email" className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0b0b25] border border-[#142235] text-gray-200 focus:outline-none" placeholder="you@company.com" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Message</label>
                <textarea rows="5" className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0b0b25] border border-[#142235] text-gray-200 focus:outline-none" placeholder="How can we help?" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <div className="text-sm text-gray-400">Or email us at <span className="text-blue-400">support@jiboltd.com</span></div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* MAPS */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <iframe
            title="Jibo Limited UK Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19800.784703957086!2d-0.1082034!3d51.5113358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b95a3d1f67%3A0x34b7b197648f5c25!2sFleet%20St%2C%20London!5e0!3m2!1sen!2suk!4v1692022100821!5m2!1sen!2suk"
            className="w-full h-64 rounded-2xl border-0"
            allowFullScreen
            loading="lazy"
          />
          <iframe
            title="Jibo Limited Nigeria Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.341620962518!2d3.426218074687793!3d6.605635822262256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53f740c7fd9%3A0x2c0e3c5b5e60c12d!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1692023100456!5m2!1sen!2sng"
            className="w-full h-64 rounded-2xl border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* Footer-ish CTA */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto bg-[#0b0b25] border border-[#142235] rounded-2xl p-6 text-center">
          <h5 className="text-lg font-bold text-white mb-2">Need a tailored solution?</h5>
          <p className="text-gray-300 mb-4">Contact our enterprise team for/partnership enquiries.</p>
          <a href="mailto:support@jiboltd.com" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-semibold">Contact Sales</a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
