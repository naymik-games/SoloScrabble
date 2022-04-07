class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    gameSettings = JSON.parse(localStorage.getItem('ssSettings'));
    if (gameSettings === null || gameSettings.length <= 0) {
      localStorage.setItem('ssSettings', JSON.stringify(defaultValues));
      gameSettings = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0xf7eac6);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'gothic', 'Solo Scrabble', 125).setOrigin(.5).setTint(0xc76210);
    var playButton = this.add.image(game.config.width / 2, 275, 'play').setScale(2).setInteractive().setTint(0x000000)
    //var startTime = this.add.bitmapText(game.config.width / 2, 275, 'gothic', 'Play', 80).setOrigin(.5).setTint(0x000000);

    playButton.on('pointerdown', this.clickHandler, this);
    var bestScoreText = this.add.bitmapText(game.config.width / 2, 475, 'gothic', 'Best: ' + gameSettings.topScore, 60).setOrigin(.5).setTint(0x000000);
    var bestWordText = this.add.bitmapText(game.config.width / 2, 575, 'gothic', 'Words: ' + gameSettings.mostWordsFound, 60).setOrigin(.5).setTint(0x000000);
    var directionsLabelText = this.add.bitmapText(game.config.width / 2, 795, 'gothic', 'How to play:', 50).setOrigin(.5).setTint(0x000000);
    var directions = '1. Drag letter to a spot on the Board \n'
    directions += '2. After making word(s), click the play icon \n'
    directions += '3. Continue placing words and clicking play \n'
    directions += '4. When satisfied, click the new board icon'
    var directionsText = this.add.bitmapText(65, 875, 'gothic', directions, 40).setOrigin(0).setTint(0x000000);
    var tipsLabelText = this.add.bitmapText(game.config.width / 2, 1200, 'gothic', 'Tips:', 50).setOrigin(.5).setTint(0x000000);
    var tips = '1. Words do not need to touch \n'
    tips += '2. Non-words lower your score, based on letter value \n'
    tips += '3. Red tiles are 3x word score, green are 2x\n'
    tips += '4. Drag tiles to the swap icon to trade\n'
    tips += 'TS = Board Score x (correct words - errors)'
    var tipsText = this.add.bitmapText(65, 1280, 'gothic', tips, 40).setOrigin(0).setTint(0x000000).setMaxWidth(775);


  }
  clickHandler() {

    this.scene.start('playGame');
    //this.scene.launch('UI');
  }

}