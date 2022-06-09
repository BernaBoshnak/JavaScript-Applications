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

function attachEvents() {
    document.getElementById('btnCreate').addEventListener('click', async () => {
        const person = document.querySelector('input[name="person"]').value;
        const phone = document.querySelector('input[name="phone"]').value;

        if (person && phone) {
            const phonebook = {
                person,
                phone
            }
            await createPhonebook(phonebook);
        }

        document.querySelector('input[name="person"]').value = '';
        document.querySelector('input[name="phone"]').value = '';

        getPhonebooks();
    });

    document.getElementById('btnLoad').addEventListener('click', getPhonebooks);
}

attachEvents();

async function getPhonebooks() {
    const phonebook = await request('http://localhost:3030/jsonstore/phonebook');

    const phonebooks = Object.values(phonebook).map(createRow).join('\n');

    const phonebookElement = document.getElementById('phonebook');
    phonebookElement.innerHTML = phonebooks;

    phonebookElement.addEventListener('click', e => {
        if (e.target.className === 'deleteBtn') {
            const confirmed = confirm('Are you sure you want to delete this phonebook?');
            if (confirmed) {
                const phoneBookId = e.target.parentNode.dataset.id;
                deletePhonebook(phoneBookId);
            }
        }
    });
}

function createRow(e) {
    const result = `
    <li data-id="${e._id}">${e.person}: ${e.phone}
    <button class="deleteBtn">Delete</button>
    </li>
    `
    return result;
}

async function createPhonebook(phonebook) {
    await request('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phonebook)
    });
}

async function deletePhonebook(key) {
    await request('http://localhost:3030/jsonstore/phonebook/' + key, {
        method: 'delete'
    });
    getPhonebooks();
}
