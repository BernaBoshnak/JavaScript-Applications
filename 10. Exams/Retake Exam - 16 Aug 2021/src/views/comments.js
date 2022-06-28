import { html } from '../../node_modules/lit-html/lit-html.js';

export const commentsTemplate = (isLogged, comments) => html`
<div class="details-comments">
    <h2>Comments:</h2>
        ${ isLogged && comments.length > 0 ? 
        comments.map(commentTemplate) : 
        html`<p class="no-comment">No comments.</p>`}
</div>`;

export const addCommentTemplate = (isLogged, isOwner, onSubmit) => html`
${ isLogged && !isOwner ? 
    html`<article class="create-comment">
        <label>Add new comment:</label>
        <form @submit=${onSubmit} class="form">
            <textarea name="comment" placeholder="Comment......"></textarea>
            <input class="btn submit" type="submit" value="Add Comment">
        </form>
    </article>` :
     ''}`;

const commentTemplate = (data) => html`
<ul>
    <li class="comment">
        <p>Content: ${data.comment}</p>
    </li>
</ul>`;
