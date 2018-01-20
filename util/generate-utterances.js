// Generates utterance variations
// Needs to be copied manually into the right place in models/ at the moment

const utterances = require("alexa-utterances");

var dictionary = {
  this: ["this", "that", "there"],
  quake: ["a quake", "an earthquake"]
};
var slots = {};
var templates = [
  "check if {this} was {quake}",
  "was {this} {quake}",
  "if {this} was {quake}",
  "is {this} {quake}",
  "did we have {quake}",
  "check if there was {quake} in the last {-|Duration}",
  "was there {quake} in the last {-|Duration}",
  "if there was {quake} in the last {-|Duration}",
  "did we have {quake} in the last {-|Duration}"
];

const resultsGrouped = templates.map(template =>
  utterances(template, slots, dictionary)
);
const results = [].concat(...resultsGrouped);

console.log(JSON.stringify(results));
