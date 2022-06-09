async function loadCommits() {
    // Try it with Fetch API
    const username = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;

    const url = `https://api.github.com/repos/${username}/${repo}/commits`;

    try {
        const response = await fetch(url);
        const ulElement = document.getElementById('commits');

        if (response.status === 404) {
            const liElement = document.createElement('li');
            liElement.textContent = `Error: ${response.status} (Not Found)`;
            ulElement.appendChild(liElement);
            throw new Error(response.status);
        }

        const data = await response.json();
        ulElement.innerHTML = '';

        data.forEach(r => {
            const liElement = document.createElement('li');
            liElement.textContent = `${r.commit.author.name}: ${r.commit.message}`;
            ulElement.appendChild(liElement);
        });
    } catch (error) {
        return error;
    }
}
