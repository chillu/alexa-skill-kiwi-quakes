const NodeGeocoder = require("node-geocoder");

/**
 * @param {String}
 * @param {String}
 * @param {Object} options
 * @return {Promise}
 */
module.exports = function(postCode, { apiKey }) {
  var geocoder = NodeGeocoder({
    provider: "google",
    apiKey: apiKey,
    excludePartialMatches: true
  });

  return geocoder
    .geocode({ zipcode: postCode, country: "New Zealand" })
    .then(results => {
      // TODO Handle rate limits

      const result = results ? results[0] : null;

      if (!result) {
        Promise.reject("No matches found");
      }

      // See https://developers.google.com/maps/documentation/geocoding/intro#Results
      if (!result.city) {
        Promise.reject("No city-level match found");
      }

      return ({ latitude, longitude, formattedAddress } = result);
    });
};
