// Функція для отримання всіх студентів
const studentsTableBody = document.querySelector("#students-table tbody");
const getStudentsButton = document.getElementById("get-students-btn");
const studentForm = document.getElementById("add-student-form");
async function getStudents() {
    // твій код
    try {
        const gettingFetch = await fetch("http://localhost:3000/students");
        const students = await gettingFetch.json();
        renderStudents(students);
    } catch (error) {
        console.log("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u0456 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432", error);
    }
}
// Функція для відображення студентів у таблиці
function renderStudents(students) {
    // твій код
    studentsTableBody.innerHTML = makeStudentsMarkup(students);
}
const makeStudentsMarkup = (students)=>{
    return students.map((student)=>{
        return `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>${student.skills.join(", ")}</td>
        <td>${student.email}</td>
        <td>${student.isEnrolled ? "\u0422\u0430\u043A" : "\u041D\u0456"}</td>
        <td>
          <button class="edit-btn" data-id="${student.id}">\u{420}\u{435}\u{434}\u{430}\u{433}\u{443}\u{432}\u{430}\u{442}\u{438}</button>
          <button class="delete-btn" data-id="${student.id}">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
        </td>
      </tr>
    `;
    }).join("");
};
getStudentsButton.addEventListener("click", getStudents);
// Функція для додавання нового студента
async function addStudent(studentData) {
    // твій код
    try {
        const option = {
            method: "POST",
            body: JSON.stringify(studentData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        };
        const fetching = await fetch("http://localhost:3000/students", option);
        return fetching;
    } catch (error) {
        console.log("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0434\u0430\u0432\u0430\u043D\u043D\u0456 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430", error);
    }
}
studentForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const studentData = {
        name: form.name.value.trim(),
        age: Number(form.age.value),
        course: form.course.value.trim(),
        skill: form.skill.value.trim(),
        email: form.email.value.trim(),
        isEnrolled: form.isEnrolled.checked
    };
    addStudent(studentData).then(()=>{
        studentForm.reset();
        getStudents();
    }).catch(()=>{});
});
// Функція для оновлення студента
let editingId = null;
async function updateStudent(id) {
    // твій код
    try {
        const response = await fetch(`http://localhost:3000/students/${id}`);
        const { name, age, course, skills, email, isEnrolled } = await response.json();
        studentForm.name.value = name;
        studentForm.age.value = age;
        studentForm.course.value = course;
        studentForm.skills.value = skills.join(", ");
        studentForm.email.value = email;
        studentForm.isEnrolled.checked = isEnrolled;
        editingId = id;
    } catch (error) {
        console.log("\u043F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u0456 \u0434\u0430\u043D\u0438\u0445 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430", error);
    }
}
async function updateStudentData(id, studentData) {
    // твій код
    try {
        return await fetch(`http://localhost:3000/students/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
    } catch (error) {
        console.log("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0456 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432", error);
    }
}
studentForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const studentData = {
        name: studentForm.name.value.trim(),
        age: Number(studentForm.age.value),
        course: studentForm.course.value.trim(),
        skills: studentForm.skills.value.replace(/\s*,\s*/g, ",").split(","),
        email: studentForm.email.value.trim(),
        isEnrolled: studentForm.isEnrolled.checked
    };
    if (editingId) updateStudentData(editingId, studentData).then(()=>{
        studentForm.reset();
        getStudents();
    }).catch(()=>{});
    else addStudent(studentData).then(()=>{
        studentForm.reset();
        getStudents();
    }).catch(()=>{});
});
studentsTableBody.addEventListener("click", (event)=>{
    if (event.target.classList.contains("edit-btn")) {
        const id = event.target.dataset.id;
        updateStudent(id);
    }
});
// Функція для видалення студента
async function deleteStudent(id) {
    // твій код
    try {
        const fetching = await fetch(`http://localhost:3000/students/${id}`, {
            method: "DELETE"
        });
        return fetching;
    } catch (error) {
        console.log("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u0456 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430", error);
    }
}
studentsTableBody.addEventListener("click", (event)=>{
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.dataset.id;
        deleteStudent(id).then(()=>getStudents()).catch(()=>{});
    }
});

//# sourceMappingURL=hm_19.579125c3.js.map
