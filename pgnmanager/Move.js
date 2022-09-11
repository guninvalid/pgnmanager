/**
 * Move.js
 * This is basically a wrapper class around an ordinary TreeNode. It lets me
 * construct a tree of moves which is useful when examining my openings.
 * 
 * @export Move- 	the class lmao
 */

class Move {
	
	/**
	 * 	
	 * 	This is also because I have chronic Java brain
	 * 	
	 * 	As it says on the tin. These are the children of this TreeNode
	 * 	In practice, this means move that follow this. e.g. the move e4
	 * 	would have children including e5, d5, c5, c6, e6, d6, g6, etc.
	 * 	public Map<String, Move> children;
	 * 	
	 * 	The move that preceeded this. This is very commonly null.
	 * 	e.g. If the game went e4 d5 exd5 Nf6, d5 would have a parent e4.
	 * 	@Nullable public Move parent;
	 * 	
	 * 	The amount of times this move has been played.
	 * 	public int count;
	 * 	
	 * 	The amount of wins with this move.
	 * 	public int wins;
	 * 	
	 * 	The amount of losses with this move.
	 * 	public int losses;
	 * 	
	 * 	The amount of draws with this move.
	 * 	public int draws;
	 * 	
	 * 	The move itself.
	 * 	e.g. e4, d5, Nf6, cxd8=N#
	 * 	public String name;
	 * 	
	 */
	
	/**
	 * 	This instantiates a generic Move with default values.
	 * 	
	 * 	@param String pname- 	The name of the move, e.g. e4
	 * 							This is supposed to be in algebraic
	 * 							notation but descriptive notation 
	 * 							would probably still work lol
	 * 							No plans to add support though :p
	 * 	@TODO make this set wins, losses, and draws by default
	 */
	constructor(pname) {
		
		this.children = {};
		this.count = 1;
		this.wins = 0;
		this.losses = 0;
		this.draws = 0;
		this.name = pname;
		
	}
	
	/**
	 * 	Adds a child to the move. This is a move that follows it, e.g. e4 would
	 * 	be have a child e5, a child c5, a child d5, a child c6, etc.
	 * 	
	 * 	@param String child- 	The name of the move that follows it. Note that this is 
	 * 							specifically the name of the move: it cannot be the actual
	 * 							Move object.
	 * 	@TODO	Make this work for Move objects
	 */
	add(child) {
		
		if (this.children[child] == null) {
			
			var c = new Move(child);
			c.parent = this;
			this.children[child] = c;
			
		} else {
			
			this.children[child].count++;
			
		}
		
	}
	
	/**
	 * 	sort
	 * 	This recursive function transfers the children from a dictionary to
	 * 	an array sorted by frequency, from most to least frequent.
	 * 	
	 * 	Postcondition: The children object is now a sorted array, as are all the 
	 * 	children's children objects.
	 */
	sort() {
		
		if (!(this.children instanceof Array) && Object.keys(this.children).length == 0) {
			
			return;
			
		}
		
		if (this.children instanceof Array) {
			
			for (child of this.children) {
				
				child.sort();
				
			}
			
			this.children.sort(Move.compareTo);
			return;
			
		}
		
		var tmp = this.children;
		this.children = [];
		var i = 0;
		
		for (var child in tmp) {
			
			this.children[i] = tmp[child];
			this.children[i].sort();
			i++;
			
		}
		
		//console.log("Sorting: " + this.children[0]);
		this.children.sort(Move.compareTo);
		//console.log("Sorted: " + this.children);
		
	}
	
	/**
	 * 	This is kinda like a special version of toString() but it is distinct enough
	 * 	to get a different name.
	 * 	
	 * 	@return A String in this format:
	 * 	Games: NameOfMove	x (x%)	Wins: x (x%)	Losses: x (x%)	Draws: x (x%)
	 * 	Games: d5	1093 (78%)	Wins: 557 (50.9%)	Losses: 508 (46.4%)	Draws: 28(2.5%)
	 *	
	 *	@TODO: Figure out how to make the tabs line up
	 */
	prompt() {
		
		var head = "Games: " + this.count;
		
		if (this.parent != null) {
			
			head += " (" + p(this.count, this.parent.count) + ")";
			
		}
		
		return head + "\t\" + this.name + "\tWins: " + this.wins + " (" + p(this.wins, this.count) + ")\tLosses: " + 
				this.losses + " (" + p(this.losses, this.count) + ")\tDraws: " + this.draws + "(" +
				p(this.draws, this.count) + ");
		
	}
	
	
	
	/**
	 * 	compareTo
	 * 	This is because I have chronic Java brain
	 * 	It also means I don't have to reassign a new comparator every time I try to
	 * 	sort a child.
	 * 	This function operates in the same way as a compareTo method works in Java,
	 * 	except that instead of being invoked by an object, this is essentially static.
	 * 	
	 * 	@param Move x- 	The first move
	 * 	@param Move y- 	The second move
	 * 					If y is null or not specified, will use compareTo(this, x)
	 * 					instead. This is exactly the same behavior as Java lol
	 * 	@return > 0 if y has more games played than x
	 * 			= 0 if y has the same number of games as x
	 * 			< 0 if y has fewer games played than x
	 */
	static compareTo(x, y) {
		
		if (y == null) {
			
			return x.count - this.count;
			
		}
		
		return y.count - x.count;
		
	}
	
}

// Simple helper function that converts ratios to percentages
// Note that since I'm using a floor function, percentages will probably
// add to less than 100%
function p(a, b) {
	
	if (b == null) {
		
		b = 1;
		
	}
	
	return Math.floor(a / b * 1000) / 10 + "%";
	
}

exports.Move = Move;
