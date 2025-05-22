# SmartPark Stock Inventory Management System (SIMS)

A web application for managing spare parts inventory for SmartPark company.

## Features

- User authentication (login/register)
- Spare parts management
- Stock in/out tracking
- Reporting (stock status and daily stock out)
- Dark mode UI with overlay forms

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup Instructions

### Database Setup

1. Create a MySQL database named `sims`
2. Import the database schema from `backend/config/db.sql`

```sql
CREATE DATABASE IF NOT EXISTS sims;
USE sims;
-- Run the SQL commands from backend/config/db.sql
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm run install-deps
```

3. Configure environment variables:
   - Create a `.env` file in the backend directory based on the provided `.env.example`
   - Update the database connection details

### Running the Application

To run both frontend and backend concurrently:

```bash
npm run dev
```

To run frontend only:

```bash
npm run frontend
```

To run backend only:

```bash
npm run backend
```

## Application Structure

### Frontend

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/context` - Context providers
- `/src/services` - API service functions

### Backend

- `/config` - Configuration files
- `/controllers` - Request handlers
- `/models` - Database models
- `/routes` - API routes
- `/middleware` - Custom middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Spare Parts
- `GET /api/spare-parts` - Get all spare parts
- `GET /api/spare-parts/:id` - Get a spare part by ID
- `POST /api/spare-parts` - Create a new spare part
- `PUT /api/spare-parts/:id` - Update a spare part
- `DELETE /api/spare-parts/:id` - Delete a spare part

### Stock In
- `GET /api/stock-in` - Get all stock in records
- `GET /api/stock-in/:id` - Get a stock in record by ID
- `POST /api/stock-in` - Create a new stock in record

### Stock Out
- `GET /api/stock-out` - Get all stock out records
- `GET /api/stock-out/:id` - Get a stock out record by ID
- `GET /api/stock-out/date/:date` - Get stock out records by date
- `POST /api/stock-out` - Create a new stock out record
- `PUT /api/stock-out/:id` - Update a stock out record
- `DELETE /api/stock-out/:id` - Delete a stock out record

### Reports
- `GET /api/reports/stock-status` - Get stock status report
- `GET /api/reports/daily-stock-out/:date` - Get daily stock out report
