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
		this.bestScore = false;
		this.bestWord = false;
		//console.log(this.rackCount)
		//	this.cameras.main.setBackgroundColor(0xf7eac6);
		this.totalScoreFinal = this.totalScore
		this.tempRack = 0
		this.scoreBuffer = 0
		if (this.rackCount == 0) {
			this.tempRack = Math.floor(1000 / this.boardNumber)
			this.totalScoreFinal += this.tempRack
			//this.showToast('all tiles bonus')
		}
		var bonus = this.wordCount - this.notWordCount
		this.score *= bonus
		this.totalScoreFinal += this.score
		if (this.totalScoreFinal > gameSettings.topScore) {
			gameSettings.topScore = this.totalScoreFinal
			this.bestScore = true
		}
		if (this.wordCount > gameSettings.mostWordsFound) {
			gameSettings.mostWordsFound = this.wordCount
			this.bestWord = true
		}
		gameSettings.lastScore = this.totalScoreFinal
		this.saveSettins()
		var timedEvent = this.time.addEvent({ delay: 3000, callback: this.populateEnd, callbackScope: this, loop: false });

		var back = this.add.image(50, 120, 'blank').setAlpha(.9).setOrigin(0);
		back.displayWidth = 800;
		back.displayHeight = 1400;

		this.scoreLabelText = this.add.bitmapText(500, 400, 'gothic', 'Last Board:', 70).setOrigin(1, .5).setTint(0x000000).setAlpha(1);
		this.rackBonusLabelText = this.add.bitmapText(500, 500, 'gothic', 'Rack Bonus:', 70).setOrigin(1, .5).setTint(0x000000).setAlpha(1);
		this.totalScoreLabelText = this.add.bitmapText(500, 600, 'gothic', 'Total:', 70).setOrigin(1, .5).setTint(0x000000).setAlpha(1);

		this.scoreText = this.add.bitmapText(1525, 400, 'gothic', this.score, 70).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.rackBonusText = this.add.bitmapText(1525, 500, 'gothic', this.tempRack, 70).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalScoreText = this.add.bitmapText(1525, 600, 'gothic', this.totalScoreFinal, 70).setOrigin(0, .5).setTint(0x000000).setAlpha(1);

		this.newText = this.add.bitmapText(this.totalScoreText.x + this.totalScoreText.width, 600, 'gothic', 'NEW', 35).setOrigin(0, .5).setTint(0xff0000).setAlpha(1);


		var timeline = this.tweens.createTimeline();
		timeline.add({
			targets: this.scoreText,
			x: 525,               // '+=100'
			ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 500,
			repeat: 0,            // -1: infinity
			delay: 250
			// offset: '-=500',   // starts 500ms before previous tween ends
		})
		timeline.add({
			targets: this.rackBonusText,
			x: 525,               // '+=100'
			ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 500,
			repeat: 0,            // -1: infinity
			delay: 250
			// offset: '-=500',   // starts 500ms before previous tween ends
		})
		timeline.add({
			targets: this.totalScoreText,
			x: 525,               // '+=100'
			ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 500,
			repeat: 0,            // -1: infinity
			delay: 250
			// offset: '-=500',   // starts 500ms before previous tween ends
		})
		timeline.play();

		this.totalWordText = this.add.bitmapText(350, 800, 'gothic', 'Words: ' + this.wordCount, 50).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalErrorText = this.add.bitmapText(350, 875, 'gothic', 'Errors: ' + this.notWordCount, 50).setOrigin(0, .5).setTint(0x000000).setAlpha(1);
		this.totalBoardText = this.add.bitmapText(350, 950, 'gothic', 'Boards: ' + this.boardNumber, 50).setOrigin(0, .5).setTint(0x000000).setAlpha(1);

		var graphics = this.add.graphics();
		graphics.lineStyle(10, 0x000000, 1)
		graphics.strokeRect(back.x, back.y, back.displayWidth, back.displayHeight)

	}
	update() {

	}
	populateEnd() {
		if (this.bestScore) {
			this.newTotalText = this.add.bitmapText((this.totalScoreText.x + this.totalScoreText.width) + 10, 600, 'gothic', 'BEST', 35).setOrigin(0, .5).setTint(0xff0000).setAlpha(1);
		}
		if (this.bestWord) {
			this.newWordText = this.add.bitmapText((this.totalWordText.x + this.totalWordText.width) + 10, 800, 'gothic', 'BEST', 35).setOrigin(0, .5).setTint(0xff0000).setAlpha(1);
		}
		var playButton = this.add.image(game.config.width / 2, 1200, 'play').setScale(2).setInteractive().setTint(0x000000)
		//var startTime = this.add.bitmapText(game.config.width / 2, 275, 'gothic', 'Play', 80).setOrigin(.5).setTint(0x000000);

		playButton.on('pointerdown', this.clickHandler, this);

		var homeButton = this.add.image(game.config.width / 2, 1400, 'home_icon').setScale(1).setInteractive().setTint(0x000000)
		homeButton.on('pointerdown', this.clickHandler2, this);


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
	clickHandler2() {
		this.scene.stop('playGame')
		this.scene.stop('endGame')
		this.scene.start('startGame');
		//this.scene.launch('UI');
	}

}

