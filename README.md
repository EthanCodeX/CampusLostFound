# Campus Lost & Found System

A web-based Lost & Found system designed for campus-wide use. This system allows users to report, view, and manage lost or found items through an intuitive interface, while ensuring security, reliability, and performance.

---

## 🚀 Live Demo

Access the deployed application here:  
**[Campus Lost & Found Live Demo](https://campuslostfound-production.up.railway.app)**

---

## 📌 Features

### Functional
- Submit a **Lost Item** report
- Submit a **Found Item** report
- View all **Lost** and **Found** items
- **Filter** and **Sort** items by category or date
- View **Item Details** in a modal popup
- Update item status: Active → Claimed / Resolved
- Delete a report

### Item Details
Each item includes:  
- Title  
- Description  
- Category (Lost/Found)  
- Location  
- Date  
- Contact Information  
- Status  

---

## 🛠️ Technical Stack

### Frontend
- HTML5 with semantic structure
- CSS3 and responsive design (mobile-friendly)
- Bootstrap 5 for UI components
- JavaScript for dynamic content and validation
- Lazy loading for images
- Deferred scripts for better performance

### Backend
- Node.js with Express framework
- MongoDB for database (Mongoose ODM)
- JWT-based authentication
- RESTful API routes (`GET`, `POST`, `PUT`, `DELETE`)
- Middleware for JSON parsing, file uploads, and static file serving
- Error handling: 404 & server errors

### Security
- Server-side input validation & sanitization
- NoSQL injection prevention
- Basic XSS protection
- `.env` for sensitive credentials
- Passwords hashed with **bcrypt**

### Performance
- Image optimization
- Lazy loading & deferred scripts
- Minified CSS & JS
- Efficient database queries

---

## 🗂️ Project Structure
``` bash
Campus-Lost-Found/
├─ assets/                  # Images, logos, icons
├─ css/
│  └─ style.css             # Custom styles
├─ js/
│  ├─ auth.js               # Login/Register functionality
│  ├─ common.js             # Shared functions
│  ├─ lost.js               # Lost item form & logic
│  ├─ found.js              # Found item form & logic
│  ├─ lost-display.js       # Lost items UI display
│  ├─ found-display.js      # Found items UI display
│  └─ item-detail.js        # Modal item detail logic
├─ views/
│  ├─ index.html            # Landing page
│  ├─ login.html
│  ├─ register.html
│  ├─ dashboard.html
│  ├─ lost.html
│  ├─ found.html
│  └─ history.html
├─ models/
│  ├─ Item.js               # Item schema (Lost/Found)
│  └─ User.js               # User schema
├─ routes/
│  ├─ auth.js               # Authentication routes
│  ├─ items.js              # Item-related routes
│  └─ users.js              # User-related routes
├─ .env                     # Environment variables
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## ⚡ Setup Instructions

Follow these steps to run the Campus Lost & Found System locally:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/campus-lost-and-found.git
cd campus-lost-and-found
```
### 2. Install dependencies
```bash
npm install
```
### 3. Create a .env file with the following variables
```bash
PORT=3000
MONGO_URI=<your_mongo_db_connection_string>
JWT_SECRET=<your_jwt_secret>
```
### 4. Start the server
```bash
npm start
```
### 5. Access the application at http://localhost:3000

---

## 📝 License
This project is licensed under the MIT License.


