import { create } from '../dom.js';
import { getElementById, deleteIdeaById } from '../api/data.js';

function createCard(idea, isOwner, goTo) {
    const result = document.createDocumentFragment();
    result.appendChild(create('img', { className: 'det-img', src: idea.img }));
    result.appendChild(create('div', { className: 'desc' },
        create('h2', { className: 'display-5' }, idea.title),
        create('p', { className: 'infoType' }, 'Description:'),
        create('p', { className: 'idea-description' }, idea.description)
    ));
    if (isOwner) {
        result.appendChild(create('div', { className: 'text-center' },
            create('a', { className: 'btn detb', href: '', onClick: onDelete }, 'Delete')));
    }
    return result;

    async function onDelete(e) {
        e.preventDefault();
        const confirmed = confirm('Are you sure you want to delete this idea?');
        if (confirmed) {
            await deleteIdeaById(idea._id);
            goTo('dashboard');
        }
    }
}

export function setupDetails(section, nav) {
    return showDetails;

    async function showDetails(id) {
        section.innerHTML = '';

        const idea = await getElementById(id);
        const userId = sessionStorage.getItem('userId');

        const card = createCard(idea, userId === idea._ownerId, nav.goTo);
        section.appendChild(card);

        return section;
    }
}
