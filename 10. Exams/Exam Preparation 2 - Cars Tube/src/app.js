import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { logout as apiLogout } from './api/data.js';
import { homePage } from './views/home.js';
import { registerPage } from './views/register.js';
import { loginPage } from './views/login.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';

const main = document.getElementById('site-content');
document.getElementById('logoutBtn').addEventListener('click', logout);
setUserNav();

page('/', decorateContext, guestUserOnly, homePage);
page('/register', decorateContext, registerPage);
page('/login', decorateContext, loginPage);
page('/all-listings', decorateContext, catalogPage);
page('/create', decorateContext, createPage);
page('/details/:id', decorateContext, detailsPage);
page('/edit/:id', decorateContext, editPage);


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
    const username = sessionStorage.getItem('username');

    if (username != null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('user-greeting').textContent = `Welcome, ${username}`;
    } else {
        document.getElementById('guest').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}
