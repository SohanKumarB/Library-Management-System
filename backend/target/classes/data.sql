-- H2 Database Initializer Data
-- Seed Users (Password is 'admin123', 'lib123', 'student123' BCrypt encoded)
INSERT INTO users (id, name, email, password, phone, department, year_of_study, address, role, avatar_url, created_at) VALUES
(1, 'Admin User', 'admin@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1234567890', 'Administration', 'N/A', 'Central Admin Building, Campus', 'ROLE_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', CURRENT_TIMESTAMP),
(2, 'Eleanor Vance', 'librarian@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1987654321', 'Library Staff', 'N/A', 'Library Wing A, Desk 4', 'ROLE_LIBRARIAN', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', CURRENT_TIMESTAMP),
(3, 'Alex Johnson', 'student@library.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019283', 'Computer Science', '3rd Year', '742 Evergreen Terrace, Sector 4', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', CURRENT_TIMESTAMP),
(4, 'Sophia Martinez', 'sophia@student.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019284', 'Electrical Engineering', '2nd Year', 'B-12 Campus Hostel', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', CURRENT_TIMESTAMP),
(5, 'Marcus Chen', 'marcus@student.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY04gB8R052yvF1w6L2yO', '+1555019285', 'Mechanical Engineering', '4th Year', 'Block C-4 Dorms', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', CURRENT_TIMESTAMP);

-- Books Seed Data
INSERT INTO books (id, title, author, isbn, publisher, category, language, edition, shelf_number, total_copies, available_copies, description, cover_image, ebook_url, created_at) VALUES
(1, 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', '978-0132350884', 'Prentice Hall', 'Computer Science', 'English', '1st Edition', 'CS-A1-04', 5, 3, 'Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(2, 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'MIT Press', 'Computer Science', 'English', '3rd Edition', 'CS-B2-12', 4, 2, 'A comprehensive update of the leading textbook on algorithms, featuring new material on vEB trees, multithreaded algorithms, dynamic programming, and edge-based flow.', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(3, 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm', '978-0201633610', 'Addison-Wesley', 'Software Engineering', 'English', '1st Edition', 'SE-C3-08', 3, 1, 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(4, 'The Pragmatic Programmer: Your Journey to Mastery', 'David Thomas, Andrew Hunt', '978-0135957059', 'Addison-Wesley', 'Software Engineering', 'English', '2nd Edition', 'SE-C3-15', 6, 5, 'Illustrates the best approaches and major pitfalls of many different aspects of software development.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(5, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', '978-0134610993', 'Pearson', 'Artificial Intelligence', 'English', '4th Edition', 'AI-D1-01', 4, 4, 'The long-anticipated revision of this best-selling text offers the most comprehensive, up-to-date introduction to the theory and practice of AI.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(6, 'Database System Concepts', 'Abraham Silberschatz', '978-0078022159', 'McGraw-Hill', 'Database Systems', 'English', '7th Edition', 'DB-A3-20', 5, 4, 'Database System Concepts presents the fundamental concepts of database management in an intuitive manner geared toward allowing students to begin working with databases.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP),
(7, 'Calculus: Early Transcendentals', 'James Stewart', '978-1285741550', 'Cengage Learning', 'Mathematics', 'English', '8th Edition', 'MATH-M1-09', 8, 7, 'Success in your calculus course starts here! James Stewart''s CALCULUS texts are world-wide best-sellers for a reason.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', CURRENT_TIMESTAMP);

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
(1, 4, 1, CURRENT_TIMESTAMP, 'PENDING');

-- Wishlists Seed Data
INSERT INTO wishlists (id, student_id, book_id, added_at) VALUES
(1, 3, 5, CURRENT_TIMESTAMP);

-- Notifications Seed Data
INSERT INTO notifications (id, user_id, message, type, is_read, created_at) VALUES
(1, 3, 'Your borrowed book "Clean Code" is overdue by 13 days! Fine accumulated: $65.00.', 'WARNING', FALSE, CURRENT_TIMESTAMP),
(2, 3, 'Your borrowed book "Introduction to Algorithms" is overdue by 4 days.', 'WARNING', FALSE, CURRENT_TIMESTAMP),
(3, 4, 'Your reserved book "Clean Code" is pending availability.', 'INFO', TRUE, CURRENT_TIMESTAMP);

-- Audit Logs Seed Data
INSERT INTO audit_logs (id, timestamp, username, action, details) VALUES
(1, CURRENT_TIMESTAMP, 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Clean Code" (ID: 1) to Alex Johnson (ID: 3)'),
(2, CURRENT_TIMESTAMP, 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Introduction to Algorithms" (ID: 2) to Alex Johnson (ID: 3)'),
(3, CURRENT_TIMESTAMP, 'librarian@library.com', 'ISSUE_BOOK', 'Issued "Design Patterns" (ID: 3) to Sophia Martinez (ID: 4)');
