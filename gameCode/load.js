let loadState = {
	preload: function() {
		let loadingLabel = game.add.text(80, 150, 'Loading...',{fill: '#fff'});

        game.load.audio('song1', 'assets/sounds/1.mp3');
        game.load.audio('song2', 'assets/sounds/2.mp3');
        game.load.audio('song3', 'assets/sounds/3.mp3');
        game.load.audio('laugh', 'assets/sounds/laugh.mp3');

        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('game-over', 'assets/game-over.png');
        game.load.image('tiles', 'assets/levels/tiles.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('blob', 'assets/ball.png');
        game.load.image('dungeon', 'assets/dungeon.png');
        game.load.image('heart', 'assets/health.png');
        game.load.atlasJSONArray('dude', 'assets/knight1.png', 'assets/knight1.json');
        game.load.atlasJSONArray('zombie', 'assets/zombie1.png', 'assets/zombie1.json');
        game.load.atlasJSONArray('ghost', 'assets/ghost.png', 'assets/ghost.json');
        game.load.atlasJSONArray('wizard', 'assets/wizard.png', 'assets/wizard.json');
        game.load.image('mageBullet', 'assets/bullet2.png');
	},

	create: function() {
		game.state.start('menu');
	}
}