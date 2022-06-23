import { html } from '../../node_modules/lit-html/lit-html.js';
import { carTemplate } from './common/car.js';
import { search } from '../api/data.js';

const searchTemplate = (cars, onSearch, year) => html`
<section id="search-cars">
    <h1>Filter by year</h1>

    <div @click=${onSearch} class="container">
        <input id="search-input" type="text" name="search" placeholder="Enter desired production year" .value=${year || ''}>
        <button class="button-list">Search</button>
    </div>

    <h2>Results:</h2>
    <div class="listings">

        ${cars.length == 0 ? 
        html`<p class="no-cars"> No results.</p>` :
        cars.map(carTemplate)
    }
    </div>
</section>`;

export async function searchPage(ctx) {
    const year = Number(ctx.querystring.split('=')[1]);
    const cars = Number.isNaN(year) ? [] : await search(year);
    ctx.render(searchTemplate(cars, onSearch, year));

    function onSearch() {
        const query = Number(document.getElementById('search-input').value);
        if(Number.isNaN(query) == false) {
            ctx.page.redirect('/search?query=' + query);
        }else {
            return alert('Year must be a positive number!');
        }
    }
}
