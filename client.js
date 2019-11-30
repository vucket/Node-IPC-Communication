import IPC from 'node-ipc';
import { parseMessage, decodeMessage } from './utils/messageParser';

require('dotenv').config();

const serverId = process.env.SERVER_ID;
const cliendId = process.env.CLIENT_ID;

IPC.config.id = cliendId;
IPC.config.silent = true;
IPC.config.rawBuffer = true;
IPC.config.encoding = 'ascii';

IPC.connectTo(serverId, () => {
  IPC.of[serverId].on('connect', () => {
    console.log(`Client connected to ${serverId}`);
    IPC.of[serverId].emit(parseMessage('Hi I am a client'));
  });
  IPC.of[serverId].on('disconnect', () => {
    console.log(`Client disconnected from ${serverId}`);
    process.exit(0);
  });

  IPC.of[serverId].on('data', data => {
    console.log(`got a message from ${serverId}: ${decodeMessage(data)}`);
  });
});
