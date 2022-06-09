import { create } from './dom.js';

async function start() {
    loadAllPosts();

    sessionStorage.clear();

    document.getElementById('allPosts').addEventListener('click', (e) => {
        if (e.target.tagName === 'H2') {
            e.preventDefault();

            sessionStorage.setItem('postId', e.target.parentNode.children[1].value);

            window.location.pathname = '01.Forum/theme-content.html';
        }
        document.getElementById('createPost').addEventListener('submit', createPost);
    });
}

async function loadAllPosts() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts');
    const data = await response.json();

    const posts = document.getElementById('allPosts');

    posts.innerHTML = '';

    Object.values(data).forEach(p => {
        const date = new Date(p.date).toUTCString();

        const element = create('div', { className: 'topic-container' },
            create('div', { className: 'topic-name-wrapper' },
                create('div', { className: 'topic-name' },
                    create('a', { href: '#', className: 'normal' },
                        create('h2', {}, p.title),
                        create('input', { type: 'hidden', value: p._id })),
                    create('div', { className: 'columns' },
                        create('div', {},
                            create('p', {},
                                create('a', {}, 'Date: '),
                                create('time', {}, date)),
                            create('div', { className: 'nick-name' },
                                create('p', {}, `Username: ${p.username}`))),
                        create('div', { className: 'subscribers' },
                            create('p', {}, 'Subscribers: 0'))
                    )
                )
            )
        );
        posts.appendChild(element);
    });
}

async function createPost(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (e.submitter.className === 'cancel') {
        console.log(e);
        e.preventDefault();
        e.target.reset();
    }
    const comment = {
        'title': formData.get('topicName'),
        'username': formData.get('username'),
        'post': formData.get('postText'),
        'date': Date.now()
    }

    if (comment.title === '' || comment.username === '') {
        return alert(`All field's are required!`);
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    });

    if (response.ok) {
        e.target.reset();
        loadAllPosts();
    } else {
        const error = await response.json();
        return alert(error.message);
    }
}

start();
