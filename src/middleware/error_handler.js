"use strict";

function errorHandler(err, req, res, next) {
  if (err) {
    console.error(err);
    return res.status(500).send({ error: "Something failed!" });
  }
  next;
}

module.exports = errorHandler;
