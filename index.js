
var fs = require('fs'),
	csv = require('csv'),
	Stringifier = require('newline-json').Stringifier,
	es = require('event-stream'),
	scrape = require('./scrape');

var out = fs.createWriteStream(process.argv[2].slice(0,-4)+'_out.jsonl')


fs.createReadStream(process.argv[2])
	.pipe(csv.parse())
	.pipe(es.map(function(data, callback){
		scrape(data[0], data[1], callback)
	}))
	.pipe(new Stringifier)
	.pipe(out)

