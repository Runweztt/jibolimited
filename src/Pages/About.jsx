
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; 

const About = () => {
  
  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200 font-inter">
      {/* HERO */}
      <section className="pt-28 pb-12 px-6 md:px-12 lg:px-24 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl mt-20 md:text-6xl font-extrabold text-white leading-tight mb-4">
            About Jibo Limited
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl">
            Empowering businesses and individuals with innovative financial solutions.
            We combine modern technology with real-world services to simplify finance
            and everyday transactions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* WHO WE ARE + IMAGE */}
      <section className="px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Founded on transparency, efficiency, and innovation, <strong>Jibo Limited</strong> provides
              digital finance services that empower users to manage assets, make payments,
              and access financial tools seamlessly.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our platform focuses on <strong>crypto finance</strong>,
              offering users a unique ecosystem where technology meets convenience.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-gray-400">
              <div className="bg-[#071224] p-4 rounded-lg border border-[#142235]">
                <div className="font-semibold text-white">500M+</div>
                <div className="text-gray-400">Transactions processed</div>
              </div>
              <div className="bg-[#071224] p-4 rounded-lg border border-[#142235]">
                <div className="font-semibold text-white">100+</div>
                <div className="text-gray-400">Trusted clients</div>
              </div>
              <div className="bg-[#071224] p-4 rounded-lg border border-[#142235]">
                <div className="font-semibold text-white">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#142235]">
              <img
                // use assets.crypto_img or a local file if available; fallback to placeholder
                src={assets?.jibo_office ?? "/jibo_office.jpg"}
                alt="Jibo office"
                className="w-full h-72 object-cover"
                onError={(e) => { e.target.src = "/jibo_office.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Our Mission",
              text: "To redefine financial and mobility experiences through secure, fast, and user-friendly technology."
            },
            {
              title: "Our Vision",
              text: "To become the leading digital ecosystem connecting finance and lifestyle  making innovation accessible to everyone."
            },
            {
              title: "Our Values",
              text: "Integrity, innovation, and inclusivity  technology should empower people and businesses to grow confidently."
            }
          ].map((card, i) => (
            <div key={i} className="bg-[#071224] border border-[#142235] rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">{card.title}</h3>
              <p className="text-gray-300">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Highlights */}
      <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-[#142235]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Leadership & Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Jite Majemite", role: "founder & Ceo" },
                { name: "Emmanuel Amarikwa", role: " Coo" },
              { name: "Salome Kenneth", role: "Research & Operations" },
              { name: "Eniola John", role: "HR & People Ops" },
             
            ].map((p, idx) => (
              <div key={idx} className="bg-[#0b0b25] border border-[#142235] rounded-2xl p-4 text-center">
                <div className="w-20 h-20 bg-[#071224] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                  {p.name[0]}
                </div>
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-sm text-gray-400">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-5xl mx-auto">
          <h4 className="text-xl font-bold text-white mb-4">Frequently asked questions</h4>
          <div className="space-y-3">
            <details className="bg-[#071224] border border-[#142235] rounded-lg p-4">
              <summary className="font-semibold text-white cursor-pointer">How do I start trading crypto?</summary>
              <p className="text-gray-300 mt-2">Create an account, verify, then use our Finance page to browse coins and hit the Trade button.</p>
            </details>

            <details className="bg-[#071224] border border-[#142235] rounded-lg p-4">
              <summary className="font-semibold text-white cursor-pointer">Is my data secure?</summary>
              <p className="text-gray-300 mt-2">Yes we prioritise security and use best practices for user data and authentication.</p>
            </details>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default About;
