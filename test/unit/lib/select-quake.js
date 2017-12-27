const assert = require("assert");
const sinon = require("sinon");
const expect = require("chai").expect;
const selectQuake = require("../../../src/lib/select-quake");
const fixQuakeOldMag3 = require("../../fixtures/quake-old-mag3");
const fixQuakeRecentMag2 = require("../../fixtures/quake-recent-mag2");
const fixQuakeRecentMag3 = require("../../fixtures/quake-recent-mag3");
const fixQuakeRecentMag4 = require("../../fixtures/quake-recent-mag4");

const currDate = "2017-12-15T11:11:11.000Z"; // just after last quake

function getFixture(quakes) {
  return {
    type: "FeatureCollection",
    features: quakes
  };
}

describe("selectQuake", function() {
  it("should tell you the most recent quake if there was one", () => {
    const quakes = getFixture([fixQuakeRecentMag3, fixQuakeRecentMag4]);
    return selectQuake(quakes, { currDate }).then(res => {
      expect(res.message).to.contain("There have been 2 quakes");
    });
  });
  it("should tell you if there was no recent quake", () => {
    const quakes = getFixture([fixQuakeOldMag3]);
    return selectQuake(quakes, { currDate }).then(res => {
      expect(res.message).to.contain("No quakes found");
    });
  });
  it("should tell you if there was no quakes at all", () => {
    const quakes = getFixture([]);
    return selectQuake(quakes, { currDate }).then(res => {
      expect(res.message).to.contain("No quakes found");
    });
  });
  it("should convert relative time", () => {
    const quakes = getFixture([fixQuakeOldMag3]);
    const since = "PT24H";
    return selectQuake(quakes, { since, currDate }).then(res => {
      expect(res.message).to.contain("No quakes found in the last day");
    });
  });
  it("should optionally include location", () => {
    const quakes = getFixture([fixQuakeRecentMag3]);
    const latLng = { latitude: -42.3, longitude: 173.8 };
    return selectQuake(quakes, { latLng, currDate }).then(res => {
      expect(res.message).to.contain("5 kilometers away");
    });
  });
});
