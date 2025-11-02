### 🚗 JIBO Limited — Smart Vehicle rental & crypto finance Platform

JIBO Limited is a modern vehicle rental and logistics platform that allows users to rent vehicles, calculate transport costs, access finance services, and chat with an intelligent AI assistant. Built with a mobile-first UI, Firebase authentication, and Gemini AI chatbot.

---

##  Project Structure


---

##  Features

| Feature | Description |
|--------|------------|
|  Firebase Authentication | User Sign Up & Login with Google/email-password |
|  Gemini AI Chatbot | Smart assistant to help customers ask questions & navigate services |
|  Logistics Price Engine | User enters pickup & destination → calculates price |
|  Car Rental Booking | Car selection → details sent to WhatsApp |
|  Mobile-first UI | Animated landing page, responsive layout |
|  Protected Routes | Only logged-in users can access private pages |
| Figma Inspired UI | Styled based on modern rental landing-pages |
|  Real-time API | Gecko API integration for crypto updates |

---

##  Tech Stack

| Category | Tech |
|--------|------|
| Frontend | React, Vite, Tailwind / CSS |
| Authentication | Firebase Auth |
| AI | Google Gemini API |
| Hosting / DB | Firebase |
| Icons | react-icons |
| Animations / UI | Tailwind + custom CSS |
| Sliders | Swiper.js |
| Messaging | WhatsApp deep-link booking |

---

##  Core Functionality

###  Authentication  
- Config in `Firebase.js`  
- `AuthContext.jsx` manages auth state  
- Protected routes via `ProtectedRoute.jsx`  

###  AI Chatbot (Gemini API)  
- File: `Pages/Jibochatbot.jsx`  
- Customer assistant for questions & navigation  

### booking price Price Calculator  
- File: `Pages/Logistics/Logistics.jsx`  
- Pickup → price calculation  
- Booking details → WhatsApp send  

###  WhatsApp Booking  
- Rental car info sent via deep-link WhatsApp message  

###  Route Protection  
- Blocks unauthorized access to user-only pages  

---

##  Environment Variables

Create `.env` in root:

frontend/
 ├── public/
 ├── src/
 │   ├── assets/
 │   ├── chat/
 │   ├── Components/
 │   │   ├── Navbar.jsx
 │   │   ├── Footer.jsx
 │   │   └── ProtectedRoute.jsx
 │   ├── Context/
 │   │   ├── AuthContext.jsx
 │   │   └── Coincontext.jsx
 │   ├── Pages/
 │   │   ├── Auth/
 │   │   │   ├── Login.jsx
 │   │   │   └── Register.jsx
 │   │   ├── Finance/
 │   │   │   └── Finance.jsx
 │   │   ├── Logistics/
 │   │   │   └── Logistics.jsx
 │   │   ├── About.jsx
 │   │   ├── Contact.jsx
 │   │   ├── Jibochatbot.jsx
 │   │   └── Home.jsx
 │   ├── App.jsx
 │   ├── App.css
 │   ├── Firebase.js
 │   ├── Companyinfo.js
 │   ├── index.css
 │   └── main.jsx


##  Roadmap / Future Enhancements

###  Logistics & Ride Booking
| Status | Feature |
|--------|--------|
|  | Vehicle database & API integration |
|  | Booking admin dashboard |
|  | Payment gateway (Flutterwave / Paystack) |
|  | Real-time vehicle availability |
|  | Push notifications |
|  | Multi-city fleet expansion system |
|  | GPS tracking + live trip updates |
|  | Driver onboarding + KYC |
|  | Car inspection + maintenance logs |
|  | Fleet management dashboard |
|  | AI-powered rental assistant (voice support) |
|  | Mobile App (React-Native / Expo) |
|  | Public beta launch |

---

###  Crypto Exchange Roadmap

| Status | Feature |
|--------|--------|
|  | Built-in crypto exchange UI |
|  | Crypto ↔ Fiat conversion (NGN / USD / GBP / EUR) |
|  | Wallet address generation & user wallets |
|  | On-platform payments using crypto |
|  | SEC-compliant KYC/AML verification |
|  | Live exchange rates (real-time data feeds) |
|  | Direct P2P trading & escrow service |
|  | Instant settlement + receipts |
|  | Business onboarding for corporate exchange |


> **Goal**: Users can buy/sell crypto, swap tokens, and convert to fiat — WITH payout to bank or wallet directly from platform.

---

##  Notes for Developers

-  Mobile-first UI & component architecture
-  Scalable folder structure & reusable modules
-  Firebase Auth + protected routing
-  Crypto & ride-booking in one ecosystem
-  Figma-inspired car-rental interface
-  Optimized animations & performance
-  React Context powering global app state
-  Future-ready for financial compliance modules (KYC / AML)

---

##  Developer Note

This project is actively evolving into:

-  A smart transport & rental system  
-  A fintech layer for global payments  
-  A secure crypto on-ramp/off-ramp platform  

> Contributions, audits, PRs, feature ideas & security suggestions are welcome.

Building an ecosystem that connects **mobility + payments + crypto** on one platform. 🚀
