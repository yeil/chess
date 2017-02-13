// MODULE
var chessApp = angular.module("chessApp", []);

// CONTROLLERS
chessApp.controller("chessCtrl", function($scope, $timeout) {
  
  var WHITE = "White";
  var BLACK = "Black";
  
  var BOARD_WIDTH = 8;

  var PAWN = "Pawn";
  var ROOK = "Rook";
  var KNIGHT = "Knight";
  var BISHOP = "Bishop";
  var QUEEN = "Queen";
  var KING = "King";
  
  var repeat;
  var selectedSquare = null;
  var checkIdentity;
  var checkPlayer;
  var blackDefenseChoices = [];
  var whiteDefenseChoices = [];

  var blackCastleLeft = true;
  var blackCastleRight = true;
  var whiteCastleLeft = true;
  var whiteCastleRight = true;
  
  var previousSquare;
  var previousSelected;
  var previousFunc;

  $scope.whiteCaptured = [];
  $scope.blackCaptured = [];

  function Piece(player, x, y, identity) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.identity = identity;
    this.isChoice = false;
    this.isPiece = false;
    this.isCheck = false;
  }

  function Captured(player, identity) {
    this.player = player;
    this.identity = identity;
  }

  $scope.newGame = function() {
    $scope.player = WHITE;
    
    $scope.board = [];
    for (var i = 0; i < BOARD_WIDTH; i++) {
      $scope.board[i] = [];
      for (var j = 0; j < BOARD_WIDTH; j++) {
        if (i === 1) {
          $scope.board[i][j] = new Piece(BLACK, j, i, PAWN);
        } else if (i === 0) {
          if (j === 0 || j === BOARD_WIDTH - 1) {
            $scope.board[i][j] = new Piece(BLACK, j, i, ROOK);
          } else if (j === 1 || j === BOARD_WIDTH - 2) {
            $scope.board[i][j] = new Piece(BLACK, j, i, KNIGHT);
          } else if (j === 2 || j === BOARD_WIDTH - 3) {
            $scope.board[i][j] = new Piece(BLACK, j, i, BISHOP);
          } else if (j === 3) {
            $scope.board[i][j] = new Piece(BLACK, j, i, QUEEN);
          } else if (j === 4) {
            $scope.board[i][j] = new Piece(BLACK, j, i, KING);
          }
        } else if (i === BOARD_WIDTH - 2) {
          $scope.board[i][j] = new Piece(WHITE, j, i, PAWN);
        } else if (i === BOARD_WIDTH - 1) {
          if (j === 0 || j === BOARD_WIDTH - 1) {
            $scope.board[i][j] = new Piece(WHITE, j, i, ROOK);
          } else if (j === 1 || j === BOARD_WIDTH - 2) {
            $scope.board[i][j] = new Piece(WHITE, j, i, KNIGHT);
          } else if (j === 2 || j === BOARD_WIDTH - 3) {
            $scope.board[i][j] = new Piece(WHITE, j, i, BISHOP);
          } else if (j === 3) {
            $scope.board[i][j] = new Piece(WHITE, j, i, QUEEN);
          } else if (j === 4) {
            $scope.board[i][j] = new Piece(WHITE, j, i, KING);
          }
        } else {
          $scope.board[i][j] = new Piece(null, j , i, null);
        }
      }
    }
  }
  $scope.newGame();

  $scope.setClass = function(square) {
    if (square.isCheck) {
      return {"backgroundColor": "#ff3434"};
    }
    
    if (square.isPiece) {
      return {"backgroundColor": "#DAC34B"};
    }
    
    if (square.isChoice && square.player) {
      return {"backgroundColor": "#f7d574"};
    }

    if (square.y % 2 === 0) {
      if (square.x % 2 === 0) {
        return square.isChoice ? {"backgroundColor": "#F7EC74"} : {"backgroundColor": "#fdd399"};
      } else {
        return square.isChoice ? {"backgroundColor": "#F7EC74"} : {"backgroundColor": "#a5552b"};
      }
    } else {
      if (square.x % 2 === 1) {
        return square.isChoice ? {"backgroundColor": "#F7EC74"} : {"backgroundColor": "#fdd399"};
      } else {
        return square.isChoice ? {"backgroundColor": "#F7EC74"} : {"backgroundColor": "#a5552b"};
      }
    }
  }

  $scope.setStyling = function(square) {
    if (square.player === BLACK && square.identity === PAWN) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png')"};
    } else if (square.player === BLACK && square.identity === ROOK) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png')"};
    } else if (square.player === BLACK && square.identity === KNIGHT) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png')"};
    } else if (square.player === BLACK && square.identity === BISHOP) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png')"};
    } else if (square.player === BLACK && square.identity === QUEEN) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png')"};
    } else if (square.player === BLACK && square.identity === KING) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png')"};
    } else if (square.player === WHITE && square.identity === PAWN) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png')"};
    } else if (square.player === WHITE && square.identity === ROOK) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png')"};
    } else if (square.player === WHITE && square.identity === KNIGHT) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png')"};
    } else if (square.player === WHITE && square.identity === BISHOP) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png')"};
    } else if (square.player === WHITE && square.identity === QUEEN) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png')"};
    } else if (square.player === WHITE && square.identity === KING) {
      return {"backgroundImage": "url('https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png')"};
    } else {
      return {"backgroundColor": "none"};
    }
  }

  $scope.select = function(square) {
    if (square.player === null && !square.isChoice || square.player !== $scope.player && !square.isChoice) {
      resetChoices();
      repeat = null;
    }

    if (square.player && !square.isChoice) {
      resetChoices();
    }

    if (square.player === $scope.player) {
      resetChoices();
      selectedSquare = square;
      selectedSquare.isPiece = true;
      setChoices(selectedSquare.x, selectedSquare.y);
      repeatCheck(square);
    }

    if (square !== undefined && square.isChoice) {
      var pinCheck = isPin(selectedSquare, square);
      if (pinCheck) {
        previousSelected = {
          player: selectedSquare.player,
          identity: selectedSquare.identity,
          y: selectedSquare.y,
          x: selectedSquare.x
        }
        capturePiece(square);
        movePiece(selectedSquare, square);
        resetChoices();
        //DIRECT CHECK
        setChoices(square.x, square.y);
        resetChoices();
        //INDIRECT CHECK
        checkTest();
        previousSquare = square;
        //CHECKMATE TEST
        var king = kingFinder();
        if (king.isCheck) {
          mateTest(king);
        }
        checkTest();
      }
    }
  }

  function mateTest(king) {
    var count = 0;
    var checkCount = 0;
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if ($scope.board[king.y + i] && $scope.board[king.y + i][king.x + j].player !== $scope.player) {
          count++;
          kingMove = $scope.board[king.y + i][king.x + j];
          if (!isPin(king, kingMove)) {
            checkCount++;
          }
        }
      }
    }
    if (checkCount === count) {
      mateTest2();
    }
  }

  function mateTest2() {
    var defenseChoices = $scope.player === WHITE ? whiteDefenseChoices : blackDefenseChoices;
    var count = 0;
    var checkCount = 0;

    for (var i = 0; i < BOARD_WIDTH; i++) {
      for (var j = 0; j < BOARD_WIDTH; j++) {
        if ($scope.board[i][j].identity && $scope.board[i][j].player === $scope.player && $scope.board[i][j] !== KING ) {
          count++;
          var currentSquare = $scope.board[i][j];
          defenseChoices.length = 0;
          checkIdentity = $scope.board[i][j].identity;
          checkPlayer = $scope.board[i][j].player;
          setChoices($scope.board[i][j].x, $scope.board[i][j].y);
          if (mateTest3(currentSquare, defenseChoices)) {
            checkCount++;
          };
          resetChoices();
          checkIdentity = null;
          checkPlayer = null;
        }
      }
    }
    if (checkCount === count && count !== 0 && checkCount !== 0) {
      $timeout(function () {
        alert('Checkmate');
      }, 50);
      var attackingPlayer = $scope.player === WHITE ? BLACK : WHITE;
      $scope.player = attackingPlayer + ' wins!';
    }
  }

  function mateTest3(currentSquare, defenseChoices) {
    var king = kingFinder();
    kingState = king.isCheck;

    for (var i = 0; i < defenseChoices.length; i++) {
      var holdIdentity = defenseChoices[i].identity;
      var holdPlayer = defenseChoices[i].player;
      defenseChoices[i].identity = currentSquare.identity;
      defenseChoices[i].player = currentSquare.player;
      king.isCheck = false;
      checkTest()
      if (king.isCheck === false) {
        defenseChoices[i].identity = holdIdentity;
        defenseChoices[i].player = holdPlayer;
        king.isCheck = kingState;
        return false;
      }
      defenseChoices[i].identity = holdIdentity;
      defenseChoices[i].player = holdPlayer;
    }
    king.isCheck = kingState;
    return true;
  }

  function checkTest() {
    var selectedIdentity = selectedSquare.identity;
    var selectedPlayer = selectedSquare.player;
    var selectedHolder = selectedSquare;
    var attackingPlayer = $scope.player === WHITE ? BLACK : WHITE;
    selectedSquare = "temp";
    selectedSquare.identity = "tempIdentity";
    selectedSquare.player = "tempPlayer";

    for (var i = 0; i < BOARD_WIDTH; i++) {
      for (var j = 0; j < BOARD_WIDTH; j++) {
        if ($scope.board[i][j].identity && $scope.board[i][j].player === attackingPlayer) {
          checkIdentity = $scope.board[i][j].identity;
          checkPlayer = $scope.board[i][j].player;
          setChoices($scope.board[i][j].x, $scope.board[i][j].y);
          resetChoices();
          checkIdentity = null;
          checkPlayer = null;
        }
      }
    }
    selectedSquare = selectedHolder;
    selectedSquare.identity = selectedIdentity;
    selectedSquare.player = selectedPlayer;
  }

  function isPin(selectedSquare, square) {
    var identity = square.identity;
    var player = square.player;
    var selectedIdentity = selectedSquare.identity;
    var selectedPlayer = selectedSquare.player;
    var king1 = kingFinder();

    square.identity = selectedIdentity;
    square.player = selectedPlayer;
    selectedSquare.player = null;
    selectedSquare.identity = null;
    var attackingPlayer = $scope.player === WHITE ? BLACK : WHITE;
    var king2 = kingFinder();
    king2.isCheck = false;

    for (var i = 0; i < BOARD_WIDTH; i++) {
      for (var j = 0; j < BOARD_WIDTH; j++) {
        if ($scope.board[i][j].identity && $scope.board[i][j].player === attackingPlayer) {
          checkIdentity = $scope.board[i][j].identity;
          checkPlayer = $scope.board[i][j].player;
          setChoices($scope.board[i][j].x, $scope.board[i][j].y);
          resetChoices();
          checkIdentity = null;
          checkPlayer = null;
        }
        if (king2.isCheck) {
          selectedSquare.identity = selectedIdentity
          selectedSquare.player = selectedPlayer
          square.identity = identity;
          square.player = player;
          king2.isCheck = false;
          repeat = null;
          checkTest();
          return false;
        }
      }
    }
    square.identity = identity;
    square.player = player;
    selectedSquare.identity = selectedIdentity
    selectedSquare.player = selectedPlayer
    king1.isCheck = false;
    return true;
  }

  function resetChoices() {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      for (var j = 0; j < BOARD_WIDTH; j++) {
        $scope.board[i][j].isChoice = false;
        $scope.board[i][j].isPiece = false;
      }
    }
  }

  function kingFinder() {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      for (var j = 0; j < BOARD_WIDTH; j++) {
        if ($scope.board[i][j].identity === KING && $scope.player === $scope.board[i][j].player) {
          return $scope.board[i][j];
        }
      }
    }
  }

  function repeatCheck(square) {
    if (repeat === square) {
      resetChoices();
      repeat = null;
    } else {
      repeat = square;
    }
  }

  function capturePiece(square) {
    if (square.player === BLACK) {
      if (square.identity === ROOK && square.x === 0) {
        blackCastleLeft = false;
      }
      if (square.identity === ROOK && square.x === 7) {
        blackCastleRight = false;
      }
      var prisoner = new Captured(square.player, square.identity);
      captureValue(prisoner);
      $scope.whiteCaptured.push(prisoner);
    } else if (square.player === WHITE) {
      if (square.identity === ROOK && square.x === 0) {
        whiteCastleLeft = false;
      }
      if (square.identity === ROOK && square.x === 7) {
        whiteCastleRight = false;
      }
      var prisoner = new Captured(square.player, square.identity);
      captureValue(prisoner);
      $scope.blackCaptured.push(prisoner);
    }
    if (square.player === null) {
      if (selectedSquare.player === WHITE && selectedSquare.identity === PAWN && selectedSquare.y === 3 && previousSquare.identity === PAWN && previousSquare.y === 3 && previousSquare.x === square.x) {
        var prisoner = new Captured(previousSquare.player, previousSquare.identity);
        captureValue(prisoner);
        $scope.whiteCaptured.push(prisoner);
      } else if (selectedSquare.player === BLACK && selectedSquare.identity === PAWN && selectedSquare.y === 4 && previousSquare.identity === PAWN && previousSquare.y === 4 && previousSquare.x === square.x) {
        var prisoner = new Captured(previousSquare.player, previousSquare.identity);
        captureValue(prisoner);
        $scope.blackCaptured.push(prisoner);
      }
    }
    capturedSort();
  }

  function captureValue(prisoner) {
    if (prisoner.identity === PAWN) {
      prisoner.value = 1;
    } else if (prisoner.identity === KNIGHT) {
      prisoner.value = 3;
    } else if (prisoner.identity === BISHOP) {
      prisoner.value = 3;
    } else if (prisoner.identity === ROOK) {
      prisoner.value = 5;
    } else if (prisoner.identity === QUEEN) {
      prisoner.value = 9;
    }
  }

  function capturedSort() {
    $scope.whiteCaptured.sort(function(a, b) {
      return a.value - b.value;
    });
    $scope.blackCaptured.sort(function(a, b) {
      return a.value - b.value;
    });
  }

  function castleTest(selectedSquare, square) {
    if (selectedSquare.identity === ROOK && selectedSquare.x === 0 && selectedSquare.y === 0) {
      blackCastleLeft = false;
    }
    if (selectedSquare.identity === ROOK && selectedSquare.x === 7 && selectedSquare.y === 0) {
      blackCastleRight = false;
    }
    if (selectedSquare.identity === KING && selectedSquare.x === 4 && selectedSquare.y === 0) {
      blackCastleRight = false;
      blackCastleLeft = false;
    }
    if (selectedSquare.identity === ROOK && selectedSquare.x === 0 && selectedSquare.y === 7) {
      whiteCastleLeft = false;
    }
    if (selectedSquare.identity === ROOK && selectedSquare.x === 7 && selectedSquare.y === 7) {
      whiteCastleRight = false;
    }
    
    if (selectedSquare.identity === KING && selectedSquare.x === 4 && selectedSquare.y === 7) {
      whiteCastleRight = false;
      whiteCastleLeft = false;
    }
  }

  function movePiece(selectedSquare, square) {    
    if (selectedSquare.identity === KING && whiteCastleRight && square.x === 6 && square.y === 7) {
      castleTest(selectedSquare);
      square.player = WHITE;
      square.identity = KING;
      $scope.board[7][5].player = WHITE;
      $scope.board[7][5].identity = ROOK;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.board[7][7].player = null;
      $scope.board[7][7].identity = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === KING && whiteCastleLeft && square.x === 2 && square.y === 7) {
      castleTest(selectedSquare);
      square.player = WHITE;
      square.identity = KING;
      $scope.board[7][3].player = WHITE;
      $scope.board[7][3].identity = ROOK;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.board[7][0].player = null;
      $scope.board[7][0].identity = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === KING && blackCastleRight && square.x === 6 && square.y === 0) {
      castleTest(selectedSquare);
      square.player = BLACK;
      square.identity = KING;
      $scope.board[0][5].player = BLACK;
      $scope.board[0][5].identity = ROOK;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.board[0][7].player = null;
      $scope.board[0][7].identity = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === KING && blackCastleRight && square.x === 2 && square.y === 0) {
      castleTest(selectedSquare);
      square.player = BLACK;
      square.identity = KING;
      $scope.board[0][3].player = BLACK;
      $scope.board[0][3].identity = ROOK;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.board[0][0].player = null;
      $scope.board[0][0].identity = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === PAWN && $scope.player === WHITE && selectedSquare.y === 3 && previousSquare.identity === PAWN && previousSquare.y === 3 && previousSquare.x === square.x) {
      square.identity = selectedSquare.identity;
      square.player = selectedSquare.player;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      previousSquare.identity = null;
      previousSquare.player = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === PAWN && $scope.player === BLACK && selectedSquare.y === 4 && previousSquare.identity === PAWN && previousSquare.y === 4 && previousSquare.x === square.x) {
      square.identity = selectedSquare.identity;
      square.player = selectedSquare.player;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      previousSquare.identity = null;
      previousSquare.player = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === PAWN && $scope.player === WHITE && square.y === 0) {
      square.identity = QUEEN;
      square.player = WHITE;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else if (selectedSquare.identity === PAWN && $scope.player === BLACK && square.y === 7) {
      square.identity = QUEEN;
      square.player = BLACK;
      selectedSquare.identity = null;
      selectedSquare.player = null;
      $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    } else {
    castleTest(selectedSquare);
    square.identity = selectedSquare.identity;
    square.player = selectedSquare.player;
    selectedSquare.identity = null;
    selectedSquare.player = null;
    $scope.player = $scope.player === WHITE ? BLACK : WHITE;
    }
    
  }

  function setChoices(x, y) {
    
    //WHITE PIECES
    if (selectedSquare.player === WHITE || checkPlayer === WHITE) {
      if (selectedSquare.identity === PAWN || checkIdentity === PAWN) {
        if (y === BOARD_WIDTH - 2 && !$scope.board[y - 1][x].player && !$scope.board[y - 2][x].player) {
          var highlight = $scope.board[y - 2][x];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
        if (!$scope.board[y - 1][x].player) {
          var highlight = $scope.board[y - 1][x];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
        //CAPTURE
        if (x > 0 && $scope.board[y - 1][x - 1].player === BLACK) {
          if ($scope.board[y - 1][x - 1].identity === KING) {
            var highlight = $scope.board[y - 1][x - 1];
            highlight.isCheck = true;
          }
          var highlight = $scope.board[y - 1][x - 1];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
        if (x < BOARD_WIDTH - 1 && $scope.board[y - 1][x + 1].player === BLACK) {
          if ($scope.board[y - 1][x + 1].identity === KING) {
            var highlight = $scope.board[y - 1][x + 1];
            highlight.isCheck = true;
          }
          var highlight = $scope.board[y - 1][x + 1];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
        //EN PASSANT        
        if (selectedSquare.y === 3 && previousSelected.y === 1 && previousSelected.identity === PAWN && previousSquare === $scope.board[y][x + 1]) {
          var highlight = $scope.board[y - 1][x + 1];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
        if (selectedSquare.y === 3 && previousSelected.y === 1 && previousSelected.identity === PAWN && previousSquare === $scope.board[y][x - 1]) {
          var highlight = $scope.board[y - 1][x - 1];
          highlight.isChoice = true;
          whiteDefenseChoices.push(highlight);
        }
      }

      if (selectedSquare.identity === KNIGHT || checkIdentity === KNIGHT) {
        //TOP LEFT
        if ($scope.board[y - 2] && $scope.board[y - 2][x - 1]) {
          if ($scope.board[y - 2][x - 1].player === BLACK) {
            if ($scope.board[y - 2][x - 1].identity === KING) {
              var highlight = $scope.board[y - 2][x - 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 2][x - 1];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y - 2][x - 1].player === null) {
            var highlight = $scope.board[y - 2][x - 1];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //TOP RIGHT
        if ($scope.board[y - 2] && $scope.board[y - 2][x + 1]) {
          if ($scope.board[y - 2][x + 1].player === BLACK) {
            if ($scope.board[y - 2][x + 1].identity === KING) {
              var highlight = $scope.board[y - 2][x + 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 2][x + 1];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y - 2][x + 1].player === null) {
            var highlight = $scope.board[y - 2][x + 1];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LEFT UPPER
        if ($scope.board[y - 1] && $scope.board[y - 1][x - 2]) {
          if ($scope.board[y - 1][x - 2].player === BLACK) {
            if ($scope.board[y - 1][x - 2].identity === KING) {
              var highlight = $scope.board[y - 1][x - 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 1][x - 2];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y - 1][x - 2].player === null) {
            var highlight = $scope.board[y - 1][x - 2];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LEFT LOWER
        if ($scope.board[y + 1] && $scope.board[y + 1][x - 2]) {
          if ($scope.board[y + 1][x - 2].player === BLACK) {
            if ($scope.board[y + 1][x - 2].identity === KING) {
              var highlight = $scope.board[y + 1][x - 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 1][x - 2];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y + 1][x - 2].player === null) {
            var highlight = $scope.board[y + 1][x - 2];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //RIGHT UPPER
        if ($scope.board[y - 1] && $scope.board[y - 1][x + 2]) {
          if ($scope.board[y - 1][x + 2].player === BLACK) {
            if ($scope.board[y - 1][x + 2].identity === KING) {
              var highlight = $scope.board[y - 1][x + 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 1][x + 2];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y - 1][x + 2].player === null) {
            var highlight = $scope.board[y - 1][x + 2];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //RIGHT LOWER
        if ($scope.board[y + 1] && $scope.board[y + 1][x + 2]) {
          if ($scope.board[y + 1][x + 2].player === BLACK) {
            if ($scope.board[y + 1][x + 2].identity === KING) {
              var highlight = $scope.board[y + 1][x + 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 1][x + 2];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y + 1][x + 2].player === null) {
            var highlight = $scope.board[y + 1][x + 2];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //BOTTOM LEFT
        if ($scope.board[y + 2] && $scope.board[y + 2][x - 1]) {
          if ($scope.board[y + 2][x - 1].player === BLACK) {
            if ($scope.board[y + 2][x - 1].identity === KING) {
              var highlight = $scope.board[y + 2][x - 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 2][x - 1];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y + 2][x - 1].player === null) {
            var highlight = $scope.board[y + 2][x - 1];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //BOTTOM RIGHT
        if ($scope.board[y + 2] && $scope.board[y + 2][x + 1]) {
          if ($scope.board[y + 2][x + 1].player === BLACK) {
            if ($scope.board[y + 2][x + 1].identity === KING) {
              var highlight = $scope.board[y + 2][x + 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 2][x + 1];
              highlight.isChoice = true;
            }
          }
          if ($scope.board[y + 2][x + 1].player === null) {
            var highlight = $scope.board[y + 2][x + 1];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }

      }

      if (selectedSquare.identity === BISHOP || checkIdentity === BISHOP) {
        //UPPER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x - i]) {
            if ($scope.board[y - i][x - i].player === BLACK) {
              if ($scope.board[y - i][x - i].identity === KING) {
                var highlight = $scope.board[y - i][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //UPPER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x + i]) {
            if ($scope.board[y - i][x + i].player === BLACK) {
              if ($scope.board[y - i][x + i].identity === KING) {
                var highlight = $scope.board[y - i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LOWER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x - i]) {
            if ($scope.board[y + i][x - i].player === BLACK) {
              if ($scope.board[y + i][x - i].identity === KING) {
                var highlight = $scope.board[y + i][x - i];
                highlight.isCheck = true;
              }              
              var highlight = $scope.board[y + i][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LOWER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x + i]) {
            if ($scope.board[y + i][x + i].player === BLACK) {
              if ($scope.board[y + i][x + i].identity === KING) {
                var highlight = $scope.board[y + i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
      }
      
      if (selectedSquare.identity === ROOK || checkIdentity === ROOK) {
        //UP
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x]) {
            if ($scope.board[y - i][x].player === BLACK) {
              if ($scope.board[y - i][x].identity === KING) {
                var highlight = $scope.board[y - i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x - i]) {
            if ($scope.board[y][x - i].player === BLACK) {
              if ($scope.board[y][x - i].identity === KING) {
                var highlight = $scope.board[y][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x + i]) {
            if ($scope.board[y][x + i].player === BLACK) {
              if ($scope.board[y][x + i].identity === KING) {
                var highlight = $scope.board[y][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //DOWN
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x]) {
            if ($scope.board[y + i][x].player === BLACK) {
              if ($scope.board[y + i][x].identity === KING) {
                var highlight = $scope.board[y + i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
      }
      
      if (selectedSquare.identity === QUEEN || checkIdentity === QUEEN) {
        //UPPER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x - i]) {
            if ($scope.board[y - i][x - i].player === BLACK) {
              if ($scope.board[y - i][x - i].identity === KING) {
                var highlight = $scope.board[y - i][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //UP
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x]) {
            if ($scope.board[y - i][x].player === BLACK) {
              if ($scope.board[y - i][x].identity === KING) {
                var highlight = $scope.board[y - i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //UPPER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x + i]) {
            if ($scope.board[y - i][x + i].player === BLACK) {
              if ($scope.board[y - i][x + i].identity === KING) {
                var highlight = $scope.board[y - i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y - i][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x + i]) {
            if ($scope.board[y][x + i].player === BLACK) {
              if ($scope.board[y][x + i].identity === KING) {
                var highlight = $scope.board[y][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LOWER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x + i]) {
            if ($scope.board[y + i][x + i].player === BLACK) {
              if ($scope.board[y + i][x + i].identity === KING) {
                var highlight = $scope.board[y + i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x + i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x + i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x + i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //DOWN
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x]) {
            if ($scope.board[y + i][x].player === BLACK) {
              if ($scope.board[y + i][x].identity === KING) {
                var highlight = $scope.board[y + i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LOWER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x - i]) {
            if ($scope.board[y + i][x - i].player === BLACK) {
              if ($scope.board[y + i][x - i].identity === KING) {
                var highlight = $scope.board[y + i][x - i];
                highlight.isCheck = true;
              }              
              var highlight = $scope.board[y + i][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y + i][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
        //LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x - i]) {
            if ($scope.board[y][x - i].player === BLACK) {
              if ($scope.board[y][x - i].identity === KING) {
                var highlight = $scope.board[y][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x - i];
              highlight.isChoice = true;
              whiteDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x - i].player === WHITE) {
              break;
            }
            var highlight = $scope.board[y][x - i];
            highlight.isChoice = true;
            whiteDefenseChoices.push(highlight);
          }
        }
      }
      
      if (selectedSquare.identity === KING) {
        //UPPER LEFT
        if ($scope.board[y - 1] && $scope.board[y - 1][x - 1]) {
          if ($scope.board[y - 1][x - 1].player === BLACK) {
            var highlight = $scope.board[y - 1][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x - 1].player) {
            var highlight = $scope.board[y - 1][x - 1];
            highlight.isChoice = true;
          }
        }
        //UP
        if ($scope.board[y - 1] && $scope.board[y - 1][x]) {
          if ($scope.board[y - 1][x].player === BLACK) {
            var highlight = $scope.board[y - 1][x];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x].player) {
            var highlight = $scope.board[y - 1][x];
            highlight.isChoice = true;
          }
        }
        //UPPER RIGHT
        if ($scope.board[y - 1] && $scope.board[y - 1][x + 1]) {
          if ($scope.board[y - 1][x + 1].player === BLACK) {
            var highlight = $scope.board[y - 1][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x + 1].player) {
            var highlight = $scope.board[y - 1][x + 1];
            highlight.isChoice = true;
          }
        }
        //RIGHT
        if ($scope.board[y] && $scope.board[y][x + 1]) {
          if ($scope.board[y][x + 1].player === BLACK) {
            var highlight = $scope.board[y][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y][x + 1].player) {
            var highlight = $scope.board[y][x + 1];
            highlight.isChoice = true;
          }
        }
        //RIGHT CASTLE
        if ($scope.board[y] && $scope.board[y][x + 2]) {
          if (!$scope.board[y][x + 1].player && !$scope.board[y][x + 2].player && whiteCastleRight) {
            var highlight = $scope.board[y][x + 2];
            highlight.isChoice = true;
          }
        }
        //LOWER RIGHT
        if ($scope.board[y + 1] && $scope.board[y + 1][x + 1]) {
          if ($scope.board[y + 1][x + 1].player === BLACK) {
            var highlight = $scope.board[y + 1][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x + 1].player) {
            var highlight = $scope.board[y + 1][x + 1];
            highlight.isChoice = true;
          }
        }
        //DOWN
        if ($scope.board[y + 1] && $scope.board[y + 1][x]) {
          if ($scope.board[y + 1][x].player === BLACK) {
            var highlight = $scope.board[y + 1][x];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x].player) {
            var highlight = $scope.board[y + 1][x];
            highlight.isChoice = true;
          }
        }
        //LOWER LEFT
        if ($scope.board[y + 1] && $scope.board[y + 1][x - 1]) {
          if ($scope.board[y + 1][x - 1].player === BLACK) {
            var highlight = $scope.board[y + 1][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x - 1].player) {
            var highlight = $scope.board[y + 1][x - 1];
            highlight.isChoice = true;
          }
        }
        //LEFT
        if ($scope.board[y] && $scope.board[y][x - 1]) {
          if ($scope.board[y][x - 1].player === BLACK) {
            var highlight = $scope.board[y][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y][x - 1].player) {
            var highlight = $scope.board[y][x - 1];
            highlight.isChoice = true;
          }
        }
        //LEFT CASTLE
        if ($scope.board[y] && $scope.board[y][x - 2]) {
          if (!$scope.board[y][x - 1].player && !$scope.board[y][x - 2].player && whiteCastleLeft) {
            var highlight = $scope.board[y][x - 2];
            highlight.isChoice = true;
          }
        }
      }
    }

    //BLACK PIECES
    if (selectedSquare.player === BLACK || checkPlayer === BLACK) {
      if (selectedSquare.identity === PAWN || checkIdentity === PAWN) {
        if (y === 1 && !$scope.board[y + 1][x].player && !$scope.board[y + 2][x].player) {
          var highlight = $scope.board[y + 2][x];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
        if (!$scope.board[y + 1][x].player) {
          var highlight = $scope.board[y + 1][x];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
        //CAPTURE
        if (x > 0 && $scope.board[y + 1][x - 1].player === WHITE) {
          if ($scope.board[y + 1][x - 1].identity === KING) {
            var highlight = $scope.board[y + 1][x - 1];
            highlight.isCheck = true;
          }
          var highlight = $scope.board[y + 1][x - 1];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
        if (x < BOARD_WIDTH - 1 && $scope.board[y + 1][x + 1].player === WHITE) {
          if ($scope.board[y + 1][x + 1].identity === KING) {
            var highlight = $scope.board[y + 1][x + 1];
            highlight.isCheck = true;
          }
          var highlight = $scope.board[y + 1][x + 1];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
        //EN PASSANT        
        if (selectedSquare.y === 4 && previousSelected.y === 6 && previousSelected.identity === PAWN && previousSquare === $scope.board[y][x + 1]) {
          var highlight = $scope.board[y + 1][x + 1];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
        if (selectedSquare.y === 4 && previousSelected.y === 6 && previousSelected.identity === PAWN && previousSquare === $scope.board[y][x - 1]) {
          var highlight = $scope.board[y + 1][x - 1];
          highlight.isChoice = true;
          blackDefenseChoices.push(highlight);
        }
      }
      
      if (selectedSquare.identity === KNIGHT || checkIdentity === KNIGHT) {
        //TOP LEFT
        if ($scope.board[y - 2] && $scope.board[y - 2][x - 1]) {
          if ($scope.board[y - 2][x - 1].player === WHITE) {
            if ($scope.board[y - 2][x - 1].identity === KING) {
              var highlight = $scope.board[y - 2][x - 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 2][x - 1];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y - 2][x - 1].player === null) {
            var highlight = $scope.board[y - 2][x - 1];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //TOP RIGHT
        if ($scope.board[y - 2] && $scope.board[y - 2][x + 1]) {
          if ($scope.board[y - 2][x + 1].player === WHITE) {
            if ($scope.board[y - 2][x + 1].identity === KING) {
              var highlight = $scope.board[y - 2][x + 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 2][x + 1];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y - 2][x + 1].player === null) {
            var highlight = $scope.board[y - 2][x + 1];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LEFT UPPER
        if ($scope.board[y - 1] && $scope.board[y - 1][x - 2]) {
          if ($scope.board[y - 1][x - 2].player === WHITE) {
            if ($scope.board[y - 1][x - 2].identity === KING) {
              var highlight = $scope.board[y - 1][x - 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 1][x - 2];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y - 1][x - 2].player === null) {
            var highlight = $scope.board[y - 1][x - 2];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LEFT LOWER
        if ($scope.board[y + 1] && $scope.board[y + 1][x - 2]) {
          if ($scope.board[y + 1][x - 2].player === WHITE) {
            if ($scope.board[y + 1][x - 2].identity === KING) {
              var highlight = $scope.board[y + 1][x - 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 1][x - 2];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y + 1][x - 2].player === null) {
            var highlight = $scope.board[y + 1][x - 2];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //RIGHT UPPER
        if ($scope.board[y - 1] && $scope.board[y - 1][x + 2]) {
          if ($scope.board[y - 1][x + 2].player === WHITE) {
            if ($scope.board[y - 1][x + 2].identity === KING) {
              var highlight = $scope.board[y - 1][x + 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y - 1][x + 2];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y - 1][x + 2].player === null) {
            var highlight = $scope.board[y - 1][x + 2];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //RIGHT LOWER
        if ($scope.board[y + 1] && $scope.board[y + 1][x + 2]) {
          if ($scope.board[y + 1][x + 2].player === WHITE) {
            if ($scope.board[y + 1][x + 2].identity === KING) {
              var highlight = $scope.board[y + 1][x + 2];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 1][x + 2];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y + 1][x + 2].player === null) {
            var highlight = $scope.board[y + 1][x + 2];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //BOTTOM LEFT
        if ($scope.board[y + 2] && $scope.board[y + 2][x - 1]) {
          if ($scope.board[y + 2][x - 1].player === WHITE) {
            if ($scope.board[y + 2][x - 1].identity === KING) {
              var highlight = $scope.board[y + 2][x - 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 2][x - 1];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y + 2][x - 1].player === null) {
            var highlight = $scope.board[y + 2][x - 1];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //BOTTOM RIGHT
        if ($scope.board[y + 2] && $scope.board[y + 2][x + 1]) {
          if ($scope.board[y + 2][x + 1].player === WHITE) {
            if ($scope.board[y + 2][x + 1].identity === KING) {
              var highlight = $scope.board[y + 2][x + 1];
              highlight.isCheck = true;
            } else {
              var highlight = $scope.board[y + 2][x + 1];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
            }
          }
          if ($scope.board[y + 2][x + 1].player === null) {
            var highlight = $scope.board[y + 2][x + 1];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
      
      }

      if (selectedSquare.identity === BISHOP || checkIdentity === BISHOP) {
        //UPPER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x - i]) {
            if ($scope.board[y - i][x - i].player === WHITE) {
              if ($scope.board[y - i][x - i].identity === KING) {
                var highlight = $scope.board[y - i][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //UPPER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x + i]) {
            if ($scope.board[y - i][x + i].player === WHITE) {
              if ($scope.board[y - i][x + i].identity === KING) {
                var highlight = $scope.board[y - i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LOWER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x - i]) {
            if ($scope.board[y + i][x - i].player === WHITE) {
              if ($scope.board[y + i][x - i].identity === KING) {
                var highlight = $scope.board[y + i][x - i];
                highlight.isCheck = true;
              }              
              var highlight = $scope.board[y + i][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LOWER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x + i]) {
            if ($scope.board[y + i][x + i].player === WHITE) {
              if ($scope.board[y + i][x + i].identity === KING) {
                var highlight = $scope.board[y + i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
      }
      
      if (selectedSquare.identity === ROOK || checkIdentity === ROOK) {
        //UP
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x]) {
            if ($scope.board[y - i][x].player === WHITE) {
              if ($scope.board[y - i][x].identity === KING) {
                var highlight = $scope.board[y - i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x - i]) {
            if ($scope.board[y][x - i].player === WHITE) {
              if ($scope.board[y][x - i].identity === KING) {
                var highlight = $scope.board[y][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x + i]) {
            if ($scope.board[y][x + i].player === WHITE) {
              if ($scope.board[y][x + i].identity === KING) {
                var highlight = $scope.board[y][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //DOWN
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x]) {
            if ($scope.board[y + i][x].player === WHITE) {
              if ($scope.board[y + i][x].identity === KING) {
                var highlight = $scope.board[y + i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
      }
      
      if (selectedSquare.identity === QUEEN || checkIdentity === QUEEN) {
        //UPPER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x - i]) {
            if ($scope.board[y - i][x - i].player === WHITE) {
              if ($scope.board[y - i][x - i].identity === KING) {
                var highlight = $scope.board[y - i][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //UP
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x]) {
            if ($scope.board[y - i][x].player === WHITE) {
              if ($scope.board[y - i][x].identity === KING) {
                var highlight = $scope.board[y - i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //UPPER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y - i] && $scope.board[y - i][x + i]) {
            if ($scope.board[y - i][x + i].player === WHITE) {
              if ($scope.board[y - i][x + i].identity === KING) {
                var highlight = $scope.board[y - i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y - i][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y - i][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y - i][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x + i]) {
            if ($scope.board[y][x + i].player === WHITE) {
              if ($scope.board[y][x + i].identity === KING) {
                var highlight = $scope.board[y][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LOWER RIGHT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x + i]) {
            if ($scope.board[y + i][x + i].player === WHITE) {
              if ($scope.board[y + i][x + i].identity === KING) {
                var highlight = $scope.board[y + i][x + i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x + i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x + i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x + i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //DOWN
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x]) {
            if ($scope.board[y + i][x].player === WHITE) {
              if ($scope.board[y + i][x].identity === KING) {
                var highlight = $scope.board[y + i][x];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y + i][x];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LOWER LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y + i] && $scope.board[y + i][x - i]) {
            if ($scope.board[y + i][x - i].player === WHITE) {
              if ($scope.board[y + i][x - i].identity === KING) {
                var highlight = $scope.board[y + i][x - i];
                highlight.isCheck = true;
              }              
              var highlight = $scope.board[y + i][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y + i][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y + i][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
        //LEFT
        for (var i = 1; i < BOARD_WIDTH; i++) {
          if ($scope.board[y][x - i]) {
            if ($scope.board[y][x - i].player === WHITE) {
              if ($scope.board[y][x - i].identity === KING) {
                var highlight = $scope.board[y][x - i];
                highlight.isCheck = true;
              }
              var highlight = $scope.board[y][x - i];
              highlight.isChoice = true;
              blackDefenseChoices.push(highlight);
              break;
            } else if ($scope.board[y][x - i].player === BLACK) {
              break;
            }
            var highlight = $scope.board[y][x - i];
            highlight.isChoice = true;
            blackDefenseChoices.push(highlight);
          }
        }
      }

      if (selectedSquare.identity === KING) {
        //UPPER LEFT
        if ($scope.board[y - 1] && $scope.board[y - 1][x - 1]) {
          if ($scope.board[y - 1][x - 1].player === WHITE) {
            var highlight = $scope.board[y - 1][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x - 1].player) {
            var highlight = $scope.board[y - 1][x - 1];
            highlight.isChoice = true;
          }
        }
        //UP
        if ($scope.board[y - 1] && $scope.board[y - 1][x]) {
          if ($scope.board[y - 1][x].player === WHITE) {
            var highlight = $scope.board[y - 1][x];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x].player) {
            var highlight = $scope.board[y - 1][x];
            highlight.isChoice = true;
          }
        }
        //UPPER RIGHT
        if ($scope.board[y - 1] && $scope.board[y - 1][x + 1]) {
          if ($scope.board[y - 1][x + 1].player === WHITE) {
            var highlight = $scope.board[y - 1][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y - 1][x + 1].player) {
            var highlight = $scope.board[y - 1][x + 1];
            highlight.isChoice = true;
          }
        }
        //RIGHT
        if ($scope.board[y] && $scope.board[y][x + 1]) {
          if ($scope.board[y][x + 1].player === WHITE) {
            var highlight = $scope.board[y][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y][x + 1].player) {
            var highlight = $scope.board[y][x + 1];
            highlight.isChoice = true;
          }
        }
        //RIGHT CASTLE
        if ($scope.board[y] && $scope.board[y][x + 2]) {
          if (!$scope.board[y][x + 1].player && !$scope.board[y][x + 2].player && blackCastleRight) {
            var highlight = $scope.board[y][x + 2];
            highlight.isChoice = true;
          }
        }
        //LOWER RIGHT
        if ($scope.board[y + 1] && $scope.board[y + 1][x + 1]) {
          if ($scope.board[y + 1][x + 1].player === WHITE) {
            var highlight = $scope.board[y + 1][x + 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x + 1].player) {
            var highlight = $scope.board[y + 1][x + 1];
            highlight.isChoice = true;
          }
        }
        //DOWN
        if ($scope.board[y + 1] && $scope.board[y + 1][x]) {
          if ($scope.board[y + 1][x].player === WHITE) {
            var highlight = $scope.board[y + 1][x];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x].player) {
            var highlight = $scope.board[y + 1][x];
            highlight.isChoice = true;
          }
        }
        //LOWER LEFT
        if ($scope.board[y + 1] && $scope.board[y + 1][x - 1]) {
          if ($scope.board[y + 1][x - 1].player === WHITE) {
            var highlight = $scope.board[y + 1][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y + 1][x - 1].player) {
            var highlight = $scope.board[y + 1][x - 1];
            highlight.isChoice = true;
          }
        }
        //LEFT
        if ($scope.board[y] && $scope.board[y][x - 1]) {
          if ($scope.board[y][x - 1].player === WHITE) {
            var highlight = $scope.board[y][x - 1];
            highlight.isChoice = true;
          } else if (!$scope.board[y][x - 1].player) {
            var highlight = $scope.board[y][x - 1];
            highlight.isChoice = true;
          }
        }
        //LEFT CASTLE
        if ($scope.board[y] && $scope.board[y][x - 2]) {
          if (!$scope.board[y][x - 1].player && !$scope.board[y][x - 2].player && blackCastleLeft) {
            var highlight = $scope.board[y][x - 2];
            highlight.isChoice = true;
          }
        }
      }
    }

  }

  function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 500);
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
  }

  function show(className, value) {
      document.getElementsByClassName(className)[0].style.display = value ? 'block' : 'none';
  }

  onReady(function () {
      show('game-container', true);
      show('loading', false);
  });

});