const differenceInHours = require("date-fns/difference_in_hours");
const distanceInWords = require("date-fns/distance_in_words");

// Config
const defaultHoursAgo = 6;

module.exports = function(quakesPromise, currDate) {
  if (!currDate) {
    currDate = new Date();
  }

  // Can't use async/await in NodeJS 6 on Lambda, sigh...
  return quakesPromise.then(quakes => {
    const quake = quakes.features[0];
    if (!quake) {
      return {
        success: false,
        message: `No quakes found in the last ${defaultHoursAgo} hours`
      };
    }

    const { time, locality, mmi } = quake.properties;

    const hasQuake =
      differenceInHours(new Date(time), currDate) >= -1 * defaultHoursAgo;

    if (!hasQuake) {
      return {
        success: false,
        message: `No quakes found in the last ${defaultHoursAgo} hours`
      };
    }

    const relativeTime = distanceInWords(new Date(time), currDate, {
      includeSeconds: false
    });

    return {
      success: true,
      message: `There has been a magnitude ${mmi} quake ${relativeTime} ago, ${locality}`
    };
  });
};
