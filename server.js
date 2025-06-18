const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');

const app = express();

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/server.cert')),
};

const httpsServer = https.createServer(serverOptions, app);
const wss = new WebSocket.Server({ server: httpsServer });

wss.on('connection', (ws) => {
  console.clear();
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    console.clear();
    console.log('Mensagem do cliente:', message.toString());
    ws.send('Mensagem recebida: ' + message);
  });

  ws.send('Olá do servidor WebSocket!');
});

// Serve seu arquivo test.html na rota /mira
app.get('/mira', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

httpsServer.listen(3000, () => {
  console.log('Servidor rodando em https://localhost:3000');
  console.log('Acesse https://localhost:3000/mira para abrir o test.html');
});
