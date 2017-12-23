const assert = require("assert");
const sinon = require("sinon");
const expect = require("chai").expect;
const selectQuake = require("../../../src/lib/select-quake");
const fixtureQuakesNone = require("../../fixtures/quakes-none");
const fixtureQuakesRecent = require("../../fixtures/quakes-recent");
const fixtureQuakesOld = require("../../fixtures/quakes-old");

const currDate = "2017-12-15T11:11:11.000Z"; // just after last quake

describe("selectQuake", function() {
  it("should tell you the most recent quake if there was one", () => {
    return selectQuake(fixtureQuakesRecent, { currDate }).then(res => {
      expect(res.message).to.contain("There have been 2 quakes");
    });
  });
  it("should tell you if there was no recent quake", () => {
    return selectQuake(fixtureQuakesOld, { currDate }).then(res => {
      expect(res.message).to.contain("No quakes found");
    });
  });
  it("should tell you if there was no quakes at all", () => {
    return selectQuake(fixtureQuakesNone, { currDate }).then(res => {
      expect(res.message).to.contain("No quakes found");
    });
  });
  it("should convert relative time", () => {
    const since = "PT24H";
    return selectQuake(fixtureQuakesNone, { since, currDate }).then(res => {
      expect(res.message).to.contain("No quakes found since 1 day ago");
    });
  });
  it("should optionally include location", () => {
    const latLng = { latitude: 173.8478163, longitude: -41.33280867 };
    return selectQuake(fixtureQuakesRecent, { latLng, currDate }).then(res => {
      expect(res.message).to.contain("111 kilometers away");
    });
  });
});
