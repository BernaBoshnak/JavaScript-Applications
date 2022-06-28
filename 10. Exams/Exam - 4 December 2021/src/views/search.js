import { html } from '../../node_modules/lit-html/lit-html.js';
import { search } from '../api/data.js';
import { albumTemplate } from './common/album.js';

const searchTemplate = (albums, userId, onSearch, name) => html`
<section id="searchPage">
    <h1>Search by Name</h1>

    <div class="search">
        <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name" .value=${name || ''}>
        <button @click=${onSearch} class="button-list">Search</button>
    </div>

    <h2>Results:</h2>

    <div class="search-result">

    ${albums.length == 0 ? 
    html`<p class="no-result">No result.</p>` : 
    albums.map(a => albumTemplate(a, userId))}
    
    </div>
</section>`;

export async function searchPage(ctx) {
    const userId = sessionStorage.getItem('userId');
    const name = ctx.querystring.split('=')[1];
    const albums = name ? await search(name) : [];
    ctx.render(searchTemplate(albums, userId , onSearch, name));

    function onSearch() {
        const query = document.getElementById('search-input').value;
        ctx.page.redirect('/search?query=' + query);
    }
}
