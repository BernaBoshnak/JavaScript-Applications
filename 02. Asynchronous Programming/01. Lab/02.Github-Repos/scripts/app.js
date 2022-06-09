async function asyncLoadRepos() {
	const username = document.getElementById('username').value;

	const url = `https://api.github.com/users/${username}/repos`;

	try {
		const response = await fetch(url);
		if (response.status === 404) {
			throw new Error('User not found');
		}

		const data = await response.json();
		const ulElement = document.getElementById('repos');
		ulElement.innerHTML = '';

		data.forEach(r => {
			const liElement = document.createElement('li');
			liElement.textContent = r.full_name;
			ulElement.appendChild(liElement);
		})
	} catch (error) {
		console.log(error);
	}
}
