# Spooky MOT

Web scraper to collect vehicle MOT history

## Installation

### Prerequisites

* [Node.js](http://nodejs.org) >= 0.8

Install dependencies using npm

``` shell
$ npm install
```

## Usage

Save the vehicle csv file in the root directory which must follow the structure of test_vehicles.csv. You can then run the scaper like so

```shell
$ node index.js [filename]
```

This will output a [JSON Lines](http://jsonlines.org/) file to the root directory.

## Updating

The backend code that reads/writes files and queues the scrapes shouldn't need updating. If the mot history web page changes you will need to update the front end code found in scrape.js

## Testing

Testing is limited. If you want to test the front end scraping code you can run a single vehicle through the front end code and bypass the backend queing logic using

```shell
$ node single.js
```

This can also be useful if you are only interested in scraping one vehicle. You just need to change the hardcoded vehicle details in single.js. (Note this will not output a file and will simply log to the console)

## To do

- parse the .jsonl file into something usable
- throttle it