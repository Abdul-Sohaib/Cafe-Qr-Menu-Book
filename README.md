#  Café QR Menu Management System

A full-stack café management platform that allows **admins to add and manage menu categories and items**, and lets **customers instantly view the live digital menu** by scanning a **QR code** — all in real time.

Built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**, this system combines modern design with efficient data management to bring a seamless digital experience to cafés and restaurants.

---

##  Features Overview

###  Admin Panel

* Secure admin authentication (JWT-based)
* Add, edit, and delete **menu items** and **categories**
* Upload item images with preview & drag-drop support
* Automatic synchronization — updates instantly reflect on customer side
* QR Code generator for customers to scan and access the live menu
* Clean, responsive dashboard built with **React + Tailwind CSS**

###  Customer Interface

* Scan the café’s QR code to access the live digital menu
* View items organized by categories (e.g., Coffee, Snacks, Desserts)
* Beautiful UI designed for both **mobile** and **desktop**
* Automatically shows the latest updates from the admin panel

###  Tech Stack

| Layer                  | Technology                                       |
| ---------------------- | ------------------------------------------------ |
| **Frontend**           | React, Vite, TypeScript, Tailwind CSS            |
| **Backend**            | Node.js, Express.js                              |
| **Database**           | MongoDB                                          |
| **Authentication**     | JWT                                              |
| **Hosting **           | Vercel / Render                                  |
| **Other Tools**        | Axios, React Toastify, React Icons, QRCode.react |

---

##  System Architecture

```text
Admin Panel  →  Backend API (Express)  →  MongoDB
          ↓                            ↑
      QR Generator                Live Data Fetch
          ↓                            ↑
      Customer QR Page  ←──────────────┘
```

All menu updates made by the admin are reflected live when customers scan the café’s QR code.

---

##  Getting Started

###  Prerequisites

Make sure you have installed:

* **Node.js** (>= 16)
* **npm** or **yarn**
* **MongoDB** (local or Atlas instance)

---

###  Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:

   ```bash
   npm run dev
   ```

   The API will be available at:

   ```
   http://localhost:5000
   ```

---

###  Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```
5. Open the app in your browser:

   ```
   http://localhost:5173
   ```

---

##  Folder Structure

```bash
cafe-qr-menu/
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── api/
│   │   └── App.tsx
│   ├── .env
│   └── vite.config.ts
│
└── README.md
```

---

##  Environment Variables

| Variable         | Description                   |
| ---------------- | ----------------------------- |
| **MONGO_URI**    | MongoDB connection string     |
| **JWT_SECRET**   | Secret key for authentication |
| **PORT**         | Backend port number           |
| **VITE_API_URL** | Frontend API base URL         |

---

##  API Endpoints

### Categories

| Method   | Endpoint                   | Description          |
| -------- | -------------------------- | -------------------- |
| `GET`    | `/api/menu/categories`     | Fetch all categories |
| `POST`   | `/api/menu/categories`     | Add a new category   |
| `PUT`    | `/api/menu/categories/:id` | Update a category    |
| `DELETE` | `/api/menu/categories/:id` | Delete a category    |

### Menu Items

| Method   | Endpoint        | Description          |
| -------- | --------------- | -------------------- |
| `GET`    | `/api/menu`     | Fetch all menu items |
| `POST`   | `/api/menu`     | Add new menu item    |
| `PUT`    | `/api/menu/:id` | Update menu item     |
| `DELETE` | `/api/menu/:id` | Delete menu item     |

---

##  QR Code Workflow

1. Admin generates a QR code via the dashboard using:

   ```tsx
   <QRCode value="https://yourfrontend.com/menu" />
   ```
2. Print or share the QR.
3. Customer scans the QR and is redirected to the menu page.
4. Menu page fetches the latest menu dynamically from:

   ```
   GET /api/menu
   ```

---

##  UI Design Highlights

* Warm café-inspired color palette (coffee brown, cream beige, accent orange)
* Accessible typography using *Playfair Display* and *Inter*
* Fully responsive and mobile-first design
* Smooth animations for splash screens and transitions
* Designed for real cafés — aesthetic yet practical

---

##  Future Enhancements

* ~ Table-order integration (customers place orders digitally)
* ~ Payment gateway for online checkout
* ~ Analytics dashboard for sales insights
* ~ Multi-café support (dynamic café IDs)
* ~ Real-time updates via WebSockets

---

##  Author

**Abdul Sohaib**
Full Stack Developer | UX/UI Enthusiast
 [sohaibmdabdul999@gmail.com](mailto:sohaibmdabdul999@gmail.com)
 [Portfolio Link Coming Soon]

---

##  License

This project is licensed under the **MIT License** — feel free to use and modify it for educational or commercial purposes with attribution.

---


