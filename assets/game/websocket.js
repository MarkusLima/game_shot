export function conectarWebSocket(callback) {
  const socket = new WebSocket('wss://192.168.1.108:3000'); // substitua pelo IP correto

  socket.onopen = () => {
    console.log("✅ Conectado ao WebSocket");
  };

  socket.onerror = (err) => {
    console.error("❌ Erro WebSocket:", err);
  };

  socket.onmessage = (event) => {
      try {
        const dados = JSON.parse(event.data);
        console.log(event)
        callback(dados);
      } catch (e) {
        // Se não for JSON, passa a string pura no callback
        callback({ text: event.data });
      }
  };
}
