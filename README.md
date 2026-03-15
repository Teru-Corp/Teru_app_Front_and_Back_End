# Teru Project - Setup & Startup Guide

## 🚀 New Architecture
- **Web App Migration**: The project has officially migrated from a React Native Expo application to a standard **React + TypeScript Web Application (Vite)**.
- **Anonymous Emotional Mirror**: Check in with an intuitive 2D grid (Feeling vs Energy), now rewritten to run smoothly in standard web browsers.
- **Fully Ported Experiences**: The Weather Dashboard, Community Chat, Visual Garden, and History screens have all been faithfully restored using pure CSS and Web APIs.
- **Responsive Mobile Layout**: The `web-frontend` simulates a native mobile app container on desktop while naturally scaling to your iPhone screen, removing the need for Expo Go.

---

## 🛠️ How to Start the App (Complete Guide)

This project contains both the **Frontend** (`web-frontend/`) and the **Backend** (`backend/`). Follow these steps carefully to run the full stack locally.

### 📋 Prerequisites
1.  **Node.js** (v18+) installed.
2.  **MongoDB Community Server** installed and running locally. [Download here](https://www.mongodb.com/try/download/community).

---

### 📥 Initial Setup (First Time Only)

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # On Windows CMD: copy .env.example .env
    # On PowerShell/bash: cp .env.example .env
    ```
    *The `.env` file works automatically with local MongoDB (teru_db).*

2.  **Frontend Setup**:
    From the **root** folder, go into the new web folder:
    ```bash
    cd web-frontend
    npm install
    ```

---

### 🚦 Daily Startup Flow (2 Steps)

#### Step 1: Start the Backend
1.  Open a terminal in the `backend` folder and run:
    ```bash
    node app.js
    ```
    *Wait for: "Connecté à MongoDB" & "Serveur lancé sur http://0.0.0.0:3000"*

#### Step 2: Start the Web Frontend
1.  In a **new terminal**, navigate to the `web-frontend` folder:
    ```bash
    cd web-frontend
    npm run dev -- --host
    ```
2.  **Test on PC**: Open the "Local" link provided in your terminal (usually `http://localhost:5173/`).
3.  **Test on Mobile (iPhone)**: Open Safari and type in the "Network" IP address provided in your terminal (e.g., `http://10.1.224.89:5173/`).
    *Tip: Tap "Share" and "Add to Home Screen" on your iPhone for a native app experience!*

---

## 🆘 Troubleshooting

### "Network Error" on Phone (API)
- **Cause**: The computer's IP address might have changed, or the Web App was blocked by CORS/Firewall.
- **Fix**: 
  1. Ensure you started the API tunnel (Step 2) and updated `client.ts` with the new Serveo link.
  2. Ensure the backend has the `cors` middleware installed and correctly configured in `app.js` (this is now done by default!).

### The web app won't load on my phone
- **Cause**: Your computer's Firewall is blocking port 5173 or port 5174 over the local Wi-Fi.
- **Fix**: 
  1. Ensure your PC's Wi-Fi network profile is set to **Private** (Settings > Network & Internet > Wi-Fi > network properties).
  2. Temporarily disable Windows Firewall to test if it's blocking the connection, then add rules to allow Node.js.
  3. Ensure your phone is not using cellular data and is connected to the same Wi-Fi.