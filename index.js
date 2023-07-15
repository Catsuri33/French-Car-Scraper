const puppeteer =  require("puppeteer");
const fs = require('fs');

async function getCarData(numberplate){

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    await page.goto("https://www.yakarouler.com/car_search/immat?immat=" + numberplate + "&name=undefined&redirect=true&search_keep_slug=");

    try {

        const title = await page.$("h2");
        const informations = await page.$$("li");
        let informationsTxt = [];
        let i = 0;

        const car = new Object();
        car.title = await title.evaluate(el => el.textContent, title);

        for (const info of informations) {

            let infoTxt = await info.evaluate(el => el.textContent, info);
            infoTxt = infoTxt.replace(/^\s+|\s+$/gm,'');
            infoTxt = infoTxt.replace("\n", "");

            informationsTxt[i] = infoTxt;
            i++;

        }

        car.content = informationsTxt;

        // Write to body.json file
        fs.writeFile('./body.json', JSON.stringify(car), err => {
            if (err) {
                console.error(err);
            }
        });

    } catch(e){

        const err = new Object();
        err.success = "false";
        err.msg = "This numberplate doesn't exist";

        fs.writeFile('./body.json', JSON.stringify(err), err => {
            if (err) {
                console.error(err);
            }
        });

    }

    browser.close();

}

getCarData("AA-123-AA");