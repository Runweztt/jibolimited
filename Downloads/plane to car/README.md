# P2C - Priority Passenger Clearance

P2C is a Nigerian airport concierge booking platform designed for speed, structure, trust, and stress-free airport arrivals.

## Folder Structure
- `backend/`: Flask API with Supabase integration.
- `frontend/`: React + Vite + Tailwind CSS application.

## Prerequisites
- Python 3.9+
- Node.js 18+
- Supabase account and project

## Setup Instructions

### 1. Database Setup
1. Create a new Supabase project.
2. Go to the SQL Editor in Supabase and execute the contents of `backend/database.sql`.
3. This will create the necessary tables (`profiles`, `airports`, `service_tiers`, `bookings`, `booking_status_logs`) and seed initial data.

### 2. Backend Setup
1. Navigate to the `backend/` folder.
2. Create a `.env` file based on `.env.example`:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SECRET_KEY=your_secret_key
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Run the backend: `python main.py`

### 3. Frontend Setup
1. Navigate to the `frontend/` folder.
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the frontend: `npm run dev`

## Core Features
- **Passenger**: Sign up, book airport clearance, track status.
- **Concierge**: View assignments, update service progress status.
- **Admin**: Manage bookings, verify concierge accounts, assign tasks.
