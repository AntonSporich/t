let menuState = {
	create: function() {
		// let nameLabel = game.add.text(90, 90, 'The Knight', {fill: '#fff'});
		// let startLabel = game.add.text(90, 190, 'press W to start',{fill: '#fff'});
		let menu = game.add.sprite(0, 0, 'menu')
		let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		

		spaceKey.onDown.addOnce(this.start, this);
	},

	start: function() {
		game.state.start('play')
	}
}