async function getRecipeList() {
    const main = document.querySelector('main');
    const url = 'http://localhost:3030/jsonstore/cookbook/recipes';

    try {
        const response = await fetch(url);
        const recipes = await response.json();

        if (recipes.ok === false) {
            throw new Error(response.statusText);
        }

        main.innerHTML = '';
        Object.values(recipes).map(createPreview).forEach(r => main.appendChild(r));
    } catch (error) {
        alert(error.message);
    }
}

function createPreview(recipe) {
    const result = create('article', { className: 'preview' },
        create('div', { className: 'title' }, create('h2', {}, recipe.name)),
        create('div', { className: 'small' }, create('img', { src: recipe.img })));

    result.addEventListener('click', () => getRecipeDetails(recipe._id, result));
    return result;
}

async function getRecipeDetails(id, preview) {
    const url = 'http://localhost:3030/jsonstore/cookbook/details/' + id;

    const response = await fetch(url);
    const data = await response.json();

    const result = create('article', {},
        create('h2', { onClick: toggleCard }, data.name),
        create('div', { className: 'band' },
            create('div', { className: 'thumb' },
                create('img', { src: data.img })),
            create('div', { className: 'ingredients' },
                create('h3', {}, 'Ingredients:'),
                create('ul', {}, data.ingredients.map(i => create('li', {}, i)))
            )
        ),
        create('div', { className: 'description' },
            create('h3', {}, 'Preparation:'),
            data.steps.map(s => create('p', {}, s)))
    )
    preview.replaceWith(result);

    function toggleCard() {
        result.replaceWith(preview);
    }
}

window.addEventListener('load', () => {
    getRecipeList();
});


function create(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}
