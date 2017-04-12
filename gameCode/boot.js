let bootState = {
	preload: function() {
		game.load.image('preloadBar', 'assets/bar.png');
		game.load.image('logo', 'assets/logo.png');
	},
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}
}