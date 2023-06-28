"use strict";
const moment = require("moment");
const dateNow = moment().format("MMM Do YY, HH:mm:ss");

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: dateNow,
    }),
  };
};
