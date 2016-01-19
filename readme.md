# Spooky MOT

Web scraper to collect vehicle MOT history

## Installation

### Prerequisites

* [Node.js](http://nodejs.org) >= 0.8
* [PhantomJS](http://phantomjs.org/) >= 1.9
* [CasperJS](http://casperjs.org/) >= 1.0

Install dependencies using npm

``` shell
$ npm install
```

## Usage

Save the test_vehicle.csv in the root directory which must follow the structure of the example csv. You can then run the scaper like so

```shell
$ node index.js
```

This will output a [JSON Lines](http://jsonlines.org/) file to the root directory.

## Updating

The backend code that reads/writes files and queues the scrapes shouldn't need updating. If the mot history web page changes you will need to update the front end code. This will involve updating the spooky steps in scrape.js and/or updating the jquery in datascrape.js

## Testing

Testing is limited. If you want to test the front end scraping code you can run a single vehicle through the front end code and bypass the backend queing logic using

```shell
$ node single.js
```

This can also be useful if you are only interested in scraping one vehicle. You just need to change the hardcoded vehicle details in single.js. (Note this will not output a file and will simply log to the console)

## To do

- parse the .jsonl file into something usable
- create an example vehicle csv
- make the input file an arguement (so you can have different names for input file. ie. Jan/Feb)
- change the output file type to .jsonl
- throttle it