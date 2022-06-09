import { create } from '../dom.js';
import { getRecent } from '../api/data.js';

export function setupHome(section, navigation) {
    const container = section.querySelector('.recent-recipes');
    return showHome;

    async function showHome() {
        container.inneHTML = 'Loading&hellip;';

        const recipes = await getRecent();
        const cards = recipes.map(createRecipePreview);

        const fragment = document.createDocumentFragment();

        while (cards.length > 0) {
            fragment.appendChild(cards.shift());
            if (cards.length > 0) {
                fragment.appendChild(createSpacer());
            }
        }
        container.innerHTML = '';
        container.appendChild(fragment);

        return section;
    }

    function createRecipePreview(recipe) {
        const result = create('article', { className: 'recent', onClick: () => navigation.goTo('details', recipe._id) },
            create('div', { className: 'recent-preview' }, create('img', { src: recipe.img })),
            create('div', { className: 'recent-title' }, recipe.name),
        );

        return result;
    }

    function createSpacer() {
        return create('div', { className: 'recent-space' });
    }
}
