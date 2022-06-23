import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { logout as apiLogout } from './api/data.js';
import { homePage } from './views/home.js';
import { registerPage } from './views/register.js';
import { loginPage } from './views/login.js';
import { createPage } from './views/create.js';
import { catalogPage } from './views/catalog.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';

const main = document.getElementById('main-content');
document.getElementById('logoutBtn').addEventListener('click', logout);
setUserNav();

page('/', decorateContext, homePage);
page('/register', decorateContext, registerPage);
page('/login', decorateContext, loginPage);
page('/create', decorateContext, createPage);
page('/catalog', decorateContext, catalogPage);
page('/details/:id', decorateContext, detailsPage);
page('/edit/:id', decorateContext, editPage);

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;

    next();
}

function setUserNav() {
    const email = sessionStorage.getItem('email');

    if (email != null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('user').style.display = 'inline-block';
    } else {
        document.getElementById('guest').style.display = 'inline-block';
        document.getElementById('user').style.display = 'none';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}
