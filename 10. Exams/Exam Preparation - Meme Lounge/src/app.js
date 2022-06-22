import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { logout as apiLogout } from './api/data.js';
import { homePage } from './views/home.js';
import { registerPage } from './views/register.js';

const main = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', logout);
setUserNav();

page('/', decorateContext, guestUserOnly, homePage);
page('/register', decorateContext, registerPage);

page.start();

function guestUserOnly(ctx, next) {
    const token = sessionStorage.getItem('authToken');
    if (token != null) {
        return ctx.page.redirect('/catalog');
    }

    next();
}

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;

    next();
}

function setUserNav() {
    const token = sessionStorage.getItem('authToken');

    if (token != null) {
        document.querySelector('.user').style.display = '';
        document.querySelector('.guest').style.display = 'none';
    } else {
        document.querySelector('.user').style.display = 'none';
        document.querySelector('.guest').style.display = '';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}
