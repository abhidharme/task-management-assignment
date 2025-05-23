# 📝 Task Management Backend

This is the **backend** for the Task Management Assignment built using **Node.js**, **Express.js**, and **MongoDB**. It provides a RESTful API to manage tasks—allowing creation, retrieval, updating, and deletion of task records.

---

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **dotenv** – for environment variables
- **cors** – to enable cross-origin requests
- **nodemon** – for development auto-restarts

---

## 📁 Project Structure

backend/
├── controllers/ # Business logic
├── models/ # Mongoose schemas
├── routes/ # Route definitions
├── .env # Environment config (do not commit)
├── server.js # Main entry point
└── package.json

yaml
Copy
Edit

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v14 or higher) – [https://nodejs.org](https://nodejs.org)
- MongoDB (local or Atlas) – [https://www.mongodb.com](https://www.mongodb.com)

---

### ⚙️ Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/abhidharme/task-management-assignment.git
cd task-management-assignment/backend
Install backend dependencies:

bash
Copy
Edit
npm install
Create a .env file in the backend/ directory:

env
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
If you're using MongoDB Atlas, replace the URI with your Atlas connection string.

Start the development server:

bash
Copy
Edit
npm run dev
Or start normally:

bash
Copy
Edit
npm start
🌐 API Endpoints
Method	Endpoint	Description
GET	/api/tasks	Retrieve all tasks
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update a task by ID
DELETE	/api/tasks/:id	Delete a task by ID

