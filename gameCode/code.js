window.onload = function() {


    var game = new Phaser.Game(1025, 480, Phaser.CANVAS, 'gameAround', { preload: preload, create: create, update: update });

    function preload() {
        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/levels/tiles.png');;
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('dungeon', 'assets/dungeon.png')
        game.load.atlasJSONArray('dude', 'assets/knight.png', 'assets/knight.json');
    }

    let map;
    let tileset;
    let layer;
    let player; 
    let platforms; 
    let cursors; 
    let stars; 
    let score = 0; 
    let scoreText;
    let bg;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        bg = game.add.tileSprite(0, 0, 1920, 480, 'dungeon');
        bg.fixedToCamera = true;

        map = game.add.tilemap('level1');
        map.addTilesetImage('tiles');

             
        layer = map.createLayer('Tile Layer 1');
        game.add.existing(layer);

        layer.resizeWorld();

        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);  

        //game.add.sprite(0, 0, 'sky');

        // platforms = game.add.group();
        // platforms.enableBody = true;

        // let ground = platforms.create(0, game.world.height - 64, 'ground');

        // ground.scale.setTo(2, 2);
        // ground.body.immovable = true;

        // let ledge = platforms.create(400, 400, 'ground');
        // ledge.body.immovable = true;

        // ledge = platforms.create(-150, 250, 'ground');
        // ledge.body.immovable = true;

        player = game.add.sprite(32, game.world.height -190, 'dude');


        game.physics.arcade.enable(player);
        game.camera.follow(player);

        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 3, true);
        player.animations.add('right', [0, 1, 2, 3], 3, true);
        player.animations.add('kick', [4, 5, 6, 7], 5, true);

        stars = game.add.group();
        stars.enableBody = true;

        for (var i = 0; i < 12; i++) 
        {
            let star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
            star.body.collideWorldBounds = true;
        }

        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {

        game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(player, layer);

        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        player.body.velocity.x = 0;

        // Movements of Player
        if (cursors.left.isDown && player.body.touching.down)
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
            player.scale.x = -1;
        }
        else if (cursors.left.isDown && !player.body.touching.down)
        {
            player.body.velocity.x = -150;
            player.animations.stop();
            player.frame = 2;
            player.scale.x = -1;
        }
        else if (cursors.right.isDown && player.body.touching.down)
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
            player.scale.x = 1;
        }
        else if (cursors.right.isDown && !player.body.touching.down)
        {
            player.body.velocity.x = 150;
            player.animations.stop();
            player.frame = 2;
            player.scale.x = 1;
        }
        else if (cursors.down.isDown)
        {
            player.animations.play('kick');
        }

        //  Allow the player to jump if they are touching the ground.
        else if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -250;
        }
        else
        {
            //  Stand idle
            player.animations.stop();
            player.frame = 1;
        }
    }

    function collectStar (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;

    }
}
