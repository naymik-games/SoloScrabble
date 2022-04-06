class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {



    this.letterPad()

    this.Main = this.scene.get('playGame');
    this.Main.events.on('score', function () {

      this.score += 1;
      //console.log('dots ' + string)
      this.scoreText.setText(this.score)
    }, this);



  }

  update() {

  }

  letterPad() {
    //this.letterContainer = this.add.group()
    this.bg = this.add.image(155, 1195, 'blank').setOrigin(0)
    this.bg.displayWidth = (7 * 80) + 30
    this.bg.displayHeight = (4 * 80) + 30
    for (var i = 0; i < 26; i++) {
      if (i < 7) {
        var xPos = 210 + i * 80
        var yPos = 1250
      } else if (i < 14) {
        var num = i - 7
        var xPos = 210 + num * 80
        var yPos = 1330
      } else if (i < 21) {
        var num = i - 14
        var xPos = 210 + num * 80
        var yPos = 1410
      } else {
        var num = i - 21
        var xPos = 210 + num * 80
        var yPos = 1490
      }

      var letter = this.add.image(xPos, yPos, 'letters', i).setInteractive()
      letter.index = i
      letter.on('pointerdown', this.selectLetter.bind(this, letter));
    }
  }
  selectLetter(t) {
    console.log(t.index + 'letter')
    //this.Main.blankLetter = t.index;
    this.Main.setLetter(t.index)
    this.scene.stop();
    this.scene.resume('playGame')
  }

}