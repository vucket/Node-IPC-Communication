import IPC from 'node-ipc';
import { parseMessage, decodeMessage } from './utils/messageParser';

require('dotenv').config();

IPC.config.id = process.env.SERVER_ID;
IPC.config.silent = true;
IPC.config.rawBuffer = true;
IPC.config.encoding = 'ascii';

IPC.serve(() => {
  IPC.server.on('connect', () => {
    console.log(`Client connected`);
  });
  IPC.server.on('socket.disconnected', (socket, destroyedSocketID) => {
    console.log(`Client disconnected`);
  });

  IPC.server.on('data', (data, socket) => {
    console.log(`Got message: ${decodeMessage(data)}`);
    IPC.server.emit(socket, parseMessage('Hi I am server'));
  });
});

IPC.server.start();
