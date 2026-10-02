# ScrollToll

> **Earn your scroll. Control your attention.**

ScrollToll is a digital wellbeing platform that makes short-form content consumption more intentional by introducing a token-based system between users and scrolling.

## Problem

Short-form content platforms are designed around continuous scrolling. Users often intend to watch a few videos but end up spending much more time than planned.

Traditional screen-time limits focus mainly on duration. ScrollToll focuses on **intentionality before scrolling**.

## Solution

ScrollToll introduces a simple **Scroll Token** system.

Users earn tokens by completing intentional activities:

- **Brain Gym** – Logic, patterns, math, memory and attention challenges
- **Focus Forge** – Short attention-focused games
- **Mindful Minute** – A 60-second intentional pause and reflection

Users spend their earned tokens to unlock a limited scrolling session.

**1 Scroll Token = 2 minutes of scrolling**

This creates a deliberate decision before entering a scrolling session.

## Key Features

- Token-based scrolling system
- Focus Forge with multiple attention games
- Mindful Minute reflections
- Controlled short-form content feed
- Scroll session tracking
- Dashboard and behavioral analytics

## Tech Stack

| Category               | Technologies / Tools                                      |
| ---------------------- | --------------------------------------------------------- | --- |
| **Frontend**           | React, Vite, JavaScript, Tailwind CSS, React Router       |
| **Backend**            | Node.js, Express.js, REST API, JWT Authentication, bcrypt |
| **Database**           | MySQL                                                     |
| **External API**       | YouTube Data API v3                                       |
| **Tools & Deployment** | Git, GitHub, GitHub Actions, Render, Aiven                |     |

## Project Structure

scrolltoll/
├── .github/
│ └── workflows/
├── database/
│ ├── schema.sql
│ └── seed.sql
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── services/
│ │ └── server.js
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── layouts/
│ │ ├── pages/
│ │ └── services/
│ └── package.json
├── .gitignore
└── README.md

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MySQL
- Git
- YouTube Data API v3 key

### 1. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

### 2. Set Up the Database

Create the database:

```sql
CREATE DATABASE scrolltoll;
```

Import the schema and seed data:

```bash
mysql -u root -p scrolltoll < database/schema.sql
mysql -u root -p scrolltoll < database/seed.sql
```

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scrolltoll
DB_PORT=3306

JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key

FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 4. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL provided by Vite.

## Live Demo

[**Visit ScrollToll →**](https://scrolltoll-frontend.onrender.com)

## Team

| Name                        | USN          |
| --------------------------- | ------------ |
| `Akanksha       `           | `4VP24CS006` |
| `G Madhura Shastry`         | `4VP24CS035` |
| `Muralikrishna D`           | `4VP24CS060` |
| `Niveditha Marcopolo Totar` | `4VP24CS065` |

## Future Scope

- Adaptive friction based on scrolling behavior
- Browser extension integration
- Integration with actual short-form platforms
- Personalized behavioral insights
- Additional focus activities
