"use strict";

const Alexa = require("alexa-sdk");
const getQuakes = require("./lib/geonet").getQuakes;
const selectQuake = require("./lib/select-quake");
const NodeGeocoder = require("node-geocoder");
const setLocation = require("./lib/set-location");

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.dynamoDBTableName = "usersTable";
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
    getQuakes().then(quakes => {
      selectQuake(quakes).then(res => {
        this.response.speak(res.message);
        this.emit(":responseReady");
      });
    });
  },
  FindQuakeSinceIntent: function() {
    getQuakes().then(quakes => {
      const { slots } = this.event.request.intent;
      selectQuake(quakes, { since: slots.Duration.value }).then(res => {
        this.response.speak(res.message);
        this.emit(":responseReady");
      });
    });
  },
  SetLocationIntent: function() {
    const { userId } = this.event.session.user;
    const { slots } = this.event.request.intent;
    const geocoder = NodeGeocoder({
      provider: "google",
      apiKey: process.env.GOOGLE_API_KEY
    });
    console.log("GOOGLE_API_KEY", process.env.GOOGLE_API_KEY);

    // Value not filled
    if (!slots.City.value) {
      const speechOutput =
        "What's your location? Use your city for best results";
      const repromptSpeech = speechOutput;
      return this.emit(":elicitSlot", "City", speechOutput, repromptSpeech);
    }

    geocoder
      .geocode({ address: slots.City.value, country: "New Zealand" })
      .then(results => {
        console.log("results", results);
        // TODO Handle no places found

        const result = results[0];
        const { latitude, longitude, formattedAddress } = result;
        this.attributes.latLng = { latitude, longitude };

        // Slot value is not confirmed
        this.response.speak(`Setting your location to ${formattedAddress}`);
        this.emit(":responseReady");
      })
      .catch(() => {
        // TODO Handle generic error (e.g. API limits)
        const speechOutput =
          "Sorry, I couldn't find a location. Use your city for best results";
        const repromptSpeech = speechOutput;
        this.emit(":elicitSlot", "City", speechOutput, repromptSpeech);
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
