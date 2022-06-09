import { logout as apiLogout } from './api/data.js';

import { setupHome } from './views/home.js';
import { setupLogin } from './views/login.js';
import { setupRegister } from './views/register.js';
import { setupDashboard } from './views/dashboard.js';
import { setupCreate } from './views/create.js';
import { setupDetails } from './views/details.js';

const views = {};
const links = {};

const main = document.querySelector('main');
const nav = document.querySelector('nav');

const navigation = {
    setUserNav,
    goTo
}

registerView('home', document.getElementById('home-page'), setupHome, 'homeLink');
registerView('login', document.getElementById('login-page'), setupLogin, 'loginLink');
registerView('register', document.getElementById('register-page'), setupRegister, 'registerLink');
registerView('dashboard', document.getElementById('dashboard-holder'), setupDashboard, 'dashboardLink');
registerView('create', document.getElementById('create-page'), setupCreate, 'createLink');
registerView('details', document.getElementById('details-page'), setupDetails);
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('views').remove();


setupNavigation();

goTo('home');

function registerView(name, section, setup, linkId) {
    const view = setup(section, navigation);

    views[name] = view;
    if (linkId) {
        links[linkId] = name;
    }
}

async function goTo(name, ...params) {
    main.innerHTML = '';
    const section = await views[name](...params);
    main.appendChild(section);
}

function setupNavigation() {
    setUserNav();

    nav.addEventListener('click', (e) => {
        if (e.target.tagName == 'A') {
            const viewName = links[e.target.id];
            if (viewName) {
                e.preventDefault();
                goTo(viewName);
            }
        }
    });
}

function setUserNav() {
    const token = sessionStorage.getItem('authToken');
    if (token !== null) {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'block');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'none');
    } else {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'none');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'block');
    }
}

async function logout() {
    await apiLogout();
}
