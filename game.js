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
    this.load.image('player', 'player.png'); // ton perso
    this.load.image('bug', 'bug.png');
}

let player;

function create() {
    player = this.matter.add.sprite(300, 300, "player")
    player.setIgnoredByGravity(true);
}

function update() {
}