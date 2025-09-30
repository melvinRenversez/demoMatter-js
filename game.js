const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


let player;
let cursors;
let keys;

const game = new Phaser.Game(config);


function preload() {
    this.load.image('player', 'player.png'); // ton perso
    this.load.image('bug', 'bug.png');
}

function create() {
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);

    this.player.body.setSize(100, 100);

    this.player.setImmovable(false);
    this.player.health = 100;

    this.player.healthBar = this.add.graphics();
    this.player.healthBar.fillStyle(0x00ff00, 1);
    this.player.healthBar.fillRect(this.player.x - 25, this.player.y - 40, 50, 5);

    this.player.damageble = true;

    this.player.attackHitbox = this.add.rectangle(this.player.x, this.player.y, 40, 20, 0xff0000, 0.5);
    this.physics.add.existing(this.player.attackHitbox);
    this.player.attackHitbox.visible = false;

    this.player.lastAngle = this.player.angle;

    this.player.isAttack = false;

    this.player.cc = true;
    this.player.ccTime = 400;




    this.bug = this.physics.add.sprite(600, 400, 'bug');
    this.bug.setCollideWorldBounds(true);
    this.bug.setImmovable(true);

    this.bug.health = 100;
    this.bug.healthBar = this.add.graphics();
    this.bug.healthBar.fillStyle(0x00ff00, 1);
    this.bug.healthBar.fillRect(this.bug.x - 25, this.bug.y - 40, 50, 5);

    this.bug.damageble = true;





    this.physics.add.collider(this.player, this.bug)




    cursors = this.input.keyboard.createCursorKeys();


    this.physics.add.overlap(this.player.attackHitbox, this.bug, () => {
        if (this.bug.damageble && this.player.isAttack && this.player.cc) {
            this.bug.health -= 10;
            this.bug.damageble = false;

            if (this.bug.health <= 0) {
                this.bug.destroy();
            }

            setTimeout(() => {
                this.bug.damageble = true;
            }, 150);
        }
    });

    // touches ZQSD
    keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        test: Phaser.Input.Keyboard.KeyCodes.O
    });
}



let activeKeys = { "up": false, "down": false, "left": false, "right": false };
function update() {
    const speed = 200; // vitesse en pixels par seconde
    let targetAngle = this.player.angle;

    console.log(this.player.isAttack, this.player.cc);

    // Remise à zéro de la vitesse
    this.player.setVelocity(0);

    if (keys.test.isDown && this.player.damageble) {
        this.player.health -= 10;
        this.player.damageble = false;
        setTimeout(() => {
            this.player.damageble = true;
        }, 150);
    }

    this.player.isAttack = false;
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && this.player.cc) {
        console.log("attaque");
        attack(this.player);
        this.player.isAttack = true; 
        setTimeout(() => {
            this.player.cc = false;
        }, 100);
        setTimeout(() => {
            this.player.cc = true;
        }, this.player.ccTime);
    }


    // Déplacement horizontal
    if (cursors.left.isDown || keys.left.isDown) {
        this.player.setVelocityX(-speed);
        targetAngle = -90;
    }
    if (cursors.right.isDown || keys.right.isDown) {
        this.player.setVelocityX(speed);
        targetAngle = 90;
    }

    // Déplacement vertical
    if (cursors.up.isDown || keys.up.isDown) {
        this.player.setVelocityY(-speed);
        targetAngle = 0;
    }
    if (cursors.down.isDown || keys.down.isDown) {
        this.player.setVelocityY(speed);
        targetAngle = 180;
    }

    // Gestion diagonales
    if ((cursors.up.isDown || keys.up.isDown) && (cursors.left.isDown || keys.left.isDown)) targetAngle = -45;
    if ((cursors.up.isDown || keys.up.isDown) && (cursors.right.isDown || keys.right.isDown)) targetAngle = 45;
    if ((cursors.down.isDown || keys.down.isDown) && (cursors.left.isDown || keys.left.isDown)) targetAngle = -135;
    if ((cursors.down.isDown || keys.down.isDown) && (cursors.right.isDown || keys.right.isDown)) targetAngle = 135;

    this.player.lastAngle = targetAngle;

    // Rotation fluide
    const rotationSpeed = 0.1;
    this.player.angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.RotateTo(
            Phaser.Math.DegToRad(this.player.angle),
            Phaser.Math.DegToRad(targetAngle),
            rotationSpeed
        )
    );

    updateHealthBar(this.player);
    updateHealthBar(this.bug);
}

function updateHealthBar(entity) {
    entity.healthBar.clear(); // supprime l'ancien graphique
    entity.healthBar.fillStyle(0x00ff00, 1);

    let width = 50 * (entity.health / 100); // largeur proportionnelle à la vie
    entity.healthBar.fillRect(entity.x - 25, entity.y - 40, width, 5);
}


function attack(player) {
    // rendre la hitbox visible juste le temps du coup
    player.attackHitbox.visible = true;

    // Positionner la hitbox devant le joueur selon l'angle
    const distance = 80; // distance devant le joueur
    const angleRad = Phaser.Math.DegToRad(player.angle - 90);
    player.attackHitbox.x = player.x + Math.cos(angleRad) * distance;
    player.attackHitbox.y = player.y + Math.sin(angleRad) * distance;
    player.attackHitbox.rotation = angleRad;

    // Après un petit délai, cacher la hitbox
    setTimeout(() => {
        player.attackHitbox.visible = false;
    }, 150); // 150 ms pour la frappe
}
