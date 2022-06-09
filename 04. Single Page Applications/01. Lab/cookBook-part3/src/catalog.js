import { create } from './dom.js';
import { showDetails } from './details.js';

async function getRecipes() {
    const response = await fetch('http://localhost:3030/data/recipes');
    const recipes = await response.json();

    return recipes;
}

function createRecipePreview(recipe) {
    const result = create('article', { className: 'preview', onClick: () => showDetails(recipe._id) },
        create('div', { className: 'title' }, create('h2', {}, recipe.name)),
        create('div', { className: 'small' }, create('img', { src: recipe.img })),
    );

    return result;

}


let main;
let section;
let setActiveNav;

export function setupCatalog(mainTarget, sectionTarget, setActiveNavCb) {
    main = mainTarget;
    section = sectionTarget;
    setActiveNav = setActiveNavCb;
}

export async function showCatalog() {
    setActiveNav('catalogLink');
    section.innerHTML = '<p style="color: white">Loading...</p>';
    main.innerHTML = '';
    main.appendChild(section);

    const recipes = await getRecipes();
    const cards = recipes.map(createRecipePreview);

    const fragment = document.createDocumentFragment();
    cards.forEach(c => fragment.appendChild(c));

    section.innerHTML = '';
    section.appendChild(fragment);
}