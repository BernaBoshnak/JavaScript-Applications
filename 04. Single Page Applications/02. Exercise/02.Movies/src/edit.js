import { showDetails } from './details.js'

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const data = await response.json();
    console.log(data);
    return data;
}

async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const movieId = formData.get('id');
    
    const movie = {
        'title': formData.get('title'),
        'description': formData.get('description'),
        'img': formData.get('imageUrl'),
    }

    if (movie.title === '' || movie.description === '' || movie.img === '') {
        return alert('All fields are required!');
    }

    const token = sessionStorage.getItem('authToken');
    if (token == null) {
        return alert(`You're not authorised!`);
    }

    try {
        const response = await fetch('http://localhost:3030/data/movies/' + movieId, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(movie)
        });

        if (response.ok) {
            e.target.reset();
            showDetails(movieId);
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        console.error(err.message);
    }
}

let main;
let section;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showEdit(id) {
    main.innerHTML = '';
    main.appendChild(section);

    const movie = await getMovieById(id);

    document.querySelector('[name="id"]').value = id;
    document.querySelector('[name="title"]').value = movie.title;
    document.querySelector('[name="description"]').value = movie.description;
    document.querySelector('[name="imageUrl"]').value = movie.img;
}
