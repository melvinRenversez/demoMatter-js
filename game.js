const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);


function preload() {
    this.load.image('player', 'player.png');
    this.load.image('bug', 'bug.png');
}

let player;
let bug;
let keys;

let activeKeys = {
    up: false,
    down: false,
    left: false,
    right: false
};

function create() {
    player = this.matter.add.sprite(300, 300, "player");

    player.setBody({
        type: 'circle',
        width: 95,
        height: 95
    })

    player.speed = 4;

    bug = this.matter.add.image(500, 400, 'bug');

    bug.setBody({
        type: 'rectangle',
        width: 90,
        height: 100
    });

    bug.setStatic(true);

    // Crée les touches ZQSD
    keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}

function update() {

    let targetAngle = player.angle;

    if (keys.left.isDown) {
        console.log('left');
        player.x -= player.speed;
        activeKeys.left = true;
        targetAngle = -90;
    }

    if (keys.right.isDown) {
        console.log('right');
        player.x += player.speed;
        activeKeys.right = true;
        targetAngle = 90;
    }

    if (keys.up.isDown) {
        console.log('up');
        player.y -= player.speed;
        activeKeys.up = true;
        targetAngle = 0;
    }

    if (keys.down.isDown) {
        console.log('down');
        player.y += player.speed;
        activeKeys.down = true;
        targetAngle = 180;
    }

    // Gestion diagonales
    if ((keys.up.isDown) && (keys.left.isDown)) targetAngle = -45;
    if ((keys.up.isDown) && (keys.right.isDown)) targetAngle = 45;
    if ((keys.down.isDown) && (keys.left.isDown)) targetAngle = -135;
    if ((keys.down.isDown) && (keys.right.isDown)) targetAngle = 135;

    console.log(targetAngle);

    const rotationSpeed = 0.1;
    player.angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.RotateTo(
            Phaser.Math.DegToRad(player.angle),
            Phaser.Math.DegToRad(targetAngle),
            rotationSpeed)
    );


}