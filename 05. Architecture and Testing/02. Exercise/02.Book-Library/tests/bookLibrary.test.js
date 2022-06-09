const { chromium } = require('playwright-chromium');
const { expect } = require('chai');


let browser, page;

describe('book-library tests', function () {
    this.timeout(6000);

    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
        // browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('load books', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');

        const books = await page.$$eval('tbody>tr>td', r => r.map(td => td.textContent));

        expect(books).includes('Harry Potter and the Philosopher\'s Stone');
        expect(books).includes('J.K.Rowling');
        expect(books).includes('C# Fundamentals');
        expect(books).includes('Svetlin Nakov');
    });

    it('add book', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');

        await page.fill('#createForm>input[type=text]:nth-child(3)', 'The Candy House');
        await page.fill('#createForm>input[type=text]:nth-child(5)', 'Jennifer Egan');

        await page.click('#createForm>button');
        await page.click('text=LOAD ALL BOOKS');

        const books = await page.$$eval('tbody>tr>td', r => r.map(td => td.textContent));

        expect(books).includes('Harry Potter and the Philosopher\'s Stone');
        expect(books).includes('J.K.Rowling');
        expect(books).includes('C# Fundamentals');
        expect(books).includes('Svetlin Nakov');
        expect(books).includes('The Candy House');
        expect(books).includes('Jennifer Egan');
    });

    it('add book with empty file', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');

        await page.fill('#createForm>input[type=text]:nth-child(3)', '');
        await page.fill('#createForm>input[type=text]:nth-child(5)', '');

        await page.click('#createForm>button');
        await page.click('text=LOAD ALL BOOKS');

        const books = await page.$$eval('tbody>tr>td', r => r.map(td => td.textContent));

        expect(books).includes('Harry Potter and the Philosopher\'s Stone');
        expect(books).includes('J.K.Rowling');
        expect(books).includes('C# Fundamentals');
        expect(books).includes('Svetlin Nakov');
    });

    it('When the “Edit” button is clicked, the correct form should be made visible', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');
        await page.click('button.editBtn');

        const visible = await page.isVisible('#editForm');
        const notVisible = await page.isVisible('#createForm');

        const title = await page.$eval('#editForm>input[type=text]:nth-child(4)', el => el.value);
        const author = await page.$eval('#editForm>input[type=text]:nth-child(6)', el => el.value);

        expect(visible).to.be.true;
        expect(notVisible).to.be.false;

        expect(title).to.equal('Harry Potter and the Philosopher\'s Stone');
        expect(author).to.equal('J.K.Rowling');
    });

    it('edit book', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');
        await page.click('button.editBtn');

        await page.fill('#editForm>input[type=text]:nth-child(4)', 'Harry Potter and the Philosopher\'s Stone');
        await page.fill('#editForm>input[type=text]:nth-child(6)', 'J.K.Rowling');

        await page.click('#editForm>button');
        await page.click('text=LOAD ALL BOOKS');

        const books = await page.$$eval('tbody>tr>td', r => r.map(td => td.textContent));

        expect(books).includes('Harry Potter and the Philosopher\'s Stone');
        expect(books).includes('J.K.Rowling');
    });

    it('delete book', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=LOAD ALL BOOKS');

        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.click('button.deleteBtn');
        await page.click('text=LOAD ALL BOOKS');

        const books = await page.$$eval('tbody>tr>td', r => r.map(td => td.textContent));

        expect(books[0]).to.equal('C# Fundamentals');
        expect(books[1]).to.equal('Svetlin Nakov');
    });
});
