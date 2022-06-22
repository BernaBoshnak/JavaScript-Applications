import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { homePage } from './views/home.js';
import { registerPage } from './views/register.js';

const main = document.getElementById('site-content');
setUserNav();

page('/', decorateContext, homePage);
page('/register', decorateContext, registerPage);

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    const token = sessionStorage.getItem('userId');

    if (token != null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
    } else {
        document.getElementById('guest').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
    }
}
