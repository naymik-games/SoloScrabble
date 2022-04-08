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
    var playButton = this.add.image(game.config.width / 2, 375, 'play').setScale(2).setInteractive().setTint(0x000000)
    //var startTime = this.add.bitmapText(game.config.width / 2, 275, 'gothic', 'Play', 80).setOrigin(.5).setTint(0x000000);

    playButton.on('pointerdown', this.clickHandler, this);
    var bestScoreText = this.add.bitmapText(game.config.width / 2, 675, 'gothic', 'Best: ' + gameSettings.topScore, 60).setOrigin(.5).setTint(0x000000);
    var bestWordText = this.add.bitmapText(game.config.width / 2, 775, 'gothic', 'Words: ' + gameSettings.mostWordsFound, 60).setOrigin(.5).setTint(0x000000);
    var directionsLabelText = this.add.bitmapText(game.config.width / 2, 1195, 'gothic', 'How to play:', 50).setOrigin(.5).setTint(0x000000);
    var directions = '1. Drag letter to a spot on the Board \n'
    directions += '2. After making word(s), click the play icon \n'
    directions += '3. Continue placing words and clicking play \n'
    directions += '4. Click the new board icon to get a clean slate'
    var directionsText = this.add.bitmapText(60, 1275, 'lato', directions, 45).setOrigin(0).setTint(0x000000);


  }
  clickHandler() {

    this.scene.start('playGame');
    //this.scene.launch('UI');
  }

}