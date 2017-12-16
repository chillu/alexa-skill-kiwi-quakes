# Alexa Skill for New Zealand Earthquakes

## Requirements

* Node 6.x or newer
* [Alexa Ask CLI](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html)
* A working AWS account

## Setup

```
npm install
```

The project is hard-wired to a certain AWS stack (see `.ask/config`).
You'll need to use [ask clone](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#clone-command) to create your own version.

## Usage

Full deploy (AWS skills, models and function)

```
npm run deploy
```

## Testing

Uses [Mocha](http://http://mochajs.org/).

```
npm test
```
