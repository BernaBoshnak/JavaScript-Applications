import { create } from './dom.js';

async function getPostById() {
    const postId = sessionStorage.getItem('postId');

    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts' + postId);
    const data = await response.json();

    return data;
}

async function start() {
    const currentPost = document.getElementById('post');

    currentPost.innerHTML = '';

    const post = await getPostById();

    const element = create('div', { className: 'topic-name-wrapper' },
        create('div', { className: 'topic-name' },
            create('a', { href: '#', className: 'normal' },
                create('h2', {}, post.title)),
            create('div', { className: 'columns' },
                create('div', {},
                    create('p', {},
                        create('a', {}, 'Date: 2021'),
                        create('time', {}, date)),
                    create('div', { className: 'nick-name' },
                        create('p', {}, `Username: ${post.username}`))),
                create('div', { className: 'subscribers' },
                    create('p', {}, 'Subscribers: 0'))
            )
        )
    )
    currentPost.appendChild(element);

    loadAllComments();

    document.getElementById('postComment').addEventListener('submit', createComment);
}
async function loadAllComments() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments');
    const data = await response.json();

    const comments = document.getElementById('comments');

    comments.innerHTML = '';

    Object.values(data).forEach(c => {
        if (c.postId === sessionStorage.getItem('postId')) {
            const date = new Date(c.date).toUTCString();

            const element = create('div', { className: 'comment' },
                create('div', { className: 'header' },
                    create('p', {}, create('span', {}, c.username),
                        create('a', {}, 'posted on '),
                        create('time', {}, date))),
                create('div', { className: 'comment-main' },
                    create('div', { className: 'userdetails' },
                        create('img', { src: './static/profile.png', alt: 'avatar' })),
                    create('div', { className: 'post-content' },
                        create('p', {}, c.comment))),
                create('div', { className: 'footer' },
                    create('p', {}, create('span', {}, 0), create('a', {}, ' likes')))
            );
            comments.appendChild(element);
        }
    });
}

async function createComment(e) {
    e.preventDefault();

    const postId = sessionStorage.getItem('postId');
    const formData = new FormData(e.target);
    const comment = {
        'title': formData.get('topicName'),
        'username': formData.get('username'),
        'post': formData.get('postText'),
        'date': Date.now()
    }

    if (comment.title === '' || comment.username === '') {
        return alert(`All field's are required!`);
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment, postId)
    });

    if (response.ok) {
        e.target.reset();
        loadAllComments();
    } else {
        const error = await response.json();
        return alert(error.message);
    }
}

start();