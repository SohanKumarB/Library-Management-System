/* ==========================================================================
   Library Management System - API Client Module with JWT & Fallback Mock Mode
   ========================================================================== */

const API_BASE = 'http://localhost:8080/api';

// Initial In-Memory Fallback State (Ensures full offline demonstration)
let mockBooks = [
  { id: 1, title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '978-0132350884', publisher: 'Prentice Hall', category: 'Computer Science', language: 'English', edition: '1st Edition', shelfNumber: 'CS-A1-04', totalCopies: 5, availableCopies: 3, description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', publisher: 'MIT Press', category: 'Computer Science', language: 'English', edition: '3rd Edition', shelfNumber: 'CS-B2-12', totalCopies: 4, availableCopies: 2, description: 'A comprehensive update of the leading textbook on algorithms.', coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 3, title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma, Richard Helm', isbn: '978-0201633610', publisher: 'Addison-Wesley', category: 'Software Engineering', language: 'English', edition: '1st Edition', shelfNumber: 'SE-C3-08', totalCopies: 3, availableCopies: 1, description: 'Capturing a wealth of experience about the design of object-oriented software.', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 4, title: 'The Pragmatic Programmer: Your Journey to Mastery', author: 'David Thomas, Andrew Hunt', isbn: '978-0135957059', publisher: 'Addison-Wesley', category: 'Software Engineering', language: 'English', edition: '2nd Edition', shelfNumber: 'SE-C3-15', totalCopies: 6, availableCopies: 5, description: 'Illustrates the best approaches and major pitfalls of software development.', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 5, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '978-0134610993', publisher: 'Pearson', category: 'Artificial Intelligence', language: 'English', edition: '4th Edition', shelfNumber: 'AI-D1-01', totalCopies: 4, availableCopies: 4, description: 'Comprehensive introduction to the theory and practice of AI.', coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 6, title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', publisher: 'McGraw-Hill', category: 'Database Systems', language: 'English', edition: '7th Edition', shelfNumber: 'DB-A3-20', totalCopies: 5, availableCopies: 4, description: 'Fundamental concepts of database management.', coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', ebookUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

let mockStudents = [
  { id: 1, name: 'Admin User', email: 'admin@library.com', role: 'ROLE_ADMIN', phone: '+1234567890', department: 'Administration', yearOfStudy: 'N/A', address: 'Campus Admin', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 2, name: 'Eleanor Vance', email: 'librarian@library.com', role: 'ROLE_LIBRARIAN', phone: '+1987654321', department: 'Library Staff', yearOfStudy: 'N/A', address: 'Library Wing A', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
  { id: 3, name: 'Alex Johnson', email: 'student@library.com', role: 'ROLE_STUDENT', phone: '+1555019283', department: 'Computer Science', yearOfStudy: '3rd Year', address: 'Sector 4 Dorms', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 4, name: 'Sophia Martinez', email: 'sophia@student.com', role: 'ROLE_STUDENT', phone: '+1555019284', department: 'Electrical Engineering', yearOfStudy: '2nd Year', address: 'Hostel B', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
];

let mockIssues = [
  { id: 1, student: mockStudents[2], book: mockBooks[0], issueDate: '2026-07-01', dueDate: '2026-07-15', returnDate: null, fineAmount: 65.00, status: 'OVERDUE' },
  { id: 2, student: mockStudents[2], book: mockBooks[1], issueDate: '2026-07-10', dueDate: '2026-07-24', returnDate: null, fineAmount: 20.00, status: 'OVERDUE' },
  { id: 3, student: mockStudents[3], book: mockBooks[2], issueDate: '2026-07-18', dueDate: '2026-08-01', returnDate: null, fineAmount: 0.00, status: 'ISSUED' },
  { id: 4, student: mockStudents[3], book: mockBooks[5], issueDate: '2026-06-01', dueDate: '2026-06-15', returnDate: '2026-06-14', fineAmount: 0.00, status: 'RETURNED' }
];

let mockFines = [
  { id: 1, bookIssue: mockIssues[0], student: mockStudents[2], amount: 65.00, paymentStatus: 'UNPAID', paymentDate: null },
  { id: 2, bookIssue: mockIssues[1], student: mockStudents[2], amount: 20.00, paymentStatus: 'UNPAID', paymentDate: null }
];

let mockNotifications = [
  { id: 1, user: mockStudents[2], message: 'Your borrowed book "Clean Code" is overdue by 13 days! Fine accumulated: $65.00.', type: 'WARNING', isRead: false, createdAt: '2026-07-28' },
  { id: 2, user: mockStudents[2], message: 'Your borrowed book "Introduction to Algorithms" is overdue by 4 days.', type: 'WARNING', isRead: false, createdAt: '2026-07-28' }
];

const Api = {
  getAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  },

  async request(endpoint, options = {}) {
    options.headers = { ...this.getAuthHeader(), ...options.headers };
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`Backend connection attempt to ${endpoint} failed. Using instant interactive mock state.`, err.message);
      return this.handleMockFallback(endpoint, options);
    }
  },

  handleMockFallback(endpoint, options) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;

    if (endpoint.includes('/dashboard/stats')) {
      return {
        totalBooks: mockBooks.length,
        availableBooks: mockBooks.reduce((acc, b) => acc + b.availableCopies, 0),
        borrowedBooks: mockIssues.filter(i => i.status === 'ISSUED' || i.status === 'OVERDUE').length,
        returnedBooks: mockIssues.filter(i => i.status === 'RETURNED').length,
        overdueBooks: mockIssues.filter(i => i.status === 'OVERDUE').length,
        registeredStudents: mockStudents.filter(s => s.role === 'ROLE_STUDENT').length,
        totalFinesCollected: mockFines.filter(f => f.paymentStatus === 'PAID').reduce((a, f) => a + f.amount, 0),
        totalUnpaidFines: mockFines.filter(f => f.paymentStatus === 'UNPAID').reduce((a, f) => a + f.amount, 0),
        categoryDistribution: { 'Computer Science': 2, 'Software Engineering': 2, 'Artificial Intelligence': 1, 'Database Systems': 1 },
        monthlyBorrowingStats: { 'Jan': 12, 'Feb': 19, 'Mar': 25, 'Apr': 30, 'May': 22, 'Jun': 45, 'Jul': 60 },
        mostBorrowedBooks: { 'Clean Code': 14, 'Intro to Algorithms': 10, 'Design Patterns': 8 }
      };
    }

    if (endpoint.includes('/books')) {
      if (method === 'POST') {
        const newBook = { id: Date.now(), ...body, availableCopies: body.totalCopies };
        mockBooks.unshift(newBook);
        return newBook;
      }
      if (method === 'DELETE') {
        const id = parseInt(endpoint.split('/').pop());
        mockBooks = mockBooks.filter(b => b.id !== id);
        return { success: true };
      }
      return mockBooks;
    }

    if (endpoint.includes('/students')) {
      if (method === 'POST') {
        const newStudent = { id: Date.now(), role: 'ROLE_STUDENT', ...body };
        mockStudents.push(newStudent);
        return newStudent;
      }
      return mockStudents.filter(s => s.role === 'ROLE_STUDENT');
    }

    if (endpoint.includes('/issues')) {
      if (endpoint.includes('/issue') && method === 'POST') {
        const student = mockStudents.find(s => s.id == body.studentId) || mockStudents[2];
        const book = mockBooks.find(b => b.id == body.bookId) || mockBooks[0];
        const newIssue = {
          id: Date.now(),
          student,
          book,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14*86400000).toISOString().split('T')[0],
          returnDate: null,
          fineAmount: 0.00,
          status: 'ISSUED'
        };
        mockIssues.unshift(newIssue);
        if (book.availableCopies > 0) book.availableCopies -= 1;
        return newIssue;
      }
      if (endpoint.includes('/return') && method === 'POST') {
        const issue = mockIssues.find(i => i.id == body.issueId);
        if (issue) {
          issue.status = 'RETURNED';
          issue.returnDate = new Date().toISOString().split('T')[0];
          issue.book.availableCopies += 1;
        }
        return issue;
      }
      return mockIssues;
    }

    if (endpoint.includes('/fines')) {
      if (endpoint.includes('/pay') && method === 'PUT') {
        const id = parseInt(endpoint.split('/')[3]);
        const fine = mockFines.find(f => f.id === id);
        if (fine) {
          fine.paymentStatus = 'PAID';
          fine.paymentDate = new Date().toISOString();
        }
        return fine;
      }
      return mockFines;
    }

    if (endpoint.includes('/notifications')) {
      return mockNotifications;
    }

    return [];
  }
};
