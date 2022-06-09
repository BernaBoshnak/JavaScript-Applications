import { setupHome, showHome } from './home.js';
import { setupCreate, showCreate } from './create.js';
import { setupDetails } from './details.js';
import { setupEdit } from './edit.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';


const main = document.querySelector('main');
const nav = document.querySelector('nav');

const links = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
    'createLink': showCreate
}

setupSection('home-page', setupHome);
setupSection('add-movie', setupCreate);
setupSection('movie-details', setupDetails);
setupSection('edit-movie', setupEdit);
setupSection('form-login', setupLogin);
setupSection('form-sign-up', setupRegister);

setupNavigation();

showHome();

function setupSection(sectionId, setup) {
    const section = document.getElementById(sectionId);
    setup(main, section);
}

function setupNavigation() {
    const email = sessionStorage.getItem('email');
    if (email !== null) {
        document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;
        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'block');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'none');
    } else {
        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'block');
    }

    document.getElementById('logoutBtn').addEventListener('click', logout);

    nav.addEventListener('click', (e) => {
        const view = links[e.target.id];
        if (typeof view === 'function') {
            e.preventDefault();
            view();
        }
    });

    document.getElementById('createLink').addEventListener('click', (e) => {
        e.preventDefault();
        showCreate();
    });
}

async function logout() {
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: { 'X-Authorization': sessionStorage.getItem('authToken') }
    });

    if (response.ok) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('email');

        [...document.querySelectorAll('nav .user')].forEach(l => l.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(l => l.style.display = 'block');

        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}