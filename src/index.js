"use strict";

const Alexa = require("alexa-sdk");
const Geonet = require("./lib/geonet");
const findQuake = require("./intents/find-quake");

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  LaunchRequest: function() {
    this.response.speak(
      "You can try: 'alexa, ask kiwi quakes if this was an earthquake'"
    );
    this.emit(":responseReady");
  },
  FindQuakeIntent: function() {
    findQuake(Geonet.quakes()).then(res => {
      this.response.speak(res.message);
      this.emit(":responseReady");
    });
  },
  SessionEndedRequest: function() {
    console.log("Session ended with reason: " + this.event.request.reason);
  },
  "AMAZON.StopIntent": function() {
    this.response.speak("Bye");
    this.emit(":responseReady");
  },
  "AMAZON.HelpIntent": function() {
    this.response.speak(
      "You can try: 'alexa, ask kiwi quakes if this was an earthquake'"
    );
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak("Bye");
    this.emit(":responseReady");
  },
  Unhandled: function() {
    this.response.speak(
      "Sorry, I didn't get that. You can try: 'alexa, ask kiwi quakes if this was an earthquake'"
    );
  }
};
