import { html } from '../../node_modules/lit-html/lit-html.js';
import { getMemeById } from '../api/data.js';

const detailsTemplate = (meme, isOwner) => html`
<section id="meme-details">
    <h1>Meme Title: ${meme.title}</h1>
    <div class="meme-details">
        <div class="meme-img">
            <img alt="meme-alt" src="${meme.imageUrl}">
        </div>
        <div class="meme-description">
            <h2>Meme Description</h2>
            <p>${meme.description}</p>

            ${isOwner ? html`<a class="button warning" href="/edit/${meme._id}">Edit</a>
            <button class="button danger">Delete</button>` : ''}

        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const userId = sessionStorage.getItem('userId');
    const memeId = ctx.params.id;
    const meme = await getMemeById(memeId);
    const isOwner = userId === meme._ownerId;

    ctx.render(detailsTemplate(meme, isOwner));
}