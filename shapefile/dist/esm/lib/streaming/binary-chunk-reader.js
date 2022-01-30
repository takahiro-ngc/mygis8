import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export default class BinaryChunkReader {
  constructor(options) {
    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "arrayBuffers", void 0);

    _defineProperty(this, "ended", void 0);

    _defineProperty(this, "maxRewindBytes", void 0);

    const {
      maxRewindBytes = 0
    } = options || {};
    this.offset = 0;
    this.arrayBuffers = [];
    this.ended = false;
    this.maxRewindBytes = maxRewindBytes;
  }

  write(arrayBuffer) {
    this.arrayBuffers.push(arrayBuffer);
  }

  end() {
    this.arrayBuffers = [];
    this.ended = true;
  }

  hasAvailableBytes(bytes) {
    let bytesAvailable = -this.offset;

    for (const arrayBuffer of this.arrayBuffers) {
      bytesAvailable += arrayBuffer.byteLength;

      if (bytesAvailable >= bytes) {
        return true;
      }
    }

    return false;
  }

  findBufferOffsets(bytes) {
    let offset = -this.offset;
    const selectedBuffers = [];

    for (let i = 0; i < this.arrayBuffers.length; i++) {
      const buf = this.arrayBuffers[i];

      if (offset + buf.byteLength <= 0) {
        offset += buf.byteLength;
        continue;
      }

      const start = offset <= 0 ? Math.abs(offset) : 0;
      let end;

      if (start + bytes <= buf.byteLength) {
        end = start + bytes;
        selectedBuffers.push([i, [start, end]]);
        return selectedBuffers;
      }

      end = buf.byteLength;
      selectedBuffers.push([i, [start, end]]);
      bytes -= buf.byteLength - start;
      offset += buf.byteLength;
    }

    return null;
  }

  getDataView(bytes) {
    const bufferOffsets = this.findBufferOffsets(bytes);

    if (!bufferOffsets && this.ended) {
      throw new Error('binary data exhausted');
    }

    if (!bufferOffsets) {
      return null;
    }

    if (bufferOffsets.length === 1) {
      const [bufferIndex, [start, end]] = bufferOffsets[0];
      const arrayBuffer = this.arrayBuffers[bufferIndex];
      const view = new DataView(arrayBuffer, start, end - start);
      this.offset += bytes;
      this.disposeBuffers();
      return view;
    }

    const view = new DataView(this._combineArrayBuffers(bufferOffsets));
    this.offset += bytes;
    this.disposeBuffers();
    return view;
  }

  disposeBuffers() {
    while (this.arrayBuffers.length > 0 && this.offset - this.maxRewindBytes >= this.arrayBuffers[0].byteLength) {
      this.offset -= this.arrayBuffers[0].byteLength;
      this.arrayBuffers.shift();
    }
  }

  _combineArrayBuffers(bufferOffsets) {
    let byteLength = 0;

    for (const bufferOffset of bufferOffsets) {
      const [start, end] = bufferOffset[1];
      byteLength += end - start;
    }

    const result = new Uint8Array(byteLength);
    let resultOffset = 0;

    for (const bufferOffset of bufferOffsets) {
      const [bufferIndex, [start, end]] = bufferOffset;
      const sourceArray = new Uint8Array(this.arrayBuffers[bufferIndex]);
      result.set(sourceArray.subarray(start, end), resultOffset);
      resultOffset += end - start;
    }

    return result.buffer;
  }

  skip(bytes) {
    this.offset += bytes;
  }

  rewind(bytes) {
    this.offset -= bytes;
  }

}
//# sourceMappingURL=binary-chunk-reader.js.map