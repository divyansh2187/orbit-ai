# 🌐 Orbit AI

Orbit AI is a modern **AI-powered web application** that provides intelligent responses through a clean, fast, and responsive chat interface. The project focuses on simplicity, performance, and a smooth user experience.

This project does **not** include authentication or voice support.

---

## 🚀 Features

* 🤖 AI-powered chat responses
* ⚡ Fast and responsive user interface
* 🌙 Light / Dark mode support
* 💬 Real-time chat experience
* 🔗 Backend API built using Node.js
* 📱 Fully responsive (mobile & desktop)


---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Lucide Icons

### Backend

* Node.js
* Express.js
* REST API

### Tools & Deployment

* Git & GitHub
* Render (Backend Hosting)

---

## 📂 Project Structure

```
orbit-ai/
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   └── package.json
│
├── server/              # Backend (Node.js)
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/orbit-ai.git
cd orbit-ai
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm start
```

The backend server will start on the port defined in your `.env` file.

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port).

---

## 🌍 Environment Variables

Create a `.env` file inside the **server** folder and add:

```
PORT=5000
API_KEY=your_api_key_here
```

Make sure the `.env` file is added to `.gitignore`.

---

## 🔌 API Overview

| Method | Endpoint  | Description                                |
| ------ | --------- | ------------------------------------------ |
| POST   | /api/chat | Sends user prompt and receives AI response |

---

## 📦 Deployment

* **Frontend**: GitHub Pages / Vercel
* **Backend**: Render

Ensure the backend URL is correctly configured in the frontend and CORS is enabled on the server.

---

## 🧠 Future Enhancements

* User authentication
* Chat history persistence
* Voice input/output
* Improved error handling
* Better AI context management

---

## 👨‍💻 Author

**Divyansh Bhati**
Full Stack / Backend Developer

---

## 📜 License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, consider giving it a star on GitHub!
