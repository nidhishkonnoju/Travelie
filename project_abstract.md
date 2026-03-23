# Project Abstract: Travelie - Luxury Travel Dashboard & Booking System

## Overview
This project is a comprehensive luxury Travel Dashboard and Booking System designed to facilitate travel discovery, package management, and booking workflows. It features a modern, responsive **and highly visual** web interface for users, backed by a robust backend to handle data persistence, security, and business logic.

## Architecture
The application follows a decoupled, full-stack architecture:
*   **Frontend:** Built with React and Vite, utilizing React Router for navigation and Axios for API communication. It provides a dynamic user experience with interactive components, **including smooth crossfade image galleries**, styled entirely with custom Vanilla CSS for a premium aesthetic.
*   **Backend:** A Spring Boot application (Java 17) following the layered MVC pattern. It uses Spring Data JPA for database interactions and Spring Security with JWT for secure, stateless user authentication. The backend is structured with:
    *   **8 Controllers** (e.g., Auth, Booking, Deal, TravelPackage, User)
    *   **8 Services** handling business logic
    *   **7 Repositories** for data access
    *   **10 Models/Entities** defining the data schema
*   **Database:** Data is persisted in the cloud using **Supabase PostgreSQL, accessed via an IPv4-compatible Session Pooler for reliable connectivity.** *(Previously H2/MySQL)*

## Key Features
*   **User Authentication:** Secure Login and Registration system with role-based access control (Admin vs. Customer).
*   **Travel Explorer:** A visually rich discovery interface for users to search and explore various travel packages and deals, **complete with interactive image carousels for location previews.**
*   **Booking Management:** End-to-end booking flow where users can select packages, view detailed daily itineraries, and manage their trips.
*   **Dashboard & Profile:** Personalized user views to track bookings, manage account settings, and view system statistics.
*   **Messaging System:** Built-in communication layer for users to interact directly with travel agents or support.
*   **Admin Panel:** Comprehensive backend services and frontend interfaces for administrators to manage `TravelPackage`, `Deal`, and `ItineraryDay` entities, as well as monitor users.

## Technical Stack
*   **Languages:** Java (Backend), JavaScript/JSX (Frontend), **CSS3**.
*   **Frameworks/Libraries:** Spring Boot, React, **Lucide React (Icons)**.
*   **Database:** **Supabase (PostgreSQL)**.
*   **Tools:** Maven, Vite, Lombok, JWT.
