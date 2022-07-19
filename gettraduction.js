import playwright from "playwright";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export default async function getTraduction(word) {
    if (word == "" || word == undefined) {
        console.log("palabra vacia");
        return "";
    }
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(`https://www.google.com/search?q=traductor`);
    try {
        await page.click('//div[@class="tw-ets tw-ess tw-src-ltr"]/div/div/div');
    } catch (error) {
        await page.click('//div[@class="tw-ets tw-ess tw-src-ltr"]/div/div/div');
    }

    await page.keyboard.insertText(word);
    await delay(1000 * 2.5);
    let resultado = await (
        await page.$$('//div[@id="tw-target"]//span[@lang="es"]')
    )[0].innerText();
    await browser.close();
    return resultado;
}