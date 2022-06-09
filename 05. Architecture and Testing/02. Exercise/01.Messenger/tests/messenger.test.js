//@ts-check
const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page;

describe('Messenger tests', function () {
    this.timeout(6000);

    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 });
        browser = await chromium.launch();
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

    it('load messages', async () => {
        await page.goto('http://localhost:3000');

        await page.click('text=Refresh');

        const messages = await page.$eval('#messages', el => el.value.split('\n'));

        expect(messages[0]).to.equal('Spami: Hello, are you there?');
        expect(messages[1]).to.equal('Garry: Yep, whats up :?');
        expect(messages[2]).to.equal('Spami: How are you? Long time no see? :)');
        expect(messages[3]).to.equal('George: Hello, guys! :))');
        expect(messages[4]).to.equal('Spami: Hello, George nice to see you! :)))');
    });

    it('send message', async () => {
        await page.goto('http://localhost:3000');

        await page.fill('#author', 'Spami');
        await page.fill('#content', 'Hello, guys?');

        await page.click('#submit');

        await page.click('text=Refresh');

        const messages = await page.$eval('#messages', el => el.value.split('\n'));

        expect(messages[0]).to.equal('Spami: Hello, are you there?');
        expect(messages[1]).to.equal('Garry: Yep, whats up :?');
        expect(messages[2]).to.equal('Spami: How are you? Long time no see? :)');
        expect(messages[3]).to.equal('George: Hello, guys! :))');
        expect(messages[4]).to.equal('Spami: Hello, George nice to see you! :)))');
        expect(messages[5]).to.equal('Spami: Hello, guys?');
    });
});
