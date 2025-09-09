# library-books
# Library Books Project

## Project Overview

The **Library Books Project** is a web application that allows users to **search, save, and manage books** in a library. It supports user registration, login, and viewing of previously saved books, making it easy to track and revisit favorite books.

---

## Features

- **User Registration & Login:** Secure authentication using JWT (auth.js middleware)  
- **Book Search & Save:** Users can search books on `index.html` and save them to their history  
- **View & Manage History:** Users can see their saved books on `history.html` and clear history if needed  
- **Responsive Frontend:** Pages designed with `style.css` for consistent look and feel  
- **Backend API:** Express.js server handles authentication, book history CRUD operations  

---

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Tools:** npm  

---

## Project Structure

library-books/
library-book/
├── backend/
│   ├── models/
│   │   ├── User.js          // User schema (name, email, username, password)
│   │   └── History.js       // History schema (userId, title, author, img)
│   ├── routes/
│   │   ├── auth.js          // Register & login routes
│   │   └── history.js       // Save, fetch, delete history routes
│   ├── middleware/
│   │   └── auth.js          // JWT authentication middleware
│   └── server.js            // Express server + route registration
├── frontend/
│   ├── index.html           // Home page + search + save book
│   ├── login.html           // Login page
│   ├── register.html        // Registration page
│   ├── history.html         // Display user’s history + clear
│   ├── style.css            // Styles for frontend
│   └── script.js            // (Optional) shared scripts if needed
└── package.json             // Backend dependencies   this is the projectpts if needed
└── package.json # Backend dependencies

yaml
Copy code

---

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/sachinnaik143/library-books.git
Navigate to backend

bash
Copy code
cd library-books/backend
Install dependencies

bash
Copy code
npm install
Setup environment variables (if required, e.g., MongoDB URI, JWT secret)

Create a .env file in backend (optional)

Run the server

bash
Copy code
node server.js
Open frontend

Open frontend/index.html in a browser

Database Setup

Ensure MongoDB is running locally or via a cloud service

Connect backend to MongoDB using your connection string in server.js

How It Works
Users register using register.html and login using login.html.

After login, users can search for books on index.html.

Selected books are saved in the user's history via history.js routes.

Users can view and clear their saved history on history.html.

Authentication is handled via JWT middleware (auth.js) for secure API access.

Screenshots
Replace with actual screenshots from your project

Login Page:

Register Page:

Home / Search Page:

History Page:

Contributing
Fork the repository

Create a new branch

Make your changes

Submit a pull request

Author
Kethavath Sachin Naik

B.Tech Student, JNU

Contact: [Your Email]

License
MIT License

yaml
Copy code

---

### ✅ Instructions to add this `README.md` to your repo:

1. Create a folder `screenshots/` in your project and add placeholder images:  
login-page.png
register-page.png
index-page.png
history-page.png

sql
Copy code
2. Save the above content as `README.md` in the root of your project.  
3. Commit and push to GitHub:

```bash
git add README.md screenshots/
git commit -m "Add README.md with project details and screenshots"
git push
