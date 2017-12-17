const NodeGeocoder = require("node-geocoder");

/**
 * @param {String}
 * @param {String}
 * @return {Promise}
 */
module.exports = function(loc, apiKey) {
  var geocoder = NodeGeocoder({
    provider: "google",
    apiKey: apiKey
  });

  geocoder.geocode({ address: loc, country: "New Zealand" }).then(res => {
    return ({ latitude, longitude } = res);
  });
};
