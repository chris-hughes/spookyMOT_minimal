function scrape(){
	var chris = [];

	function uniq(a){
		var seen = {};
		return a.filter(function(item){
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	}

	$('.testresult').each(function(test){
		var mot = {};

		var id = test;
		mot["mot_id"] = test;

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
				mot[name] = fields[1];
			} else if (fields.length>2){
				fields.shift(); // removes the first value which is used as the name
				fields = uniq(fields);
				fields.shift(); // really bad, for some reason the first value is always ""
				var reasons = fields.reduce(function(o,v,i){
					o[i] = v;
					return o;
				}, {});

				mot[name] = reasons;
			}
		});
		return mot;
		chris.push(mot);
	});
}

module.exports = scrape;