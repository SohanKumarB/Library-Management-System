-- ========================================================
-- Library Management System - MySQL Database Schema & Seed
-- ========================================================

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- 1. Users Table (Admin, Librarian, Student)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50),
    year_of_study VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL, -- ROLE_ADMIN, ROLE_LIBRARIAN, ROLE_STUDENT
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table
CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL UNIQUE,
    publisher VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    language VARCHAR(30) DEFAULT 'English',
    edition VARCHAR(30),
    shelf_number VARCHAR(30),
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    description TEXT,
    cover_image TEXT,
    ebook_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Book Issue / Borrow Records Table
CREATE TABLE IF NOT EXISTS book_issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED', -- ISSUED, RETURNED, OVERDUE
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 4. Fine Table
CREATE TABLE IF NOT EXISTS fines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID', -- UNPAID, PAID
    payment_date TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES book_issues(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Book Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, FULFILLED, CANCELLED
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 6. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================================
-- Seed Initial Data
-- ========================================================

-- Users (BCrypt Encoded Passwords for 'admin123', 'lib123', 'student123')
-- Default admin, librarian, and student accounts
INSERT INTO users (id, name, email, password, phone, department, year_of_study, address, role, avatar_url) VALUES
(1, 'Admin User', 'admin@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1234567890', 'Administration', 'N/A', 'Central Admin Building, Campus', 'ROLE_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Eleanor Vance', 'librarian@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1987654321', 'Library Staff', 'N/A', 'Library Wing A, Desk 4', 'ROLE_LIBRARIAN', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
(3, 'Alex Johnson', 'student@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019283', 'Computer Science', '3rd Year', '742 Evergreen Terrace, Sector 4', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
(4, 'Sophia Martinez', 'sophia@student.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019284', 'Electrical Engineering', '2nd Year', 'B-12 Campus Hostel', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(5, 'Marcus Chen', 'marcus@student.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019285', 'Mechanical Engineering', '4th Year', 'Block C-4 Dorms', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

-- Books Seed Data
INSERT INTO books (id, title, author, isbn, publisher, category, language, edition, shelf_number, total_copies, available_copies, description, cover_image, ebook_url) VALUES
(1, 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', '978-0132350884', 'Prentice Hall', 'Computer Science', 'English', '1st Edition', 'CS-A1-04', 5, 3, 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(2, 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'MIT Press', 'Computer Science', 'English', '3rd Edition', 'CS-B2-12', 4, 2, 'A comprehensive update of the leading textbook on algorithms, featuring new material on vEB trees, multithreaded algorithms, dynamic programming, and edge-based flow.', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(3, 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm', '978-0201633610', 'Addison-Wesley', 'Software Engineering', 'English', '1st Edition', 'SE-C3-08', 3, 1, 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(4, 'The Pragmatic Programmer: Your Journey to Mastery', 'David Thomas, Andrew Hunt', '978-0135957059', 'Addison-Wesley', 'Software Engineering', 'English', '2nd Edition', 'SE-C3-15', 6, 5, 'Illustrates the best approaches and major pitfalls of many different aspects of software development.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(5, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', '978-0134610993', 'Pearson', 'Artificial Intelligence', 'English', '4th Edition', 'AI-D1-01', 4, 4, 'The long-anticipated revision of this best-selling text offers the most comprehensive, up-to-date introduction to the theory and practice of AI.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(6, 'Database System Concepts', 'Abraham Silberschatz', '978-0078022159', 'McGraw-Hill', 'Database Systems', 'English', '7th Edition', 'DB-A3-20', 5, 4, 'Database System Concepts presents the fundamental concepts of database management in an intuitive manner geared toward allowing students to begin working with databases.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(7, 'Calculus: Early Transcendentals', 'James Stewart', '978-1285741550', 'Cengage Learning', 'Mathematics', 'English', '8th Edition', 'MATH-M1-09', 8, 7, 'Success in your calculus course starts here! James Stewart\'s CALCULUS texts are world-wide best-sellers for a reason.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

-- Book Issues Seed Data
INSERT INTO book_issues (id, student_id, book_id, issue_date, due_date, return_date, fine_amount, status) VALUES
(1, 3, 1, '2026-07-01', '2026-07-15', NULL, 65.00, 'OVERDUE'),
(2, 3, 2, '2026-07-10', '2026-07-24', NULL, 20.00, 'OVERDUE'),
(3, 4, 3, '2026-07-18', '2026-08-01', NULL, 0.00, 'ISSUED'),
(4, 5, 6, '2026-06-01', '2026-06-15', '2026-06-14', 0.00, 'RETURNED');

-- Fines Seed Data
INSERT INTO fines (id, issue_id, student_id, amount, payment_status, payment_date) VALUES
(1, 1, 3, 65.00, 'UNPAID', NULL),
(2, 2, 3, 20.00, 'UNPAID', NULL);

-- Reservations Seed Data
INSERT INTO reservations (id, student_id, book_id, request_date, status) VALUES
(1, 4, 1, '2026-07-25 10:30:00', 'PENDING');

-- Wishlist Seed Data
INSERT INTO wishlists (id, student_id, book_id, added_at) VALUES
(1, 3, 5, '2026-07-20 14:15:00');

-- Notifications Seed Data
INSERT INTO notifications (id, user_id, message, type, is_read, created_at) VALUES
(1, 3, 'Your borrowed book "Clean Code" is overdue by 13 days! Fine accumulated: $65.00.', 'WARNING', FALSE, '2026-07-28 08:00:00'),
(2, 3, 'Your borrowed book "Introduction to Algorithms" is overdue by 4 days.', 'WARNING', FALSE, '2026-07-28 08:00:00'),
(3, 4, 'Your reserved book "Clean Code" is pending availability.', 'INFO', TRUE, '2026-07-25 10:30:00');

-- Audit Logs Seed Data
INSERT INTO audit_logs (id, timestamp, username, action, details) VALUES
(1, '2026-07-01 09:00:00', 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Clean Code" (ID: 1) to Alex Johnson (ID: 3)'),
(2, '2026-07-10 11:20:00', 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Introduction to Algorithms" (ID: 2) to Alex Johnson (ID: 3)'),
(3, '2026-07-18 14:05:00', 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Design Patterns" (ID: 3) to Sophia Martinez (ID: 4)');
