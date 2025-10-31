// src/Pages/Logistics/Logistics.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { assets } from "../../assets/assets";
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCarSide,
  FaUsers,
  FaSnowflake,
} from "react-icons/fa";

const CARS = [
  { id: 1, name: "Toyota Prado", price: 150000, passengers: 5, transmission: "Auto", airCondition: true, doors: 4, rating: 4.8, reviews: 210, image: assets.pradojeep },
  { id: 2, name: "landcruiser", price: 350000, passengers: 5, transmission: "Auto", airCondition: true, doors: 4, rating: 4.9, reviews: 320, image: assets.landcruiser },
  { id: 3, name: "Lexus RX 350", price: 180000, passengers: 5, transmission: "Auto", airCondition: true, doors: 4, rating: 4.7, reviews: 185, image: assets.lexus },
  { id: 4, name: "Range Rover Vogue", price: 400000, passengers: 5, transmission: "Auto", airCondition: true, doors: 4, rating: 4.9, reviews: 450, image: assets.Range },
];

const Logistics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(1);
  const [car, setCar] = useState(CARS[0]);
  const [total, setTotal] = useState(car.price);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setTotal(car.price * days);
  }, [car, days]);

  const handleBook = (selectedCar) => {
    // auth guard for action
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const bookedCar = selectedCar || car;
    if (!pickup || !destination || !name) {
      setShowAlert(true);
      return;
    }

    const msg = ` *Ride Booking Details*
Name: ${name}
Pickup: ${pickup}
Destination: ${destination}
Car: ${bookedCar.name}
Days: ${days}
Price per Day: ₦${bookedCar.price.toLocaleString()}
Total: ₦${(bookedCar.price * days).toLocaleString()}

✅ Please confirm your booking with Jibo Logistics.`;

    const whatsappUrl = `https://wa.me/2349069937105?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#030318] text-white font-sans">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-car.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl font-extrabold text-blue-400 mb-4">Premium Car Rentals & Airport Pickups</h1>
          <p className="text-gray-300 mb-6 text-lg">Book your ride across Lagos in minutes — luxury, comfort, and reliability guaranteed.</p>
          <a href="#booking" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white shadow-md">Book a Ride</a>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 px-4 md:px-10">
        <div className="max-w-5xl mx-auto bg-[#0b0b25] border border-blue-900 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-10">Ride Booking Details</h2>

          {showAlert && (
            <div className="bg-red-800/50 text-red-200 border border-red-500 px-4 py-3 rounded-lg mb-6 text-center">
              ⚠️ Please fill in your name, pickup, and destination before booking.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" className="w-full bg-transparent border border-blue-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Pickup Location</label>
              <input value={pickup} onChange={(e) => setPickup(e.target.value)} type="text" placeholder="e.g. Ikeja City Mall" className="w-full bg-transparent border border-blue-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Destination</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} type="text" placeholder="e.g. Murtala Muhammed Airport" className="w-full bg-transparent border border-blue-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Number of Days</label>
              <input value={days} onChange={(e) => setDays(e.target.value)} type="number" min="1" className="w-full bg-transparent border border-blue-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Select Car</label>
              <select value={car.id} onChange={(e) => setCar(CARS.find((c) => c.id === parseInt(e.target.value)))} className="w-full bg-transparent border border-blue-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600">
                {CARS.map((c) => (<option key={c.id} value={c.id} className="bg-[#0b0b25] text-white">{c.name} - ₦{c.price.toLocaleString()}/day</option>))}
              </select>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#11113a] border border-blue-900 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Booking Summary</h3>
              <p className="text-gray-300 flex items-center gap-2"><FaMapMarkerAlt /> <strong>Pickup:</strong> {pickup || "—"}</p>
              <p className="text-gray-300 flex items-center gap-2 mt-2"><FaMapMarkerAlt /> <strong>Destination:</strong> {destination || "—"}</p>
              <p className="text-gray-300 flex items-center gap-2 mt-2"><FaCarSide /> <strong>Car:</strong> {car.name}</p>
              <p className="text-gray-300 flex items-center gap-2 mt-2"><FaCalendarAlt /> <strong>Days:</strong> {days}</p>
              <p className="text-lg text-blue-400 font-bold mt-4">Total: ₦{total.toLocaleString()}</p>
            </div>

            <div className="text-center">
              <button onClick={() => handleBook()} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-3 w-full md:w-auto mx-auto">
                <FaWhatsapp className="text-xl" /> Confirm & Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Car Selection */}
      <section className="max-w-7xl mx-auto mt-20 px-4 pb-20">
        <div className="text-center mb-8">
          <span className="bg-blue-900/30 text-blue-400 px-4 py-1 rounded-full text-sm font-semibold">Popular Rental Deals</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 text-white">Most Popular Car Rental Deals</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CARS.map((carItem) => (
            <div key={carItem.id} className="bg-[#0b0b25] border border-blue-800 rounded-2xl overflow-hidden shadow-lg transition transform hover:scale-[1.02]">
              <img src={carItem.image} alt={carItem.name} className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-blue-400">{carItem.name}</h3>
                <p className="text-sm text-gray-400 mt-1">⭐ {carItem.rating} ({carItem.reviews} reviews)</p>

                <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mt-3">
                  <span className="flex items-center gap-1"><FaUsers /> {carItem.passengers}</span>
                  <span className="flex items-center gap-1"><FaCarSide /> {carItem.transmission}</span>
                  {carItem.airCondition && <span className="flex items-center gap-1"><FaSnowflake /> A/C</span>}
                  <span>{carItem.doors} Doors</span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-gray-300"><span className="text-blue-400 font-bold">₦{carItem.price.toLocaleString()}</span>/day</p>
                  <button onClick={() => handleBook(carItem)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><FaWhatsapp /> Rent Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="border border-blue-800 text-blue-400 hover:bg-blue-800/30 px-6 py-2 rounded-lg text-sm font-semibold">Show all vehicles →</button>
        </div>
      </section>
    </div>
  );
};

export default Logistics;
