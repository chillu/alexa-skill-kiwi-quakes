# Alexa Skill for New Zealand Earthquakes

[![Build Status](https://travis-ci.org/chillu/alexa-skill-kiwi-quakes.svg?branch=master)](https://travis-ci.org/chillu/alexa-skill-kiwi-quakes)

New Zealanders often ask themselves: Was that an earthquake,
a truck going past, or just the wind? Now you can ask Alexa!

Examples:

* "Alexa, ask kiwi quakes if this was an earthquake"

We acknowledge the awesome New Zealand GeoNet project and its sponsors EQC,
GNS Science and LINZ, for providing data used in this app.
Check their [API](https://api.geonet.org.nz) and
[data policy](http://www.geonet.org.nz/policy).

Under the hood, it uses [AWS Lambda](https://aws.amazon.com/lambda/) functions
deployed through the [Serverless Framework](http://serverless.com).

## Requirements

* Node 6.x (latest version supported by AWS Lambda)
* [Alexa Ask CLI](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html)
* A working AWS account

## Setup

```
npm install
```

Now copy `config.default.json` to `config.json` and set your
[Google API key](https://developers.google.com/maps/documentation/geocoding/get-api-key)
(required for geocoding lookups).

## Usage

First, create two skills in Alexa: `dev` and `prod`.
Then, adjust the skill ids and AWS profiles accordingly in `package.json`.
More details can be found in the [Alexa Starter Template](https://github.com/rmtuckerphx/alexa-skill-serverless-starter-template)

* `npm run deploy:dev`: Deploys skill, model and function (dev stage)
* `npm run deploy:dev:sls`: Deploys function (dev stage)
* `npm run deploy:dev:skill`: Deploys skill (dev stage)
* `npm run deploy:dev:model`: Deploys model (dev stage)
* `npm run deploy:prod`: Deploys skill, model and function (prod stage)
* `npm run deploy:prod:sls`: Deploys function (prod stage)
* `npm run deploy:prod:skill`: Deploys skill (prod stage)
* `npm run deploy:prod:model`: Deploys model (prod stage)

Note that utterances in `models/` should be regenerated
manually via `util/generate-utterances.js` at the moment.

## Testing

Uses [Mocha](http://http://mochajs.org/).

```
npm test
```
