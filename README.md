# 💬 LiveRoom — Real-Time Chat Web App

LiveRoom is a full-featured real-time chat application built with a clean and classic tech stack — **HTML, CSS, JavaScript, PHP & MySQL**. The app includes user registration, login, room-based chat, likes, dark/light theme toggle, and an admin panel.

![LiveRoom Preview](screenshots/landing.png) <!-- Replace with your actual image -->

---

## 🚀 Demo

🌐 **Live Demo:** [https://your-live-demo-link.com](https://your-live-demo-link.com)  
📸 **Screenshots:** See below or open the `/screenshots/` folder

---

## ✨ Features

| Category        | Functionality                                                                 |
|----------------|--------------------------------------------------------------------------------|
| 🔐 Auth         | Registration, login, password hashing, session protection                     |
| 💬 Chat         | Send/receive messages via AJAX (no page reload)                                |
| 🧩 Rooms        | Room-based chat with unique ID or slug                                         |
| ❤️ Likes        | Like messages (AJAX + DB)                                                      |
| 🌙 Themes       | Dark and light mode (saved in localStorage)                                    |
| 👮 Admin Panel  | Delete messages, block users (admin-only)                                      |
| 📱 Responsive   | Works well on mobile and desktop                                               |

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP (procedural & clean structure)
- **Database:** MySQL
- **Data Exchange:** AJAX (`fetch()` + JSON responses)
- **Auth:** PHP Sessions, `password_hash()`, `password_verify()`

---

## 📂 Folder Structure

```

/chat-app/
├── index.html             # 🌟 Landing page
├── index.php              # Login/registration page
├── chat.php               # Main chat interface
├── admin.php              # Admin dashboard
│
├── css/
│   └── landing.css        # Landing page styles
│
├── js/
│   └── landing.js         # Landing page scripts
│
├── api/
│   ├── send-message.php
│   ├── get-messages.php
│   ├── like.php
│   ├── login.php
│   ├── register.php
│   └── delete-message.php
│
├── includes/
│   ├── db.php
│   ├── auth.php
│   └── utils.php
│
└── sql/
└── schema.sql

````

---

## 🎬 Screenshots

> Screenshots are located in the `/screenshots/` folder. Replace them with your actual app UI.

```markdown
![Landing Page](screenshots/landing.png)
![Login Page](screenshots/login.png)
![Chat Room](screenshots/chat.png)
![Admin Panel](screenshots/admin.png)
````

---

## 📎 Setup Instructions

1. Clone this repository
2. Import `sql/schema.sql` into your MySQL database
3. Update DB credentials in `includes/db.php`
4. Run the project using a local PHP server (e.g., XAMPP or MAMP)
5. Open `index.html` to start

---

## 👨‍💻 Author

**Oleksandr Azenko**
📧 [azenko0609@gmail.com](mailto:azenko0609@gmail.com)
🌐 [GitHub Portfolio](https://github.com/Azenko01)
