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
- SQL Injection / NoSQL injection prevention
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
