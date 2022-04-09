class help extends Phaser.Scene {
	constructor() {
		super("help");
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

		this.totalWordLabelText = this.add.bitmapText(100, 275, 'gothic', 'Help', 40).setOrigin(0).setTint(0x000000).setAlpha(1);

		var directionsLabelText = this.add.bitmapText(game.config.width / 2, 375, 'gothic', 'How to play:', 40).setOrigin(.5).setTint(0x000000);
		var directions = '1. Drag letter to a spot on the Board \n'
		directions += '2. After making word(s), click the play icon \n'
		directions += '3. Continue placing words and clicking play \n'
		directions += '4. Click the new board icon to get a clean slate'
		var directionsText = this.add.bitmapText(100, 425, 'lato', directions, 38).setOrigin(0).setTint(0x000000).setMaxWidth((gameOptions.cols * this.Main.blockSize) - 60);

		var tipsLabelText = this.add.bitmapText(game.config.width / 2, 725, 'gothic', 'Tips:', 40).setOrigin(.5).setTint(0x000000);
		var tips = '1. Words do not need to touch \n'
		tips += '2. Non-words lower your score, based on letter value \n'
		tips += '3. Red tiles are 3x word score, green are 2x\n'
		tips += '4. Drag tiles to the swap icon to trade\n'
		tips += '5. Higher the board, the more spaces are blocked\n'
		tips += '6. Higher the board, more swapping costs\n'
		tips += '7. Place all tiles, earn a bonus. The less boards you use, the higher the bonus\n'
		tips += 'TS = Board Score x (correct words - errors)'
		var tipsText = this.add.bitmapText(100, 775, 'lato', tips, 38).setOrigin(0).setTint(0x000000).setMaxWidth((gameOptions.cols * this.Main.blockSize) - 60);

		var graphics = this.add.graphics();
		graphics.lineStyle(10, 0x000000, 1)
		graphics.strokeRect(back.x, back.y, back.displayWidth, back.displayHeight)
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

