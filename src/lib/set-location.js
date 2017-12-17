const NodeGeocoder = require("node-geocoder");

/**
 * @param {String}
 * @return {Promise}
 */
module.exports = function(loc) {
  console.log(process.env.GOOGLE_API_KEY);
  var geocoder = NodeGeocoder({
    provider: "google",
    apiKey: process.env.GOOGLE_API_KEY
  });

  geocoder.geocode({ address: loc, country: "New Zealand" }).then(res => {
    return ({ latitude, longitude } = res);
  });
};
