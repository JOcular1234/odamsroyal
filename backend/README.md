# OdamsRoyal Backend

This is the backend API for the OdamsRoyal project, built with Node.js, Express, and MongoDB.

## Features
- RESTful API for properties, inquiries, appointments, and admin
- MongoDB database (via Mongoose)
- Nodemailer for email notifications
- Environment variable support via `.env`

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if exists) or create a `.env` file with your config:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ...
     ```
3. **Run the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

---

## Deploying to Render

1. **Push your backend code to GitHub.**
2. **Create a new Web Service on [Render](https://render.com/):**
   - **Environment:** Node
   - **Root Directory:** `backend` (if your repo has both frontend and backend)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Set Environment Variables:**
   - In the Render dashboard, add all variables from your local `.env` (do NOT upload `.env` itself).
   - Make sure `MONGO_URI` points to a cloud MongoDB (e.g., MongoDB Atlas).
4. **Deploy:**
   - Click 'Create Web Service'. Render will build and deploy your backend.
   - After deployment, Render will provide a public URL for your API.

---

## Notes
- Make sure your MongoDB is accessible from Render (use MongoDB Atlas or similar).
- Do not commit sensitive info (like `.env`) to your repo.

---

## Useful Scripts
- `npm start` — Start the server
- `npm install` — Install dependencies

---

## Contact
For issues, please contact the maintainer.
