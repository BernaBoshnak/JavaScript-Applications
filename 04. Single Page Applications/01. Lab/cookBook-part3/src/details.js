import { create } from './dom.js';
import { showEdit } from './edit.js';

async function getRecipeById(id) {
    const response = await fetch('http://localhost:3030/data/recipes/' + id);
    const recipe = await response.json();

    return recipe;
}

function createRecipeCard(recipe) {
    const result = create('article', {},
        create('h2', {}, recipe.name),
        create('div', { className: 'band' },
            create('div', { className: 'thumb' }, create('img', { src: recipe.img })),
            create('div', { className: 'ingredients' },
                create('h3', {}, 'Ingredients:'),
                create('ul', {}, recipe.ingredients.map(i => create('li', {}, i))),
            )
        ),
        create('div', { className: 'description' },
            create('h3', {}, 'Preparation:'),
            recipe.steps.map(s => create('p', {}, s))
        ),
    );
    const userId = sessionStorage.getItem('userId');
    if (userId === recipe._ownerId) {
        result.appendChild(create('div', { className: 'controls' },
            create('button', { onClick: () => showEdit(recipe._id) }, '\u270E Edit'),
            create('button', { onClick: () => onDelete(recipe._id) }, '\u2716 Delete')
        ));
    }

    return result;
}

async function onDelete(id) {
    const confirmed = confirm('Are you sure you want to delete this recipe?');
    if (confirmed) {
        const token = sessionStorage.getItem('authToken');
        if (token == null) {
            return alert(`You're not logged in`);
        }

        try {
            const response = await fetch('http://localhost:3030/data/recipes/' + id, {
                method: 'delete',
                headers: {
                    'X-Authorization': token
                }
            });

            if (response.status == 200) {
                section.innerHTML = '<article><h2>Recipe deleted</h2></article>';
            } else {
                throw new Error(await response.json());
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}

let main;
let section;
let setActiveNav;

export function setupDetails(mainTarget, sectionTarget, setActiveNavCb) {
    main = mainTarget;
    section = sectionTarget;
    setActiveNav = setActiveNavCb;
}

export async function showDetails(id) {
    setActiveNav();
    section.innerHTML = '<p style="color: white">Loading...</p>';
    main.innerHTML = '';
    main.appendChild(section);

    const recipe = await getRecipeById(id);
    const card = createRecipeCard(recipe);

    section.innerHTML = '';
    section.appendChild(card);
}
