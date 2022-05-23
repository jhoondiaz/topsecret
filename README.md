# Test-Mutant

[![node](https://img.shields.io/badge/node-v16.9.1-yellow.svg)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-v8.1.0-red.svg)](https://www.npmjs.com/)

>Project in NodeJS and AWS, which allows the user to detect the position and encode a message based on the data sent to 3 satellites.


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node](https://nodejs.org)
* [NPM](hhttps://www.npmjs.com/)
* [Postman](https://www.postman.com/downloads/)(Recommended)

## Usage

to use the service that processes satellites array:
  * in Postman create a new request of type POST
  * copy and paste the following URL: https://cc1hmhx8bb.execute-api.us-east-2.amazonaws.com/v1/topsecret
  * in the body of the request add an object of type JSON with the following structure: 
  >`{
    "satellites": [
        {
            "name": "kenobi",
            "distance": 400.5,
            "message": ["este", "", "", "mensaje", "","","la"]
        },
        {
            "name": "skywalker",
            "distance": 671.9,
            "message": ["", "es", "", "", "secreto","para","","","","bien"]
        },
        {
            "name": "sato",
            "distance": 100,
            "message": ["este", "", "un", "", "","","","gente","de"]
        }
    ]
}`
  * execute the request

to use the service that processes distances from satellites to a specific position:
  * in Postman create a new request of type POST
  * copy and paste the following URL: https://cc1hmhx8bb.execute-api.us-east-2.amazonaws.com/v1/topsecret
  * in the body of the request add an object of type JSON with the following structure: 
  >`{
    "position":{
        "x": -500,
        "y": 100
    } 
}`
  * execute the request


to use the service that independently stores sent distances:
  * in Postman create a new request of type POST
  * copy and paste the following URL: https://cc1hmhx8bb.execute-api.us-east-2.amazonaws.com/v1/topsecret_split/{satellite_name}
  * in satellite_name options: kenobi,skywalker,sato
  * in the body of the request add an object of type JSON with the following structure: 
  >`{
    "distance": 1000,
    "message": ["este", "", "un", "", "","","","gente","de"]
}`
  * execute the request


to use the service that processes satellites array:
  * in Postman create a new request of type GET
  * copy and paste the following URL: https://cc1hmhx8bb.execute-api.us-east-2.amazonaws.com/v1/topsecret_split/{satellite_name}
  * in satellite_name options: kenobi,skywalker,sato
  * no body required
  * execute the request

## Installation

* `git clone git@github.com:jhoondiaz/topsecret.git` this repository
* change into the new directory `cd test-mutant`

## Dependencies

Run `npm install` to install project dependencies.

## Build

Run `npm run build` to build the project. The build artifact (a .zip file containing your package and its dependencies) will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

## Contributing

If you find this repo useful here's how you can help:

1. Send a Merge Request with your awesome new features and bug fixes
2. Wait for a Coronita :beer: you deserve it.

## Further Reading / Useful Links

* [NodeJs](https://nodejs.org/en/about/)
* [NPM](https://www.npmjs.com/)
