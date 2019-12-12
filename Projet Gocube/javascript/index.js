var moves = [];
var timeStampedMoves = [];
var lastMoveTimestamp = 0;

var SPLIT_LINES_MS = 500;
var firstMoveReceived = false;

window.addEventListener("load", function() {

  document.getElementById("connect").addEventListener("click", function f() {
    console.log("Connecting...");
    document.getElementById("connect").textContent = "Connecting...";
    cubing.bluetooth.connect().then(function(cube) {
      window.cube = cube;
      console.log("Connected !");
      document.getElementById("connect").textContent = "Connected!";

      cube.addMoveListener(function(d) {
        const latestMove = {
          type: "move",
          base: d.latestMove.family,
          amount: d.latestMove.amount
        }

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