  let map;
    //let objArr;
    let tileset;
    let layer;
    let cursors;
    let keys;
    let scoreText;
    let background;

    let player;
    let playerX;
    let blobs;
    let stars;
    let hearts;
    let stoppers;

    let heartScale;
    let firstScaleHeartX = 150;

    let song1;
    let song2;
    let song3;
    let song4;
    let playerDeadSound;
    let enemyDeadSound;
    let collectSound;

    let nowPlaying;

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

    // Ghost
    let ghosts;
    let ghost;
    let ghostX = 0;

    // Wizard
    let wizard;
    let wizards;
    let wizardX = 70;
    let mageBullet;
    let mageBullets;
    let firingTimer = 0;

let playState = {
	create: function() {
		background = game.add.tileSprite(0, 0, 1920, 480, 'dungeon');
        background.fixedToCamera = true;

        song1 = game.add.audio('song1');
        song2 = game.add.audio('song2');
        song3 = game.add.audio('song3');

        let arr = [song1, song2, song3];

        nowPlaying = arr[Math.round(0- 0.5 + Math.random() * ((arr.length - 1) - 0 + 1))].play();
        nowPlaying.loop = true
        nowPlaying.volume = 0.08;

        playerDeadSound = game.add.audio('playerDead');
        playerDeadSound.volume = 0.03;

        enemyDeadSound = game.add.audio('enemyDead');
        enemyDeadSound.volume = 0.1;

        collectSound = game.add.audio('collect');
        collectSound.volume = 0.5;

        map = game.add.tilemap('level1');
        map.addTilesetImage('tiles');
        layer = map.createLayer('Tile Layer 1');
        game.add.existing(layer);
        layer.resizeWorld();
        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
        //map.forEach(function (t) { if (t) { t.collideDown = false;} }, game, 0, 0, map.width, map.height, layer);

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

        ghosts = game.add.group();
        ghosts.enableBody = true;

        wizards = game.add.group();
        wizards.enableBody = true;
        mageBullets = game.add.group();
        mageBullets.enableBody = true;

        mageBullets.setAll('anchor.x', 0.5);
        mageBullets.setAll('anchor.y', 1);
        mageBullets.setAll('outOfBoundsKill', true);
        mageBullets.setAll('checkWorldBounds', true);

        stoppers = game.add.group();
        stoppers.enableBody = true;

        this.enetetiesPositioning();

        scoreText = game.add.text(16, 16, 'Remains: 0/666', { fontSize: '18px', fill: '#fff' });
        scoreText.fixedToCamera = true;

        heartScale = game.add.group();
        heartScale.fixedToCamera = true;
        firstScaleHeartX = 150;

        this.threeLives();

        cursors = game.input.keyboard.createCursorKeys();
        keys = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W,'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D, 'kick':Phaser.Keyboard.SPACEBAR});
	},

	update: function() {
		game.physics.arcade.collide(stars, layer);
        game.physics.arcade.collide(hearts, layer)
        game.physics.arcade.collide(blobs, layer);
        game.physics.arcade.collide(zombies, layer);
        game.physics.arcade.collide(ghosts, layer);
        game.physics.arcade.collide(wizards, layer);
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(stoppers, layer);

        game.physics.arcade.collide(stoppers, blobs);
        game.physics.arcade.collide(stoppers, zombies);
        game.physics.arcade.collide(stoppers, wizards);
        game.physics.arcade.collide(stoppers, stars);

        game.physics.arcade.overlap(stars, player, this.collectStar, null, this);
        game.physics.arcade.overlap(hearts, player, this.collectHealth, null, this);
        game.physics.arcade.overlap(blobs, player, this.blobKills, null, this);
        game.physics.arcade.overlap(zombies, player, this.enemyKills, null, this);
        game.physics.arcade.overlap(ghosts, player, this.enemyKills, null, this);
        game.physics.arcade.overlap(wizards, player, this.enemyKills, null, this);
        game.physics.arcade.overlap(mageBullets, player, this.bulletsKill, null, this);


        player.body.velocity.x = 0;
        // Movements of Player
        if ((cursors.left.isDown || keys.left.isDown)
        && player.body.onFloor() && (!cursors.down.isDown || !keys.kick.isDown))
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
            playerX = 0;

        }
        else if ((cursors.left.isDown || keys.left.isDown)
        && !player.body.onFloor() && (!cursors.down.isDown || !keys.kick.isDown))
        {
            player.body.velocity.x = -150;
            player.animations.stop();
            player.frame = 6;
            playerX = 0;

        }
        else if ((cursors.right.isDown || keys.right.isDown)
        && player.body.onFloor() && (!cursors.down.isDown || !keys.kick.isDown))
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
            playerX = 1;

        }
        else if ((cursors.right.isDown || keys.right.isDown)
        && !player.body.onFloor() && (!cursors.down.isDown || !keys.kick.isDown))
        {
            player.body.velocity.x = 150;
            player.animations.stop();
            player.frame = 2;
            playerX = 1;

        }
        else if ((cursors.down.isDown || keys.kick.isDown) &&
        (cursors.down.downDuration(500) || keys.kick.downDuration(500)))
        {
            if(playerX === 0) {
                player.animations.play('leftKick');
            }
            else if(playerX === 1) {
                player.animations.play('rightKick');
            }
        }

        //  Allow the players to jump if they are touching the ground.
        else if ((cursors.up.isDown || keys.up.isDown)
        && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 900;
        }
        else
        {
            //  Stand idle
            player.animations.stop();
            if(playerX === 0) {
                player.frame = 5;
            }
            else if(playerX === 1) {
                player.frame = 1;
            }
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

        //Lose and win
        if (heartScale["children"].length === 0)
        {
            nowPlaying.stop();
            score = 0;
            game.state.start('lose');
        }

        if (score === 3)
        {   
            nowPlaying.stop();
            score = 0;
        	game.state.start('win');
        }

        bitMapData.cls();
        this.updateNastyBlob();
        this.UpdateZombie();
        this.UpdateGhost();
        this.UpdateWizard();
	},

	collectStar: function (player, star) {
        if (player.x === 52) score--;
        collectSound.play();
        star.kill();
        //  Add and update the score
        score++;
        scoreText.text = 'Remains: ' + score + '/666';
	},


    collectHealth: function (player, heart) {
        collectSound.play();
        heart.kill();
        let sHeart = heartScale.create(firstScaleHeartX, 18, 'heart');
    },

    blobKills: function (player, blob) {
        if ((cursors.down.isDown || keys.kick.isDown) && playerX === 0
        && player.body.x > blob.body.x && (!cursors.down.downDuration(100) && !keys.kick.downDuration(100))
        && (cursors.down.downDuration(500) || keys.kick.downDuration(500)))
        {   
            enemyDeadSound.play();
            blob.kill();
        }
        else if((cursors.down.isDown || keys.kick.isDown) && playerX === 1
        && player.body.x < blob.body.x && (!cursors.down.downDuration(100) && !keys.kick.downDuration(100))
        && (cursors.down.downDuration(500) || keys.kick.downDuration(500)))
        {   
            enemyDeadSound.play();
            blob.kill();
        }
        else {
            playerDeadSound.play();
            player.kill();
            heartScale["children"].pop();
            firstScaleHeartX -= 20;
            player.reset(52, 52)
        }
    },

    enemyKills: function (player, zombie) {
        if ((cursors.down.isDown || keys.kick.isDown) && playerX === 0
        && player.body.x > zombie.body.x && (!cursors.down.downDuration(100) && !keys.kick.downDuration(100))
        && (cursors.down.downDuration(500) || keys.kick.downDuration(500)))
        {
            enemyDeadSound.play();
            zombie.destroy(true);
        }
        else if((cursors.down.isDown || keys.kick.isDown) && playerX === 1
        && player.body.x < zombie.body.x && (!cursors.down.downDuration(100) && !keys.kick.downDuration(100))
        && (cursors.down.downDuration(500) || keys.kick.downDuration(500)))
        {
            enemyDeadSound.play();
            zombie.destroy(true);
        }
        else if (Math.abs(zombie.body.x - player.body.x) < 20)
        {
            player.kill();
            playerDeadSound.play();
            heartScale["children"].pop();
            firstScaleHeartX -= 20;
            player.reset(52, 52, 'dude')
        }
    },

    updateNastyBlob: function () {
        let s = 0;
        let copyRect = { x: 0, y: 0, w: wavePixelChunk, h: 35 };
        let copyPoint = { x: 0, y: 0 };

        // Patroling for blobs
        for(key in blobs.children) {
            //console.log(blobs.children[key].body.velocity.x)
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
    },

    UpdateZombie: function  () {
        for(key in zombies.children) {
            if(Math.abs(zombies.children[key].body.x - player.body.x) < 200 && Math.abs(zombies.children[key].body.y - player.body.y) < 60) {
                if(zombies.children[key].body.x > player.body.x) {
                    zombies.children[key].body.velocity.x = - 120;
                }
                else if (zombies.children[key].body.x < player.body.x) {
                    zombies.children[key].body.velocity.x =  120;
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
    },

    UpdateGhost: function () {
        for(key in ghosts.children) {
            if(Math.abs(ghosts.children[key].body.x - player.body.x) < 200 && Math.abs(ghosts.children[key].body.y - player.body.y) < 60) {
                if(ghosts.children[key].body.x > player.body.x) {
                    ghosts.children[key].animations.play('attakLeft');
                    ghosts.children[key].body.velocity.x = - 250;
                }
                else if (ghosts.children[key].body.x < player.body.x) {
                    ghosts.children[key].animations.play('attakRight');
                    ghosts.children[key].body.velocity.x =  250;
                }
            }
            else {
                ghosts.children[key].animations.play('idle');
                ghosts.children[key].body.velocity.x =  ghostX;
            }
        }
    },

    UpdateWizard: function  () {
        for(key in wizards.children) {
                if(wizards.children[key].body.velocity.x < 0) {
                    wizards.children[key].animations.play('moveLeft');
                }
                else if (wizards.children[key].body.velocity.x > 0) {
                    wizards.children[key].animations.play('moveRight');
                }
                if(Math.abs(wizards.children[key].body.x - player.body.x) < 600 && Math.abs(wizards.children[key].body.y - player.body.y) < 20) {
                    if (game.time.now > firingTimer) {
                        mageBullet = mageBullets.create(wizards.children[key].body.x, (wizards.children[key].body.y + 10), 'mageBullet')
                        if(mageBullet.body.x > player.body.x) {
                            mageBullet.body.velocity.x = - 150;
                            wizards.children[key].body.velocity.x = - 90;
                        }
                        else if(mageBullet.body.x < player.body.x) {
                            mageBullet.body.velocity.x = 150;
                            wizards.children[key].body.velocity.x = 90;
                        }
                        firingTimer = game.time.now + 6000;
                    }
                }
                if(Math.abs(wizards.children[key].body.x - player.body.x) < 100 && Math.abs(wizards.children[key].body.y - player.body.y) < 60) {
                    if(wizards.children[key].body.x > player.body.x) {
                        wizards.children[key].body.velocity.x = - 120;
                        wizards.children[key].animations.play('attakLeft');
                    }
                    else if (wizards.children[key].body.x < player.body.x) {
                        wizards.children[key].body.velocity.x =  120;
                        wizards.children[key].animations.play('attakRight');
                    }
                }
                if (!wizards.children[key].body.velocity.x) {
                    wizardX *= -1;
                    wizards.children[key].body.velocity.x = wizardX;
                }
        }
    },

    bulletsKill: function (player, mageBullet) {
        if(Math.abs(mageBullet.body.x - player.body.x) < 20) {
            player.kill();
            heartScale["children"].pop();
            firstScaleHeartX -= 20;
            player.reset(52, 152);
        }
    },

    enetetiesPositioning: function () {

        let objArr = map["objects"]["Object Layer 1"];

        for (let i = 0; i < objArr.length; i++)
        {
            let Entity = objArr[i];
            if (Entity["name"] === "player")
            {
                player = game.add.sprite(Entity["x"], Entity["y"], 'dude');
                game.physics.arcade.enable(player);
                game.camera.follow(player);

                player.body.gravity.y = 1100;
                player.body.collideWorldBounds = true;

                player.animations.add('left', [4, 5, 6, 7], 3, true);
                player.animations.add('right', [0, 1, 2, 3], 3, true);
                player.animations.add('rightKick', [8, 9, 10, 11], 8, true);
                player.animations.add('leftKick', [12, 13, 14, 15], 8, true);

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

            } else if (Entity["name"] === "stopper")
            {
                 let stopper = stoppers.create(Entity["x"], Entity["y"]);
                 stopper.body.collideWorldBounds = true;
                 stopper.body.immovable = true;
            } else if (Entity["name"] === "ghost")
            {
                ghost = ghosts.create(Entity["x"], Entity["y"], "ghost")
                ghost.body.collideWorldBounds = true;
                ghost.body.gravity.y = 1100;
                ghost.animations.add('idle', [0, 1, 2, 3, 4,], 5, true);
                ghost.animations.add('attakRight', [5], 5, true);
                ghost.animations.add('attakLeft', [6], 5, true);
                ghost.body.velocity.x = ghostX;
            } else if (Entity["name"] === "wizard")
            {
                wizard = wizards.create(Entity["x"], Entity["y"], "wizard")
                wizard.body.collideWorldBounds = true;
                wizard.body.gravity.y = 1100;
                wizard.animations.add('moveLeft', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 6, true);
                wizard.animations.add('moveRight', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 6, true);
                wizard.animations.add('attakRight', [27, 28, 29], 6, true);
                wizard.animations.add('attakLeft', [24, 25, 26], 6, true);
                wizard.body.velocity.x = wizardX;
            }
        }
    },

    threeLives: function () {
        for (let i = 0; i < 3; i++) {
            let sHeart = heartScale.create(firstScaleHeartX, 18, 'heart');
            firstScaleHeartX += 20;
        }
    }

}
