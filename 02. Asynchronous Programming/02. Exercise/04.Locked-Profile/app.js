async function lockedProfile() {
    const main = document.getElementById('main');

    main.innerHTML = '';
    const url = 'http://localhost:3030/jsonstore/advanced/profiles';

    const response = await fetch(url);
    const data = await response.json();

    Object.values(data).forEach((x,i) => main.appendChild(profileTemplate(x, i+1)));
}

function profileTemplate({ username, email, age }, id) {
    const div = document.createElement('div');
    div.className = 'profile';

    div.innerHTML = `<img src="./iconProfile2.png" class="userIcon" />
    <label>Lock</label>
    <input type="radio" name="user${id}Locked" value="lock" checked="">
    <label>Unlock</label>
    <input type="radio" name="user${id}Locked" value="unlock"><br>
    <hr>
    <label>Username</label>
    <input type="text" name="user${id}Username" value="${username}" disabled="" readonly="" />
    <div id="user1HiddenFields">
        <hr>
        <label>Email:</label>
        <input type="email" name="user${id}Email" value="${email}" disabled="" readonly="" />
        <label>Age:</label>
        <input type="email" name="user${id}Age" value="${age}" disabled="" readonly="" />
    </div>`;

    const btn = document.createElement('button');
    btn.innerText = 'Show More';

    btn.addEventListener('click', (e) => {
        const isLocked = div.querySelector('input[type="radio"]:checked').value === 'lock';

        if (isLocked) {
            return;
        }

        const divElement = div.querySelector('div');
        const isVisible = divElement.style.display === 'block';
        divElement.style.display = isVisible ? 'none' : 'block';

        e.target.textContent = !isVisible ? 'Hide it' : 'Show more';
    });

    div.appendChild(btn);

    return div;
}
