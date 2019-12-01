class Device {
  constructor() {
    this.data = 0;
  }

  getData() {
    this.data++;
    return `${this.data} unit(s)`;
  }

  setDataValue(val) {
    this.data = val;
  }
}
export default Device;
