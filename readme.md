# srcom

A Node.js module that provides you with the ability to look up runs and rules from speedrun.com using the command line, in addition to posting runs.

![lookup world record](static/srcom-1.gif)

![post run](static/srcom-2.gif)

## Prerequisites

[Node.js](https://nodejs.org/en/download/) installed.

## Installation

```
npm i -g srcom
```

## Usage

Type `srcom` in a terminal/command line and follow the prompts.

### Notes

In order to post runs, you need an API key from [speedrun.com](https://www.speedrun.com/api/auth). srcom will prompt you for this if it is not present.

When searching for games, srcom will first check for an exact match with a game slug. This means if you know the slug for Super Mario World is 'smw', you can simply type in `smw` and srcom will find it.

Similarly, for users, srcom will first check for an exact match to a Twitch user name.