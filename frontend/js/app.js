/* ==========================================================================
   Library Management System - Application Controller & Router (ES6)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentRole: 'ROLE_ADMIN',
  currentTheme: localStorage.getItem('theme') || 'light',
  viewMode: 'grid',

  monthlyChart: null,
  categoryChart: null,

  async init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupRoleSwitcher();
    this.setupModals();
    this.setupGlobalSearch();

    await this.loadDashboard();
    await this.loadBooks();
    await this.loadStudents();
    await this.loadIssues();
    await this.loadFines();

    this.showToast('Welcome to LibCore Management System', 'info');
  },

  // -----------------------------------------------------------------------
  // Theme Engine (Dark/Light Mode)
  // -----------------------------------------------------------------------
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcon();

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        this.showToast(`Switched to ${this.currentTheme} mode`, 'info');
      });
    }
  },

  updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = this.currentTheme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    }
  },

  // -----------------------------------------------------------------------
  // Navigation & View Routing
  // -----------------------------------------------------------------------
  setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.switchView(targetView);
      });
    });

    const toggleSidebarBtn = document.getElementById('sidebar-toggle');
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }
  },

  switchView(viewName) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-link[data-view="${viewName}"]`);
    if (activeLink) activeLink.classList.add('active');

    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) targetSection.classList.add('active');

    if (viewName === 'reports') this.loadReports();
  },

  // -----------------------------------------------------------------------
  // Role Switcher Simulation
  // -----------------------------------------------------------------------
  setupRoleSwitcher() {
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentRole = btn.getAttribute('data-role');
        const roleLabel = btn.innerText;
        document.getElementById('header-user-role').innerText = roleLabel;
        document.getElementById('header-user-name').innerText = `${roleLabel} User`;

        this.showToast(`Switched active view role to: ${roleLabel}`, 'success');
      });
    });
  },

  // -----------------------------------------------------------------------
  // Toast Notification System
  // -----------------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconClass = 'bi-info-circle-fill';
    if (type === 'success') iconClass = 'bi-check-circle-fill';
    if (type === 'warning') iconClass = 'bi-exclamation-triangle-fill';
    if (type === 'danger') iconClass = 'bi-x-circle-fill';

    toast.innerHTML = `
      <i class="bi ${iconClass}"></i>
      <span style="font-size: 13px; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // -----------------------------------------------------------------------
  // Modals Controller
  // -----------------------------------------------------------------------
  setupModals() {
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        this.closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Triggers
    const addBookBtn = document.getElementById('add-book-modal-trigger');
    if (addBookBtn) {
      addBookBtn.addEventListener('click', () => {
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
        document.getElementById('book-modal-title').innerHTML = '<i class="bi bi-book-fill"></i> Add New Book';
        this.openModal('book-modal');
      });
    }

    const quickAddBtn = document.getElementById('quick-add-book-btn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => this.switchView('books'));
    }

    const issueBtn = document.getElementById('issue-book-modal-trigger');
    if (issueBtn) {
      issueBtn.addEventListener('click', () => this.openIssueModal());
    }

    const quickQRBtn = document.getElementById('quick-qr-btn');
    if (quickQRBtn) {
      quickQRBtn.addEventListener('click', () => this.openIssueModal());
    }

    const addStudentBtn = document.getElementById('add-student-modal-trigger');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => {
        document.getElementById('student-form').reset();
        document.getElementById('student-id').value = '';
        document.getElementById('student-modal-title').innerHTML = '<i class="bi bi-person-plus-fill"></i> Register New Student';
        this.openModal('student-modal');
      });
    }

    // Forms Submissions
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
      bookForm.addEventListener('submit', (e) => this.handleSaveBook(e));
    }

    const issueForm = document.getElementById('issue-form');
    if (issueForm) {
      issueForm.addEventListener('submit', (e) => this.handleIssueBook(e));
    }

    const studentForm = document.getElementById('student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => this.handleSaveStudent(e));
    }
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  },

  // -----------------------------------------------------------------------
  // Dashboard Metrics & Charts
  // -----------------------------------------------------------------------
  async loadDashboard() {
    const stats = await Api.request('/dashboard/stats');
    if (!stats) return;

    document.getElementById('stat-total-books').innerText = stats.totalBooks;
    document.getElementById('stat-available-books').innerText = stats.availableBooks;
    document.getElementById('stat-borrowed-books').innerText = stats.borrowedBooks;
    document.getElementById('stat-overdue-books').innerText = stats.overdueBooks;
    document.getElementById('stat-students').innerText = stats.registeredStudents;
    document.getElementById('nav-book-count').innerText = stats.totalBooks;
    document.getElementById('nav-overdue-count').innerText = stats.overdueBooks;

    this.renderCharts(stats);
  },

  renderCharts(stats) {
    // 1. Monthly Borrowing Bar Chart
    const ctxMonthly = document.getElementById('monthlyChart');
    if (ctxMonthly) {
      if (this.monthlyChart) this.monthlyChart.destroy();
      this.monthlyChart = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
          labels: Object.keys(stats.monthlyBorrowingStats),
          datasets: [{
            label: 'Books Borrowed',
            data: Object.values(stats.monthlyBorrowingStats),
            backgroundColor: '#4f46e5',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 2. Category Pie Chart
    const ctxCategory = document.getElementById('categoryChart');
    if (ctxCategory) {
      if (this.categoryChart) this.categoryChart.destroy();
      this.categoryChart = new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
          labels: Object.keys(stats.categoryDistribution),
          datasets: [{
            data: Object.values(stats.categoryDistribution),
            backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },

  // -----------------------------------------------------------------------
  // Book Catalog Operations
  // -----------------------------------------------------------------------
  async loadBooks() {
    const books = await Api.request('/books');
    const container = document.getElementById('books-container');
    if (!container || !books) return;

    container.innerHTML = books.map(book => `
      <div class="book-card">
        <div class="book-cover-wrap">
          <img src="${book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}" alt="${book.title}">
          <span class="book-category-pill">${book.category}</span>
        </div>
        <div class="book-details">
          <h4 class="book-title">${book.title}</h4>
          <p class="book-author">by ${book.author}</p>
          <div class="book-meta">
            <span>ISBN: ${book.isbn}</span>
            <span class="status-badge ${book.availableCopies > 0 ? 'returned' : 'overdue'}">
              ${book.availableCopies} Left
            </span>
          </div>
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="App.viewBookDetails(${book.id})">
              <i class="bi bi-info-circle"></i> Details
            </button>
            <button class="btn btn-danger btn-sm" onclick="App.deleteBook(${book.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  async handleSaveBook(e) {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const dto = {
      title: document.getElementById('book-title').value,
      author: document.getElementById('book-author').value,
      isbn: document.getElementById('book-isbn').value,
      category: document.getElementById('book-category').value,
      publisher: document.getElementById('book-publisher').value,
      shelfNumber: document.getElementById('book-shelf').value,
      totalCopies: parseInt(document.getElementById('book-total-copies').value),
      edition: document.getElementById('book-edition').value,
      coverImage: document.getElementById('book-cover-url').value,
      description: document.getElementById('book-description').value
    };

    const endpoint = id ? `/books/${id}` : '/books';
    const method = id ? 'PUT' : 'POST';

    await Api.request(endpoint, { method, body: JSON.stringify(dto) });
    this.closeModal('book-modal');
    this.showToast(`Book '${dto.title}' saved successfully!`, 'success');
    await this.loadBooks();
    await this.loadDashboard();
  },

  async viewBookDetails(id) {
    const books = await Api.request('/books');
    const book = books.find(b => b.id === id);
    if (!book) return;

    document.getElementById('detail-book-title').innerText = book.title;
    document.getElementById('detail-book-author').innerText = book.author;
    document.getElementById('detail-book-isbn').innerText = book.isbn;
    document.getElementById('detail-book-category').innerText = book.category;
    document.getElementById('detail-book-shelf').innerText = book.shelfNumber || 'General Shelf';
    document.getElementById('detail-book-available').innerText = `${book.availableCopies} of ${book.totalCopies} copies available`;
    document.getElementById('detail-book-desc').innerText = book.description || 'No description provided.';
    document.getElementById('detail-book-img').src = book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';

    const qrContainer = document.getElementById('qr-code-canvas');
    if (qrContainer) {
      qrContainer.innerHTML = `
        <div style="text-align:center;">
          <i class="bi bi-qr-code" style="font-size: 64px; color: var(--primary);"></i>
          <div style="font-size: 9px; font-weight: bold; margin-top: 4px;">ISBN: ${book.isbn}</div>
        </div>
      `;
    }

    const readBtn = document.getElementById('read-ebook-btn');
    if (readBtn) {
      readBtn.onclick = () => {
        window.open(book.ebookUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
      };
    }

    this.openModal('book-detail-modal');
  },

  async deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      await Api.request(`/books/${id}`, { method: 'DELETE' });
      this.showToast('Book deleted successfully', 'warning');
      await this.loadBooks();
      await this.loadDashboard();
    }
  },

  // -----------------------------------------------------------------------
  // Student Directory
  // -----------------------------------------------------------------------
  async handleSaveStudent(e) {
    e.preventDefault();
    const dto = {
      name: document.getElementById('student-name').value,
      email: document.getElementById('student-email').value,
      phone: document.getElementById('student-phone').value,
      department: document.getElementById('student-department').value,
      yearOfStudy: document.getElementById('student-year').value,
      address: document.getElementById('student-address').value,
    };
    await Api.request('/students', { method: 'POST', body: JSON.stringify(dto) });
    this.closeModal('student-modal');
    this.showToast(`Student '${dto.name}' registered successfully!`, 'success');
    await this.loadStudents();
    await this.loadDashboard();
  },

  async loadStudents() {
    const students = await Api.request('/students');
    const tbody = document.getElementById('students-table-body');
    if (!tbody || !students) return;

    tbody.innerHTML = students.map(s => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${s.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" style="width:36px; height:36px; border-radius:50%;">
            <div>
              <div style="font-weight:600;">${s.name}</div>
              <div style="font-size:11px; color:var(--text-muted);">ID: #STU-${s.id}</div>
            </div>
          </div>
        </td>
        <td>${s.email}</td>
        <td>${s.phone || 'N/A'}</td>
        <td><span class="status-badge issued">${s.department || 'General'}</span></td>
        <td>${s.yearOfStudy || 'N/A'}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="App.showToast('Student profile active', 'info')"><i class="bi bi-pencil"></i></button>
        </td>
      </tr>
    `).join('');
  },

  // -----------------------------------------------------------------------
  // Book Issue & Return System
  // -----------------------------------------------------------------------
  async loadIssues() {
    const issues = await Api.request('/issues');
    const tbody = document.getElementById('issues-table-body');
    const recentTbody = document.getElementById('recent-issues-table');

    if (!issues) return;

    const rows = issues.map(i => `
      <tr>
        <td>#ISSUE-${i.id}</td>
        <td><strong>${i.student ? i.student.name : 'Unknown'}</strong></td>
        <td>${i.book ? i.book.title : 'Unknown'}</td>
        <td>${i.issueDate}</td>
        <td>${i.dueDate}</td>
        <td style="color:${i.fineAmount > 0 ? 'var(--danger)' : 'inherit'}; font-weight:600;">
          $${i.fineAmount ? i.fineAmount.toFixed(2) : '0.00'}
        </td>
        <td>
          <span class="status-badge ${i.status.toLowerCase()}">${i.status}</span>
        </td>
        <td>
          ${i.status !== 'RETURNED' ? `
            <button class="btn btn-primary btn-sm" onclick="App.returnBook(${i.id})"><i class="bi bi-box-arrow-in-left"></i> Return</button>
          ` : '<span style="font-size:12px; color:var(--text-muted);">Completed</span>'}
        </td>
      </tr>
    `).join('');

    if (tbody) tbody.innerHTML = rows;
    if (recentTbody) recentTbody.innerHTML = rows;
  },

  async openIssueModal() {
    const students = await Api.request('/students');
    const books = await Api.request('/books');

    const studentSelect = document.getElementById('issue-student-select');
    const bookSelect = document.getElementById('issue-book-select');

    if (studentSelect) {
      studentSelect.innerHTML = students.map(s => `<option value="${s.id}">${s.name} (${s.email})</option>`).join('');
    }

    if (bookSelect) {
      bookSelect.innerHTML = books.filter(b => b.availableCopies > 0).map(b => `<option value="${b.id}">${b.title} [Copies Left: ${b.availableCopies}]</option>`).join('');
    }

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    document.getElementById('issue-date').value = today;
    document.getElementById('issue-due-date').value = dueDate;

    this.openModal('issue-modal');
  },

  async handleIssueBook(e) {
    e.preventDefault();
    const dto = {
      studentId: parseInt(document.getElementById('issue-student-select').value),
      bookId: parseInt(document.getElementById('issue-book-select').value),
      issueDate: document.getElementById('issue-date').value,
      dueDate: document.getElementById('issue-due-date').value
    };

    await Api.request('/issues/issue', { method: 'POST', body: JSON.stringify(dto) });
    this.closeModal('issue-modal');
    this.showToast('Book issued successfully!', 'success');
    await this.loadIssues();
    await this.loadBooks();
    await this.loadDashboard();
  },

  async returnBook(issueId) {
    if (confirm('Process return for this borrowed book?')) {
      await Api.request('/issues/return', { method: 'POST', body: JSON.stringify({ issueId }) });
      this.showToast('Book returned and inventory updated!', 'success');
      await this.loadIssues();
      await this.loadBooks();
      await this.loadFines();
      await this.loadDashboard();
    }
  },

  // -----------------------------------------------------------------------
  // Fine Management
  // -----------------------------------------------------------------------
  async loadFines() {
    const fines = await Api.request('/fines');
    const tbody = document.getElementById('fines-table-body');
    if (!tbody || !fines) return;

    tbody.innerHTML = fines.map(f => `
      <tr>
        <td>#FINE-${f.id}</td>
        <td><strong>${f.student ? f.student.name : 'Unknown'}</strong></td>
        <td>${f.bookIssue && f.bookIssue.book ? f.bookIssue.book.title : 'Overdue Book'}</td>
        <td style="font-weight:700; color:var(--danger);">$${f.amount.toFixed(2)}</td>
        <td><span class="status-badge ${f.paymentStatus.toLowerCase()}">${f.paymentStatus}</span></td>
        <td>
          ${f.paymentStatus === 'UNPAID' ? `
            <button class="btn btn-outline btn-sm" onclick="App.payFine(${f.id})"><i class="bi bi-check2-circle"></i> Mark Paid</button>
          ` : '<span style="font-size:12px; color:var(--success); font-weight:600;"><i class="bi bi-check-all"></i> Settled</span>'}
        </td>
      </tr>
    `).join('');
  },

  async payFine(id) {
    await Api.request(`/fines/${id}/pay`, { method: 'PUT' });
    this.showToast('Fine payment registered successfully!', 'success');
    await this.loadFines();
    await this.loadDashboard();
  },

  // -----------------------------------------------------------------------
  // Global Search Filter
  // -----------------------------------------------------------------------
  setupGlobalSearch() {
    const input = document.getElementById('global-search');
    if (input) {
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const q = input.value.trim();
          if (q) {
            this.switchView('books');
            document.getElementById('book-search-input').value = q;
            this.filterBooks(q);
          }
        }
      });
    }

    const bookSearch = document.getElementById('book-search-input');
    if (bookSearch) {
      bookSearch.addEventListener('input', (e) => this.filterBooks(e.target.value));
    }
  },

  filterBooks(q) {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(q.toLowerCase()) ? 'flex' : 'none';
    });
  },

  // -----------------------------------------------------------------------
  // Reports & PDF/CSV Exports
  // -----------------------------------------------------------------------
  async loadReports() {
    const head = document.getElementById('report-table-head');
    const body = document.getElementById('report-table-body');
    const issues = await Api.request('/issues');

    if (!head || !body) return;

    head.innerHTML = `
      <th>Issue ID</th>
      <th>Student</th>
      <th>Book Title</th>
      <th>Issue Date</th>
      <th>Due Date</th>
      <th>Fine</th>
      <th>Status</th>
    `;

    body.innerHTML = issues.map(i => `
      <tr>
        <td>#ISSUE-${i.id}</td>
        <td>${i.student ? i.student.name : 'N/A'}</td>
        <td>${i.book ? i.book.title : 'N/A'}</td>
        <td>${i.issueDate}</td>
        <td>${i.dueDate}</td>
        <td>$${i.fineAmount ? i.fineAmount.toFixed(2) : '0.00'}</td>
        <td>${i.status}</td>
      </tr>
    `).join('');

    const pdfBtn = document.getElementById('export-pdf-btn');
    if (pdfBtn) {
      pdfBtn.onclick = () => window.print();
    }

    const excelBtn = document.getElementById('export-excel-btn');
    if (excelBtn) {
      excelBtn.onclick = () => this.exportTableToCSV('library_report.csv');
    }
  },

  exportTableToCSV(filename) {
    const table = document.getElementById('report-data-table');
    let csv = [];
    for (let row of table.rows) {
      let cols = Array.from(row.cells).map(cell => `"${cell.innerText.replace(/"/g, '""')}"`);
      csv.push(cols.join(','));
    }
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    this.showToast('Report CSV exported successfully!', 'success');
  }
};
