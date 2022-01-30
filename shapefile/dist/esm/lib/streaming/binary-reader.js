import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export default class BinaryReader {
  constructor(arrayBuffer) {
    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "arrayBuffer", void 0);

    this.offset = 0;
    this.arrayBuffer = arrayBuffer;
  }

  hasAvailableBytes(bytes) {
    return this.arrayBuffer.byteLength - this.offset >= bytes;
  }

  getDataView(bytes) {
    if (bytes && !this.hasAvailableBytes(bytes)) {
      throw new Error('binary data exhausted');
    }

    const dataView = bytes ? new DataView(this.arrayBuffer, this.offset, bytes) : new DataView(this.arrayBuffer, this.offset);
    this.offset += bytes;
    return dataView;
  }

  skip(bytes) {
    this.offset += bytes;
  }

  rewind(bytes) {
    this.offset -= bytes;
  }

}
//# sourceMappingURL=binary-reader.js.map