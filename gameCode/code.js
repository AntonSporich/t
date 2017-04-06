window.onload = function() {


    var game = new Phaser.Game(1025, 480, Phaser.CANVAS, 'gameAround', { preload: preload, create: create, update: update });

    function preload() {
        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/levels/tiles.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('blob', 'assets/ball.png');
        game.load.image('dungeon', 'assets/dungeon.png');
        game.load.atlasJSONArray('dude', 'assets/knight.png', 'assets/knight.json');
    }

    let map;
    let tileset;
    let layer;
    let cursors;
    let scoreText;
    let background;
    //let platforms;

    let player;
    let blobs;
    let stars;

    let score = 0;
    let jumpTimer = 0;

    // Blob
    let blobX = 120;
    let waveSize = 8;
    let wavePixelChunk = 2;
    let bitMapData;
    let waveDataCounter;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        background = game.add.tileSprite(0, 0, 1920, 480, 'dungeon');
        background.fixedToCamera = true;

        map = game.add.tilemap('level1');
        map.addTilesetImage('tiles');
        layer = map.createLayer('Tile Layer 1');
        game.add.existing(layer);
        layer.resizeWorld();
        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

        bitMapData = game.add.bitmapData(32, 64);
        waveData = game.math.sinCosGenerator(32, 8, 8, 2);

        player = game.add.sprite(32, game.world.height - 190, 'dude');
        game.physics.arcade.enable(player);
        game.camera.follow(player);

        player.body.gravity.y = 1100;
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


        blobs = game.add.group();
        blobs.enableBody = true;

        // Will take coordintats of blobs from the tile map and add it in cycle, like stars

        //let blob = game.add.sprite(130, game.world.height - 164, bitMapData)
        blob = blobs.create(130, game.world.height - 260, bitMapData);
        blob.body.gravity.y = 1100;
        blob.body.collideWorldBounds = true;
        blob.body.velocity.x = blobX;
        //blob.body.velocity.y = game.world.randomY;
    }

    function update() {

        game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(blobs, layer);
        game.physics.arcade.collide(player, layer);

        game.physics.arcade.overlap(stars, player, collectStar, null, this);
        game.physics.arcade.overlap(blobs, player, blobKills, null, this);

        player.body.velocity.x = 0;

        // Movements of Player
        if (cursors.left.isDown && player.body.onFloor())
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
            player.scale.x = -1;
        }
        else if (cursors.left.isDown && !player.body.onFloor())
        {
            player.body.velocity.x = -150;
            player.animations.stop();
            player.frame = 2;
            player.scale.x = -1;
        }
        else if (cursors.right.isDown && player.body.onFloor())
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
            player.scale.x = 1;
        }
        else if (cursors.right.isDown && !player.body.onFloor())
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

        //  Allow the players to jump if they are touching the ground.
        else if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 900;
        }
        else
        {
            //  Stand idle
            player.animations.stop();
            player.frame = 1;
        }


        for(key in blobs.children) 
        {
            if (!blobs.children[key].body.velocity.x) 
            {
                blobX *= -1;
                blobs.children[key].body.velocity.x = blobX;
            } 
        }

        bitMapData.cls();
        updateNastyBlob();
    }

    function collectStar (player, star) {
        // Removes the star from the screen
        star.kill();
        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;
    }

    function blobKills(player, blob) {
        player.kill();
        player.reset(52, 52)
    }

    function updateNastyBlob() {
        let s = 0;
        let copyRect = { x: 0, y: 0, w: wavePixelChunk, h: 35 };
        let copyPoint = { x: 0, y: 0 };

        for (let x = 0; x < 32; x += wavePixelChunk)
        {
            copyPoint.x = x;
            copyPoint.y = waveSize + (waveSize / 2) + waveData.sin[s];

            bitMapData.context.drawImage(game.cache.getImage('blob'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);
            
            copyRect.x += wavePixelChunk;
            
            s++;
    }

    //  Cycle through the wave data - this is what causes the image to "undulate"
    Phaser.ArrayUtils.rotate(waveData.sin);
    
    waveDataCounter++;
    
    if (waveDataCounter === waveData.length)
    {
        waveDataCounter = 0;
    }
    }
}
