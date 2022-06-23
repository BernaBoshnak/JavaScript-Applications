import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

const main = document.getElementById('main-content');

page('/', decorateContext);


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);

    next();
}
