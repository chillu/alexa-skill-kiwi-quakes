const differenceInHours = require("date-fns/difference_in_hours");
const distanceInWords = require("date-fns/distance_in_words");

// Config
const defaultHoursAgo = 6;

module.exports = function(quakesFn, currDate) {
  if (!currDate) {
    currDate = new Date();
  }

  // Can't use async/await in NodeJS 6 on Lambda, sigh...
  return quakesFn().then(quakes => {
    const quake = quakes.features[0];
    const { time, locality, mmi } = quake.properties;

    const hasQuake =
      differenceInHours(new Date(time), currDate) <= defaultHoursAgo;

    if (!hasQuake) {
      return `No quakes found in the last ${defaultHoursAgo} hours`;
    }

    const relativeTime = distanceInWords(new Date(time), currDate, {
      includeSeconds: false
    });
    return `There has been a magnitude ${mmi} quake ${relativeTime} ago, ${locality}`;
  });
};
