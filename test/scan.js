"user strict";

var mocha = require("mocha");
var chai = require("chai");
var chaiHttp = require("chai-http");
const expect = require("chai").expect;
const app = require("../src/server.js");

chai.use(chaiHttp);

mocha.describe("Scan test", () => {
  // ----------------------------------------------
  // Amazon
  // ----------------------------------------------
  mocha.it("Scan product from Amazon", (done) => {
    chai
      .request(app)
      .post("/scan")
      .set({ "x-api-key": process.env.X_API_KEY })
      .send({
        url:
          "https://www.amazon.es/Resident-Evil-3-Remake-PS4/dp/B082MVD2PS/ref=sr_1_1?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1BZSA01QQ7BXY&dchild=1&keywords=resident+evil+3+ps4&qid=1588439651&sprefix=resid%2Caps%2C168&sr=8-1",
      })
      .end(function (err, res) {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("name")
          .to.be.equal("Resident Evil 3 Remake - PS4");
        done();
      });
  });
  // ----------------------------------------------
  // Ebay
  // ----------------------------------------------
  mocha.it("Scan product from Ebay", (done) => {
    chai
      .request(app)
      .post("/scan")
      .set({ "x-api-key": process.env.X_API_KEY })
      .send({
        url:
          "https://www.ebay.es/itm/Xiaomi-Redmi-Note-9S-4G-64GB-6-67-48MP-5020mAh-Smartphone-Global-Version/353002220983?_trkparms=pageci%3A40b9c857-8c9e-11ea-acbd-74dbd180e2b2%7Cparentrq%3Ad688532b1710a860d2d2cea7ffc4fba7%7Ciid%3A1",
      })
      .end(function (err, res) {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("name")
          .to.be.equal(
            "Xiaomi Redmi Note 9S 4GB 64GB 6,67'' 48MP 5020mAh Smartphone Global Versión"
          );
        done();
      });
  });
});
