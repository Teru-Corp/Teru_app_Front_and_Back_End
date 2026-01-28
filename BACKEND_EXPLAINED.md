# Technical Architecture Overview: Teru Backend

## 1. Project Overview
The "Teru" application utilizes a decoupled client-server architecture. The backend is built using a standard **Node.js** and **Express.js** environment, serving as a RESTful API that handles business logic, authentication, and data persistence.

## 2. Core Technologies
*   **Runtime Environment**: **Node.js** - selected for its non-blocking I/O model, efficient for handling concurrent API requests.
*   **Web Framework**: **Express.js** - acts as the middleware layer to route HTTP requests (GET, POST) to appropriate controllers.
*   **Database**: **MongoDB** - a NoSQL database chosen for its flexibility in storing JSON-like documents (Moods, Users).
*   **ODM**: **Mongoose** - provides schema validation (e.g., ensuring a mood entry contains `emotion`, `energy`, etc.) and simplifies database interactions.
*   **Security**: **BCrypt** for password hashing and **JWT (JSON Web Tokens)** for stateless, secure user authentication.

## 3. Connectivity & Network Architecture
A key technical challenge during development was attempting to connect a mobile frontend (running on a physical iOS device via Expo Go) to a local development server (`localhost:3000`).

**The Solution: SSH Tunneling (Reverse Proxy)**
To resolve network isolation issues, the project utilizes **Serveo**, an SSH-based forwarding service.
*   **Mechanism**: An SSH tunnel is established from the local machine to a public execution server.
*   **Flow**: `Mobile Device (Public Internet)` -> `Serveo Public URL` -> `Secure SSH Tunnel` -> `Localhost:3000`.
This architecture enables the mobile application to communicate seamlessly with the local backend database without complex firewall or port-forwarding configurations on the local network.

## 4. Data Flow Example: "Mood Check-in"
1.  **Frontend**: The React Native app collects user metrics (Emotion, Energy, Stress).
2.  **Transmission**: An authenticated HTTP POST request is sent to the `/mood` endpoint carrying a specific JSON payload.
3.  **Processing**: The Express server verifies the JWT token, validates the data against the Mongoose schema, and commits the entry to MongoDB.
4.  **Feedback**: A success response (HTTP 201) is returned to the client, triggering a UI update.

## 5. Emotional Aggregation Logic
Terubot is supported by a backend that connects the mobile application with the physical robot, handling authentication, storage, and aggregation of emotional inputs. The system follows a decoupled client--server architecture, allowing components to communicate while remaining loosely coupled.

**Aggregation Algorithm**:
The system performs a rolling aggregation of the user's ten most recent inputs. It calculates the mean energy value to derive an "emotional temperature" and determines the dominant "weather condition" (e.g., Sunny, Stormy) based on the frequency of reported emotions and stress levels, which drives the robot’s physical expression.
