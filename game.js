require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { getPlayer, setPlayer } = require('./db')
const passport = require('./auth');
const fs = require('fs');
const app = express();

const PORT = 3000 || process.env.PORT;

app.use(session({
    secret: 'andjsadnjasndas',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(express.json());

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    });



app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

app.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        const { id, username, discriminator, avatar } = req.user;
        res.json({ id, username, discriminator, avatar });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// Obtener posición del jugador
app.get('/player/position', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'No autenticado' });
    const player = await getPlayer(req.user.id);
    res.json(player || { x: 100, y: 100 });
});

// Guardar posición del jugador
app.post('/player/position', express.json(), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'No autenticado' });
    const { x, y } = req.body;
    await setPlayer(req.user.id, { x, y });
    res.json({ success: true });
});

app.listen(PORT, console.log('[Game]: Runnnig in the port: ', PORT));