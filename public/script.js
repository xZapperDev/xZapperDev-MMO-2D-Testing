const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const keys = {};
let username = null;
let discriminator = null;
let avatarURL = null;
let lastSent = Date.now();

const player = {
    x: 100,
    y: 100,
    dx: 0,
    dy: 0,
    width: 32,
    height: 32,
    speed: 3,
    color: 'lime'
};

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function logout() {
    fetch('/logout').then(() => location.reload());
}

function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Cerrar menú si clic fuera del mismo o del botón
window.addEventListener('click', e => {
    const menu = document.getElementById('profileMenu');
    const btn = document.getElementById('logoutBtn');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

fetch('/me')
    .then(res => res.json())
    .then(user => {
        if (!user.error) {
            username = user.username;
            discriminator = user.discriminator || '0000';
            // Avatar con extensión adecuada
            const ext = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
            avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}`;

            // Mostrar UI juego
            document.getElementById('loginArea').style.display = 'none';
            document.getElementById('gameCanvas').style.display = 'block';
            document.getElementById('info').style.display = 'block';
            document.getElementById('controls').style.display = 'block';
            document.getElementById('info').innerText = `Bienvenido, ${username}`;

            // Mostrar botón logout con avatar
            const logoutBtn = document.getElementById('logoutBtn');
            logoutBtn.style.display = 'block';
            document.getElementById('avatarImg').src = avatarURL;

            // Configurar menú perfil
            document.getElementById('menuAvatar').src = avatarURL;
            document.getElementById('menuUsername').textContent = `${username}#${discriminator}`;
            document.getElementById('menuTag').style.display = 'none';

            // Cargar posición inicial jugador
            fetch('/player/position')
                .then(res => res.json())
                .then(pos => {
                    player.x = pos.x;
                    player.y = pos.y;
                });
        } else {
            // Usuario no logueado
            document.getElementById('loginArea').style.display = 'block';
            document.getElementById('gameCanvas').style.display = 'none';
            document.getElementById('info').style.display = 'none';
            document.getElementById('controls').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'none';
        }
    });

function update() {
    if (!username) return;

    player.dx = player.dy = 0;
    if (keys['w']) player.dy = -player.speed;
    if (keys['s']) player.dy = player.speed;
    if (keys['a']) player.dx = -player.speed;
    if (keys['d']) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    if (Date.now() - lastSent > 500) {
        lastSent = Date.now();
        fetch('/player/position', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: player.x, y: player.y })
        });
    }
}

function draw() {
    if (!username) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nombre del jugador encima del cubo
    ctx.fillStyle = 'red';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(username, player.x + player.width / 2, player.y - 10);

    // Cubo jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();