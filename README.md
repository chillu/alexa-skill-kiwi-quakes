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

The project is hard-wired to a certain AWS stack (see `.ask/config`).
You'll need to use [ask clone](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#clone-command)
to create your own version.

Now copy `config.default.json` to `config.json` and set your
[Google API key](https://developers.google.com/maps/documentation/geocoding/get-api-key)
(required for geocoding lookups);

## Usage

Full deploy (AWS skills, models and lambda function)

```
npm run ask -- deploy --target skill
npm run serverless -- deploy
```

In case you're running a custom AWS profile (example: `kiwiquakes`):

```
npm run ask -- deploy --target skill -p kiwiquakes
npm run serverless -- deploy --awsProfile kiwiquakes
```

While the skill model is mostly definable as JSON in `models/`,
the [dialog model](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html)
can't be defined in this way yet. You'll need to go into the
[Alexa Skills Builder](https://developer.amazon.com/alexacreator/)
and paste in the `interaction-model.json` file.

## Testing

Uses [Mocha](http://http://mochajs.org/).

```
npm test
```
