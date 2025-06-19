const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');

const app = express();

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/192.168.1.108+2-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/192.168.1.108+2.pem')),
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const httpsServer = https.createServer(serverOptions, app);
const wss = new WebSocket.Server({ server: httpsServer });

// Lista de clientes conectados
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('✅ Novo cliente WebSocket conectado');
  clients.add(ws);

  ws.send('Olá do servidor WebSocket!');

  ws.on('message', (message) => {
    console.log('📨 Mensagem recebida:', message.toString());

    // Broadcast: envia para todos os outros clientes
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('❌ Cliente desconectado');
  });
});

// Rota para o controle
app.get('/mira', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/control/test.html'));
});

// Rota para o jogo
app.get('/', (req, res) => {
  res.render('game/index');
});

httpsServer.listen(3000, () => {
  console.log('✅ Servidor rodando em https://192.168.1.108:3000');
  console.log('🔗 Acesse / para o JOGO e /mira para o CONTROLE');
});
