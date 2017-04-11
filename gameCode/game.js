let game = new Phaser.Game(1025, 480, Phaser.AUTO,'gameAround');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
// game.state.add('win', winState);

game.state.start('boot');