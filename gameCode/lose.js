let loseState = {
	create: function() {

		let laugh = game.add.audio('laugh');
		laugh.play();
		//player.kill();

		let youLose = game.add.sprite(0, 0, 'game-over');
		youLose.fixedToCamera = true

		let restartKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		restartKey.onDown.addOnce(this.restart, this);
	},

	restart: function() {
		game.state.start('menu');
	}
}