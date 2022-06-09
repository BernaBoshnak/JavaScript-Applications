function attachEvents() {
    document.querySelector('.load').addEventListener('click', getAllCatches);
    document.getElementById('catches').addEventListener('click', mainClick);

    const token = sessionStorage.getItem('userToker');
    const userId = sessionStorage.getItem('userId');

    if (token !== null) {
        document.getElementById('user').style.display = 'inline-block';

        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        document.getElementById('guest').style.display = 'inline-block';
    }

    if (token != null && userId != null) {
        document.querySelector('.add').disabled = false;
        document.getElementById('addForm').addEventListener('submit', addNewCatche)
    }
}

attachEvents();

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

async function getAllCatches() {
    const catches = await request('http://localhost:3030/data/catches');

    const rows = Object.values(catches).map(createRow).join('\n');
    document.getElementById('catches').innerHTML = rows;

    function createRow(catche) {
        const result = `
        <div class="catch">
            <input type="hidden" class="id" value="${catche._id}" />
            <label>Angler</label>
            <input type="text" class="angler" value="${catche.angler}" />
            <hr>
            <label>Weight</label>
            <input type="number" class="weight" value="${catche.weight}" />
            <hr>
            <label>Species</label>
            <input type="text" class="species" value="${catche.species}" />
            <hr>
            <label>Location</label>
            <input type="text" class="location" value="${catche.location}" />
            <hr>
            <label>Bait</label>
            <input type="text" class="bait" value="${catche.bait}" />
            <hr>
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${catche.captureTime}" />
            <hr>
            <button class="update">Update</button>
            <button class="delete">Delete</button>
        </div>`
        return result;
    }
}

async function createCatche(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const angler = formData.get('angler');
    const weight = Number(formData.get('weight'));
    const species = formData.get('species');
    const location = formData.get('location');
    const bait = formData.get('bait');
    const captureTime = Number(formData.get('captureTime'));

    if (angler && weight && species && location && bait && captureTime) {
        const token = sessionStorage.getItem('userToken');

        const catche = { angler, weight, species, location, bait, captureTime };

        await request('http://localhost:3030/data/catches', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
            body: JSON.stringify(catche)
        });
        e.target.reset();
    } else {
        return alert('All fields are required!');
    }
}

async function logout() {
    const token = sessionStorage.getItem('userToken');

    await request('http://localhost:3030/users/logout', {
        method: 'get',
        headers: { 'X-Authorization': token },
    });

    sessionStorage.removeItem('userToken');
    window.location.pathname = 'index.html';
}

async function updateCatche(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const id = formData.get('_id');
    console.log(id);
    const angler = formData.get('angler');
    const weight = Number(formData.get('weight'));
    const species = formData.get('species');
    const location = formData.get('location');
    const bait = formData.get('bait');
    const captureTime = Number(formData.get('captureTime'));

    const token = sessionStorage.getItem('userToken');

    const catche = { angler, weight, species, location, bait, captureTime };

    await request('http://localhost:3030/data/catches/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
        body: JSON.stringify(catche)
    });
    getAllCatches();
}

async function deleteCatche(id) {
    const token = sessionStorage.getItem('userToken');

    await request(': http://localhost:3030/data/catches /' + id, {
        method: 'delete',
        headers: { 'X-Authorization': token }
    });

    getAllCatches();
}

function mainClick(e) {
    if (e.target.className === 'update') {
        document.querySelector('.update').addEventListener('click', updateCatche);
    } else if (e.target.className === 'delete') {
        document.querySelector('.delete').addEventListener('click', deleteCatche);
    }
}