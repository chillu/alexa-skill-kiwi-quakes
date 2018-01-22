"use strict";

const Alexa = require("alexa-sdk");
const getQuakes = require("./lib/geonet").getQuakes;
const selectQuake = require("./lib/select-quake");
const geocode = require("./lib/geocode");
require("source-map-support").install();

const stage = process.env.STAGE;
const appId = process.env.APP_ID;
const googleApiKey = process.env.GOOGLE_API_KEY;

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.dynamoDBTableName = `usersTable-${stage}`;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const defaults = {
  since: "PT10M" // 10 minutes
};

const handlers = {
  LaunchRequest: function() {
    this.response.speak(
      "You can try: 'alexa, ask kiwi quakes if this was an earthquake'"
    );
    this.emit(":responseReady");
  },
  FindQuakeIntent: function() {
    const { slots } = this.event.request.intent;
    const since = slots.Duration.value ? slots.Duration.value : defaults.since;

    const getLocationPromise = new Promise((resolve, reject) => {
      const { latLng } = this.attributes;
      const sysContext = this.event.context.System;
      console.log("this.attributes", this.attributes);
      console.log("sysContext", sysContext);

      if (latLng) {
        // Use cached address for performance
        // TODO Cache expiry
        resolve(latLng);
      } else if (!sysContext.user.permissions) {
        // User hasn't provided permissions
        console.log("null");
        resolve(null);
      } else {
        // Get device location and resolve to coordinates
        const das = new Alexa.services.DeviceAddressService();
        das
          .getCountryAndPostalCode(
            sysContext.device.deviceId,
            sysContext.apiEndpoint,
            sysContext.user.permissions.consentToken
          )
          .then(data => {
            console.log("data", data);

            // Only geocode with viable data
            if (!data.postalCode) {
              resolve(null);
            }

            // Don't try to resolve overseas addresses
            if (data.countryCode !== "NZ") {
              resolve(null);
            }

            geocode({ zipcode: data.postalCode, apiKey: googleApiKey }).then(
              result => {
                console.log("result", result);
                const { latitude, longitude } = result;
                resolve({ latitude, longitude });
              }
            );
          })
          .catch(error => {
            reject(error);
          });
      }
    });

    const getQuakesPromise = getQuakes();

    // Resolve concurrently
    Promise.all([getQuakesPromise, getLocationPromise]).then(
      ([quakes, latLng]) => {
        // Store user data
        this.attributes.latLng = latLng;

        // Find the most appropriate quake
        selectQuake(quakes, { since, latLng }).then(res => {
          const msg = res.message;
          this.response.speak(msg);
          this.emit(":responseReady");
        });
      }
    );
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
      "You can try: 'alexa, ask kiwi quakes if this was an earthquake'. " +
        "For more accurate information, say 'alexa, tell kiwi quakes to set my location to post code'"
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
