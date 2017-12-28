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
(required for geocoding lookups);

## Usage

Full deploy (AWS skills, models and lambda function).
Adjust the skill id and AWS profile accordingly in `package.json`.

* `npm run update-skill`: Deploys skill
* `npm run update-model`: Deploys model
* `npm run deploy`: Deploys lambda function

## Testing

Uses [Mocha](http://http://mochajs.org/).

```
npm test
```
