/**
 * 	PGN.js
 * 	This is the PGN class. It's not really a PGN; it's more like a list 
 * 	of moves along with the side and result.
 * 	
 * 	@export PGN- the class... what did you think it would be?
 */

class PGN {
	
	// This is because I have chronic Java brain
	// It also doubles as property documentation
	
	/**
	 * 	
	 * 	Which side am I playing as? White or Black?
	 * 		I thought about making this a boolean value but that would
	 * 				have been a headache
	 * 	String side;
	 * 	
	 * 	How did the game go? Win, loss, or draw?
	 * 		Possible values: "won", "lost", "drawn"
	 * 	String result;
	 * 	
	 * 	Moves in order. Not differentiated by side: that's your problem lol
	 * 		e.g. ["e4", "d5", "exd5", "Nf6", "Nc3", "Nxd5", "Nxd5", "Qxd5"]
	 * 	String[] moves;
	 * 	
	 */
	
	/**
	 * 	
	 * 	Constructor:
	 * 	Constructs PGN objects out of actual PGNs. This may or may not work
	 * 	with enclosed PGNs (I wouldn't know), but it's intended for use with
	 * 	actual PGNs.
	 * 	
	 * 	@param pgn-	The text of the PGN itself
	 * 	@param user-	The user being observed. This is probably config.user 
	 * 					but can be any user.
	 * 	
	 */
	constructor(pgn, user) {
		
		var lines = pgn.split(/\n/);
		
		for (var line of lines) {
			
			// There's probably a better way to read PGNs (like a library)
			// but this will work
			if (line[0] === '[') {
				
				line = line.substring(1, line.length - 1);
				var tokens = line.split(" ");
				
				switch (tokens[0]) {
					
					// Screening for who's playing white
					case "White": 
						
						// Is it me? No? Ok
						if (tokens[1] === "\"" + user + "\"") {
							
							this.side = "white";
							
						}
						
						break;
						
					// Screening for who's playing black
					case "Black":
						
						// Is it me? Also no? ok
						if (tokens[1] === "\"" + user + "\"") {
							
							this.side = "black";
							
						}
						
						break;
						
					// Screening for the result
					case "Result":
						
						switch (tokens[1]) {
							
							// Hey look, it was a win! Oh wait, I was playing as
							// white? Okay then.
							case "\"0-1\"":
								
								if (this.white()) {
									
									this.result = "lost";
									
								} else {
									
									this.result = "won";
									
								}
								
								break;
								
							// Hey look, I lost :()
							case "\"1-0\"":
								
								if (this.white()) {
									
									this.result = "won";
									
								} else {
									
									this.result = "lost";
									
								}
								
								break;
								
							// Eric Rosen moment
							case "\"1/2-1/2\"":
								
								this.result = "drawn";
								
								break;
								
							
						}
						
						break;
						
					
				}
				
			} else if (line[0] === "1") {
				
				this.moves = [];
				var i = 0;
				var length = 0;
				
				for (var move of line.split(' ')) {
					
					// I am way too proud of this regex. Feel free to steal it. 
					// It's just matches chess moves. 
					// If you get strange behavior with this, consider taking off 
					// the ^ and $.
					if (move.match(/^((O\-O)|(O\-O\-O)|([a-hRQNBK][a-h]?[1-8]?x?[a-hA-H]{0,2}[1-8])|([a-h](x[a-h])?[18]=[QRBN]))[+#]?$/)) {
						
						this.moves[i] = move;
						i++;
						
					}
					
					if (move.match(/\d+[.]{1,3}/)) {
						
						length = Math.max(length, parseInt(move));
						
					}
					
				}
				
				if (Math.floor((this.moves.length + 1) / 2) != length) {
					
					console.log("Something has gone wrong! I probably missed a move or overcounted one! Will now print the PGN and parsed move list:");
					console.log(pgn);
					console.log(this.moves);
					
				}
				
			}
			
		}
		
	}
	
	// Am I playing as white?
	white() {
		
		return this.side === "white";
		
	}
	
	// Am I playing as black?
	black() {
		
		return this.side === "black";
		
	}
	
	// Did I win?
	win() {
		
		return this.result === "won";
		
	}
	
	// Did I lose?
	loss() {
		
		return this.result === "lost";
		
	}
	
	// Timeout vs insufficient material moment
	draw() {
		
		return this.result === "drawn";
		
	}
	
}

exports.PGN = PGN;