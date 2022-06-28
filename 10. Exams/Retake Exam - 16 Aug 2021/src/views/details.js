import { html } from '../../node_modules/lit-html/lit-html.js';
import { getGameById, deleteGame, getAllComments, createComment } from '../api/data.js';
import { commentsTemplate, addCommentTemplate } from './comments.js';

const detailsTemplate = (game, isOwner, onDelete, isLogged, comments, onSubmit) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">
        <div class="game-header">
            <img class="game-img" src=${game.imageUrl} />
            <h1>${game.title}</h1>
            <span class="levels">MaxLevel: ${game.maxLevel}</span>
            <p class="type">${game.category}</p>
        </div>

        <p class="text">${game.summary}</p>

        ${commentsTemplate(isLogged, comments)}

        ${isOwner ? 
            html`<div class="buttons">
            <a href="/edit/${game._id}" class="button">Edit</a>
            <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>
        </div>` : 
        ''}
    </div>

    ${ addCommentTemplate(isLogged, isOwner, onSubmit)}
</section>`;

export async function detailsPage(ctx) {
    const gameId = ctx.params.id;
    const game = await getGameById(gameId);
    const comments = await getAllComments(gameId);
    const isLogged = ctx.user;
    const isOwner = ctx.user && game._ownerId == ctx.user._id;

    ctx.render(detailsTemplate(game, isOwner, onDelete, isLogged, comments, onSubmit));

    async function onDelete() {
        const confirmed = confirm('Are you sure?');
        if (confirmed) {
            await deleteGame(gameId);
            ctx.page.redirect('/');
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get('comment');

        if (comment.length == 0) {
            return alert('Comment field is required!');
        }

        await createComment({comment});
        e.target.reset();
        ctx.page.redirect(`/details/${gameId}`);
    }
}
