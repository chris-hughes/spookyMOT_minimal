
var fs = require('fs'),
	csv = require('csv'),
	Stringifier = require('newline-json').Stringifier,
	es = require('event-stream'),
	scrape = require('./scrape');

var out = fs.createWriteStream('test_vehicles_OUT.csv')

fs.createReadStream('test_vehicles.csv')
	.pipe(csv.parse())
	.pipe(es.map(function(data, callback){
		scrape(data[0], data[1], callback)
	}))
	.pipe(new Stringifier)
	.pipe(out)

