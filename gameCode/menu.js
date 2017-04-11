let menuState = {
	create: function() {
		let nameLabel = game.add.text(90, 90, 'The Knight', {fill: '#fff'});
		let startLabel = game.add.text(90, 190, 'press W to start',{fill: '#fff'});
		let wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

		wKey.onDown.addOnce(this.start, this);
	},

	start: function() {
		game.state.start('play')
	}
}