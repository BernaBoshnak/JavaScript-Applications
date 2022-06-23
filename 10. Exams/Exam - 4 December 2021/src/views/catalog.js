import { html } from '../../node_modules/lit-html/lit-html.js';
import { getAllAlbums } from '../api/data.js';
import { albumTemplate }from './common/album.js';

const catalogTemplate = (albums) => html`
<section id="catalogPage">
    <h1>All Albums</h1>

   ${albums.length == 0 ? 
   html`<p>No Albums in Catalog!</p>` :
   albums.map(albumTemplate)}

</section>`;

export async function catalogPage(ctx) {
    const albums = await getAllAlbums();

    ctx.render(catalogTemplate(albums));
}
