async function request(url, options) {
    const response = await fetch(url, options);
    if (response.ok != true) {
        const error = await response.json();
        return alert(error.message);
    }

    const data = await response.json();
    sessionStorage.setItem('userToken', data.accessToken);
    return data;
}

async function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if (email === '' || password === '') {
        return alert('All fields are required!');
    } else if (password !== rePass) {
        return alert(`Passwords don't match!`);
    }

    await request('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    window.location.pathname = 'index.html';
}

async function onLoginSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    await request('http://localhost:3030/users/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    window.location.pathname = 'index.html';
}

function start() {
    document.getElementById('register').addEventListener('submit', onRegisterSubmit);
    document.getElementById('login').addEventListener('submit', onLoginSubmit);
}

start();
