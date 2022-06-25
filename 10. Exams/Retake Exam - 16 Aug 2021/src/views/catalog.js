import { html } from '../../node_modules/lit-html/lit-html.js';
import { getAllGames } from '../api/data.js';

const catalogTemplate = (games) => html`
<section id="catalog-page">
    <h1>All Games</h1>
    
    ${games.length == 0 ?
    html`<h3 class="no-articles">No articles yet</h3>` : 
    games.map(template)}

</section>`;

const template = (game) => html`
<div class="allGames">
    <div class="allGames-info">
        <img src=${game.imageUrl}>
        <h6>${game.category}</h6>
        <h2>${game.title}</h2>
        <a href="/details/${game._id}" class="details-button">Details</a>
    </div>
</div>`;

export async function catalogPage(ctx) {
    const games = await getAllGames();

    ctx.render(catalogTemplate(games));
}
