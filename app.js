const https = require('https');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Ler arquivos do certificado e chave
const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/server.cert')),
};

// Criar servidor HTTPS
const httpsServer = https.createServer(serverOptions, (req, res) => {
  res.writeHead(200);
  res.end('Servidor HTTPS com WebSocket rodando!\n');
});

// Criar servidor WebSocket atrelado ao HTTPS
const wss = new WebSocket.Server({ server: httpsServer });

wss.on('connection', (ws) => {
  console.log('Cliente WS conectado');

  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message.toString());
    // Exemplo: responder o cliente
    ws.send('Mensagem recebida: ' + message);
  });

  ws.send('Olá do servidor WebSocket!');
});

// Servidor HTTPS escutando na porta 3000
httpsServer.listen(3000, () => {
  console.log('Servidor rodando em https://localhost:3000');
});
