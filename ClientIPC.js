import IPC from 'node-ipc';
import { encodeMessage, decodeMessage } from './utils/messageParser';

require('dotenv').config();

const serverId = process.env.SERVER_ID;
const cliendId = process.env.CLIENT_ID;

IPC.config.id = cliendId;
IPC.config.silent = true;
IPC.config.rawBuffer = true;
IPC.config.encoding = 'ascii';
IPC.config.stopRetrying = true;

class ClientIPC {
  constructor() {
    this.isConnected = false;
    this.hasStarted = false;
    this.callback = null;
  }

  setCallback(callback) {
    if (this.callback === null && callback !== null) {
      this.callback = callback;
    }
  }

  executeCallback() {
    if (this.callback !== null) {
      this.callback();
      this.callback = null;
    }
  }

  connect(cb = null) {
    this.setCallback(cb);
    if (this.isConnected) {
      console.log(`Client already connected`);
      this.executeCallback();
      return;
    }
    IPC.connectTo(serverId, () => {
      IPC.of[serverId].on('connect', () => {
        console.log(`Client connected to ${serverId}`);
        this.isConnected = true;
        this.hasStarted = true;
        this.executeCallback();
      });
      IPC.of[serverId].on('disconnect', () => {
        if (this.hasStarted) {
          console.log(`Client disconnected from ${serverId}`);
        } else {
          console.log(`Client not able to connect to ${serverId}`);
        }
        this.isConnected = false;
        this.hasStarted = false;
        // IPC.disconnect(serverId);
        this.executeCallback();
      });

      IPC.of[serverId].on('data', data => {
        const decodedMsg = decodeMessage(data);
        console.log(
          `Message from ${serverId}: original: ${data.inspect()} - decoded: ${decodedMsg}`
        );
        this.executeCallback();
      });
    });
  }

  disconnect(cb = null) {
    this.setCallback(cb);
    if (!this.isConnected) {
      console.log(`Client already disconnected`);
      this.executeCallback();
      return;
    }
    console.log(`Client manually disconnected from ${serverId}`);
    IPC.disconnect(serverId);
  }

  getDeviceData(cb = null) {
    this.setCallback(cb);
    if (!this.isConnected) {
      console.log(`Client is not connected`);
      this.executeCallback();
      return;
    }
    IPC.of[serverId].emit(encodeMessage(`get`));
  }

  setDeviceData(data, cb = null) {
    this.setCallback(cb);
    if (!this.isConnected) {
      console.log(`Client is not connected`);
      this.executeCallback();
      return;
    }
    IPC.of[serverId].emit(encodeMessage(`set ${data}`));
  }
}
export default ClientIPC;
