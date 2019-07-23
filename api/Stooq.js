const csvstring= require("csvtojson");
const request = require("request");
var Promise = require("bluebird");
const url  = "https://stooq.com/q/l/?s=";
const params = "&f=sd2t2ohlcv&h&e=csv";

const stockBot = {
  getStooq: function(stockCode) {
    const buildUrl = `${url}${stockCode}${params}`;
    const stock = new Promise((resolve, reject) => {
      request.get(buildUrl, (error, response, body) => {
          resolve(body);
      });
    });
    return Promise.all([stock]).then(value => {
        return value;
    }).then(value => {
        return stockBot.parseResult(value[0])
    })
  },
  parseResult: function(file) {
      return csvstring({
        output: "json",
        colParser:{
          "Symbol": "string",
          "Close": "string",
        },
        checkType:true
      }).fromString(file)
        .then((csvRow) => {
          if(csvRow) {
            return csvRow[0];
          }
        })
  }
};

module.exports = stockBot;

