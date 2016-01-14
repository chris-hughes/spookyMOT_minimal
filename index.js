
var fs = require('fs'),
	csv = require('csv'),
	Stringifier = require('newline-json').Stringifier,
	es = require('event-stream')

var out = fs.createWriteStream('test_vehicles_OUT.csv')


fs.createReadStream('test_vehicles.csv')
	.pipe(csv.parse())
	.pipe(es.map(function(data, callback){


		var result = {
			reg:data[0],
			times: Math.random()
		}

		callback(null, result)

		
	}))
	.pipe(new Stringifier)
	.pipe(out)

