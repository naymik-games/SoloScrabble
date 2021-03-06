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

    scene: [preloadGame, startGame, playGame, UI, endGame, wordsPlayed, help]
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
    this.titleText = this.add.bitmapText(75, 20, 'lato', 'SOLOSCRABBLE', 50).setOrigin(0).setTint(0xffffff).setAlpha(1);

    //this.colText = this.add.bitmapText(85, 1550, 'gothic', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    // this.rowText = this.add.bitmapText(185, 1550, 'gothic', '0', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.blockSize = (game.config.width - gameOptions.offsetX * 2) / gameOptions.cols
    this.cameras.main.setBackgroundColor(0x146944);
    this.bg = this.add.image(gameOptions.offsetX - 15, (gameOptions.offsetY - (this.blockSize / 2)) - 15, 'blank').setOrigin(0).setTint(0x000000)
    this.bg.displayWidth = (this.blockSize * gameOptions.cols) + 30
    this.bg.displayHeight = (this.blockSize * gameOptions.rows) + 30

    var rackBack = this.add.image(gameOptions.offsetX - 15, 1240, 'blank').setOrigin(0).setTint(0x000000)
    rackBack.displayWidth = 7 * this.blockSize + 30
    rackBack.displayHeight = this.blockSize + 30
    this.boardText = this.add.bitmapText(75, 1550, 'gothic', '1', 60).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    starterWords = starterWordsString.split(" ")
    //console.log(starterWords)
    //main game variables
    if (gameLoad == 'new') {
      this.score = 0
      this.totalScore = 0
      this.boardNumber = 0
      this.board = []
      this.rack = []
      this.emptySlots = []
      this.foundWords = []
      this.notWords = []
      this.playedLetters = []
      this.scrabbleLetters = this.makeBag(scrabbleLettersDict)
      this.shuffle_pool()
    } else {
      loadedGame = JSON.parse(localStorage.getItem('ssSave'));
      //console.log(loadedGame.board)
      this.score = loadedGame.score
      this.totalScore = loadedGame.totalScore
      this.boardNumber = loadedGame.boardNum
      this.boardText.setText(this.boardNumber + 1)
      this.board = []
      this.rack = []
      this.emptySlots = []
      this.foundWords = loadedGame.words
      this.notWords = loadedGame.notWords
      this.playedLetters = []
      this.scrabbleLetters = loadedGame.bag

      //console.log(this.board)

    }
    this.scoreText = this.add.bitmapText(gameOptions.offsetX, gameOptions.offsetY - 100, 'gothic', this.score, 80).setOrigin(0, 1).setTint(0xffffff).setAlpha(1);
    this.xText = this.add.bitmapText(gameOptions.offsetX + 195, gameOptions.offsetY - 100, 'gothic', 'x', 50).setOrigin(0, 1).setTint(0xD6DEFF).setAlpha(1);
    this.bonusText = this.add.bitmapText(gameOptions.offsetX + 245, gameOptions.offsetY - 100, 'gothic', this.foundWords.length - this.notWords.length, 50).setOrigin(0, 1).setTint(0xcffffff).setAlpha(1);
    var tsBack = this.add.image(game.config.width - 60, gameOptions.offsetY - 85, 'blank').setOrigin(1).setTint(0x000000)
    tsBack.displayWidth = 250
    tsBack.displayHeight = 110
    this.totalScoreText = this.add.bitmapText(game.config.width - gameOptions.offsetX, gameOptions.offsetY - 100, 'gothic', this.totalScore, 80).setOrigin(1).setTint(0xffffff).setAlpha(1);
    this.bestScoreText = this.add.bitmapText(game.config.width - gameOptions.offsetX, gameOptions.offsetY - 200, 'gothic', gameSettings.topScore, 50).setOrigin(1).setTint(0xD6DEFF).setAlpha(1);

    this.wordText = this.add.bitmapText(game.config.width / 2, 1375, 'gothic', '', 50).setOrigin(.5, 0).setTint(0xcffffff).setAlpha(1);

    //scrable letters



    this.scoreDone = true;





    this.swapIcon = this.add.image(710, 1550, 'swap').setScale(1.25).setInteractive({ dropZone: true });
    this.swapIcon.type = 'swap'
    this.swap = this.add.image(825, 1550, 'letters', 26).setScale(1.25).setInteractive({ dropZone: true })
    this.swap.type = 'swap'

    this.tileText = this.add.bitmapText(825, 1550, 'gothic', '0', 40).setOrigin(.5).setTint(0x000000).setAlpha(1);

    if (gameLoad == 'new') {
      this.createBoard()

      var rand = Phaser.Math.Between(0, starterWords.length - 1)
      var tword = starterWords.splice(rand, 1)
      this.firstWord(tword[0])

      var timer = this.time.addEvent({
        delay: 1000, // ms
        callback: this.makeRack,
        //args: [],
        callbackScope: this,
        loop: false
      });
    } else {
      this.loadGame()

    }




    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      this.wordText.setText('')
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
        this.clearIcon.disableInteractive();
        this.clearIcon.setAlpha(.5)
        //gameObject.disableInteractive();
        //target.input.dropZone = false;
        ////console.log(this.board)
      } else if (target.type == 'swap') {
        this.rack.splice(gameObject.slot, 1, null)
        var ind = this.tileLetters.indexOf(gameObject.letter)
        var tempScore = this.tileLettersValues[ind] * (this.boardNumber + 1)
        this.score -= tempScore;
        this.showToast('-' + tempScore)
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

    this.clearIcon = this.add.image(175, 1550, 'clear').setScale(1.25).setAlpha(.5)
    this.clearIcon.on('pointerdown', this.clear, this)


    // var homeIcon = this.add.image(game.config.width / 2, 1550, 'menu').setScale(1.25).setInteractive();
    /*  homeIcon.on('pointerdown', function () {
       this.scene.stop();
       this.scene.start('startGame')
     }, this) */
    /*  var testData = {
       totalScore: 1000,
       score: 50,
       wordCount: 37,
       notWordCount: 3,
       rackCount: 0,
       rackScore: 0,
       boardNumber: 5
     }
     var buttonTest = this.add.image(850, 50, 'letters', 26).setInteractive()
     buttonTest.on('pointerdown', function () {
       this.scene.pause()
       this.scene.launch('endGame', testData)
       //this.saveGame()
     }, this) */

    this.scoreBuffer = 0;
    this.makeMenu()

  }
  update() {
    if (this.scoreBuffer > 0) {
      this.scoreDone = false;
      this.incrementScore();
      this.scoreBuffer--;
    } else {
      this.scoreDone = true
    }
  }
  toggleMenu() {

    if (this.menuGroup.y == 0) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -270,
        duration: 500,
        ease: 'Bounce'
      })

    }
    if (this.menuGroup.y == -270) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
    }
  }
  playWord() {
    //this.showToast('testing')
    var tempScore = 0
    var wordsOnBoard = this.getWords()
    var tempFound = []
    var tempNot = []
    //console.log(wordsOnBoard)
    if (wordsOnBoard.length > 0) {
      for (var i = 0; i < wordsOnBoard.length; i++) {
        if (ScrabbleWordList.indexOf(wordsOnBoard[i]) > -1) {
          if (this.foundWords.indexOf(wordsOnBoard[i]) < 0) {
            this.foundWords.push(wordsOnBoard[i])
            tempFound.push(wordsOnBoard[i])
            if (this.wordsbonus.length > 0) {
              //console.log(this.wordsbonus[i])
            }
            tempScore += this.scrabbleScore(wordsOnBoard[i]) * this.wordsbonus[i]
          }

        } else {
          if (this.notWords.indexOf(wordsOnBoard[i]) < 0) {
            this.notWords.push(wordsOnBoard[i])
            tempNot.push(wordsOnBoard[i])
            if (this.wordsbonus.length > 0) {
              //console.log(this.wordsbonus[i])
            }
            tempScore -= this.scrabbleScore(wordsOnBoard[i]) * this.wordsbonus[i]
          }
        }

      }
      ////console.log(this.foundWords)
      ////console.log(this.notWords)
      //console.log(tempFound)
      //console.log(tempNot)
      //console.log(this.board)
      // console.log(this.playedLetters)
      if (tempFound.length == 1) {
        var word = 'word'
      } else {
        var word = 'words'
      }
      if (tempNot.length == 1) {
        var error = 'error'
      } else {
        var error = 'errors'
      }
      this.wordText.setText(tempFound.length + ' ' + word + ', ' + tempNot.length + ' ' + error)
      this.bonusText.setText(this.foundWords.length - this.notWords.length)
      this.score += tempScore
      this.scoreText.setText(this.score)
      if (tempFound.length > 0) {
        this.wordFindEmit(this.scoreText.x, this.scoreText.y)
      }
    }
    this.disableBoard()

    this.getNewTiles()
    this.clearIcon.setInteractive();
    this.clearIcon.setAlpha(1)

    this.saveGame()
  }
  clear() {
    this.clearIcon.disableInteractive();
    this.clearIcon.setAlpha(.5)
    this.clearBoard()
    this.wordText.setText('')
    var badScore = this.scoreWordList(this.notWords)
    this.score -= badScore
    this.scoreText.setText(this.score)
    if (this.scrabbleLetters.length > 0) {
      this.updateScore()
    }
    this.boardNumber++
    this.boardText.setText(this.boardNumber + 1)
    var timer = this.time.addEvent({
      delay: 500, // ms
      callback: function () {
        if (this.scrabbleLetters.length > 0) {
          var rand = Phaser.Math.Between(0, starterWords.length - 1)
          var tword = starterWords.splice(rand, 1)
          this.firstWord(tword[0])
          this.notWords = []
          var rand2 = Phaser.Math.Between(1, 3)
          this.addDoubleBonus(rand2)
          var rand3 = Phaser.Math.Between(1, 2)
          this.addTripleBonus(rand3)
          this.addBlocks(this.boardNumber)
          this.saveGame()
        } else {
          this.endGame()
        }

      },
      //args: [],
      callbackScope: this,
      loop: false
    });
  }
  endGame() {
    this.showToast('Game Over')
    var rCount = 0
    var rScore = 0
    for (let index = 0; index < this.rack.length; index++) {
      if (this.rack[index] != null) {
        rScore += this.tileLettersValues[this.rack[index].index]
        rCount++
      }
    }

    var data = {
      totalScore: this.totalScore,
      score: this.score,
      wordCount: this.foundWords.length,
      notWordCount: this.notWords.length,
      rackCount: rCount,
      rackScore: rScore,
      boardNumber: this.boardNumber
    }
    this.scene.pause()
    this.scene.launch('endGame', data)
    /* 
    if (this.rack.length == 0) {
      this.scoreBuffer += 1000
      this.showToast('all tiles bonus')
    }

    if (this.totalScore > gameSettings.topScore) {
      gameSettings.topScore = this.totalScore
    }
    if (this.foundWords.length > gameSettings.mostWordsFound) {
      gameSettings.mostWordsFound = this.foundWords.length
    }
    gameSettings.lastScore = this.totalScore
    this.saveSettins() */
  }
  updateScore() {
    var bonus = this.foundWords.length - this.notWords.length
    this.score *= bonus
    this.scoreText.setText(this.score)
    this.tempTotal = this.totalScore
    this.totalScoreText.setText(this.tempTotal)
    this.totalScore += this.score
    this.scoreBuffer += this.score
    //this.totalScore += this.score;
    // this.totalScoreText.setText(this.totalScore);
    //this.wordFindEmit(this.totalScoreText.x, this.totalScoreText.y)
    this.score = 0
    this.scoreText.setText(this.score)
  }
  incrementScore() {
    this.tempTotal += 1;
    this.totalScoreText.setText(this.tempTotal);
  }
  launchLetterPad(col, row) {
    this.blankCoo = { col: col, row: row }
    //this.blankLetter = null
    //console.log(this.blankCoo)
    this.scene.pause()
    this.scene.launch('UI')
  }
  setLetter(ind) {
    this.playedLetters[this.blankCoo.row][this.blankCoo.col].setFrame(ind)
    this.board[this.blankCoo.row][this.blankCoo.col].letter = this.tileLetters[ind]
    //console.log(ind)
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
    ////console.log(this.playedLetters)
    //console.log(this.foundWords.length)
    //console.log(this.notWords.length)
    for (let row = 0; row < gameOptions.rows; row++) {
      for (let column = 0; column < gameOptions.cols; column++) {
        this.board[row][column].bonus = 1;
        this.board[row][column].image.clearTint()
        this.board[row][column].image.input.dropZone = true;
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

              this.playedLetters[row][column].setAlpha(0)
              this.playedLetters[row][column] = null

            }
          })
        }

      }
    }
  }
  disableBoard() {
    ////console.log(this.playedLetters)
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
    if (Math.random() > .5) {
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
    } else {
      var startR = Phaser.Math.Between(0, 2);
      var startC = Phaser.Math.Between(0, gameOptions.cols - 1);
      for (var i = 0; i < first.length; i++) {
        var ind = this.tileLetters.indexOf(first[i])
        var block = this.add.image(this.swap.x, this.swap.y, 'letters', ind).setInteractive()
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize
        block.index = ind
        block.letter = first[i]
        this.board[startR + i][startC].letter = first[i]
        this.playedLetters[startR + i][startC] = block
        var tween = this.tweens.add({
          targets: block,
          x: (gameOptions.offsetX + this.blockSize / 2) + startC * this.blockSize,
          y: gameOptions.offsetY + (startR + i) * this.blockSize,
          duration: 400,
          angle: 360,
          delay: i * 50
        })
      }
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
    var rackBack = this.add.image(gameOptions.offsetX - 15, 1235, 'blank').setOrigin(0).setTint(0x000000)
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
  addBlocks(count) {
    var i = 0
    while (i < count) {
      var row = Phaser.Math.Between(0, gameOptions.rows - 1)
      var col = Phaser.Math.Between(0, gameOptions.cols - 1)
      if (this.board[row][col].bonus == 1 && this.board[row][col].letter == null) {
        this.board[row][col].block = true
        this.board[row][col].image.setTint(0x000000)
        this.board[row][col].image.input.dropZone = false;
        i++
      }
    }
  }
  saveGame() {
    var saveBoard = []
    for (var i = 0; i < gameOptions.rows; i++) {
      var saveBoardT = []
      for (var j = 0; j < gameOptions.cols; j++) {
        var tile = {
          letter: this.board[i][j].letter,
          bonus: this.board[i][j].bonus,
          block: this.board[i][j].block
        }
        saveBoardT.push(tile)
      }
      saveBoard.push(saveBoardT)
    }
    var saveRack = []
    for (let index = 0; index < this.rack.length; index++) {
      const element = this.rack[index].letter;
      saveRack.push(element)
    }
    save.board = saveBoard
    save.score = this.score
    save.totalScore = this.totalScore
    save.boardNum = this.boardNumber
    save.words = this.foundWords
    save.notWords = this.notWords
    save.bag = this.scrabbleLetters
    save.rack = saveRack
    localStorage.setItem('ssSave', JSON.stringify(save));
    /* let save = {
      score: null,
      totalScore: null,
      boardNum: null,
      rack: [],
     
      board: [],
     
      words: [],
      notWords: [],
      bag: []
    } */
  }
  loadGame() {
    //console.log('loading---')
    for (var i = 0; i < gameOptions.rows; i++) {
      var boardT = []
      var played = []
      for (var j = 0; j < gameOptions.cols; j++) {
        var tile = {}
        var block = this.add.image((gameOptions.offsetX + this.blockSize / 2) + j * this.blockSize, gameOptions.offsetY + i * this.blockSize, 'letters', 27).setInteractive({ dropZone: true })
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize;
        tile.image = block;
        tile.letter = loadedGame.board[i][j].letter;
        tile.bonus = loadedGame.board[i][j].bonus
        block.row = i
        block.col = j
        block.type = 'board'
        tile.block = loadedGame.board[i][j].block;
        if (loadedGame.board[i][j].bonus == 2) {
          tile.image.setTint(0x00ff00)
        } else if (loadedGame.board[i][j].bonus == 3) {
          tile.image.setTint(0xff0000)
        }
        if (tile.block) {
          tile.block = true
          tile.image.setTint(0x000000)
          tile.image.input.dropZone = false;
        }
        boardT.push(tile)
        played.push(null)

      }
      this.board.push(boardT)
      this.playedLetters.push(played)
    }
    this.loadRack()
    this.loadTiles()

    ////console.log(this.board)
    ////console.log(this.playedLetters)
    // this.addDoubleBonus(1)
    //this.addTripleBonus(1)
    //this.addBlocks(3)
    //LOAD PLAYED TILES
  }
  loadRack() {
    for (var i = 0; i < 7; i++) {
      var lett = loadedGame.rack[i]
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
  loadTiles() {
    for (var i = 0; i < gameOptions.rows; i++) {
      for (var j = 0; j < gameOptions.cols; j++) {
        if (this.board[i][j].letter != null) {
          var ind = this.tileLetters.indexOf(this.board[i][j].letter)
          var block = this.add.image(this.swap.x, this.swap.y, 'letters', ind).setInteractive()
          block.displayWidth = this.blockSize;
          block.displayHeight = this.blockSize
          block.index = ind
          block.letter = this.board[i][j].letter
          //this.board[startR][(startC + i)].letter = first[i]
          this.playedLetters[i][j] = block
          var tween = this.tweens.add({
            targets: block,
            x: (gameOptions.offsetX + this.blockSize / 2) + j * this.blockSize,
            y: gameOptions.offsetY + i * this.blockSize,
            duration: 400,
            angle: 360,
            delay: i * 50
          })

        }
      }
    }
  }
  createBoard() {

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

        tile.bonus = 1
        block.row = i
        block.col = j
        block.type = 'board'
        tile.block = false;
        boardT.push(tile)
        played.push(null)
      }
      this.board.push(boardT)
      this.playedLetters.push(played)
    }
    ////console.log(this.board)
    ////console.log(this.playedLetters)
    this.addDoubleBonus(1)
    this.addTripleBonus(1)
    //this.addBlocks(3)
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
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(3);
    var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.8)
    menuBG.displayWidth = 300;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
    menuButton.on('pointerdown', this.toggleMenu, this)
    menuButton.setOrigin(0.5);
    this.menuGroup.add(menuButton);
    var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'gothic', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    homeButton.on('pointerdown', function () {
      this.scene.stop()
      this.scene.start('startGame')
    }, this)
    this.menuGroup.add(homeButton);
    var wordButton = this.add.bitmapText(game.config.width / 2, game.config.height + 140, 'gothic', 'WORDS', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    wordButton.on('pointerdown', function () {
      var data = {
        yesWords: this.foundWords,
        noWords: this.notWords
      }
      this.scene.pause()
      this.scene.launch('wordsPlayed', data)
    }, this)
    this.menuGroup.add(wordButton);
    var helpButton = this.add.bitmapText(game.config.width / 2, game.config.height + 230, 'gothic', 'HELP', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    helpButton.on('pointerdown', function () {

      this.scene.pause()
      this.scene.launch('help')
    }, this)
    this.menuGroup.add(helpButton);
    //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
    // thankYou.setOrigin(0.5);
    // menuGroup.add(thankYou);    
    ////////end menu
  }
  showToast(text) {
    if (this.toastBox) {
      this.toastBox.destroy(true);
    }
    var toastBox = this.add.container().setDepth(2);
    var backToast = this.add.image(0, 0, 'blank').setDepth(2);
    backToast.setAlpha(.9);
    backToast.displayWidth = 700;
    backToast.displayHeight = 90;
    toastBox.add(backToast);
    toastBox.setPosition(game.config.width / 2, -100);
    var toastText = this.add.bitmapText(20, 0, 'gothic', text, 52,).setTint(0x000000).setOrigin(.5, .5).setDepth(2);
    toastText.setMaxWidth(game.config.width - 10);
    toastBox.add(toastText);
    this.toastBox = toastBox;
    this.tweens.add({
      targets: this.toastBox,
      //alpha: .5,
      y: 95,
      duration: 500,
      //  yoyo: true,
      callbackScope: this,
      onComplete: function () {
        this.time.addEvent({
          delay: 2500,
          callback: this.hideToast,
          callbackScope: this
        });
      }
    });
    //this.time.addEvent({delay: 2000, callback: this.hideToast, callbackScope: this});
  }
  hideToast() {
    this.tweens.add({
      targets: this.toastBox,
      //alpha: .5,
      y: -95,
      duration: 500,
      //  yoyo: true,
      callbackScope: this,
      onComplete: function () {
        this.toastBox.destroy(true);
      }
    });

  }
  wordFindEmit(targetx, targety) {

    var particles = this.add.particles("particle");

    //.setTint(0x7d1414);
    var emitter = particles.createEmitter({
      // particle speed - particles do not move
      // speed: 1000,
      //frame: { frames: [0, 1, 2, 3], cycle: true },

      speed: {
        min: -500,
        max: 500
      },
      // particle scale: from 1 to zero
      scale: {
        start: 4,
        end: 0
      },
      // particle alpha: from opaque to transparent
      alpha: {
        start: 1,
        end: 1
      },
      // particle frequency: one particle every 100 milliseconds
      frequency: 25,
      // particle lifespan: 1 second
      lifespan: 1000
    });
    //emitter.tint.onChange(0x7d1414);
    emitter.explode(20, targetx, targety);

  }
  saveSettins() {
    localStorage.setItem('ssSettings', JSON.stringify(gameSettings));
  }
}
