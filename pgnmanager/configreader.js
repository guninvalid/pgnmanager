/**
 * configreader.js
 * 	This is essentially a library class which reads the configuration
 * 	file and sets defaults for values that are not set or are blank.
 * 
 * 	@export configreader 
 * 		The function that reads the config. If you just want the config,
 * 		you can do something like:
 * 		const config = require('./configreader.js').configreader();
 */

const fs = require('fs');
const parse = require('comment-json').parse;

/**
 * 	readConfig
 * 	As the name suggests.
 * 	This function uses kaelzhang's comment-json npm module.
 * 	
 * 	@return an object with the config options set
 * 	@TODO make this work for any parameter file
 * 	@TODO read from pgnmanager.conf.d
 */
function readConfig() {
	
	var config = parse(fs.readFileSync("./pgnmanager.conf").toString());
	
	// Has the user been set? If not, set it to default.
	if (config.user == null || config.user === "") {
		
		config.user = "GothamChess";
		
	}
	
	// Has the month been configured? If not, set it to the 
	// current month.
	if (config.months == null) {
		
		var now = new Date();
		
		config.months = [
			
			{
				
				year: now.getFullYear(),
				months: [now.getMonth() + 1],
				
			},
			
		];
		
	}
	
	// Has the lineBreakString config been set? If not, set 
	// it to the default.
	if (config.lineBreakString == null) {
		
		config.lineBreakString = "-";
		
	}
	
	// Has the excess behavior been set to a valid value? If not,
	// set it to default.
	if (config.lineBreakExcessBehavior == null) {
		
		config.lineBreakExcessBehavior = "cut";
		
	} else {
		
		switch (config.lineBreakExcessBehavior) {
			
			// Recognized configs
			case "cut": case "complete": case "stop":
				break;
				
			// Anything else gets set to default
			default:
				config.lineBreakExcessBehavior = "cut";
			
		}
		
	}
	
	// Has the user set line padding? If not, set it to 0.
	if (config.lineBreakPadding == null) {
		
		config.lineBreakPadding = 0;
		
	}
	
	// Has the tabWidth config been set? If not, set it to
	// the default.
	if (config.tabWidth == null) {
		
		config.tabWidth = 4;
		
	}
	
	return config;
	
}

// This is probably the wrong way to do it but whatever :p
exports.readConfig = readConfig;