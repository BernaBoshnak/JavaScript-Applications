async function request(url, options) {
    const response = await fetch(url, options);
    if (response.ok != true) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }

    const data = await response.json();
    return data;
}

async function getAllStudents() {
    const students = await request('http://localhost:3030/jsonstore/collections/students');

    const rows = Object.values(students).map(createRow).join('\n');
    document.querySelector('tbody').innerHTML = rows;

    function createRow(student) {
        const result = `
        <tr>
            <th>${student.firstName}</th>
            <th>${student.lastName}</th>
            <th>${student.facultyNumber}</th>
            <th>${student.grade}</th>
        </tr>`
        return result;
    }
}

function start() {
    document.getElementById('form').addEventListener('submit', createStudents);

    getAllStudents();
}

start();

async function createStudents(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    const student = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        facultyNumber: formData.get('facultyNumber'),
        grade: Number(formData.get('grade')),
    }

    await request('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    });
    
    e.target.reset();
    getAllStudents();
}
