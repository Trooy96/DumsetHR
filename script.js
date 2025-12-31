let employees = JSON.parse(localStorage.getItem('employees')) || [];

// Sample data if empty
if (employees.length === 0) {
  employees = [
    { id: 1, name: "John Mwape", email: "john@company.com", phone: "+260971234567", department: "IT", salary: 8500, joinDate: "2023-01-15", photo: "images/avatar1.jpg" },
    { id: 2, name: "Mary Zulu", email: "mary@company.com", phone: "+260977890123", department: "HR", salary: 7000, joinDate: "2024-03-20", photo: "images/avatar2.jpg" },
    { id: 3, name: "Peter Banda", email: "peter@company.com", phone: "+260976543210", department: "Finance", salary: 9500, joinDate: "2022-11-10", photo: "images/avatar3.jpg" },
    { id: 4, name: "Sarah Chanda", email: "sarah@company.com", department: "Marketing", salary: 7800, joinDate: "2023-06-05", photo: "images/avatar4.jpg" },
    { id: 5, name: "David Phiri", email: "david@company.com", department: "Operations", salary: 6500, joinDate: "2024-09-12", photo: "images/avatar5.jpg" },
    { id: 6, name: "Linda Tembo", email: "linda@company.com", department: "IT", salary: 9200, joinDate: "2023-08-20", photo: "images/avatar6.jpg" }
  ];
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Render grouped employees
function renderEmployees(search = '') {
  const container = document.getElementById('departments-list');
  if (!container) return;

  const filtered = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  filtered.forEach(emp => {
    const dept = emp.department || 'Other';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(emp);
  });

  container.innerHTML = '';

  if (Object.keys(grouped).length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#777; padding:50px;">No employees found.</p>';
    return;
  }

  Object.keys(grouped).sort().forEach(dept => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'department-group';
    groupDiv.innerHTML = `
      <div class="department-header">
        <span>${dept} Department (${grouped[dept].length})</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="employee-cards">
        ${grouped[dept].map(emp => `
          <div class="employee-card">
            <img src="${emp.photo || 'images/default-avatar.jpg'}" alt="${emp.name}">
            <h3 onclick="viewProfile(${emp.id})" style="cursor:pointer; color:#3498db;">${emp.name}</h3>
            <p><strong>Email:</strong> ${emp.email}</p>
            <p><strong>Phone:</strong> ${emp.phone || 'N/A'}</p>
            <p><strong>Salary:</strong> K${parseFloat(emp.salary).toLocaleString()}</p>
            <p><strong>Joined:</strong> ${emp.joinDate}</p>
            <div class="actions">
              <button class="action-btn edit" onclick="event.stopPropagation(); editEmployee(${emp.id})"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete" onclick="event.stopPropagation(); deleteEmployee(${emp.id})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const header = groupDiv.querySelector('.department-header');
    const cards = groupDiv.querySelector('.employee-cards');
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      cards.style.display = cards.style.display === 'none' ? 'grid' : 'none';
    });

    container.appendChild(groupDiv);
  });
}

// View profile
function viewProfile(id) {
  localStorage.setItem('viewEmployeeId', id);
  window.location.href = 'profile.html';
}

// Modal functions
function openModal(id = null) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  if (id) {
    const emp = employees.find(e => e.id === id);
    title.textContent = "Edit Employee";
    document.getElementById('edit-id').value = emp.id;
    document.getElementById('name').value = emp.name;
    document.getElementById('email').value = emp.email;
    document.getElementById('phone').value = emp.phone || '';
    document.getElementById('department').value = emp.department;
    document.getElementById('salary').value = emp.salary;
    document.getElementById('join-date').value = emp.joinDate;
  } else {
    title.textContent = "Add New Employee";
    document.getElementById('employee-form').reset();
    document.getElementById('edit-id').value = '';
  }
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function saveEmployee(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const employee = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    department: document.getElementById('department').value,
    salary: document.getElementById('salary').value,
    joinDate: document.getElementById('join-date').value,
    photo: "images/default-avatar.jpg"
  };

  if (id) {
    const index = employees.findIndex(e => e.id === parseInt(id));
    employee.id = parseInt(id);
    employees[index] = employee;
  } else {
    employee.id = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    employees.push(employee);
  }

  localStorage.setItem('employees', JSON.stringify(employees));
  closeModal();
  renderEmployees();
}

function deleteEmployee(id) {
  if (confirm("Delete this employee?")) {
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
  }
}

function editEmployee(id) {
  openModal(id);
}

// Search
if (document.getElementById('search')) {
  document.getElementById('search').addEventListener('input', (e) => renderEmployees(e.target.value));
}

// Form
if (document.getElementById('employee-form')) {
  document.getElementById('employee-form').addEventListener('submit', saveEmployee);
}

// Initial render
renderEmployees();

// Leave Requests
let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

// Render leave requests (admin)
if (document.getElementById('leave-list')) {
  const list = document.getElementById('leave-list');
  list.innerHTML = '';
  if (leaveRequests.length === 0) {
    list.innerHTML = '<tr><td colspan="5">No requests yet</td></tr>';
  } else {
    leaveRequests.forEach(req => {
      const emp = employees.find(e => e.id === req.empId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp ? emp.name : 'Unknown'}</td>
        <td>${req.type}</td>
        <td>${req.from} - ${req.to}</td>
        <td>${req.status}</td>
        <td>
          <button onclick="approveLeave(${req.id})">Approve</button>
          <button onclick="denyLeave(${req.id})">Deny</button>
        </td>
      `;
      list.appendChild(tr);
    });
  }
}

function requestLeave() {
  const empId = parseInt(localStorage.getItem('loggedInUser'));
  const type = prompt("Leave type (Annual/Sick/etc)");
  const from = prompt("From date (YYYY-MM-DD)");
  const to = prompt("To date (YYYY-MM-DD)");
  if (type && from && to) {
    leaveRequests.push({
      id: leaveRequests.length + 1,
      empId, type, from, to, status: "Pending"
    });
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    alert("Leave requested!");
  }
}

function approveLeave(id) {
  const req = leaveRequests.find(r => r.id === id);
  req.status = "Approved";
  localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  location.reload();
}

function denyLeave(id) {
  const req = leaveRequests.find(r => r.id === id);
  req.status = "Denied";
  localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  location.reload();
}

// Attendance
let attendanceLog = JSON.parse(localStorage.getItem('attendanceLog')) || {};

function clockInOut() {
  const empId = parseInt(localStorage.getItem('loggedInUser'));
  const today = new Date().toISOString().split('T')[0];
  if (!attendanceLog[today]) attendanceLog[today] = {};
  const time = new Date().toLocaleTimeString();
  if (attendanceLog[today][empId]) {
    alert("Clocked out at " + time);
  } else {
    attendanceLog[today][empId] = time;
    alert("Clocked in at " + time);
  }
  localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
}

// Fixed Render today's attendance (admin page)
if (document.getElementById('attendance-list')) {
  const today = new Date().toISOString().split('T')[0];
  const div = document.getElementById('attendance-list');
  div.innerHTML = `<h2>Attendance Record - ${today}</h2><hr>`;
  
  if (!attendanceLog[today]) {
    div.innerHTML += '<p>No attendance recorded today yet.</p>';
  } else {
    employees.forEach(emp => {
      const record = attendanceLog[today][emp.id];
      let status = '<span style="color:#e74c3c;">Absent</span>';
      if (record) {
        if (record.out) {
          status = `<span style="color:#27ae60;">Present (In: ${record.in} | Out: ${record.out})</span>`;
        } else {
          status = `<span style="color:#f39c12;">Present (In: ${record.in} | Still at work)</span>`;
        }
      }
      div.innerHTML += `<p><strong>${emp.name}</strong> (${emp.department}) — ${status}</p>`;
    });
  }
}

// Payroll payslip
if (document.getElementById('pay-emp')) {
  const select = document.getElementById('pay-emp');
  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
}

function generatePayslip() {
  const id = document.getElementById('pay-emp').value;
  const emp = employees.find(e => e.id == id);
  const gross = emp.salary;
  const tax = gross * 0.2;
  const net = gross - tax;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("NsamaHR Payslip - December 2025", 20, 20);
  doc.setFontSize(12);
  doc.text(`Employee: ${emp.name}`, 20, 40);
  doc.text(`Department: ${emp.department}`, 20, 50);
  doc.text(`Gross: K${gross.toLocaleString()}`, 20, 70);
  doc.text(`Tax (20%): K${tax.toLocaleString()}`, 20, 80);
  doc.text(`Net Pay: K${net.toLocaleString()}`, 20, 100);
  doc.save(`${emp.name.replace(' ', '_')}_payslip.pdf`);
}

// Login function
function login() {
  const email = document.getElementById('login-email').value.trim();
  const emp = employees.find(e => e.email === email);
  if (emp) {
    localStorage.setItem('loggedInUser', emp.id);
    window.location.href = 'selfservice.html';
  } else {
    alert("Email not found. Use an email from the employees list.");
  }
}

// Load self-service
if (document.getElementById('ss-name')) {
  const id = parseInt(localStorage.getItem('loggedInUser'));
  const emp = employees.find(e => e.id === id);
  if (emp) {
    document.getElementById('ss-name').textContent = emp.name;
    document.getElementById('ss-dept').textContent = emp.department;
    document.getElementById('ss-salary').textContent = parseFloat(emp.salary).toLocaleString();
    document.getElementById('ss-join').textContent = emp.joinDate;
  } else {
    window.location.href = 'login.html';
  }
}

// Add button for leave request in self-service
function openLeaveModal() {
  requestLeave();
}

// Add clock button in self-service
function clockInOut() {
  clockInOut(); // same function
}

// Login
function login() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const emp = employees.find(e => e.email.toLowerCase() === email);
  if (emp) {
    localStorage.setItem('loggedInUser', emp.id);
    window.location.href = 'selfservice.html';
  } else {
    alert("Email not found. Try one from the employees list (e.g. john@company.com)");
  }
}

// Load self-service
if (document.getElementById('ss-name')) {
  const id = parseInt(localStorage.getItem('loggedInUser'));
  const emp = employees.find(e => e.id === id);
  if (emp) {
    document.getElementById('ss-name').textContent = emp.name;
    document.getElementById('ss-dept').textContent = emp.department;
    document.getElementById('ss-salary').textContent = parseFloat(emp.salary).toLocaleString();
    document.getElementById('ss-join').textContent = emp.joinDate;
  } else {
    alert("Please login first");
    window.location.href = 'login.html';
  }
}

// Request leave from self-service
function requestLeave() {
  const type = prompt("Leave type (Annual, Sick, etc.):");
  const from = prompt("From date (YYYY-MM-DD):");
  const to = prompt("To date (YYYY-MM-DD):");
  if (type && from && to) {
    leaveRequests.push({
      id: leaveRequests.length ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 1,
      empId: parseInt(localStorage.getItem('loggedInUser')),
      type, from, to, status: "Pending"
    });
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    alert("Leave request submitted!");
  }
}

// Clock in/out
function clockInOut() {
  const today = new Date().toISOString().split('T')[0];
  if (!attendanceLog[today]) attendanceLog[today] = {};
  const empId = parseInt(localStorage.getItem('loggedInUser'));
  const time = new Date().toLocaleTimeString();
  if (attendanceLog[today][empId]) {
    alert("You clocked out at " + time);
  } else {
    attendanceLog[today][empId] = time;
    alert("You clocked in at " + time);
  }
  localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
}

// Render leave requests on leave.html
if (document.getElementById('leave-list')) {
  renderLeaveRequests();
}

function renderLeaveRequests() {
  const tbody = document.getElementById('leave-list');
  tbody.innerHTML = '';
  if (leaveRequests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No pending requests</td></tr>';
  } else {
    leaveRequests.forEach(req => {
      const emp = employees.find(e => e.id === req.empId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp ? emp.name : 'Unknown'}</td>
        <td>${req.type}</td>
        <td>${req.from} → ${req.to}</td>
        <td><strong>${req.status}</strong></td>
        <td>
          <button class="btn small primary" onclick="approveLeave(${req.id})">Approve</button>
          <button class="btn small secondary" onclick="denyLeave(${req.id})">Deny</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function approveLeave(id) {
  const req = leaveRequests.find(r => r.id === id);
  if (req) req.status = "Approved";
  localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  renderLeaveRequests();
}

function denyLeave(id) {
  const req = leaveRequests.find(r => r.id === id);
  if (req) req.status = "Denied";
  localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  renderLeaveRequests();
}

// Render attendance on attendance.html
if (document.getElementById('attendance-list')) {
  const today = new Date().toISOString().split('T')[0];
  const div = document.getElementById('attendance-list');
  div.innerHTML = `<h2>Attendance - ${today}</h2>`;
  employees.forEach(emp => {
    const time = attendanceLog[today] && attendanceLog[today][emp.id];
    const status = time ? `Present (In: ${time})` : 'Absent';
    div.innerHTML += `<p><strong>${emp.name}</strong> — ${status}</p>`;
  });
}

// Payroll payslip
if (document.getElementById('pay-emp')) {
  const select = document.getElementById('pay-emp');
  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name + ' (' + emp.department + ')';
    select.appendChild(opt);
  });
}

function generatePayslip() {
  const id = document.getElementById('pay-emp')?.value;
  if (!id) return alert("Select an employee");
  const emp = employees.find(e => e.id == id);
  const gross = emp.salary;
  const tax = gross * 0.2;
  const net = gross - tax;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("NsamaHR Payslip", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Employee: ${emp.name}`, 20, 40);
  doc.text(`Department: ${emp.department}`, 20, 50);
  doc.text(`Month: December 2025`, 20, 60);
  doc.text(`Gross Salary: K${gross.toLocaleString()}`, 20, 80);
  doc.text(`Tax (20%): -K${tax.toLocaleString()}`, 20, 90);
  doc.text(`Net Pay: K${net.toLocaleString()}`, 20, 110);
  doc.save(`${emp.name.replace(' ', '_')}_payslip_Dec2025.pdf`);
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

// Performance Reviews
let performanceReviews = JSON.parse(localStorage.getItem('performanceReviews')) || {};

// Load employee select and review
if (document.getElementById('review-emp')) {
  const select = document.getElementById('review-emp');
  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => showReview(select.value));
}

function openReviewModal() {
  const empId = document.getElementById('review-emp').value;
  if (!empId) return alert("Select an employee first");
  const emp = employees.find(e => e.id == empId);
  document.getElementById('review-emp-id').value = empId;
  document.getElementById('review-emp-name').textContent = emp.name;
  const existing = performanceReviews[empId];
  if (existing) {
    document.getElementById('rating').value = existing.rating;
    document.getElementById('comments').value = existing.comments;
  } else {
    document.getElementById('review-form').reset();
  }
  document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
  document.getElementById('review-modal').style.display = 'none';
}

function showReview(empId) {
  const div = document.getElementById('review-display');
  const review = performanceReviews[empId];
  const emp = employees.find(e => e.id == empId);
  if (review) {
    div.innerHTML = `
      <h3>Latest Review for ${emp.name}</h3>
      <p><strong>Rating:</strong> ${review.rating}/5</p>
      <p><strong>Comments:</strong></p>
      <p>${review.comments.replace(/\n/g, '<br>')}</p>
    `;
  } else {
    div.innerHTML = `<p>No review yet for ${emp.name}</p>`;
  }
}

document.getElementById('review-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const empId = document.getElementById('review-emp-id').value;
  performanceReviews[empId] = {
    rating: document.getElementById('rating').value,
    comments: document.getElementById('comments').value
  };
  localStorage.setItem('performanceReviews', JSON.stringify(performanceReviews));
  closeReviewModal();
  showReview(empId);
});

// Recruitment
let candidates = JSON.parse(localStorage.getItem('candidates')) || [];

if (document.getElementById('candidate-list')) {
  renderCandidates();
}

function renderCandidates() {
  const tbody = document.getElementById('candidate-list');
  tbody.innerHTML = '';
  candidates.forEach(cand => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cand.name}</td>
      <td>${cand.position}</td>
      <td>${cand.applied}</td>
      <td><strong>${cand.status}</strong></td>
      <td>
        <button onclick="editCandidate(${cand.id})">Edit</button>
        <button onclick="deleteCandidate(${cand.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openCandidateModal(id = null) {
  const modal = document.getElementById('candidate-modal');
  const title = document.getElementById('candidate-title');
  if (id) {
    const cand = candidates.find(c => c.id === id);
    title.textContent = "Edit Applicant";
    document.getElementById('candidate-id').value = cand.id;
    document.getElementById('candidate-name').value = cand.name;
    document.getElementById('candidate-position').value = cand.position;
    document.getElementById('candidate-applied').value = cand.applied;
    document.getElementById('candidate-status').value = cand.status;
  } else {
    title.textContent = "Add New Applicant";
    document.getElementById('candidate-form').reset();
    document.getElementById('candidate-id').value = '';
  }
  modal.style.display = 'flex';
}

function closeCandidateModal() {
  document.getElementById('candidate-modal').style.display = 'none';
}

document.getElementById('candidate-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('candidate-id').value;
  const candidate = {
    name: document.getElementById('candidate-name').value,
    position: document.getElementById('candidate-position').value,
    applied: document.getElementById('candidate-applied').value,
    status: document.getElementById('candidate-status').value
  };
  if (id) {
    const index = candidates.findIndex(c => c.id == id);
    candidate.id = parseInt(id);
    candidates[index] = candidate;
  } else {
    candidate.id = candidates.length ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
    candidates.push(candidate);
  }
  localStorage.setItem('candidates', JSON.stringify(candidates));
  closeCandidateModal();
  renderCandidates();
});

function deleteCandidate(id) {
  if (confirm("Delete this applicant?")) {
    candidates = candidates.filter(c => c.id !== id);
    localStorage.setItem('candidates', JSON.stringify(candidates));
    renderCandidates();
  }
}

function editCandidate(id) {
  openCandidateModal(id);
}