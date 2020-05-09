"user strict";

// Requirements
const express = require("express");
const bodyParser = require("body-parser");

const url_analyzer = require("url");
const checkXApiKey = require("./middleware/auth-middleware.js");

// Middleware
const errorHandler = require("./middleware/error_handler.js");

// Puppeteer framework
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Adds timestamps console logs
require("console-stamp")(console, "dd/mm/yyyy - HH:MM:ss.l");

// Constants
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// App and its config
const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// Check that requests have x-api-key
app.use(checkXApiKey);

// Blueprints
app.post("/scan", async (req, res, next) => {
  // Who did the request
  let url = req.body.url;
  let req_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.info(`${req_ip}\t~~>\t${url}`);
  // Declare browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  (async () => {
    try {
      const page = await browser.newPage();

      await page.goto(url);

      // Serialized HTML of page DOM and wait until document is complete
      console.log(`Waiting for document ready state`);
      await page.waitForFunction('document.readyState === "complete"');

      // Extract data from DOM
      let domain = url_analyzer.parse(url).hostname;
      console.log(domain);
      let productInfo = await page.evaluate((domain) => {
        let currencyRegex = /\$|£|€|US \$/;
        let name = "";
        let price = "";
        let ecommerce = "";

        switch (true) {
          // Ebay
          case /www.ebay\.[a-z]{2,4}$/.test(domain):
            name = document
              .querySelector("#itemTitle")
              .textContent.substr(14)
              .trim();
            price = parseFloat(
              document
                .querySelector('[itemprop="price"]')
                .textContent.trim()
                .replace(currencyRegex, " ")
                .replace(",", ".")
            );
            ecommerce = "ebay";
            break;

          // Amazon
          case /www.amazon\.[a-z]{2,4}$/.test(domain):
            name = document
              .querySelector("#productTitle")
              .textContent.substr(14)
              .trim();
            price = parseFloat(
              document
                .querySelector("#priceblock_ourprice")
                .textContent.trim()
                .replace(currencyRegex, " ")
                .replace(",", ".")
            );
            ecommerce = "amazon";
            break;

          default:
            throw new Error("Error getting some product attribute");
        }
        return { name, price, ecommerce };
      }, domain);

      // Response
      res.send(productInfo);
      return;
    } finally {
      await browser.close();
    }
  })().catch(next);
});

// Error handler
app.use(errorHandler);

// ----------------------
// Main
// ----------------------
app.listen(PORT, HOST);
console.info(`Running on http://${HOST}:${PORT}`);
