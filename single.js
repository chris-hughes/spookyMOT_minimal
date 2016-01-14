var scrape = require('./scrape')


scrape('OY55 JZA', 'NISSAN', function(err, data) {

	console.log("got data!", data)

})

scrape('M99 LOT', 'LOTUS', function(err, data) {

	console.log("got data!", data)

})
