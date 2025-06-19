// config/websocket.js
import { WebSocketServer } from 'ws';

let wss;

export const setupWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (socket) => {
    console.log('✅ A client connected via WebSocket');

    socket.on('message', (message) => {
      console.log('📩 Message from client:', message.toString());
    });

    socket.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });
};

export const getWSS = () => wss;