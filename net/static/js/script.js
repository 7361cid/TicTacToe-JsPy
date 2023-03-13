var gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function ChangeElement(id) {
    //console.log(gameState[id]);
    if (gameState[id] == 0)
    {
        document.getElementById("cell" + id).innerHTML = '<input type="image" src="static\\js\\image3' +
        '.jpg" onclick = "ChangeElement(' + id + ')" />';
        gameState[id] = 1;
        IsSomeoneWin(gameState, 1);
        AIMove();
        NetMove();
        IsSomeoneWin(gameState, 2);
      //  console.log(gameState, gameState);
    }
}

function BoteMoveRandom() {
    var good = isFreeSpaceLeft();
    while (good == 1 ) {
        var id = getRandomInt(1, 9);
        if (gameState[id] == 0)
        {
            document.getElementById("cell" + id).innerHTML = '<input type="image" src="static\\js\\image2' +
            '.jpg" onclick = "ChangeElement(' + id + ')" />';
            gameState[id] = 2;
            good = 0;
        }
    }
}

function AIMove() {
    // 1) Find Possible moves
    // 2) Find score for all possible moves
    // 3) Choose the best move
    var possibleMoves = getPossibleMoves(gameState);
    var bestScore = -Infinity;
    var bestMove = possibleMoves[0]
    var board = gameState.slice()
    var movesScores = {}
    for (var i in possibleMoves) {
        board[possibleMoves[i]] = 2;
        score = minmax(board, 0, false);
        movesScores["possible move " + possibleMoves[i]] = score;
      //  console.log("LOG score " + score + " possibleMove " + possibleMoves[i] + " board " + board);
        board[possibleMoves[i]] = 0;   // experemental
        if (score > bestScore) {
            bestScore = score;
            bestMove = possibleMoves[i];
        }
    }
    for(var key in movesScores) {
        console.log(key + " " + movesScores[key]);
    }
    console.log(" best move " + bestMove);
    //console.log("bestMove " + bestMove + " possibleMoves " + possibleMoves);
    document.getElementById("cell" + bestMove).innerHTML = '<input type="image" src="static\\js\\image2' +
    '.jpg" onclick = "ChangeElement(' + bestMove + ')" />';
    gameState[bestMove] = 2;
}

function NetMove() {
    sendGameData();
    console.log("HERE NetMove");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isFreeSpaceLeft(board) {
    for (var i=1; i<10; i++)
    {
      if (board[i] == 0) {
        return 1;
      }
    }
    return 0;
}

function IsSomeoneWin(board, value) {
    if (board[1] == value && board[2] == value && board[3] == value ||
        board[4] == value && board[5] == value && board[6] == value ||
        board[7] == value && board[8] == value && board[9] == value ||
        board[1] == value && board[4] == value && board[7] == value ||
        board[2] == value && board[5] == value && board[8] == value ||
        board[3] == value && board[6] == value && board[9] == value ||
        board[1] == value && board[5] == value && board[9] == value ||
        board[3] == value && board[5] == value && board[7] == value) {
            return true;
        }
        return false;
}

function getPossibleMoves(board) {
    var possibleMoves = []
    for (var i=1; i<10; i++)
    {
      if (board[i] == 0) {
        possibleMoves.push(i);
      }
    }
    return possibleMoves;
}

function minmax(board, depth, IsMaxing) {
   // console.log("minmax call  " + board + " depth= " + depth + " Is Maxing? " + IsMaxing);
    if (IsSomeoneWin(board, 1)) {
    return -1;
    };
    if (IsSomeoneWin(board, 2)) {
    return 1};
    if (!isFreeSpaceLeft(board))  {
    return 0}

    if (IsMaxing) {
        var possibleMoves = getPossibleMoves(board);
        var bestScore = -Infinity;
        var bestMove = possibleMoves[0];
        var newBoard = board.slice();
       // console.log("Depth " + depth + " board " + board + " move " + possibleMoves[i]);
        for (var i in possibleMoves) {
            newBoard[possibleMoves[i]] = 2;  //  AI move
           // console.log("IsMaxing board  " + newBoard + " move " + possibleMoves[i] + " possibleMove " + possibleMoves);
            score = minmax(newBoard, depth+1, false);
            newBoard[possibleMoves[i]] = 0;  //  AI move  clear experemental
            if (score > bestScore) {
                bestScore = score;
                bestMove = possibleMoves[i];
            }
        }
        return bestScore;
    }
    if (!IsMaxing) {
        var possibleMoves = getPossibleMoves(board);
        var bestScore = Infinity;
        var bestMove = possibleMoves[0];
        var newBoard = board.slice();  // experimental shit
        for (var i in possibleMoves) {
          //  console.log("IsMaxing " + IsMaxing + " board  " + newBoard + " move " + possibleMoves[i] + " possibleMove " + possibleMoves);
            newBoard[possibleMoves[i]] = 1;  // Predict player move
            score = minmax(newBoard, depth+1, true);
            newBoard[possibleMoves[i]] = 0;  // Predict player move  experimental
            if (score < bestScore) {
                bestScore = score;
                bestMove = possibleMoves[i];
            }
        }

        return bestScore;
    }
}

function sendGameData() {
    console.log("HERE");
   $.ajax({
       url: 'http://127.0.0.1:5000',
       dataType: "jsonp",
       contentType: 'application/json',
       AccessControlAllowOrigin: "*",
       method: "POST",
       data: JSON.stringify({ "data": gameState}),
       success: function (json) {
           console.log("data" + JSON.stringify(json));
       },
       error: function (error) {
           console.log("error" + JSON.stringify(error));
       }
    });
}

