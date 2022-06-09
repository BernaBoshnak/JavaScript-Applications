import { create } from '../dom.js';
import { getRecipes, getRecipeCount } from '../api/data.js';

function createRecipePreview(recipe, goTo) {
    const result = create('article', { className: 'preview', onClick: () => goTo('details', recipe._id) },
        create('div', { className: 'title' }, create('h2', {}, recipe.name)),
        create('div', { className: 'small' }, create('img', { src: recipe.img })),
    );

    return result;
}

function createPager(page, pages, goTo) {
    const result = create('header', { className: 'section-title' }, `Page ${page} of ${pages}`);

    if (page > 1) {
        result.appendChild(create('a', { className: 'pager', href: '/catalog', onClick: (e) => changePage(e, page - 1) }, ' < Prev'));
    }

    if (page < pages) {
        result.appendChild(create('a', { className: 'pager', href: '/catalog', onClick: (e) => changePage(e, page + 1) }, ' Next >'));
    }

    return result;

    function changePage(e, newPage) {
        e.preventDefault();
        goTo('catalog', newPage);
    }
}

export function setupCatalog(section, navigation) {
    return showCatalog;

    async function showCatalog(page = 1) {
        section.innerHTML = 'Loading&hellip;';

        const recipes = await getRecipes(page);
        const recipeCount = await getRecipeCount();
        const pages = Math.ceil(recipeCount / 5);

        const cards = recipes.map(r => createRecipePreview(r, navigation.goTo));

        const fragment = document.createDocumentFragment();

        fragment.appendChild(createPager(page, pages, navigation.goTo));
        cards.forEach(c => fragment.appendChild(c));
        fragment.appendChild(createPager(page, pages, navigation.goTo));

        section.innerHTML = '';
        section.appendChild(fragment);

        return section;
    }
}
