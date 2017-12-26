const differenceInHours = require("date-fns/difference_in_hours");
const distanceInWords = require("date-fns/distance_in_words");
const subSeconds = require("date-fns/sub_seconds");
const { convertToSecond } = require("duration-iso-8601");
const haversine = require("haversine-js");

// Config
const minMmi = 3;

/**
 * @param {Array} quakes
 * @param {Object} options.
 *   - since: ISO 8601 relative duration
 *   - currDate: For mocking purposes
 *   - latLng: WGS84 coords
 * @return {Promise}
 */
module.exports = function(quakes, { since = "PT6H", currDate, latLng }) {
  if (!currDate) {
    currDate = new Date();
  }

  const sinceDate = subSeconds(currDate, convertToSecond(since));
  const sinceNice = distanceInWords(sinceDate, currDate);

  // Filter quakes, and sort descending by magnitude
  const matchingQuakes = quakes.features
    .filter(quake => new Date(quake.properties.time) >= sinceDate)
    .sort((a, b) => b.properties.magnitude - a.properties.magnitude);

  // Can't use async/await in NodeJS 6 on Lambda, sigh...
  if (!matchingQuakes.length) {
    return Promise.resolve({
      success: false,
      message: `No quakes found since ${sinceNice} ago`
    });
  }

  const quake = matchingQuakes[0];
  const { time, locality, mmi } = quake.properties;

  const relativeTime = distanceInWords(new Date(time), currDate, {
    includeSeconds: false
  });

  var distanceOrLocality;
  if (latLng) {
    const quakeCoords = {
      latitude: quake.geometry.coordinates[1],
      longitude: quake.geometry.coordinates[0]
    };
    const kms = haversine(latLng, quakeCoords, {
      radius: haversine.EARTH.KM
    }).toFixed(0);
    distanceOrLocality = `${kms} kilometers away, ${locality}`;
  } else {
    distanceOrLocality = locality;
  }

  var msg;
  if (matchingQuakes.length > 1) {
    msg =
      `There have been ${matchingQuakes.length} ` +
      `quakes with magnitude ${minMmi} or greater since ${sinceNice} ago. ` +
      `The biggest one was a magnitude ${mmi} quake, ${relativeTime} ago, ${distanceOrLocality}`;
  } else {
    msg = `There has been a magnitude ${mmi} quake ${relativeTime} ago, ${distanceOrLocality}`;
  }

  return Promise.resolve({
    success: true,
    message: msg
  });
};
