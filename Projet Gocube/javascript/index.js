var moves = [];
var timeStampedMoves = [];
var lastMoveTimestamp = 0;

var SPLIT_LINES_MS = 500;
var firstMoveReceived = false;

function U(turn){
	if(turn) cube._doMovement({face: "U", slice: "E",rotate: 'left'});
	else cube._doMovement({face: "U", slice: "E",rotate: 'right'});
}

function D(turn){
	if(turn) cube._doMovement({face: "D", slice: "E",rotate: 'right'});
	else cube._doMovement({face: "D", slice: "E",rotate: 'left'});
}

function L(turn){
	if(turn) cube._doMovement({face: "L", slice: "M",rotate: 'right'});
	else cube._doMovement({face: "L", slice: "M",rotate: 'left'});
}

function R(turn){
	if(turn) cube._doMovement({face: "R", slice: "M",rotate: 'left'});
	else cube._doMovement({face: "R", slice: "M",rotate: 'right'});
}

function F(turn){
	if(turn) cube._doMovement({face: "F", slice: "S",rotate: 'right'});
	else cube._doMovement({face: "F", slice: "S",rotate: 'left'});
}

function B(turn){
	if(turn) cube._doMovement({face: "B", slice: "S",rotate: 'left'});
	else cube._doMovement({face: "B", slice: "S",rotate: 'right'});
}

window.addEventListener("load", function() {

	YUI().use('node','rubik-simple',function(Y){
		var cube = window.cube = new Y.Rubik();
		cube._disabledFLick = true;
		cube.run();    
	});

	document.querySelector('#resolution').addEventListener("click", resol, false);
	function resol(e){
		cube._resolve();
	}
	document.addEventListener("keypress", function (e) {
		var move = e.charCode
		let command_move_keyboard = String.fromCharCode(move);
		if(move && move!== 'on'){
			cube._expectingTransition = true;
			switch(command_move_keyboard){
				case "u": U(1); break;
				case "U": U(0); break;
				case "d": D(0); break;
				case "D": D(1); break;
				case "l": L(1); break;
				case "L": L(0); break;
				case "r": R(0); break;
				case "R": R(1); break;
				case "f": F(1); break;
				case "F": F(0); break;
				case "b": B(0); break;
				case "B": B(1); break;
				default: break;
			}
		}
	});
	document.getElementById("connect").addEventListener("click", function f() {
		console.log("Connecting...");
		document.getElementById("connect").textContent = "Connecting...";
		cubing.bluetooth.connect().then(function(cubeBluetooth) {
			console.log("Connected !");
			document.getElementById("connect").textContent = "Connected!";

			var i = 0;
			cubeBluetooth.addMoveListener(function(d) {
				const latestMove = {
					type: "move",
					base: d.latestMove.family,
					amount: d.latestMove.amount
				}

				cube._expectingTransition = true;
				console.log(latestMove.base + ", " + latestMove.amount);
				switch(latestMove.base){
					case "U": U(latestMove.amount); break;
					case "D": D(latestMove.amount); break;
					case "L": L(latestMove.amount); break;
					case "R": R(latestMove.amount); break;
					case "F": F(latestMove.amount); break;
					case "B": B(latestMove.amount); break;
					default: break;
				}

				if(!latestMove.amount) document.getElementById("lastMove").innerHTML += ++i + ". " + latestMove.base + "\'<br>";
				else document.getElementById("lastMove").innerHTML += ++i + ". " + latestMove.base + "<br>";

				console.log(d);
				timeStampedMoves.push({
					moves: latestMove,
					timeStamp: d.timeStamp,
				});

				var now = Date.now();
				if (now - lastMoveTimestamp > SPLIT_LINES_MS && moves.length > 0 && moves[moves.length - 1].type != "newline") {
					moves.push({type: "newline"});
				}
				lastMoveTimestamp = now;
				moves.push(latestMove);
			});
		});
	});
});