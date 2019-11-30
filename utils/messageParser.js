require('dotenv').config();

export function parseMessage(msg) {
  return Buffer.from(msg, process.env.MSG_ENCODING);
}
export function decodeMessage(msg) {
  return msg.toString(process.env.MSG_ENCODING);
}
