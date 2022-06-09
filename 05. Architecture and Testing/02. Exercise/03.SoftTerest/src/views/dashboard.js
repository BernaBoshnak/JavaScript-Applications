import { create } from '../dom.js';
import { getIdeas } from "../api/data.js";

function createIdeaPreview(idea) {
    const result = create('div', { className: 'card overflow-hidden current-card details' });
    result.style.width = '20rem';
    result.style.height = '18rem';
    result.innerHTML = `<div class="card-body">
    <p class="card-text">${idea.title}</p>
    </div>
    <img class="card-image" src="${idea.img}" alt="Card image cap">
    <a id="${idea._id}" class="btn" href="">Details</a>
    </div>`;
    return result;
}

export function setupDashboard(section, nav) {
    section.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
            e.preventDefault();
            const ideaId = e.target.id;
            nav.goTo('details', ideaId);
        }
    });

    section.innerHTML = '';
    return showDashboard;

    async function showDashboard() {
        const ideas = await getIdeas();
        if (ideas.length == 0) {
            section.innerHTML = '<h1>No ideas yet! Be the first one :)</h1>';
        } else {
            const cards = ideas.map(createIdeaPreview);
            cards.forEach(c => section.appendChild(c));
        }
        
        return section;
    }
}
