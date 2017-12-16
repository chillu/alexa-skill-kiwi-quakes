const assert = require("assert");
const sinon = require("sinon");
const expect = require("chai").expect;
const findQuake = require("../../intents/find-quake");
const fixtureQuakesNone = require("../fixtures/quakes-none");
const fixtureQuakesRecent = require("../fixtures/quakes-recent");
const fixtureQuakesOld = require("../fixtures/quakes-old");

const currDate = "2017-12-15T11:11:11.000Z"; // just after last quake

describe("findQuake", function() {
  it("should tell you the most recent quake", () => {
    const data = Promise.resolve(fixtureQuakesRecent);
    return findQuake(data, currDate).then(msg => {
      expect(msg).to.contain("There has been a magnitude 3 quake");
    });
  });
});
