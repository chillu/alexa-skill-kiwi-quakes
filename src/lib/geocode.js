const NodeGeocoder = require("node-geocoder");

/**
 * @param {Object} options
 * @return {Promise}
 */
module.exports = function({ zipcode, apiKey }) {
  var geocoder = NodeGeocoder({
    provider: "google",
    apiKey: apiKey,
    excludePartialMatches: true
  });

  // Geocoder is weird when not supplying address and using "zipcode"
  // as a qualifying (returns 400, or occasionally returns no results
  // with address=<zipcode> and zipcode=<zipcode>)
  return geocoder
    .geocode({ address: zipcode, country: "New Zealand" })
    .then(results => {
      console.log("geocode.js results", results);
      // TODO Handle rate limits

      const result = results ? results[0] : null;

      if (!result) {
        Promise.reject("No matches found");
        return null;
      }

      return ({ latitude, longitude, formattedAddress } = result);
    });
};
