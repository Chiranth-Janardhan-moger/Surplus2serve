# 🍱 Surplus2Serve

**Surplus2Serve** is a full-stack web application that bridges the gap between food donors and NGOs. It aims to reduce food waste by enabling real-time donations and pickups through a streamlined interface for both donors and NGOs.

---

## 🛠️ Tech Stack

**Frontend:**  
- React  
- Tailwind CSS  
- Vite  

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MySQL (using XAMPP)

---

## 📁 Core Project Structure

```sh
surplus2serve/
├── backend/
│ ├── .env
│ ├── package-lock.json
│ ├── package.json
│ └── server.js
│
├── database/
│ └── schema.sql
│
├── frontend/
│ ├── eslint.config.js
│ ├── index.html
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.js
│ ├── tailwind.config.js
│ ├── tsconfig.app.json
│ ├── tsconfig.json
│ ├── tsconfig.node.json
│ ├── vite.config.js
│ ├── vite.config.ts
│ └── src/
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ ├── vite-env.d.ts
│ ├── styles/
│ │ └── global.css
│ └── components/
│ ├── About.jsx
│ ├── Contact.jsx
│ ├── Donate.jsx
│ ├── Donors.jsx
│ ├── Features.jsx
│ ├── Footer.jsx
│ ├── Hero.jsx
│ ├── History.jsx
│ ├── Home.jsx
│ ├── Impact.jsx
│ ├── Navbar.jsx
│ ├── NgoAuth.jsx
│ ├── NgoDashboard.jsx
│ ├── NgoRegister.jsx
│ ├── display.jsx
│ ├── info.jsx
│ ├── login.jsx
│ └── signup.jsx
│
├── package-lock.json
├── package.json
└── README.md ← You are here
```

## ⚙️ Backend Setup

### Step 1: Install dependencies

```bash
cd backend
npm install
```
### Step 2: Create `.env` File

Create a `.env` file inside the `backend/` folder and add the following content:

```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENCAGE_API_KEY=your_opencage_api_key
```

### Step 3: Start the server

```bash
npm run dev
```

## 🖥️ Frontend Setup
```sh 
cd frontend
npm install
npm run dev
```

### 🗃️ Database

1. Make sure the **MySQL service** is running in **XAMPP**.
2. Open **phpMyAdmin** or any MySQL client.
3. Run the SQL script located at: **database/schema.sql**

### Some ScreenShots of project:
- home page

