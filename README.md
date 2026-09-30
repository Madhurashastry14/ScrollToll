# ScrollToll

> **Earn your scroll. Control your attention.**

ScrollToll is a digital wellbeing platform designed to make short-form content consumption more intentional.

Instead of completely blocking entertainment, ScrollToll introduces a controlled layer of friction between the user's impulse to scroll and continued access to short-form content.

Users can complete productive activities such as cognitive challenges or focused work sessions to unlock limited access to a controlled short-video feed.

---

## Problem

Short-form platforms are designed around continuous scrolling. Users may open a feed intending to watch a few videos but continue scrolling much longer than planned.

Existing screen-time solutions primarily focus on:

- Measuring screen time
- Sending reminders
- Blocking applications
- Setting usage limits

These approaches can be easy to ignore or disable.

ScrollToll explores a different approach: **make continued scrolling more intentional rather than simply blocking it.**

---

## Solution

ScrollToll introduces a **Productivity Gate** between the user and the short-form feed.

A simplified flow is:

```text
Want to scroll
      ↓
Intentionality / Productivity Gate
      ↓
Complete a productive activity
      ↓
Earn Scroll Token
      ↓
Unlock controlled short-video feed
      ↓
Limited scrolling session
      ↓
Session expires
      ↓
Feed locks
```

The system can gradually introduce additional friction when repeated scrolling sessions become excessive.

---

## Core Features

### 1. Productivity Gate

A gateway between the user and the short-form feed.

Users can choose different activities to earn access.

### 2. Brain Gym

Short cognitive challenges such as:

- Mental arithmetic
- Vocabulary
- Logical questions
- Trivia

Completing a valid session can earn a Scroll Token.

### 3. Focus Forge

A focused work session using a timer.

Example:

```text
Start Focus Session
        ↓
Focus
        ↓
Complete Session
        ↓
Earn Scroll Token
```

### 4. Mindful Minute

A short reflection activity designed to encourage users to pause before continuing to scroll.

### 5. Scroll Tokens

Virtual tokens earned through productive activities.

Tokens provide controlled access to the short-video feed.

### 6. Controlled Short-Video Feed

ScrollToll uses its own controlled short-video feed rather than directly controlling Instagram or YouTube.

This allows the application to control:

- Session duration
- Scroll events
- Video playback
- Session expiry
- Feed locking
- Usage analytics

### 7. Adaptive Friction

The system can adjust the amount of friction based on recent usage patterns.

For example:

```text
Normal usage
     ↓
Small intentionality check
     ↓
Repeated extended usage
     ↓
Increased friction
```

The goal is not to punish users but to interrupt automatic scrolling behavior.

### 8. Behavioral Analytics

The dashboard can provide information such as:

- Total focus time
- Total scrolling time
- Number of unlocks
- Intentional sessions
- Habitual sessions
- Focus-to-scroll ratio
- Scroll patterns
- Productivity activity

These are presented as usage patterns rather than medical or psychological diagnoses.

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

## Backend

- Node.js
- Express.js
- JWT
- bcrypt

## Database

- MySQL

## Development

- Git
- GitHub
- Postman / Thunder Client

---

# Architecture

```text
                    ┌────────────────────┐
                    │      React         │
                    │     Frontend       │
                    └─────────┬──────────┘
                              │
                              │ REST API
                              ↓
                    ┌────────────────────┐
                    │     Express.js     │
                    │      Backend       │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ↓                ↓                ↓
       Authentication    Business Logic    Analytics
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                    ┌────────────────────┐
                    │       MySQL        │
                    │      Database      │
                    └────────────────────┘
```

---

# Project Structure

```text
scrolltoll/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

# Local Development

## Prerequisites

Install the following:

- Node.js
- npm
- MySQL
- Git

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd scrolltoll
```

---

## 2. Setup the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run using the Vite development server.

---

## 3. Setup the backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 4. Setup MySQL

Create the database:

```sql
CREATE DATABASE scrolltoll;
```

Then execute the schema:

```text
database/schema.sql
```

---

## 5. Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scrolltoll

JWT_SECRET=your_development_secret
```

**Never commit `.env` files to GitHub.**

---

# API

The backend exposes REST API endpoints for:

```text
/api/auth
/api/focus
/api/brain-gym
/api/scroll
/api/unlock
/api/reflections
/api/analytics
```

The API will be expanded as development continues.

# Security Principles

ScrollToll follows several basic security principles:

- Passwords are hashed using bcrypt.
- Authentication uses signed JWTs.
- Database credentials are stored in environment variables.
- `.env` files are excluded from Git.
- User-specific resources are protected by authentication.
- Important productivity and unlock decisions are validated on the server.
- The client is not treated as the source of truth for token balances or unlock eligibility.

# Project Goal

ScrollToll aims to explore a different approach to digital wellbeing:

> **Entertainment doesn't have to be eliminated. The goal is to make consumption intentional.**

---

## Status

**Current status:** Initial project foundation completed.

The project is currently under active development.
