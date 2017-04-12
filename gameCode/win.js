let winSong;

let winState = {
	create: function() {

		winSong = game.add.audio('winSong');
		winSong.play();

		let youWon = game.add.sprite(0, 0, 'win');
		youWon.fixedToCamera = true;

		let restartKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		restartKey.onDown.addOnce(this.restart, this);
	},

	restart: function() {
		winSong.stop();
		game.state.start('menu');
	}
 }