async function solution() {
    const main = document.getElementById('main');

    const host = await fetch('http://localhost:3030/jsonstore/advanced/articles/list');
    const data = await host.json();

    data.forEach(x => main.appendChild(accordionTemplate(x)));
}

function accordionTemplate({ _id, title }) {
    const div = create('div', 'accordion');
    const headDiv = create('div', 'head');
    const span = create('span', '', title);
    const btn = create('button', 'button', 'More');
    btn.id = _id;

    headDiv.appendChild(span);
    headDiv.appendChild(btn);

    const extraDiv = create('div', 'extra');
    extraDiv.style.display = 'none';
    const p = create('p');

    extraDiv.appendChild(p);
    div.appendChild(headDiv);
    div.appendChild(extraDiv);

    btn.addEventListener('click', async () => {
        if (extraDiv.style.display === 'none') {
            const response = await fetch(`http://localhost:3030/jsonstore/advanced/articles/details/${_id}`);
            const data = await response.json();

            btn.textContent = 'Less';
            extraDiv.style.display = 'block';
            p.textContent = data.content;
        } else {
            btn.textContent = 'More';
            extraDiv.style.display = 'none';
        }
    });

    return div;
}

function create(type, className = '', content = '') {
    const result = document.createElement(type);
    if (className) {
        result.className = className;
    }
    result.textContent = content;

    return result;
}
