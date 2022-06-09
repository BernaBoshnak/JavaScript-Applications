import { create } from '../dom.js';
import { getRecipeById, deleteRecipeById } from '../api/data.js';

function createRecipeCard(recipe, goTo, deleteRecipe) {
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
    if (userId != null && recipe._ownerId == userId) {
        result.appendChild(create('div', { className: 'controls' },
            create('button', { onClick: () => goTo('edit', recipe._id) }, '\u270E Edit'),
            create('button', { onClick: onDelete }, '\u2716 Delete'),
        ));
    }

    return result;

    function onDelete() {
        const confirmed = confirm(`Are you sure you want to delete ${recipe.name}?`);
        if (confirmed) {
            deleteRecipe(recipe._id);
        }
    }
}

export function setupDetails(section, navigation) {
    return showDetails;

    async function showDetails(id) {
        section.innerHTML = 'Loading&hellip;';

        const recipe = await getRecipeById(id);
        section.innerHTML = '';
        section.appendChild(createRecipeCard(recipe, navigation.goTo, deleteRecipe));

        return section;
    }

    async function deleteRecipe(id) {
        await deleteRecipeById(id);
        section.innerHTML = '';
        section.appendChild(create('article', {}, create('h2', {}, 'Recipe deleted')));
    }
}
