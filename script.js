// Lấy danh sách sinh viên từ Local Storage (nếu có)
let students = JSON.parse(localStorage.getItem('students')) || [];

// Lấy các phần tử HTML cần sử dụng
const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const genderInput = document.getElementById('gender');
const searchInput = document.getElementById('search');
const studentList = document.getElementById('student-list');
const pagination = document.getElementById('pagination');

// Hàm thêm sinh viên mới
function addStudent(event) {
    event.preventDefault();
    
    const name = nameInput.value;
    const address = addressInput.value;
    const phone = phoneInput.value;
    const gender = genderInput.value;

    students.push({ name, address, phone, gender });
    alert('Thêm sinh viên thành công!');
    // Lưu danh sách sinh viên vào Local Storage
    localStorage.setItem('students', JSON.stringify(students));

    // Reset form
    studentForm.reset();

    // Hiển thị lại danh sách sinh viên
    showStudents();
}


// Hàm sửa thông tin sinh viên
function editStudent(index) {
    const student = students[index];

    // Tạo cửa sổ pop-up
    const popup = window.open('', '', 'width=400,height=400');
    popup.document.write(`
        <html>
        <head>
            <title>Sửa thông tin sinh viên</title>
        </head>
        <body>
            <h2>Sửa thông tin sinh viên</h2>
            <form id="edit-form">
                <label for="edit-name">Họ và tên:</label>
                <input type="text" id="edit-name" value="${student.name}" required><br>
                <label for="edit-address">Địa chỉ:</label>
                <input type="text" id="edit-address" value="${student.address}" required><br>
                <label for="edit-phone">Số điện thoại:</label>
                <input type="text" id="edit-phone" value="${student.phone}" required><br>
                <label for="edit-gender">Giới tính:</label>
                <select id="edit-gender" required>
                    <option value="Nam" ${student.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                    <option value="Nữ" ${student.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                </select><br>
                <button type="submit">Lưu</button>
            </form>
        </body>
        </html>
    `);

    const editForm = popup.document.getElementById('edit-form');

    // Xử lý sự kiện submit của form
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newName = popup.document.getElementById('edit-name').value;
        const newAddress = popup.document.getElementById('edit-address').value;
        const newPhone = popup.document.getElementById('edit-phone').value;
        const newGender = popup.document.getElementById('edit-gender').value;

        // Cập nhật thông tin của sinh viên
        student.name = newName;
        student.address = newAddress;
        student.phone = newPhone;
        student.gender = newGender;

        // Cập nhật Local Storage
        localStorage.setItem('students', JSON.stringify(students));

        // Đóng cửa sổ pop-up và hiển thị lại danh sách sinh viên
        popup.close();
        showStudents();
    });
}


// Hàm xoá sinh viên
function deleteStudent(index) {
    const confirmDelete = confirm('Bạn có chắc muốn xoá sinh viên này?');
    if (confirmDelete) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        showStudents();
    }
}

// Hàm tìm kiếm sinh viên
function searchStudents() {
    const query = searchInput.value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.address.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query) ||
        student.gender.toLowerCase().includes(query)
    );
    showStudents(filteredStudents);
}

// Hàm hiển thị danh sách sinh viên
function showStudents(data = students) {
    studentList.innerHTML = '';

    // Hiển thị danh sách sinh viên theo từng trang
    const page = parseInt(localStorage.getItem('currentPage')) || 1;
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    const totalPages = Math.ceil(data.length / 5);

    // Lưu trang hiện tại vào Local Storage
    localStorage.setItem('currentPage', page);

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        const student = data[i];

        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');
        studentItem.innerHTML = `
            <div class="info">
                <p><strong>Tên:</strong> ${student.name}</p>
                <p><strong>Địa chỉ:</strong> ${student.address}</p>
                <p><strong>Điện thoại:</strong> ${student.phone}</p>
                <p><strong>Giới tính:</strong> ${student.gender}</p>
            </div>
            <div class="actions">
                <button onclick="editStudent(${i})">Sửa</button>
                <button onclick="deleteStudent(${i})">Xoá</button>
            </div>
        `;

        studentList.appendChild(studentItem);
    }

    // Hiển thị phân trang
    pagination.innerHTML = `
        <span>Trang ${page}/${totalPages}</span>
        <button onclick="prevPage()" ${page === 1 ? 'disabled' : ''}>Trang trước</button>
        <button onclick="nextPage()" ${page === totalPages ? 'disabled' : ''}>Trang sau</button>
    `;
}

// Hàm chuyển đến trang trước
function prevPage() {
    const currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    if (currentPage > 1) {
        localStorage.setItem('currentPage', currentPage - 1);
        showStudents();
    }
}

// Hàm chuyển đến trang sau
function nextPage() {
    const currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const totalPages = Math.ceil(students.length / 5);
    if (currentPage < totalPages) {
        localStorage.setItem('currentPage', currentPage + 1);
        showStudents();
    }
}

// Thêm sự kiện input cho ô tìm kiếm
searchInput.addEventListener('input', searchStudents);

// Thêm sự kiện submit cho form
studentForm.addEventListener('submit', addStudent);

// Hiển thị danh sách sinh viên khi trang được tải
showStudents();
