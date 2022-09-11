const readConfig = require("./configreader.js").readConfig;
const PGN = require("./PGN.js").PGN;
const https = require("https");
const Move = require("./Move.js").Move;
const readline = require("readline");
const config = readConfig();

function fetch(url) {
	
	return new Promise(resolve => {
		
		https.get(url, response => {
			
			var json = "";
			
			response.on("data", (data) => {
				
				json += data;
				
			});
			
			response.on("end", () => {
				
				resolve(then(json, url));
				
			});
			
			response.on("error", (error) => {
				
				console.log(error.message);
				
			});
			
		});
		
	});
	
}

function then(data, url) {
	
	var json = JSON.parse(data);
	data = json;
	console.log("Fetched " + url);
	return data.games;
	
}

function readInput(stdin) {
	
	return new Promise(resolve => {
		
		stdin.on('line', line => {
			
			resolve(line);
			stdin.removeAllListeners();
			
		});
		
	})
	
}

function lengthWithTabs(s) {
	
	var length = 0;
	var tab = s.indexOf("\t");
	
	while (tab != -1) {
		
		length += (Math.floor(tab / config.tabWidth) + 1) * config.tabWidth;
		s = s.substring(tab + 1);
		tab = s.indexOf("\t");
		
	}
	
	length += s.length;
	return length;
	
}

async function main() {
	
	var pgns = [];
	var i = 0;
	var totalstarttime = Date.now();
	
	for (year of config.months) {
		
		for (month of year.months) {
			
			var monthstarttime = Date.now();
			var startsize = i;
			var url = "https://api.chess.com/pub/player/" + config.user + "/games/" + year.year + "/" 
					+ ("0" + month).slice(-2);
			var blob = await fetch(url);
			
			for (game of blob) {
				
				pgns[i] = new PGN(game.pgn, config.user);
				i++;
				
			}
			
			console.log((i - startsize) + " records fetched and interpreted in " + (Date.now() - monthstarttime) + " milliseconds");
			
		}
		
	}
	
	console.log("====\n" + pgns.length + " records fetched and interpreted in " + (Date.now() - totalstarttime) + " milliseconds\n====");
	
	process.stdout.write("Building tree... ");
	var tree = new Move("games");
	tree.add("white");
	tree.add("black");
	tree.count = 0;
	tree.children["white"].count = 0;
	tree.children["black"].count = 0;
	
	for (pgn of pgns) {
		
		if (pgn.moves == null || Symbol.iterable in pgn.moves) {
			
			console.log("Offending PGN: " + pgn);
			console.log("I don't know what's happened. I will skip it.");
			continue;
			
		}
		
		tree.count++;
		var cursor = tree.children[pgn.side];
		cursor.count++;
		
		if (pgn.win()) {
			
			tree.wins++;
			cursor.wins++;
			
		}
		
		if (pgn.loss()) {
			
			tree.losses++;
			cursor.losses++;
			
		}
		
		if (pgn.draw()) {
			
			tree.draws++;
			cursor.draws++;
			
		}
		
		for (move of pgn.moves) {
			
			cursor.add(move);
			cursor = cursor.children[move];
			
			if (pgn.win()) {
				
				cursor.wins++;
				
			}
			
			if (pgn.loss()) {
				
				cursor.losses++;
				
			}
			
			if (pgn.draw()) {
				
				cursor.draws++;
				
			}
			
		}
		
	}
	
	tree.sort();
	console.log("Done");
	var cursor = tree;
	var flag = true;
	
	const stdin = readline.createInterface({
		
		input: process.stdin, 
		output: process.stdout, 
		
	});
	
	while (flag) {
		
		var i = 5;
		var minLineBreakLength = 0;
		var lines = [
			
			"Cursor: ", 
			cursor.prompt(), 
			undefined, 
			"", 
			"Moves: ",
			
		];
		
		var length = lengthWithTabs(lines[1]);
		lines[2] = config.lineBreakString.repeat(length).substring(0, length);
		
		for (child of cursor.children) {
			
			lines[i] = child.prompt();
			i++;
			
		}
		
		for (line of lines) {
			
			console.log(line);
			
		}
		
		process.stdout.write("\nSelect move: ");
		var input = await readInput(stdin);
		
		switch(input) {
			
			case "exit":
				
				console.log("Bye");
				flag = false;
				process.exit(0);
				break;
				
			case "..": case "back":
				
				if (cursor.parent != null) {
					
					console.log("There's nowhere to go back to!");
					cursor = cursor.parent;
					
				}
				
				break;
				
			default:
				
				var child = null;
				
				for (move of cursor.children) {
					
					if (input === move.name) {
						
						child = move;
						
					}
					
				}
				
				if (child == null) {
					
					console.log("That move does not exist or has not been played.");
					
				} else {
					
					cursor = child;
					
				}
				
				break;
				
			
		}
		
	}
	
	stdin.close();
	
}

main();