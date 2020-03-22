'user strict';

// Requirements
const express = require('express');
const bodyParser = require('body-parser');

const url_analyzer = require('url');
const environment = require('.env');


// Puppeteer framework
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Adds timestamps console logs
require('console-stamp')(console, '[dd/mm/yyyy - HH:MM:ss.l]');

// Constants
const PORT = environment.PORT;
const HOST = environment.HOST;

// App and its config
const app = express();

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Blueprints
app.post('/scan', (req, res) => {
    // Who did the request
    url = req.body.url
    let req_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.info(`${req_ip}\t~~>\t${url}`);
    try {
        (async() => {
            // Declare browser
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();

            let response = await page.goto(url).catch((res) => {
                console.error('Failed', res)
                // TODO: add exception handler
            });

            // Serialized HTML of page DOM and wait until document is complete
            console.log(`Waiting for document ready state`);
            await page.waitForFunction('document.readyState === "complete"');

            // Extract data from DOM
            domain = url_analyzer.parse(url).hostname;
            console.log(domain);
            let productInfo = await page.evaluate((domain) => {
                currencyRegex = /\$|£|€|US \$/
                let name = '';
                let price = '';
                switch (true) {
                  // Ebay
                  case /www.ebay\.[a-z]{2,4}$/.test(domain):
                    name = document.querySelector('#itemTitle').textContent.substr(14).trim();
                    price = parseFloat(document.querySelector('[itemprop="price"]').textContent.trim().replace(currencyRegex, ' ').replace(',','.'));
                    break;

                  // Amazon
                  case /www.amazon\.[a-z]{2,4}$/.test(domain):
                    name = document.querySelector('#productTitle').textContent.substr(14).trim();
                    price = parseFloat(document.querySelector('#priceblock_ourprice').textContent.trim().replace(currencyRegex, ' ').replace(',','.'));
                    break;

                  default:
                    throw new Error('Error getting some product attribute');
                }
                return {name, price};
            }, domain);
            await browser.disconnect();

            // Response
            res.send(productInfo);
            return;
        })();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something failed!' });
        return;
    }
});

// ----------------------
// Main
// ----------------------
app.listen(PORT, HOST);
console.info(`Running on http://${HOST}:${PORT}`);
