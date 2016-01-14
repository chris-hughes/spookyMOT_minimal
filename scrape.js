var Spooky = require('spooky');

function getData(regno, manu, callback) {

	// var Spooky = require('spooky');

	var spooky = new Spooky({
		child: {
	        transport: 'http'
	    },
		casper: {
			logLevel: 'error',
	   		verbose: false,
	   		options: {
	     		clientScripts: ['./node_modules/jquery/dist/jquery.min.js']
	   		}
	  	}
	}, function (err) {

		console.log("YEAHJ?")

		if (err){
			e = new Error('Failed to initialize SpookyJS');
	        e.details = err;
	        throw e;
		}

		// var regno = 'OY55 JZA',
			// manu = 'NISSAN';

		// var regno = 'M99 LOT',
		// 	manu = 'LOTUS';

		spooky.start("https://www.check-mot.service.gov.uk/");

		spooky.then(function(){
			this.emit('emit', 'Loaded '+this.evaluate(function(){
				return document.title;
			}));
		});
			

		spooky.then([{
			regno: regno,
			manu: manu
		}, function(){
	    	this.fillSelectors('form#EVL', {
	        	'input[name="registration"]': regno,
	        	'input[name="manufacturer"]': manu,
	    	}, true); // true should submit but not working so next step clicks
		}])

		spooky.then(function(){
			this.click('.button');
		})

		spooky.then(function(){
			this.capture('foo.jpg', undefined, {
		        format: 'jpg',
		        quality: 75
		    });
		})

		spooky.then(function(){
			this.emit('emit', 'Snap taken');
		});

		spooky.then([{
			regno: regno,    // this passes from node/spooky to Casper
			manu: manu
		}, function(){
			this.emit('writeToMongo', this.evaluate(function(regno){			

				// this is datascrape.js - should move this out and require it
				var chris = [];

				function uniq(a){
					var seen = {};
					return a.filter(function(item){
						return seen.hasOwnProperty(item) ? false : (seen[item] = true);
					});
				}

				$('.testresult').each(function(test){
					var mot_test = {};

					// var id = test;              
					// mot_test["MOTid"] = test;   // removed this (see notes in ./model/mot.js)

					$(this).children().each(function(row){
						var fields = [];

						$(this).children().each(function(d){
							if ($(this).children()[0]){
								fields.push($(this).children(':first').text());

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

				return mot;

			},{regno:regno})) // this passes from Casper to the browser
		}])

		
		spooky.run();
	});

	// this needs to save to the database
	spooky.on('writeToMongo', function(a){
		// console.log(a);

		callback(null, a)
		
	});

	spooky.on('emit', function (msg) {
	    console.log(msg);
	});

	spooky.on('error', function (e, stack) {
	    console.error(e);

	    if (stack) {
	        console.log(stack);
	    }

	    callback(e)
	});

	// spooky.on('log', function (log) {
	//     if (log.space === 'remote') {
	//         console.log(log.message.replace(/ \- .*/, ''));
	//     }
	// });


}






// var spooky = new Spooky({
//         child: {
//             transport: 'http'
//         },
//         casper: {
//             logLevel: 'debug',
//             verbose: true
//         }
//     }, function (err) {
//         if (err) {
//             e = new Error('Failed to initialize SpookyJS');
//             e.details = err;
//             throw e;
//         }

//         spooky.start('http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');

//         spooky.then(function () {
//             this.emit('hello', 'Hello, from ' + this.evaluate(function () {
//                 return document.title;
//             }));
//         });
//         spooky.run();
//     });

// spooky.on('hello', function (e, stack) {
//     console.error(e);

//     if (stack) {
//         console.log(stack);
//     }
// });

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






