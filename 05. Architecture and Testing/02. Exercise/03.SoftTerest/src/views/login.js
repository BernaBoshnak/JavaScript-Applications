import { login } from '../api/data.js';

export function setupLogin(section, nav) {
    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);

    return showLogin;

    async function showLogin() {
        return section;
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(form);

        const email = formData.get('email');
        const password = formData.get('password');

        await login(email, password);
        form.reset();
        nav.setUserNav();
        nav.goTo('home');
    }
}
