export function setupHome(section, nav) {
    section.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        nav.goTo('dashboard');
    });

    return showHome;

    async function showHome() {
        return section;
    }
}
