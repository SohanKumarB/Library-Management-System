# 📚 Modern Full-Stack Library Management System

A production-ready, feature-rich **Library Management System** built with **Java (Spring Boot 3)**, **Spring Security**, **JWT Authentication**, **JPA/Hibernate**, **H2 / MySQL**, **HTML5/CSS3/JavaScript (ES6+)**, **Chart.js**, and **Bootstrap 5**.

![Library Management System](https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200)

---

## 🌟 Key Features

### 1. Role-Based Access & Security
- **Admin**: System-wide management, student records, book catalog CRUD, fine collection, audit logs, reports export.
- **Librarian**: Book issuance/returns, due date renewals, student registration, fine collection.
- **Student**: Search catalog, check availability, view active borrows & due dates, request book holds/reservations, download eBooks.
- **JWT & BCrypt**: Stateless token authentication with BCrypt password hashing.

### 2. Modern Analytics Dashboard
- Interactive **Chart.js** visualizations:
  - Monthly Borrowing Trends (Bar chart)
  - Book Category Distribution (Doughnut chart)
  - Most Borrowed Books statistics
- Animated real-time counter cards: Total Books, Available Copies, Active Borrows, Overdue Count, Unpaid Fines.

### 3. Comprehensive Book Catalog Management
- **CRUD Operations**: Add, Edit, Delete, View Book Details.
- **Search & Filter**: Search by Title, Author, ISBN, Publisher, or Filter by Category.
- **QR Code Generation**: Auto-generated QR code per book for mobile scanning & quick issuance.
- **eBook Reader Integration**: View and download sample PDF eBooks directly in-app.

### 4. Book Issue, Return & Fine Calculation
- Automatic **Due Date calculation** (14-day default loan period).
- **Fine Auto-Calculation**: Overdue fine accumulation ($5.00/day).
- Return processing with fine settlement and stock count replenishment.
- Renewal action button (+14 days extension).

### 5. Reports & Exports
- Export reports to **PDF / Print** and **Excel (CSV)**.
- Filter by Borrow/Return logs, Book inventory, Fine collection, and Student directory.

### 6. Extra Features
- **Dark & Light Mode**: Seamless UI theme switcher with persistent user preference.
- **Wishlist & Hold Queue**: Student book reservation system.
- **System Audit Logs**: Security audit trail tracking all user operations.

---

## 🏗️ Project Structure

```
Library Management System/
├── backend/
│   ├── src/main/java/com/library/
│   │   ├── LibraryManagementApplication.java
│   │   ├── config/ (SecurityConfig, WebConfig)
│   │   ├── controller/ (AuthController, BookController, StudentController, IssueController, FineController, ReportController, DashboardController, etc.)
│   │   ├── dto/ (AuthDTOs, BookDTO, IssueRequest, ReturnRequest, DashboardStatsDTO)
│   │   ├── model/ (User, Role, Book, BookIssue, Fine, Reservation, Wishlist, AuditLog, Notification)
│   │   ├── repository/ (UserRepository, BookRepository, IssueRepository, FineRepository, etc.)
│   │   ├── security/ (JwtUtils, JwtAuthFilter, UserDetailsImpl, UserDetailsServiceImpl, AuthEntryPointJwt)
│   │   └── service/ (AuthService, BookService, StudentService, IssueService, FineService, ReportService, AuditLogService, NotificationService)
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql (Seed data for H2 DB)
│   └── pom.xml
├── frontend/
│   ├── index.html (Main SPA Dashboard)
│   ├── css/styles.css (Design System, Dark/Light mode, Glassmorphism, Responsive CSS)
│   └── js/
│       ├── api.js (JWT API client + instant fallback mock mode)
│       └── app.js (Main router, modals, Chart.js, CRUD actions, notifications)
├── database/
│   └── library_db.sql (MySQL Schema & Sample Data Script)
└── README.md
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@library.com` | `admin123` |
| **Librarian** | `librarian@library.com` | `lib123` |
| **Student** | `student@library.com` | `student123` |

*(Note: In the frontend top navbar, you can also use the **Quick Role Switcher** pills to instantly preview the UI from any role's perspective!)*

---

## 🚀 How to Run the Application

### Option A: Standalone Frontend Execution (Zero Setup)
Simply open `frontend/index.html` in any web browser! The frontend contains built-in API fallback state so all features (charts, modals, book catalog, issue/return forms, dark mode, PDF export) are 100% interactive immediately out of the box.

### Option B: Running Spring Boot Backend + Frontend

#### 1. Requirements
- **Java 17+** (Java 25 LTS supported)
- **Maven** (or IDE with Spring Boot plugin like IntelliJ / Eclipse / VS Code)

#### 2. Launch Backend
Navigate to the `backend` directory and run:

```bash
mvn spring-boot:run
```

Or using Maven wrapper:
```bash
./mvnw spring-boot:run
```

The server will start at: `http://localhost:8080`

#### 3. Access Database Consoles & APIs
- **H2 In-Memory DB Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:librarydb`
  - Username: `sa`
  - Password: *(leave empty)*
- **REST Endpoints**: `/api/books`, `/api/issues`, `/api/students`, `/api/dashboard/stats`, `/api/fines`

#### 4. Switching to MySQL Database
To use production MySQL instead of embedded H2:
1. Import `database/library_db.sql` into your MySQL server.
2. In `backend/src/main/resources/application.properties`, update:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 📊 Database ER Diagram / Schema Overview

- **`users`**: User ID, Name, Email, Password (BCrypt), Phone, Department, Year, Address, Role, Avatar URL.
- **`books`**: Book ID, Title, Author, ISBN, Publisher, Category, Language, Edition, Shelf Number, Total Copies, Available Copies, Cover Image, Description, Ebook URL.
- **`book_issues`**: Issue ID, Student ID (FK), Book ID (FK), Issue Date, Due Date, Return Date, Fine Amount, Status (`ISSUED`, `RETURNED`, `OVERDUE`).
- **`fines`**: Fine ID, Issue ID (FK), Student ID (FK), Amount, Payment Status (`UNPAID`, `PAID`), Payment Date.
- **`reservations`**: Request ID, Student ID (FK), Book ID (FK), Request Date, Status (`PENDING`, `FULFILLED`, `CANCELLED`).
- **`wishlists`**: Wishlist ID, Student ID (FK), Book ID (FK), Added Date.
- **`audit_logs`**: Log ID, Timestamp, Username, Action, Details.
- **`notifications`**: Notification ID, User ID (FK), Message, Type, IsRead, CreatedAt.

---

## 📝 License
Licensed under the MIT License. Built for educational and enterprise library management systems.
"# Library-Management-System" 
