(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Coord = SnakeGame.Coord = function (y, x) {
    this.y = y;
    this.x = x;
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.y + coord2.y, this.x + coord2.x);
  };

  var Apple = SnakeGame.Apple = function(board) {
    this.board = board;
  }

  Apple.prototype.replace = function() {
    var x = Math.floor(Math.random() * this.board.dim);
    var y = Math.floor(Math.random() * this.board.dim);

    this.position = new Coord(x,y);
  }

  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "N";
    this.board = board;

    var center = new Coord(board.dim / 2, board.dim / 2);
    this.segments = [center];
  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.SYMBOL = "S";

  Snake.prototype.move = function () {
    var snake = this;
    var head = _(this.segments).last();
    var new_head = head.plus(Snake.DIFFS[this.dir]);

    if (snake.eatsApple(new_head)) {
      snake.segments.push(head.plus(Snake.DIFFS[this.dir]));
      this.board.apple.replace();
    } else if (this.board.validMove(new_head)) {
      snake.segments.push(head.plus(Snake.DIFFS[this.dir]));
      snake.segments.shift();
    } else {
      snake.segments = [];
    }
  };

  Snake.prototype.eatsApple = function(coord) {
    var apple_coord = this.board.apple.position
    return (coord.y == apple_coord.y) && (coord.x == apple_coord.x)
  }

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  var Board = SnakeGame.Board = function (dim) {
    this.dim = dim;

    this.apple = new Apple(this);
    this.apple.replace();

    this.snake = new Snake(this);
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function (dim) {
    return _.times(dim, function () {
      return _.times(dim, function () {
        return Board.BLANK_SYMBOL
      });
    });
  };

  Board.prototype.validMove = function (coord) {
    var inside = (coord.y >= 0) && (coord.y <= 49) && (coord.x >= 0) && (coord.x <= 49)

    var empty = _(this.snake.segments).every(function(seg){
      return (coord.y !== seg.y) || (coord.x !== seg.x)
    });

    return inside && empty;
  }

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);

    _(this.snake.segments).each(function (seg) {
      grid[seg.y][seg.x] = Snake.SYMBOL;
    });

    var apple_pos = this.apple.position

    grid[apple_pos.y][apple_pos.x] = Apple.SYMBOL;

    // join it up
    return _(grid).map(function (row) { return row.xoin(""); }).xoin("\n");
  };
})(this);