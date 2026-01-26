# Teru Project - Setup & Startup Guide

## Prerequisites
-   **Node.js** installed on your computer.
-   **Expo Go** app installed on your phone.
-   Access to both the `mon-premier-backend` and `Front-end2` folders.

---

## 🚀 How to Start the App (Every Time)

This project contains both the **Frontend** (Expo/React Native) and the **Backend** (Node.js/Express).

### Prerequisites
1.  **Node.js** installed.
2.  **MongoDB** running locally (or configured in .env).
3.  **Expo Go** on your phone.

### Initial Setup (First Time Only)
1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Create your .env file
    cp .env.example .env
    # (On Windows CMD: copy .env.example .env)
    cd ..
    ```
2.  **Frontend Setup**:
    ```bash
    npm install
    ```

### Step 1: Start the Backend
1.  Open a terminal in the `backend` folder.
2.  Run:
    ```bash
    node app.js
    ```
    *Success: "Connecté à MongoDB" & "Serveur lancé sur http://0.0.0.0:3000"*

### Step 2: Start the Tunnel (Serveo)
*Required for your phone to see the local backend.*

1.  Open a terminal in the root folder.
2.  Run:
    ```bash
    ssh -R 80:127.0.0.1:3000 serveo.net
    ```
3.  **Copy the URL** (e.g., `https://algo...serveousercontent.com`).
4.  Update `api/client.ts` with this new URL.

### Step 3: Start the Frontend
1.  Open a terminal in the root folder.
2.  Run:
    ```bash
    npx expo start --tunnel
    ```
3.  Scan with Expo Go.

---

## Troubleshooting

### "Request failed with status code 502"
-   This means the Tunnel is running, but it can't find your Backend.
-   **Fix**: Check if Step 1 (Backend) is running. Check if Step 2 command was exactly `ssh -R 80:127.0.0.1:3000 serveo.net`.

### "Network Error" or Timeout
-   The phone cannot reach the tunnel.
-   **Fix**: Ensure `api/client.ts` has the *exact* URL generated in Step 2. Restart the Frontend if you changed the file.

### "Authentication Failed"
-   Make sure you are pointing to the correct database (Step 1 output).