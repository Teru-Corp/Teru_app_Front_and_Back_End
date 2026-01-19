# Teru Project - Setup & Startup Guide

## Prerequisites
-   **Node.js** installed on your computer.
-   **Expo Go** app installed on your phone.
-   Access to both the `mon-premier-backend` and `Front-end2` folders.

---

## 🚀 How to Start the App (Every Time)

You need to run processes in **3 separate terminals**.

### Step 1: Start the Backend
1.  Open a terminal in the `mon-premier-backend` folder.
2.  Run the command:
    ```bash
    node app.js
    ```
    *You should see: "Connecté à MongoDB" and "Serveur lancé sur http://0.0.0.0:3000"*

### Step 2: Start the Tunnel (Serveo)
*This allows your phone to reach your computer's local backend.*

1.  Open a terminal in the `Front-end2` folder (or anywhere else).
2.  Run this exact command:
    ```bash
    ssh -R 80:127.0.0.1:3000 serveo.net
    ```
3.  If asked "Are you sure you want to continue connecting?", type `yes`.
4.  **Copy the URL** it gives you. It will look like: 
    `https://abc123xymz-90-7-241-117.serveousercontent.com`

    > **⚠️ Important:** Do NOT close this terminal!

### Step 3: Configure Frontend Connection
1.  Open the file `api/client.ts` in the `Front-end2` folder.
2.  Paste the URL from Step 2 into the `API_URL` variable:
    ```typescript
    const API_URL = 'https://YOUR-NEW-URL.serveousercontent.com';
    ```
    *(Make sure to keep the single quotes)*

### Step 4: Start the Frontend
1.  Open a terminal in the `Front-end2` folder.
2.  Run the command:
    ```bash
    npx expo start --tunnel
    ```
    *(Using `--tunnel` is safer for connectivity).*
3.  Scan the QR code with **Expo Go** on your iPhone/Android.

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