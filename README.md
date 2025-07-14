# 🔐 FaceLock – Face Recognition Login System

FaceLock is a modern and secure face recognition login system built with **React**, **TensorFlow\.js**, **face-api.js**, and **Node.js**. It provides fast and accurate biometric login using the webcam, while also offering a fallback to traditional email/password authentication.

---

## 🚀 Features

* 🎥 **Face Authentication** via webcam
* 🧠 **Face Descriptor Matching** using face-api.js
* 🛡️ **Secure JWT-based login**
* 📧 **Email verification** for account activation
* 🔐 **Password fallback** if face auth fails
* 💾 **Multer-based face data storage**
* ⚙️ Backend in **Express.js + MongoDB**

---

## 🧩 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Webcam
* face-api.js
* TensorFlow\.js

### Backend

* Node.js
* Express.js
* MongoDB
* Multer
* Bcrypt
* JWT
* Nodemailer

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/alihussnain1122/facelock-face-auth-login.git
cd facelock-face-auth-login
```

### 2. Install dependencies

```bash
# For frontend
cd client
npm install

# For backend
cd ../server
npm install
```

### 3. Setup Environment Variables

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4. Start the app

```bash
# In one terminal (backend)
cd server
npm run dev

# In another terminal (frontend)
cd client
npm run dev
```

---

## 📁 Folder Structure

```
facelock-face-auth-login/
├── client/               # React frontend
│   └── src/components/WebcamCapture.js
├── server/               # Node.js backend
│   └── controllers/
│   └── models/
│   └── routes/
│   └── utils/
├── public/models/        # face-api.js models
├── .gitignore
├── README.md
```


## 🤝 Contributions

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

