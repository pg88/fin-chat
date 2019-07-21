const http = require("http");
const url  = "http://stooq.com/q/l/?s=";
const params = "&f=sd2t2ohlcv&h&e=csv";

const getStooq = function(stockCode) {
  const buildUrl = `${url}${stockCode}${params}`;
  return http.get(buildUrl, (response) => {
      console.log("STOCKCSV__", response);
      return response;
  });
};

module.exports = getStooq;
