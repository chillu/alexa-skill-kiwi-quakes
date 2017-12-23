const differenceInHours = require("date-fns/difference_in_hours");
const distanceInWords = require("date-fns/distance_in_words");
const subSeconds = require("date-fns/sub_seconds");
const { convertToSecond } = require("duration-iso-8601");

// Config
const defaultHoursAgo = 6;

/**
 * @param {Array} quakes
 * @param {Object} options.
 *   - since:  ISO 8601 relative duration
 *   - currDate:  For mocking purposes
 * @return {Promise}
 */
module.exports = function(quakes, { since = "PT6H", currDate }) {
  if (!currDate) {
    currDate = new Date();
  }

  const sinceDate = subSeconds(currDate, convertToSecond(since));
  const sinceNice = distanceInWords(sinceDate, currDate);
  console.log(since);
  console.log(sinceDate);
  console.log(sinceNice);
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

  const hasQuake =
    differenceInHours(new Date(time), currDate) >= -1 * defaultHoursAgo;

  if (!hasQuake) {
    return Promise.resolve({
      success: false,
      message: `No quakes found since ${sinceNice} ago`
    });
  }

  const relativeTime = distanceInWords(new Date(time), currDate, {
    includeSeconds: false
  });

  return Promise.resolve({
    success: true,
    message: `There has been a magnitude ${mmi} quake ${relativeTime} ago, ${locality}`
  });
};
