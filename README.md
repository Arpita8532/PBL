# EcoLoop ♻️  
**Competitive Municipal Recycling Platform**

EcoLoop is a fully integrated platform designed to encourage responsible waste management through **streamlined pickup logistics and gamified recycling credits**. 

The system bridges the gap between waste generators (households, housing societies, organizations) and waste collectors (recycling collectors), enabling clear communication, tracked recycling, and community-driven environmental impact.

By making recycling **simple, engaging, and measurable**, EcoLoop promotes the core principles of **Reduce, Reuse, and Recycle (RRR)**.

---

## 🎯 Problem Statement

Waste mismanagement remains a pressing environmental issue. Despite good intentions, recyclable materials often end up in landfills due to:
- Difficulty in finding local, authorized recycling services
- Lack of localized incentives for responsible waste disposal
- Fragmented and disconnected waste collection networks

Although informal collectors (recycling collectors) are the backbone of local recycling, they lack digital tools to efficiently manage pickups and connect directly with households at scale.

---

## 💡 Our Solution

EcoLoop connects **waste generators and collectors** through a digital portal and introduces **Green Credits** to reward and gamify recycling.

Key benefits of the system:
- **Frictionless Pickups**: Societies can schedule waste pickups in just a few clicks.
- **Incentivized Action**: Earn Green Credits for every kilogram of waste recycled.
- **Community Competition**: Public leaderboards track and rank societies based on their recycling contributions.
- **Data-Driven Impact**: Municipal dashboards provide real-time metrics on waste diverted from landfills.

---

## ✨ Core Features

### 1. Society & Collector Portals
- **Society Dashboard**: Register your housing society, track lifetime pickups, and request new waste collections (Plastic, Metal, Paper, etc.).
- **Recycling Collector Panel**: A dedicated interface for collectors to view pending requests, confirm pickups, and record actual waste weights.

### 2. Green Credit System
Every confirmed pickup automatically calculates and awards credits based on the waste type and weight. 
Example scoring:
- **Plastic**: 8 credits / kg
- **Paper**: 5 credits / kg
- **Metal**: 15 credits / kg
- **E-Waste**: 20 credits / kg

### 3. Live Leaderboards
Societies accumulate credits and compete on a citywide leaderboard, unlocking municipal rewards, recognition, and fostering sustainable habits through friendly competition.

---

## 🔄 System Workflow

1. **Request Pickup**: Society requests a waste pickup via the dashboard.
2. **Assign Collector**: System assigns the request to the regional collection pool.
3. **Collect & Confirm**: Recycling Collector arrives, collects the waste, and inputs the actual weight on their portal.
4. **Reward**: Green Credits are calculated and instantly awarded to the society.
5. **Rank**: The society climbs the citywide leaderboard.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Node.js**
- **Express.js**

### Database
- **Firebase Firestore** (Real-time NoSQL database)

---

## 📂 Project Structure

```text
PBL/
│
├── recycai-frontend/       # React application (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Cards, Layouts)
│   │   ├── pages/          # Dashboards, Login, Request pages
│   │   └── assets/         # Images and icons
│   └── index.html
│
├── recycai-backend/        # Express API server
│   ├── server.js           # Core API logic, routes, scoring
│   ├── firebase.js         # Firebase Admin SDK initialization
│   └── serviceAccountKey.json # Credentials (Ignored in Git)
│
└── README.md
```

---

## 🚀 Future Improvements

- Implementation of a real-time collector tracking map (GPS).
- Extended municipal dashboards for city administration.
- Blockchain-based verification for Green Credits.
- Civic reward integrations for top-ranking societies.
- SMS/WhatsApp notifications for pickup statuses.

---

## 📄 License
This project is developed as part of a **Project Based Learning (PBL)** initiative.
