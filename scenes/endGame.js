class endGame extends Phaser.Scene {
	constructor() {
		super("endGame");
	}
	preload() {



	}
	init(data) {
		this.score = data.score;
		this.totalScore = data.totalScore;
		this.rackCount = data.rackCount;
		this.wordCount = data.wordCount;
		this.notWordCount = data.notWordCount
		this.boardNumber = data.boardNumber
	}
	create() {

		//	this.cameras.main.setBackgroundColor(0xf7eac6);
		var timedEvent = this.time.addEvent({ delay: 500, callback: this.populateEnd, callbackScope: this, loop: false });
		this.totalScoreFinal = this.totalScore
		this.tempRack = 0
		this.scoreBuffer = 0
		if (this.rackCount == 0) {
			this.temRack = 1000
			this.totalScoreFinal += 1000
			this.showToast('all tiles bonus')
		}
		var bonus = this.wordCount - this.notWordCount
		this.score *= bonus
		this.totalScoreFinal += this.score
		if (this.totalScoreFinal > gameSettings.topScore) {
			gameSettings.topScore = this.totalScoreFinal
		}
		if (this.wordCount > gameSettings.mostWordsFound) {
			gameSettings.mostWordsFound = this.wordCount
		}
		gameSettings.lastScore = this.totalScoreFinal
		this.saveSettins()



	}
	update() {
		if (this.scoreBuffer > 0) {
			this.scoreDone = false;
			this.incrementScore();
			this.scoreBuffer--;
		}
	}
	populateEnd() {
		var back = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setAlpha(.9);
		back.displayWidth = 800;
		back.displayHeight = 1400;

		this.scoreText = this.add.bitmapText(200, 400, 'gothic', 'Last Board: ' + this.score, 80).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.rackBonusText = this.add.bitmapText(200, 500, 'gothic', 'Rack Bonus: ' + this.tempRack, 80).setOrigin(0, .5).setTint(0x000000).setAlpha(1);

		this.totalScoreText = this.add.bitmapText(200, 600, 'gothic', 'Total: ' + this.totalScore, 80).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalWordText = this.add.bitmapText(200, 800, 'gothic', 'Words: ' + this.wordCount, 60).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalErrorText = this.add.bitmapText(200, 900, 'gothic', 'Errors: ' + this.notWordCount, 60).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalBoardText = this.add.bitmapText(200, 1000, 'gothic', 'Boards: ' + this.boardNumber, 60).setOrigin(0, .5).setTint(0x000000).setAlpha(1);

		var timedEvent = this.time.addEvent({
			delay: 1200, callback: function () {
				this.scoreBuffer += this.score;
				this.scoreBuffer += this.tempRack
			}, callbackScope: this, loop: false
		});

		var playButton = this.add.image(game.config.width / 2, 1200, 'play').setScale(2).setInteractive().setTint(0x000000)
		//var startTime = this.add.bitmapText(game.config.width / 2, 275, 'gothic', 'Play', 80).setOrigin(.5).setTint(0x000000);

		playButton.on('pointerdown', this.clickHandler, this);



	}
	incrementScore() {
		this.totalScore += 1;
		this.totalScoreText.setText('Total: ' + this.totalScore);
	}
	saveSettins() {
		localStorage.setItem('ssSettings', JSON.stringify(gameSettings));
	}
	clickHandler() {
		this.scene.stop('playGame')
		this.scene.stop('endGame')
		this.scene.start('playGame');
		//this.scene.launch('UI');
	}


}

