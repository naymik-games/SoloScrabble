class wordsPlayed extends Phaser.Scene {
	constructor() {
		super("wordsPlayed");
	}
	preload() {



	}
	init(data) {

		this.words = data.yesWords;
		this.notWords = data.noWords

	}
	create() {
		this.Main = this.scene.get('playGame');

		var back = this.add.image(gameOptions.offsetX, gameOptions.offsetY - (this.Main.blockSize / 2), 'blank').setAlpha(.9).setOrigin(0);
		back.displayWidth = gameOptions.cols * this.Main.blockSize;
		back.displayHeight = gameOptions.rows * this.Main.blockSize;
		this.input.on('pointerdown', function () {
			this.scene.stop()
			this.scene.resume('playGame')
			this.Main.toggleMenu()
		}, this)

		this.totalWordLabelText = this.add.bitmapText(100, 275, 'gothic', 'Words', 40).setOrigin(0).setTint(0x000000).setAlpha(1);
		this.totalNoWordLabelText = this.add.bitmapText(500, 275, 'gothic', 'Errors', 40).setOrigin(0).setTint(0x000000).setAlpha(1);

		this.totalWordText = this.add.bitmapText(100, 340, 'gothic', '', 35).setOrigin(0).setTint(0x000000).setAlpha(1);
		this.totalNoWordText = this.add.bitmapText(500, 340, 'gothic', '', 35).setOrigin(0).setTint(0x000000).setAlpha(1);
		var tempWords = ''
		for (let index = 0; index < this.words.length; index++) {
			var end = (index % 2 == 0) ? ',\n' : ', '
			tempWords += this.words[index] + end

		}
		this.totalWordText.setText(tempWords)
		var tempNoWords = ''
		for (let index = 0; index < this.notWords.length; index++) {
			var end = (index % 2 == 0) ? ',\n' : ', '
			tempNoWords += this.notWords[index] + end

		}
		this.totalNoWordText.setText(tempNoWords)
		var graphics = this.add.graphics();
		graphics.lineStyle(10, 0x000000, 1)
		graphics.strokeRect(back.x, back.y, back.displayWidth, back.displayHeight)
		//	var rect = this.add.rectangle(back.x, back.y, back.displayWidth, back.displayHeight, 0x000000, 1);


	}
	update() {

	}

	clickHandler() {
		this.scene.stop('playGame')
		this.scene.stop('endGame')
		this.scene.start('playGame');
		//this.scene.launch('UI');
	}


}

