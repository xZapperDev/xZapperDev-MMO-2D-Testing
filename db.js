const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'players.json');

// Leer todos los jugadores
function getAllPlayers() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Obtener un jugador por ID
function getPlayer(id) {
    const players = getAllPlayers();
    return players[id] || { x: 100, y: 100 };
}

// Guardar posición del jugador
function setPlayer(id, data) {
    const players = getAllPlayers();
    players[id] = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(players, null, 2));
}

module.exports = { getPlayer, setPlayer };
