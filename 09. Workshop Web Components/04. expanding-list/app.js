class ExpandingList extends HTMLUListElement {
    constructor() {
        self = super();

        const uls = Array.from(self.querySelector('ul'));
        const lis = Array.from(self.querySelector('li'));

        uls.forEach(ul => {
            ul.style.display = 'none'
        });

        lis.forEach(li => {
            if (li.querySelector('ul').length > 0) {
                li.setAttribute('class', 'closed');

                const childText = li.childNodes[0];
                const newSpan = document.createElement('span');

                newSpan.textContent = childText.textContent;
                newSpan.style.cursor = 'pointer';

                newSpan.onclick = self.showul;

                childText.parentNode.insertBefore(newSpan, childText);
                childText.parentNode.removeChild(childText);
            }
        });
    }

    showul(e) {
        const nextUl = e.target.nextElementSibling;

        if (nextUl.style.display == 'block') {
            nextUl.style.display = 'none';
            nextUl.parentNode.setAttribute('class', 'closed');
        } else {
            nextUl.style.display = 'block';
            nextUl.parentNode.setAttribute('class', 'open');
        }
    }
}

window.customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
