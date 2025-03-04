# Corner - Real-Time  Code Editor

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey)

## 🚀 Introduction
Corner is an  real-time code editor that allows developers to collaborate seamlessly. It features an integrated terminal, video chat support via Agora, and project-saving capabilities. Built with **Monaco Editor**, **Express.js**, and **Socket.IO**, this platform enables users to create and save coding projects in rooms.

## ✨ Features
- **🖥️ Real-Time Code Collaboration** - Work together in shared rooms using Monaco Editor.
- **🎥 Video Chat with Agora** - Communicate with team members while coding.
- **🖲️ Integrated Terminal** - Run code directly within the browser.
- **📁 Save Projects** - Users can create rooms and save their work as projects.
- **🔐 Secure Authentication** - Login and user authentication powered by JWT.


---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React (Vite)
- **Editor:** Monaco Editor
- **UI:** Tailwind CSS,
- **State Management:** Zustand
- **Communication:** Socket.IO
- **Video Call:** Agora RTC SDK


### **Backend**
- **Server:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT & Bcrypt.js
- **Real-Time Communication:** Socket.IO
- **Environment Management:** Dotenv

---

## 🚀 Getting Started

### **Frontend Setup**
```sh
# Clone the repository
git clone https://github.com/your-repo/corner.git
cd corner/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### **Backend Setup**
```sh
cd corner/backend

# Install dependencies
npm install

# Create a .env file and add required variables

# Start the server
npm run dev
```

---

## 🔑 Environment Variables
Create a `.env` file in the **backend** directory and define:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AGORA_APP_ID=your_agora_app_id
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📚 Usage
- **Create a Room** - Generate a unique room and share the link.
- **Code Together** - Edit code in real-time with others.
- **Use the Terminal** - Execute commands in an embedded terminal.
- **Start a Video Call** - Use Agora for live communication.
- **Save and Load Projects** - Persist work in MongoDB.

---

## 📜 License
This project is licensed under the ISC License.

---

## 🎭 Made with ❤️ by Sounabho

