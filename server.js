import IPC from 'node-ipc';
import { encodeMessage, decodeMessage } from './utils/messageParser';
import Device from './Device';

require('dotenv').config();

const myDevice = new Device();

const delay = ms => {
  return new Promise(res => {
    return setTimeout(res, ms);
  });
};

const sendData = async socket => {
  await delay(Math.floor(Math.random() * 2000) + 1000);
  IPC.server.emit(socket, encodeMessage(myDevice.getData()));
};

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
    const decodedMsg = decodeMessage(data);
    const splitMsg = decodedMsg.split(' ');
    const command = splitMsg[0];
    const args = splitMsg[1];
    console.log(
      `Got message: original: ${data.inspect()} - decoded: ${decodedMsg}`
    );
    switch (command) {
      case 'get':
        console.log(`Valid command`);
        console.log(`Getting device data...`);
        sendData(socket);
        break;
      case 'set':
        console.log(`Valid command`);
        console.log(`Setting device data...`);
        myDevice.setDataValue(args);
        IPC.server.emit(socket, encodeMessage(myDevice.getData()));
        break;
      default:
        console.log(`Unknown command`);
        break;
    }
  });
});

IPC.server.start();
console.log(`Server has started`);
