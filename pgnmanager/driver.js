/**
 * 	driver.js
 * 	This is the driver file. This file is mostly an example, though: these are 
 * 	the use cases for my other handlers.
 */

async function main() {
	
	// Loading config.
	const config = readConfig();
	
	// Getting data from the servers.
	var data = await fetchData(config.user, config.months);
	
	// 
	var pgns = PGN.parse(data);
	var tree = new MoveTree(pgns);
	
}

main();