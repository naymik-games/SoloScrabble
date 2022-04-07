let game;
var g_letpool = []; // letter pool
var g_letscore = {}; // score for each letter
this.g_racksize = 7;
/* var g_letters = [["a", 1, 10], ["b", 4, 2], ["c", 4, 2], ["d", 2, 5], ["e", 1, 12],
["f", 4, 2], ["g", 3, 3], ["h", 4, 3], ["i", 1, 9], ["j", 10, 1],
["k", 5, 1], ["l", 1, 4], ["m", 3, 2], ["n", 1, 6], ["o", 1, 7],
["p", 4, 2], ["q", 10, 1], ["r", 1, 6], ["s", 1, 5], ["t", 1, 7],
["u", 2, 4], ["v", 4, 2], ["w", 4, 2], ["x", 8, 1], ["y", 4, 2],
["z", 10, 1], ["*", 0, 2]];
var letterMaster = [

]
var g_vowels = { "a": 1, "e": 1, "i": 1, "o": 1, "u": 1 };

var g_letrange = "[a-z]"; */
const HORIZONTAL = 0;
const VERTICAL = 1;

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
      'w', 'x', 'y', 'z', '*'
    ];
    this.tileLettersValues = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10, 0];
    this.selected = []
    this.selectedDir = null;
    //this.colText = this.add.bitmapText(85, 1550, 'gothic', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    // this.rowText = this.add.bitmapText(185, 1550, 'gothic', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.scoreText = this.add.bitmapText(gameOptions.offsetX, gameOptions.offsetY - 100, 'gothic', '0', 80).setOrigin(0, 1).setTint(0xffffff).setAlpha(1);
    this.xText = this.add.bitmapText(gameOptions.offsetX + 195, gameOptions.offsetY - 100, 'gothic', 'x', 80).setOrigin(0, 1).setTint(0xcf5555).setAlpha(1);
    this.bonusText = this.add.bitmapText(gameOptions.offsetX + 245, gameOptions.offsetY - 100, 'gothic', '0', 80).setOrigin(0, 1).setTint(0xcffffff).setAlpha(1);
    var tsBack = this.add.image(game.config.width - 60, gameOptions.offsetY - 85, 'blank').setOrigin(1).setTint(0x000000)
    tsBack.displayWidth = 250
    tsBack.displayHeight = 110
    this.totalScoreText = this.add.bitmapText(game.config.width - gameOptions.offsetX, gameOptions.offsetY - 100, 'gothic', '0', 80).setOrigin(1).setTint(0xffffff).setAlpha(1);

    this.score = 0
    this.totalScore = 0
    var starterWordsString = 'first twist quake frodo luke solo house zebras board tile mouse catch witch famine news school simple water hunter'
    this.starterWords = []
    this.starterWords = starterWordsString.split(" ")
    this.boardNumber = 0

    this.blockSize = (game.config.width - gameOptions.offsetX * 2) / gameOptions.cols
    this.cameras.main.setBackgroundColor(0x146944);
    this.board = []
    this.rack = []
    this.emptySlots = []
    this.foundWords = []
    this.notWords = []

    this.bg = this.add.image(gameOptions.offsetX - 15, (gameOptions.offsetY - (this.blockSize / 2)) - 15, 'blank').setOrigin(0).setTint(0x7b8274)
    this.bg.displayWidth = (this.blockSize * gameOptions.cols) + 30
    this.bg.displayHeight = (this.blockSize * gameOptions.rows) + 30

    var rackBack = this.add.image(gameOptions.offsetX - 15, 1240, 'blank').setOrigin(0).setTint(0x000000)
    rackBack.displayWidth = 7 * this.blockSize + 30
    rackBack.displayHeight = this.blockSize + 30

    this.swapIcon = this.add.image(710, 1550, 'swap').setScale(1.25).setInteractive({ dropZone: true });
    this.swapIcon.type = 'swap'
    this.swap = this.add.image(825, 1550, 'letters', 26).setScale(1.25).setInteractive({ dropZone: true })
    this.swap.type = 'swap'

    this.tileText = this.add.bitmapText(825, 1550, 'gothic', '0', 40).setOrigin(.5).setTint(0x000000).setAlpha(1);

    this.scrabbleLetters = this.makeBag(scrabbleLettersDict)
    this.shuffle_pool()
    console.log(this.scrabbleLetters)
    //console.log(g_letpool)


    this.createBoard()

    var rand = Phaser.Math.Between(0, this.starterWords.length - 1)
    this.firstWord(this.starterWords[rand])

    var timer = this.time.addEvent({
      delay: 1000, // ms
      callback: this.makeRack,
      //args: [],
      callbackScope: this,
      loop: false
    });


    //console.log(g_letpool)
    this.myLetters = [];
    var comp_letters = [];

    //this.myLetters = this.takeLetters(this.myLetters);
    //comp_letters = this.takeLetters(comp_letters);



    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

      gameObject.x = dragX;
      gameObject.y = dragY;

    }, this);

    this.input.on('dragenter', function (pointer, gameObject, target) {
      if (target.type == 'board') {

      } else if (target.type == 'swap') {
        target.setScale(1.75)
      }
    }, this)
    this.input.on('dragleave', function (pointer, gameObject, target) {
      if (target.type == 'board') {

      } else if (target.type == 'swap') {
        target.setScale(1.25)
      }
    }, this)
    this.input.on('drop', function (pointer, gameObject, target) {
      gameObject.x = target.x;
      gameObject.y = target.y;
      if (target.type == 'board') {
        // this.colText.setText(target.col)
        //  this.rowText.setText(target.row)
        if (gameObject.letter == '*') {
          this.launchLetterPad(target.col, target.row)
        }
        this.board[target.row][target.col].letter = gameObject.letter
        this.playedLetters[target.row][target.col] = gameObject;
        if (this.rack[gameObject.slot] != null) {
          this.rack.splice(gameObject.slot, 1, null)
          this.emptySlots.push(gameObject.slot)
        }
        //gameObject.disableInteractive();
        //target.input.dropZone = false;
        //console.log(this.board)
      } else if (target.type == 'swap') {
        this.rack.splice(gameObject.slot, 1, null)
        var ind = this.tileLetters.indexOf(gameObject.letter)
        var tempScore = this.tileLettersValues[ind]
        this.score -= tempScore
        this.scoreText.setText(this.score)
        this.emptySlots.push(gameObject.slot)
        this.getNewTiles()
        target.setScale(1.25)
        gameObject.setAlpha(0)

      }
    }, this)

    this.input.on('dragend', function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    }, this)
    var playButton = this.add.image(820, 1300, 'play').setScale(1.4).setInteractive()
    playButton.on('pointerdown', this.playWord, this)
    //var clearButton = this.add.image(75, 1550, 'letters', 26).setScale(1.25).setInteractive()

    var clearIcon = this.add.image(175, 1550, 'clear').setScale(1.25).setInteractive()
    clearIcon.on('pointerdown', this.clear, this)
    this.boardText = this.add.bitmapText(75, 1550, 'gothic', '1', 60).setOrigin(.5).setTint(0xffffff).setAlpha(1);

    /*  var buttonTest = this.add.image(850, 50, 'letters', 26).setInteractive()
      buttonTest.on('pointerdown', function () {
        this.scene.pause()
        this.scene.launch('UI')
      }, this) */



  }
  update() {

  }

  playWord() {
    var tempScore = 0
    var wordsOnBoard = this.getWords()
    console.log(wordsOnBoard)
    if (wordsOnBoard.length > 0) {
      for (var i = 0; i < wordsOnBoard.length; i++) {
        if (ScrabbleWordList.indexOf(wordsOnBoard[i]) > -1) {
          if (this.foundWords.indexOf(wordsOnBoard[i]) < 0) {
            this.foundWords.push(wordsOnBoard[i])
            if (this.wordsbonus.length > 0) {
              console.log(this.wordsbonus[i])
            }
            tempScore += this.scrabbleScore(wordsOnBoard[i]) * this.wordsbonus[i]
          }

        } else {
          if (this.notWords.indexOf(wordsOnBoard[i]) < 0) {
            this.notWords.push(wordsOnBoard[i])
          }
        }

      }
      console.log(this.foundWords)
      console.log(this.notWords)
      this.bonusText.setText(this.foundWords.length - this.notWords.length)
      this.score += tempScore
      this.scoreText.setText(this.score)
    }
    this.disableBoard()

    this.getNewTiles()

  }
  clear() {
    this.clearBoard()
    var badScore = this.scoreWordList(this.notWords)
    this.score -= badScore
    this.scoreText.setText(this.score)
    this.updateScore()
    this.boardNumber++
    this.boardText.setText(this.boardNumber + 1)
    var timer = this.time.addEvent({
      delay: 500, // ms
      callback: function () {
        if (this.scrabbleLetters.length > 0) {
          this.firstWord(this.starterWords[this.boardNumber])
          this.notWords = []
          this.addDoubleBonus(3)
          this.addTripleBonus(2)
        } else {
          alert('Done')
        }

      },
      //args: [],
      callbackScope: this,
      loop: false
    });
  }
  updateScore() {
    var bonus = this.foundWords.length - this.notWords.length
    this.score *= bonus
    this.scoreText.setText(this.score)

    this.totalScore += this.score;
    this.totalScoreText.setText(this.totalScore);
    this.score = 0
    this.scoreText.setText(this.score)
  }
  launchLetterPad(col, row) {
    this.blankCoo = { col: col, row: row }
    //this.blankLetter = null
    console.log(this.blankCoo)
    this.scene.pause()
    this.scene.launch('UI')
  }
  setLetter(ind) {
    this.playedLetters[this.blankCoo.row][this.blankCoo.col].setFrame(ind)
    this.board[this.blankCoo.row][this.blankCoo.col].letter = this.tileLetters[ind]
    console.log(ind)
  }
  getWords() {
    let words = []
    this.wordsbonus = []
    //row words
    for (let row = 0; row < gameOptions.rows; row++) {
      let word = '';
      let wordBonus = 1
      for (let column = 0; column < gameOptions.cols; column++) {
        let letter = this.board[row][column].letter
        let bonus = this.board[row][column].bonus
        if (letter) {
          word += letter;
          if (bonus > wordBonus) {
            wordBonus = bonus
          }
        } else {
          if (word.length >= 2) {
            words.push(word);
            this.wordsbonus.push(wordBonus)
          }
          word = '';
          wordBonus = 1
        }
      }
      if (word.length >= 2) {
        words.push(word);
        this.wordsbonus.push(wordBonus)
      }
    }

    //column words
    for (let column = 0; column < gameOptions.cols; column++) {
      let word = '';
      let wordBonus = 1
      for (let row = 0; row < gameOptions.rows; row++) {
        //let field = this.fields[column + row * gameOptions.cols];
        let letter = this.board[row][column].letter
        let bonus = this.board[row][column].bonus
        if (letter) {
          word += letter;
          if (bonus > wordBonus) {
            wordBonus = bonus
          }

        } else {
          if (word.length >= 2) {
            words.push(word);
            this.wordsbonus.push(wordBonus)
          }
          word = '';
          wordBonus = 1
        }
      }
      if (word.length >= 2) {
        this.wordsbonus.push(wordBonus)
        words.push(word);
      }
    }

    return words;
  }
  getNewTiles() {
    for (var i = 0; i < this.emptySlots.length; i++) {
      if (this.scrabbleLetters.length > 0) {
        var letter = this.getLetter()
        var ind = this.tileLetters.indexOf(letter[0])
        var block = this.add.image(-100, 1300, 'letters', ind).setInteractive()
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize;
        block.index = ind
        block.letter = letter[0]
        block.slot = this.emptySlots[i]
        this.input.setDraggable(block);
        this.rack.splice(this.emptySlots[i], 1, block)
        var tween = this.tweens.add({
          targets: block,
          x: (gameOptions.offsetX + this.blockSize / 2) + this.emptySlots[i] * this.blockSize,
          duration: 400,
          angle: 360,
          delay: i * 50
        })
      }
    }
    this.tileText.setText(this.scrabbleLetters.length)
    this.emptySlots = []
  }
  getLetter() {
    return this.scrabbleLetters.splice(0, 1)
    // return g_letpool.splice(0, 1);
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
  scoreWordList(list) {
    var tempScore = 0
    for (var i = 0; i < list.length; i++) {
      tempScore += this.scrabbleScore(list[i])
    }
    return tempScore
  }
  clearBoard() {
    //console.log(this.playedLetters)
    console.log(this.foundWords.length)
    console.log(this.notWords.length)
    for (let row = 0; row < gameOptions.rows; row++) {
      for (let column = 0; column < gameOptions.cols; column++) {
        this.board[row][column].bonus = 1;
        this.board[row][column].image.clearTint()
        if (this.playedLetters[row][column] != null) {
          var tween = this.tweens.add({
            targets: this.playedLetters[row][column],
            x: this.swap.x,
            y: this.swap.y,
            duration: 200,
            angle: 360,
            //delay: row * 75,
            callbackScope: this,
            onComplete: function () {
              this.board[row][column].letter = null
              this.board[row][column].image.input.dropZone = true;
              this.playedLetters[row][column].setAlpha(0)
              this.playedLetters[row][column] = null

            }
          })
        }

      }
    }
  }
  disableBoard() {
    //console.log(this.playedLetters)
    for (let row = 0; row < gameOptions.rows; row++) {
      for (let column = 0; column < gameOptions.cols; column++) {
        if (this.playedLetters[row][column] != null) {
          this.playedLetters[row][column].disableInteractive();
          this.board[row][column].image.input.dropZone = false;
          if (this.board[row][column].bonus == 2) {
            this.playedLetters[row][column].setTint(0x00ff00)
          } if (this.board[row][column].bonus == 3) {
            this.playedLetters[row][column].setTint(0xff0000)
          }
        }
      }
    }
  }
  firstWord(word) {
    var first = word
    var startR = Phaser.Math.Between(0, gameOptions.rows - 1);
    var startC = Phaser.Math.Between(0, 2);
    for (var i = 0; i < first.length; i++) {
      var ind = this.tileLetters.indexOf(first[i])
      var block = this.add.image(this.swap.x, this.swap.y, 'letters', ind).setInteractive()
      block.displayWidth = this.blockSize;
      block.displayHeight = this.blockSize
      block.index = ind
      block.letter = first[i]
      this.board[startR][(startC + i)].letter = first[i]
      this.playedLetters[startR][(startC + i)] = block
      var tween = this.tweens.add({
        targets: block,
        x: (gameOptions.offsetX + this.blockSize / 2) + (startC + i) * this.blockSize,
        y: gameOptions.offsetY + startR * this.blockSize,
        duration: 400,
        angle: 360,
        delay: i * 50
      })
    }
    this.foundWords.push(word)
    this.removeFromPool(word)
  }
  removeFromPool(word) {
    for (var i = 0; i < word.length; i++) {
      //var ind = g_letpool.indexOf(word[i])
      // g_letpool.splice(ind, 1);
      var ind = this.scrabbleLetters.indexOf(word[i])
      this.scrabbleLetters.splice(ind, 1);

    }
    this.tileText.setText(this.scrabbleLetters.length)
  }
  makeRack() {
    var rackBack = this.add.image(gameOptions.offsetX - 15, 1240, 'blank').setOrigin(0).setTint(0x000000)
    rackBack.displayWidth = 7 * this.blockSize + 30
    rackBack.displayHeight = this.blockSize + 30
    for (var i = 0; i < 7; i++) {
      var lett = this.getLetter()
      var ind = this.tileLetters.indexOf(lett[0])
      var block = this.add.image(-100, 1300, 'letters', ind).setInteractive()
      block.displayWidth = this.blockSize;
      block.displayHeight = this.blockSize;
      block.index = ind
      block.letter = lett[0]
      block.slot = i
      this.input.setDraggable(block);
      this.rack.push(block)
      var tween = this.tweens.add({
        targets: block,
        x: (gameOptions.offsetX + this.blockSize / 2) + i * this.blockSize,
        duration: 400,
        angle: 360,
        delay: i * 50
      })
    }
    this.tileText.setText(this.scrabbleLetters.length)
  }
  addDoubleBonus(count) {
    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, gameOptions.rows - 1)
      var col = Phaser.Math.Between(0, gameOptions.cols - 1)
      if (this.board[row][col].bonus == 1 && this.board[row][col].letter == null) {
        this.board[row][col].bonus = 2;
        this.board[row][col].image.setTint(0x00ff00)
        i++
      }
    }
  }
  addTripleBonus(count) {
    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, gameOptions.rows - 1)
      var col = Phaser.Math.Between(0, gameOptions.cols - 1)
      if (this.board[row][col].bonus == 1 && this.board[row][col].letter == null) {
        this.board[row][col].bonus = 3;
        this.board[row][col].image.setTint(0xff0000)
        i++
      }
    }
  }
  createBoard() {
    this.playedLetters = []
    for (var i = 0; i < gameOptions.rows; i++) {
      var boardT = []
      var played = []
      for (var j = 0; j < gameOptions.cols; j++) {
        var tile = {}
        var block = this.add.image((gameOptions.offsetX + this.blockSize / 2) + j * this.blockSize, gameOptions.offsetY + i * this.blockSize, 'letters', 27).setInteractive({ dropZone: true })
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize;
        tile.image = block;
        tile.letter = null;
        tile.index = 26
        tile.bonus = 1
        block.row = i
        block.col = j
        block.type = 'board'
        boardT.push(tile)
        played.push(null)
      }
      this.board.push(boardT)
      this.playedLetters.push(played)
    }
    //console.log(this.board)
    //console.log(this.playedLetters)
    this.addDoubleBonus(1)
    this.addTripleBonus(1)
  }

  makeBag(lettersDict) {
    var result = []
    for (const [key, value] of Object.entries(lettersDict)) {
      // from: https://stackoverflow.com/questions/34913675/
      var name = key
      var count = value[0]
      // var score = value[1]
      for (const i in [...Array(count).keys()]) {
        // equivalent of range() in python. From: https://stackoverflow.com/questions/3895478/
        result.push(name)
      }
    }
    return result
  }
  shuffle_pool() {
    var total = this.scrabbleLetters.length;
    for (var i = 0; i < total; i++) {
      var rnd = Math.floor((Math.random() * total));
      var c = this.scrabbleLetters[i];
      this.scrabbleLetters[i] = this.scrabbleLetters[rnd];
      this.scrabbleLetters[rnd] = c;
    }
  }

}
