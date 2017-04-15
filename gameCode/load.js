let loadState = {
	preload: function() {
	let preloadBar = game.add.sprite(0, game.world.centerY + 128, 'preloadBar');
        let logo = game.add.sprite(game.world.centerY + 60, 60, 'logo');
        let loadingLabel = game.add.text(460, 330, 'Loading...', {fill: '#fff'});

        preloadBar.anchor.setTo(0);
        game.load.setPreloadSprite(preloadBar);

        game.load.audio('song1', 'assets/sounds/1.mp3');
        game.load.audio('song2', 'assets/sounds/2.mp3');
        game.load.audio('song3', 'assets/sounds/3.mp3');
        game.load.audio('winSong', 'assets/sounds/win.mp3');
        game.load.audio('playerDead', 'assets/sounds/playerDead.wav');
        game.load.audio('enemyDead', 'assets/sounds/enemyDead.mp3')
        game.load.audio('laugh', 'assets/sounds/laugh.mp3');
        game.load.audio('collect', 'assets/sounds/collect.wav')

        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('win', 'assets/win.png');
        game.load.image('game-over', 'assets/game-over.png');
        game.load.image('tiles', 'assets/levels/tiles.png');
		game.load.image('tiles2', 'assets/levels/tiles2.png');
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
