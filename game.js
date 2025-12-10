const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player = {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    color: '#ffb347',
    vy: 0,
    grounded: false
};
let gravity = 0.8;
let jumpPower = -14;
let platforms = [
    {x: 0, y: 370, width: 800, height: 30},
    {x: 200, y: 300, width: 120, height: 20},
    {x: 400, y: 250, width: 120, height: 20},
    {x: 600, y: 200, width: 120, height: 20}
];
let keys = {};
let score = 0;
let lives = 3;

// 2.5D shader function for platforms
function drawPlatform(p) {
    // Platform base
    ctx.fillStyle = "#5c7fa3";
    ctx.fillRect(p.x, p.y, p.width, p.height);

    // "2.5D" top highlight
    let grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
    grad.addColorStop(0, "#b8d0e6");
    grad.addColorStop(1, "#5c7fa3");
    ctx.fillStyle = grad;
    ctx.fillRect(p.x, p.y, p.width, p.height / 2);

    // Shadow for depth
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(p.x, p.y + p.height, p.width, 8);
}

// 2.5D shader for player
function drawPlayer() {
    // Shadow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.ellipse(player.x + player.width/2, player.y + player.height + 8, player.width/2, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    // Body
    let grad = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
    grad.addColorStop(0, "#ffe29f");
    grad.addColorStop(1, "#ffb347");
    ctx.fillStyle = grad;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Outline
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
}

// Game loop
function update() {
    // Movement
    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;

    // Gravity
    player.vy += gravity;
    player.y += player.vy;

    // Platform collision
    player.grounded = false;
    for (let p of platforms) {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height < p.y + p.height &&
            player.y + player.height + player.vy >= p.y
        ) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.grounded = true;
        }
    }

    // Jump
    if (keys['Space'] && player.grounded) {
        player.vy = jumpPower;
    }

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height) {
        lives--;
        player.x = 50;
        player.y = 300;
        player.vy = 0;
        if (lives <= 0) {
            alert("Game Over!");
            lives = 3;
            score = 0;
        }
    }

    // Score for reaching the last platform
    if (player.x > 700 && player.y < 210) {
        score++;
        player.x = 50;
        player.y = 300;
        player.vy = 0;
    }

    // Draw
    draw();
    requestAnimationFrame(update);
}
