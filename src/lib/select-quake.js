const differenceInHours = require("date-fns/difference_in_hours");
const distanceInWordsStrict = require("date-fns/distance_in_words_strict");
const subSeconds = require("date-fns/sub_seconds");
const { convertToSecond } = require("duration-iso-8601");
const haversine = require("haversine-js");

// Config
const minMmi = 3;

/**
 * Make since a bit more readable
 *
 * @param {Date}
 * @param {Date}
 * @return {String}
 */
function distanceInWordsCustom(fromDate, toDate) {
  return distanceInWordsStrict(fromDate, toDate).replace(
    /1 (minute|hour|day)/,
    "$1"
  );
}

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

  // MMI is not magnitude, see https://www.geonet.org.nz/earthquake/mmi
  const feltMmiMaxDistancesKm = {
    1: 5,
    2: 30,
    3: 50,
    4: 100,
    5: 500,
    6: 1000,
    7: 1000,
    8: 1000,
    9: 1000,
    10: 1000
  };

  const sinceDate = subSeconds(currDate, convertToSecond(since));
  const sinceNice = distanceInWordsCustom(sinceDate, currDate);

  // Filter quakes, and sort descending by magnitude
  const matchingQuakes = quakes.features
    .filter(quake => new Date(quake.properties.time) >= sinceDate)
    .sort((a, b) => b.properties.magnitude - a.properties.magnitude);

  // Optionally limit to location
  const closeQuakes = matchingQuakes.filter(quake => {
    if (!latLng) {
      return true;
    }

    const { mmi } = quake.properties;
    const { coordinates } = quake.geometry;
    const quakeCoords = {
      latitude: coordinates[1],
      longitude: coordinates[0]
    };
    const kms = haversine(latLng, quakeCoords, {
      radius: haversine.EARTH.KM
    }).toFixed(0);

    return kms < feltMmiMaxDistancesKm[mmi];
  });

  // Can't use async/await in NodeJS 6 on Lambda, sigh...
  if (!closeQuakes.length) {
    const msg = latLng
      ? `No quakes close to you found in the last ${sinceNice}`
      : `No quakes found in the last ${sinceNice}`;
    return Promise.resolve({
      success: false,
      message: msg
    });
  }

  const quake = closeQuakes[0];
  const { time, locality, mmi, magnitude } = quake.properties;
  const magnitudeNice = magnitude.toFixed(1);
  const relativeTime = distanceInWordsStrict(new Date(time), currDate);

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
  if (closeQuakes.length > 1) {
    msg =
      `There have been ${
        closeQuakes.length
      } quakes in the last ${sinceNice}. ` +
      `The biggest one was a magnitude ${magnitudeNice} quake, ${relativeTime} ago, ${distanceOrLocality}`;
  } else {
    msg = `There has been a magnitude ${magnitudeNice} quake ${relativeTime} ago, ${distanceOrLocality}`;
  }

  return Promise.resolve({
    success: true,
    message: msg
  });
};
