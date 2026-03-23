# Travelie Dashboard

A full-stack travel agency platform built with Spring Boot and React, featuring an elegant glassmorphism UI, real-time dashboards, and comprehensive admin tools for managing travel packages, exclusive deals, user bookings, and a centralized user management system.

## Features

**For Travelers:**
- 🌍 **Packages Explorer:** Browse a rich catalog of diverse travel destinations.
- 🏷️ **Exclusive Deals:** Access limited-time discounts on premium packages.
- 🎫 **Booking System:** Book spots with automatic availability tracking and price calculation.
- 📅 **My Bookings:** Track and manage personal itineraries (Pending/Confirmed/Cancelled).
- 💬 **Messaging:** Built-in messaging system to contact guides or admins.
- 🖼️ **Gallery:** View inspiring location images.

**For Administrators:**
- 📊 **Real-time Dashboard:** Track key metrics (Total Revenue, Active Packages, Users).
- 📦 **Package Management (CRUD):** Complete control to create, edit, or delete travel destinations, update capacities and adjust pricing.
- 💸 **Deals Management (CRUD):** Create promotional discounts linked to specific packages with active/expired statuses.
- 👥 **User Management:** Oversee all platform users, view their roles (Traveler, Guide, Admin), and deactivate accounts.

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Lucide React (Icons), Custom CSS (Dark Theme/Glassmorphism).
- **Backend:** Java 17+, Spring Boot 3, Spring Security 7, JWT Authentication, Spring Data JPA.
- **Database:** H2 In-Memory Database (for local development, easily swappable to PostgreSQL/MySQL).

## Prerequisites
- **Java 17 or higher**
- **Node.js (v18+) and npm**
- **Maven** (optional, wrapper included in Spring Boot)

## Getting Started

### 1. Run the Backend (Spring Boot)
The backend runs on `http://localhost:8081` and uses an H2 database that comes pre-seeded with test data.

1. Open a terminal and navigate to the `dashboard` folder:
   ```bash
   cd dashboard
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Wait until you see "Started DashboardApplication" in the logs)*

### 2. Run the Frontend (React / Vite)
The frontend runs on `http://localhost:5173`.

1. Open another terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (only needed once):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to: `http://localhost:5173`

## Default Test Accounts

The application is pre-seeded with several accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin3@travelie.com` | `password` | Full CRUD over packages, deals, users |
| **Guide** | `priya.guide@travelie.com` | `password` | Guide-specific views (Messages) |
| **Traveler** | `john@example.com` | `password` | Booking, viewing packages & deals |

*(Login with any of these accounts at `http://localhost:5173/login` to see role-based views.)*

## Database Information
Because this project uses the `H2` in-memory database by default for easy local execution:
- All data is volatile. Any packages, deals, or users you create via the Admin UI will only persist until the backend server is stopped/restarted.
- Upon every startup, the `DataSeeder.java` file will freshly populate the database with the default accounts, 8 global travel packages, and 3 promotional deals. 
- You can access the H2 console at `http://localhost:8081/h2-console` (JDBC URL: `jdbc:h2:mem:traveldb`, Username: `sa`, Password: `password`).
