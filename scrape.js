var request = require("request"),
	cheerio = require("cheerio");

function uniq(a){
	var seen = {};
	return a.filter(function(item){
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
}

function getData(regno, manu, callback) {

	request.post(
		{	url: "https://www.check-mot.service.gov.uk/",
  			form: {registration: regno, manufacturer: manu}
		},
  		function(err,httpResponse,body){
	  		if (err) {
				console.log("We’ve encountered an error: " + error);
				callback(err);
				return;
			} else {

				var $ = cheerio.load(body),
		    	chris = [];

				$('.testresult').each(function(test){
					var mot_test = {};

					$(this).children().each(function(row){
						var fields = [];

						$(this).children().each(function(d){
							if ($(this).children()[0]){
								fields.push($(this).children().first().text());

								$(this).children('.group').each(function(a){
									fields.push($(this).text());
								})
							} else {
								fields.push($(this).text());
							}
						});

						var name = fields[0].replace(/\s+/g,'').replace(/[{()}]/g,'');
						
						if (fields.length==2){
							mot_test[name] = fields[1];
						} else if (fields.length>2){
							fields.shift(); // removes the first value which is used as the name
							fields = uniq(fields);
							fields.shift(); // really bad, for some reason the first value is always ""

							mot_test[name] = fields;
						}
					});
					chris.push(mot_test);
				});

				var mot = {};
				mot["Regno"] = regno;
				mot["Tests"] = chris;

				console.log(mot);
				callback(null,mot);
				return;
			
			}
		}	
	)
}


var async = require('async')

var queue = async.queue(function (deets, callback) {

	getData(deets.reg, deets.manu, function(err, data){
		deets.callback(err, data);
		callback(err, data)
	})

}, 1);


module.exports = function(a, b, callback) {
	
	queue.push({
		reg: a,
		manu: b,
		callback: callback
	})
}