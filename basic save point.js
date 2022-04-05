let game;
var g_letpool = [];   // letter pool
var g_letscore = {};   // score for each letter
this.g_racksize = 7;
var g_letters = [["a", 1, 10], ["b", 4, 2], ["c", 4, 2], ["d", 2, 5], ["e", 1, 12],
["f", 4, 2], ["g", 3, 3], ["h", 4, 3], ["i", 1, 9], ["j", 10, 1],
["k", 5, 1], ["l", 1, 4], ["m", 3, 2], ["n", 1, 6], ["o", 1, 7],
["p", 4, 2], ["q", 10, 1], ["r", 1, 6], ["s", 1, 5], ["t", 1, 7],
["u", 2, 4], ["v", 4, 2], ["w", 4, 2], ["x", 8, 1], ["y", 4, 2],
["z", 10, 1], ["*", 0, 2]];

var g_vowels = { "a": 1, "e": 1, "i": 1, "o": 1, "u": 1 };

var g_letrange = "[a-z]";


window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {
    this.tileLetters = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', 'e', 'a', 'r', 's'
    ];
    this.tileLettersValues = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10, 1, 1, 1, 1];
    this.selected = []
    this.colText = this.add.bitmapText(85, 1550, 'topaz', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.rowText = this.add.bitmapText(185, 1550, 'topaz', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);





    this.blockSize = (game.config.width - gameOptions.offsetX * 2) / gameOptions.cols
    this.cameras.main.setBackgroundColor(0x000000);
    this.board = []

    this.createBoard()
    this.makeBag()


    //console.log(g_letpool)
    var my_letters = [];
    var comp_letters = [];

    my_letters = this.takeLetters(my_letters);
    comp_letters = this.takeLetters(comp_letters);
    //console.log(my_letters.join(''))
    this.rack = []
    for (var i = 0; i < my_letters.length; i++) {
      var ind = this.tileLetters.indexOf(my_letters[i])
      var block = this.add.image((gameOptions.offsetX + this.blockSize / 2) + i * this.blockSize, 1100, 'letters', ind).setInteractive()
      block.displayWidth = this.blockSize;
      block.displayHeight = this.blockSize;
      block.index = ind
      block.letter = my_letters[i]
      this.input.setDraggable(block);
      this.rack.push(block)
    }
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      gameObject.x = dragX;
      gameObject.y = dragY;

    }, this);
    this.input.on('dragenter', function (pointer, gameObject, target) {

    }, this)
    this.input.on('drop', function (pointer, gameObject, target) {
      gameObject.x = target.x;
      gameObject.y = target.y;
      let row = Math.floor((target.y - gameOptions.offsetY) / this.blockSize);
      let col = Math.floor((target.x - gameOptions.offsetX) / this.blockSize);
      //console.log(col + ',' + row)
      this.colText.setText(col)
      this.rowText.setText(row)
      //gameObject.disableInteractive();

    }, this)
    this.input.on('dragend', function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    }, this)
  }
  update() {

  }
  takeLetters(existing) {
    var poolsize = g_letpool.length;
    if (poolsize === 0)
      return existing;

    var needed = g_racksize - existing.length;
    if (needed > poolsize)
      needed = poolsize;
    var letters = g_letpool.slice(0, needed);
    g_letpool.splice(0, needed);
    for (var i = 0; i < letters.length; i++) {
      existing.push(letters[i])
    }
    return existing;
  }
  scrabbleScore(word) {
    let newAlphabet = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1, t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4, k: 5, j: 8, x: 8, q: 10, z: 10 },
      sum = 0,
      i;

    word = word.toLowerCase();
    for (i = 0; i < word.length; i++) {
      sum += newAlphabet[word[i]] || 0; // for unknown characters
    }
    return sum;
  }

  shuffle_pool() {
    var total = g_letpool.length;
    for (var i = 0; i < total; i++) {
      var rnd = Math.floor((Math.random() * total));
      var c = g_letpool[i];
      g_letpool[i] = g_letpool[rnd];
      g_letpool[rnd] = c;
    }
  }
  makeBag() {
    var numalpha = g_letters.length;
    for (var i = 0; i < numalpha; i++) {
      var letinfo = g_letters[i];
      var whichlt = letinfo[0];
      var lpoints = letinfo[1];
      var numlets = letinfo[2];
      g_letscore[whichlt] = lpoints;
      for (var j = 0; j < numlets; j++)
        g_letpool.push(whichlt);
    }
    this.shuffle_pool();
  }
  createBoard() {
    for (var i = 0; i < gameOptions.rows; i++) {
      var boardT = []
      for (var j = 0; j < gameOptions.cols; j++) {
        var tile = {}
        var block = this.add.image((gameOptions.offsetX + this.blockSize / 2) + i * this.blockSize, gameOptions.offsetY + j * this.blockSize, 'letters', 26).setInteractive({ dropZone: true })
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize;
        tile.image = block;
        tile.letter = null;
        tile.index = 26
        tile.bonus = 1
        boardT.push(tile)
      }
      this.board.push(boardT)
    }
    console.log(this.board)
  }
}
