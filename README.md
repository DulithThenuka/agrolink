# 🌾 AgroLink — Smart Agriculture Marketplace

AgroLink is a full-stack web application that connects farmers directly with buyers, enabling efficient crop listing, searching, and purchasing. This system is designed to solve real-world agricultural distribution challenges by providing a digital marketplace.

---

## 🚀 Features

### 🔐 Authentication & Security

* User Registration & Login
* Role-Based Access Control (FARMER, BUYER, ADMIN)
* Session & Cookie-Based Authentication
* Password Encryption (BCrypt)
* CSRF Protection

---

### 🌾 Crop Management

* Farmers can add, update, and delete crops
* Image upload with validation
* Crop categorization
* Soft delete system

---

### 🔍 Advanced Search & Filtering

* Search by keyword
* Filter by category
* Filter by location
* Price range filtering
* Pagination support

---

### 📦 Order System

* Buyers can purchase crops
* Order tracking (PENDING, CONFIRMED, DELIVERED)
* Stock management
* Order history view

---

### 📧 Email Notifications

* Order confirmation emails
* Real-time user feedback

---

### 🧑‍💼 Admin Dashboard

* Total users, crops, and orders
* Recent order tracking
* Role-protected routes

---

## 🛠️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate

### Frontend

* Thymeleaf
* HTML / CSS / Bootstrap

### Database

* MySQL

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/agrolink.git
cd agrolink
```

---

### 2. Configure Database

Create database:

```sql
CREATE DATABASE agrolink_db;
```

Update `application.properties`:

```properties
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
```

---

### 3. Configure Email

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

### 4. Run the Project

Using IntelliJ:

* Run `AgroLinkApplication.java`

Or using terminal:

```bash
mvn spring-boot:run
```

---

### 5. Access Application

* App: http://localhost:8081
* Admin Dashboard: http://localhost:8081/admin/dashboard

---

## 👤 Default Admin Account

Email: [admin@agrolink.com](mailto:admin@agrolink.com)
Password: admin123

---

## 📸 Screenshots

(Add screenshots here before submission)

* Login Page
* Crop Listing
* Add Crop
* Order Page
* Admin Dashboard

---

## 📦 API Documentation

You can test endpoints using Postman.

Example endpoints:

* POST /auth/register
* POST /orders/place
* GET /crops

---

## 📌 Future Improvements

* Payment Integration
* Real-time notifications (WebSocket)
* Mobile app version
* AI-based crop price prediction

---

## 👨‍💻 Author

Dulith Thenuka
Software Engineering Student

---

## ⭐ Project Status

Completed as part of a Full-Stack Spring Boot Assignment.
