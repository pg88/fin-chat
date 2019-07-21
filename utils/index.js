const moment = require("moment");

const utils = {
    buildMessage(string) {
      return function() {
        return `${string}`;
      }
    }
};

module.exports = utils;