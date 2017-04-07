window.onload = function() {


    var game = new Phaser.Game(1025, 480, Phaser.CANVAS, 'gameAround', { preload: preload, create: create, update: update});

    function preload() {

        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('game-over', 'assets/game-over.png');
        game.load.image('tiles', 'assets/levels/tiles.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('blob', 'assets/ball.png');
        game.load.image('dungeon', 'assets/dungeon.png');
        game.load.image('heart', 'assets/health.png')
        game.load.atlasJSONArray('dude', 'assets/knight.png', 'assets/knight.json');
        game.load.atlasJSONArray('zombie', 'assets/zombie1.png', 'assets/zombie1.json');

    }

    let map;
    //let objArr;
    let tileset;
    let layer;
    let cursors;
    let scoreText;
    let background;

    let player;
    let blobs;
    let stars;
    let hearts;

    let heartScale;
    let firstScaleHeartX = 150;



    let score = 0;
    let jumpTimer = 0;

    // Blob
    let blob;
    let blobX = 120;
    let waveSize = 8;
    let wavePixelChunk = 2;
    let bitMapData;
    let waveDataCounter;

    // Zombie
    let zombies;
    let zombie;
    let zombieX = -30;

    let youLose;

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

        stars = game.add.group();
        stars.enableBody = true;

        hearts = game.add.group();
        hearts.enableBody = true;

        blobs = game.add.group();
        blobs.enableBody = true;

        zombies = game.add.group();
        zombies.enableBody = true;

        enetetiesPositioning();

        scoreText = game.add.text(16, 16, 'Hearts: 0/666', { fontSize: '18px', fill: '#fff' });
        scoreText.fixedToCamera = true;

        heartScale = game.add.group();
        heartScale.fixedToCamera = true;
        firstScaleHeartX = 150;

        threeLives();

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {


        game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(hearts, layer)
        game.physics.arcade.collide(blobs, layer);
        game.physics.arcade.collide(zombies, layer);
        game.physics.arcade.collide(player, layer);

        game.physics.arcade.overlap(stars, player, collectStar, null, this);
        game.physics.arcade.overlap(hearts, player, collectHealth, null, this);
        game.physics.arcade.overlap(blobs, player, blobKills, null, this);
        game.physics.arcade.overlap(zombies, player, zombieKills, null, this);


        player.body.velocity.x = 0;
        // Movements of Player
        if (cursors.left.isDown && player.body.onFloor() && !cursors.down.isDown)
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
            player.scale.x = -1;
        }
        else if (cursors.left.isDown && !player.body.onFloor() && !cursors.down.isDown)
        {
            player.body.velocity.x = -150;
            player.animations.stop();
            player.frame = 2;
            player.scale.x = -1;
        }
        else if (cursors.right.isDown && player.body.onFloor() && !cursors.down.isDown)
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
            player.scale.x = 1;
        }
        else if (cursors.right.isDown && !player.body.onFloor() && !cursors.down.isDown)
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
        // Enemy begins to follow the player if he's too close

        // let diff = player.body.x - blob.body.x;
        // if (player.body.y -blob.body.y < -135)
        // {
        //     blob.body.velocity.x = 0;
        // } else if (diff >= 150 || diff <= -150)
        // {
        //     blob.body.velocity.x = 0;
        // } else if (diff < 0)
        // {
        //      blob.body.velocity.x = -120;
        // } else if (diff > 0)
        // {
        //    blob.body.velocity.x = 120;
        // }

        if (heartScale["children"].length === 0)
        {
            console.log("game over");
            player.kill();
            youLose = game.add.sprite(0, 70, 'game-over');

            document.body.onkeyup = function(e) {
                if (e.keyCode === 32)
                {
                    location.reload();
                }
            }

        }

        bitMapData.cls();
        updateNastyBlob();
        UpdateZombie();
    }

    function collectStar (player, star) {
        star.kill();
        //  Add and update the score
        score += 1;
        scoreText.text = 'Hearts: ' + score + '/666';

       }

    function collectHealth (player, heart) {
        heart.kill();
        let sHeart = heartScale.create(firstScaleHeartX, 18, 'heart');
    }

    function blobKills(player, blob) {
        if (cursors.down.isDown) {
            blob.kill();
        }
        else {
            player.kill();
            heartScale["children"].pop();
            player.reset(52, 52)
        }
    }

    function zombieKills(player, zombie) {
        if (cursors.down.isDown)
        {
            zombie.kill();
        }
        else if (Math.abs(zombie.body.x - player.body.x) < 20)
        {
            player.kill();
            heartScale["children"].pop();
            player.reset(52, 52);
        }
    }

    function updateNastyBlob() {
        let s = 0;
        let copyRect = { x: 0, y: 0, w: wavePixelChunk, h: 35 };
        let copyPoint = { x: 0, y: 0 };
        // Patroling for blobs
        for(key in blobs.children) {
            if (!blobs.children[key].body.velocity.x) {
                blobX *= -1;
                blobs.children[key].body.velocity.x = blobX;
            }
        }

        for (let x = 0; x < 32; x += wavePixelChunk) {
            copyPoint.x = x;
            copyPoint.y = waveSize + (waveSize / 2) + waveData.sin[s];

            bitMapData.context.drawImage(game.cache.getImage('blob'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);

            copyRect.x += wavePixelChunk;

            s++;
    }
        // Cycle through the wave data - this is what causes the image to "undulate"
        Phaser.ArrayUtils.rotate(waveData.sin);
        waveDataCounter++;

        if (waveDataCounter === waveData.length)
        {
            waveDataCounter = 0;
        }
    }

    function UpdateZombie () {
        for(key in zombies.children) {
            if(Math.abs(zombies.children[key].body.x - player.body.x) < 100 && Math.abs(zombies.children[key].body.y - player.body.y) < 60){
                if(zombies.children[key].body.x > player.body.x) {
                    zombies.children[key].body.velocity.x = - 90;
                }
                else if (zombies.children[key].body.x < player.body.x) {
                    zombies.children[key].body.velocity.x =  90;
                }
            }
                if (!zombies.children[key].body.velocity.x) {
                    zombieX *= -1;
                    zombies.children[key].body.velocity.x = zombieX;
                }

                if(zombies.children[key].body.velocity.x < 0) {
                    zombies.children[key].animations.play('moveLeft');
                }
                else if (zombies.children[key].body.velocity.x > 0) {
                    zombies.children[key].animations.play('moveRight');
                }
        }
    }

    function enetetiesPositioning() {

        let objArr = map["objects"]["Object Layer 1"];

        for (let i = 0; i < objArr.length; i++)
        {
            let Entity = objArr[i];
            if (Entity["name"] === "player")
            {
                player = game.add.sprite(52, 52, 'dude');
                game.physics.arcade.enable(player);
                game.camera.follow(player);

                player.body.gravity.y = 1100;
                player.body.collideWorldBounds = true;

                player.animations.add('left', [0, 1, 2, 3], 3, true);
                player.animations.add('right', [0, 1, 2, 3], 3, true);
                player.animations.add('kick', [4, 5, 6, 7], 5, true);

            }
            else if (Entity["name"] === "blob")
            {
                blob = blobs.create(Entity["x"], Entity["y"], bitMapData);
                blob.body.collideWorldBounds = true;
                blob.body.gravity.y = 1100;

                blob.body.velocity.x = blobX;

            } else if (Entity["name"] === "star")
            {
                let star = stars.create(Entity["x"], Entity["y"], "star");
                star.body.collideWorldBounds = true;
                star.body.gravity.y = 300;
                star.body.bounce.y = 0.7 + Math.random() * 0.2;

            } else if (Entity["name"] === "zombie")
            {
                zombie = zombies.create(Entity["x"], Entity["y"], "zombie")
                zombie.body.collideWorldBounds = true;
                zombie.body.gravity.y = 1100;
                zombie.animations.add('moveLeft', [0, 1, 2, 3, 4, 3, 2], 3, true);
                zombie.animations.add('moveRight', [5, 6, 7, 8, 9, 8, 7], 3, true);
                zombie.body.velocity.x = zombieX;

            } else if (Entity["name"] === "heart")
            {
                let heart = hearts.create(Entity["x"], Entity["y"], "heart");
                heart.body.collideWorldBounds = true;
                heart.body.gravity.y = 300;
                heart.body.bounce.y = 0.7 + Math.random() * 0.2;

            }
        }
    }

    function threeLives() {
        for (let i = 0; i < 3; i++) {
            let sHeart = heartScale.create(firstScaleHeartX, 18, 'heart');
            firstScaleHeartX += 20;
        }
    }

    function restart () {

    hearts["children"].length = 0;
    stars["children"].length = 0;
    blobs["children"].length = 0;
    zombies["children"].length = 0;

    // enetetiesPositioning()
    // threeLives();
    create();
    scoreText.text = 'Hearts: 0/666';
    player = game.add.sprite(52, 52, 'dude');
    youLose.visible = false;

    }
}
