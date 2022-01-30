(() => {
  // src/lib/streaming/binary-chunk-reader.ts
  var BinaryChunkReader = class {
    constructor(options) {
      const { maxRewindBytes = 0 } = options || {};
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
        throw new Error("binary data exhausted");
      }
      if (!bufferOffsets) {
        return null;
      }
      if (bufferOffsets.length === 1) {
        const [bufferIndex, [start, end]] = bufferOffsets[0];
        const arrayBuffer = this.arrayBuffers[bufferIndex];
        const view2 = new DataView(arrayBuffer, start, end - start);
        this.offset += bytes;
        this.disposeBuffers();
        return view2;
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
  };

  // src/lib/parsers/parse-shp-header.ts
  var LITTLE_ENDIAN = true;
  var BIG_ENDIAN = false;
  var SHP_MAGIC_NUMBER = 9994;
  function parseSHPHeader(headerView) {
    const header = {
      magic: headerView.getInt32(0, BIG_ENDIAN),
      length: headerView.getInt32(24, BIG_ENDIAN) * 2,
      version: headerView.getInt32(28, LITTLE_ENDIAN),
      type: headerView.getInt32(32, LITTLE_ENDIAN),
      bbox: {
        minX: headerView.getFloat64(36, LITTLE_ENDIAN),
        minY: headerView.getFloat64(44, LITTLE_ENDIAN),
        minZ: headerView.getFloat64(68, LITTLE_ENDIAN),
        minM: headerView.getFloat64(84, LITTLE_ENDIAN),
        maxX: headerView.getFloat64(52, LITTLE_ENDIAN),
        maxY: headerView.getFloat64(60, LITTLE_ENDIAN),
        maxZ: headerView.getFloat64(76, LITTLE_ENDIAN),
        maxM: headerView.getFloat64(92, LITTLE_ENDIAN)
      }
    };
    if (header.magic !== SHP_MAGIC_NUMBER) {
      console.error(`SHP file: bad magic number ${header.magic}`);
    }
    if (header.version !== 1e3) {
      console.error(`SHP file: bad version ${header.version}`);
    }
    return header;
  }

  // src/lib/parsers/parse-shp-geometry.ts
  var LITTLE_ENDIAN2 = true;
  function parseRecord(view, options) {
    const { _maxDimensions } = options?.shp || {};
    let offset = 0;
    const type = view.getInt32(offset, LITTLE_ENDIAN2);
    offset += Int32Array.BYTES_PER_ELEMENT;
    switch (type) {
      case 0:
        return parseNull();
      case 1:
        return parsePoint(view, offset, Math.min(2, _maxDimensions));
      case 3:
        return parsePoly(view, offset, Math.min(2, _maxDimensions), "LineString");
      case 5:
        return parsePoly(view, offset, Math.min(2, _maxDimensions), "Polygon");
      case 8:
        return parseMultiPoint(view, offset, Math.min(2, _maxDimensions));
      case 11:
        return parsePoint(view, offset, Math.min(4, _maxDimensions));
      case 13:
        return parsePoly(view, offset, Math.min(4, _maxDimensions), "LineString");
      case 15:
        return parsePoly(view, offset, Math.min(4, _maxDimensions), "Polygon");
      case 18:
        return parseMultiPoint(view, offset, Math.min(4, _maxDimensions));
      case 21:
        return parsePoint(view, offset, Math.min(3, _maxDimensions));
      case 23:
        return parsePoly(view, offset, Math.min(3, _maxDimensions), "LineString");
      case 25:
        return parsePoly(view, offset, Math.min(3, _maxDimensions), "Polygon");
      case 28:
        return parseMultiPoint(view, offset, Math.min(3, _maxDimensions));
      default:
        throw new Error(`unsupported shape type: ${type}`);
    }
  }
  function parseNull() {
    return null;
  }
  function parsePoint(view, offset, dim) {
    let positions;
    [positions, offset] = parsePositions(view, offset, 1, dim);
    return {
      positions: { value: positions, size: dim },
      type: "Point"
    };
  }
  function parseMultiPoint(view, offset, dim) {
    offset += 4 * Float64Array.BYTES_PER_ELEMENT;
    const nPoints = view.getInt32(offset, LITTLE_ENDIAN2);
    offset += Int32Array.BYTES_PER_ELEMENT;
    let xyPositions = null;
    let mPositions = null;
    let zPositions = null;
    [xyPositions, offset] = parsePositions(view, offset, nPoints, 2);
    if (dim === 4) {
      offset += 2 * Float64Array.BYTES_PER_ELEMENT;
      [zPositions, offset] = parsePositions(view, offset, nPoints, 1);
    }
    if (dim >= 3) {
      offset += 2 * Float64Array.BYTES_PER_ELEMENT;
      [mPositions, offset] = parsePositions(view, offset, nPoints, 1);
    }
    const positions = concatPositions(xyPositions, mPositions, zPositions);
    return {
      positions: { value: positions, size: dim },
      type: "Point"
    };
  }
  function parsePoly(view, offset, dim, type) {
    offset += 4 * Float64Array.BYTES_PER_ELEMENT;
    const nParts = view.getInt32(offset, LITTLE_ENDIAN2);
    offset += Int32Array.BYTES_PER_ELEMENT;
    const nPoints = view.getInt32(offset, LITTLE_ENDIAN2);
    offset += Int32Array.BYTES_PER_ELEMENT;
    const bufferOffset = view.byteOffset + offset;
    const bufferLength = nParts * Int32Array.BYTES_PER_ELEMENT;
    const ringIndices = new Int32Array(nParts + 1);
    ringIndices.set(new Int32Array(view.buffer.slice(bufferOffset, bufferOffset + bufferLength)));
    ringIndices[nParts] = nPoints;
    offset += nParts * Int32Array.BYTES_PER_ELEMENT;
    let xyPositions = null;
    let mPositions = null;
    let zPositions = null;
    [xyPositions, offset] = parsePositions(view, offset, nPoints, 2);
    if (dim === 4) {
      offset += 2 * Float64Array.BYTES_PER_ELEMENT;
      [zPositions, offset] = parsePositions(view, offset, nPoints, 1);
    }
    if (dim >= 3) {
      offset += 2 * Float64Array.BYTES_PER_ELEMENT;
      [mPositions, offset] = parsePositions(view, offset, nPoints, 1);
    }
    const positions = concatPositions(xyPositions, mPositions, zPositions);
    if (type === "LineString") {
      return {
        type,
        positions: { value: positions, size: dim },
        pathIndices: { value: ringIndices, size: 1 }
      };
    }
    const polygonIndices = [];
    for (let i = 1; i < ringIndices.length; i++) {
      const startRingIndex = ringIndices[i - 1];
      const endRingIndex = ringIndices[i];
      const ring = xyPositions.subarray(startRingIndex * 2, endRingIndex * 2);
      const sign = getWindingDirection(ring);
      if (sign > 0) {
        polygonIndices.push(startRingIndex);
      }
    }
    polygonIndices.push(nPoints);
    return {
      type,
      positions: { value: positions, size: dim },
      primitivePolygonIndices: { value: ringIndices, size: 1 },
      polygonIndices: { value: new Uint32Array(polygonIndices), size: 1 }
    };
  }
  function parsePositions(view, offset, nPoints, dim) {
    const bufferOffset = view.byteOffset + offset;
    const bufferLength = nPoints * dim * Float64Array.BYTES_PER_ELEMENT;
    return [
      new Float64Array(view.buffer.slice(bufferOffset, bufferOffset + bufferLength)),
      offset + bufferLength
    ];
  }
  function concatPositions(xyPositions, mPositions, zPositions) {
    if (!(mPositions || zPositions)) {
      return xyPositions;
    }
    let arrayLength = xyPositions.length;
    let nDim = 2;
    if (zPositions && zPositions.length) {
      arrayLength += zPositions.length;
      nDim++;
    }
    if (mPositions && mPositions.length) {
      arrayLength += mPositions.length;
      nDim++;
    }
    const positions = new Float64Array(arrayLength);
    for (let i = 0; i < xyPositions.length / 2; i++) {
      positions[nDim * i] = xyPositions[i * 2];
      positions[nDim * i + 1] = xyPositions[i * 2 + 1];
    }
    if (zPositions && zPositions.length) {
      for (let i = 0; i < zPositions.length; i++) {
        positions[nDim * i + 2] = zPositions[i];
      }
    }
    if (mPositions && mPositions.length) {
      for (let i = 0; i < mPositions.length; i++) {
        positions[nDim * i + (nDim - 1)] = mPositions[i];
      }
    }
    return positions;
  }
  function getWindingDirection(positions) {
    return Math.sign(getSignedArea(positions));
  }
  function getSignedArea(positions) {
    let area = 0;
    const nCoords = positions.length / 2 - 1;
    for (let i = 0; i < nCoords; i++) {
      area += (positions[i * 2] + positions[(i + 1) * 2]) * (positions[i * 2 + 1] - positions[(i + 1) * 2 + 1]);
    }
    return area / 2;
  }

  // src/lib/parsers/parse-shp.ts
  var LITTLE_ENDIAN3 = true;
  var BIG_ENDIAN2 = false;
  var SHP_HEADER_SIZE = 100;
  var SHP_RECORD_HEADER_SIZE = 12;
  var STATE = {
    EXPECTING_HEADER: 0,
    EXPECTING_RECORD: 1,
    END: 2,
    ERROR: 3
  };
  var SHPParser = class {
    constructor(options) {
      this.options = {};
      this.binaryReader = new BinaryChunkReader({ maxRewindBytes: SHP_RECORD_HEADER_SIZE });
      this.state = STATE.EXPECTING_HEADER;
      this.result = {
        geometries: []
      };
      this.options = options;
    }
    write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);
    }
    end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);
      if (this.state !== STATE.END) {
        this.state = STATE.ERROR;
        this.result.error = "SHP incomplete file";
      }
    }
  };
  function parseSHP(arrayBuffer, options) {
    const shpParser = new SHPParser(options);
    shpParser.write(arrayBuffer);
    shpParser.end();
    return shpParser.result;
  }
  async function* parseSHPInBatches(asyncIterator, options) {
    const parser = new SHPParser(options);
    let headerReturned = false;
    for await (const arrayBuffer of asyncIterator) {
      parser.write(arrayBuffer);
      if (!headerReturned && parser.result.header) {
        headerReturned = true;
        yield parser.result.header;
      }
      if (parser.result.geometries.length > 0) {
        yield parser.result.geometries;
        parser.result.geometries = [];
      }
    }
    parser.end();
    if (parser.result.geometries.length > 0) {
      yield parser.result.geometries;
    }
    return;
  }
  function parseState(state, result, binaryReader, options) {
    while (true) {
      try {
        switch (state) {
          case STATE.ERROR:
          case STATE.END:
            return state;
          case STATE.EXPECTING_HEADER:
            const dataView = binaryReader.getDataView(SHP_HEADER_SIZE);
            if (!dataView) {
              return state;
            }
            result.header = parseSHPHeader(dataView);
            result.progress = {
              bytesUsed: 0,
              bytesTotal: result.header.length,
              rows: 0
            };
            result.currentIndex = 1;
            state = STATE.EXPECTING_RECORD;
            break;
          case STATE.EXPECTING_RECORD:
            while (binaryReader.hasAvailableBytes(SHP_RECORD_HEADER_SIZE)) {
              const recordHeaderView = binaryReader.getDataView(SHP_RECORD_HEADER_SIZE);
              const recordHeader = {
                recordNumber: recordHeaderView.getInt32(0, BIG_ENDIAN2),
                byteLength: recordHeaderView.getInt32(4, BIG_ENDIAN2) * 2,
                type: recordHeaderView.getInt32(8, LITTLE_ENDIAN3)
              };
              if (!binaryReader.hasAvailableBytes(recordHeader.byteLength - 4)) {
                binaryReader.rewind(SHP_RECORD_HEADER_SIZE);
                return state;
              }
              const invalidRecord = recordHeader.byteLength < 4 || recordHeader.type !== result.header.type || recordHeader.recordNumber !== result.currentIndex;
              if (invalidRecord) {
                binaryReader.rewind(SHP_RECORD_HEADER_SIZE - 4);
              } else {
                binaryReader.rewind(4);
                const recordView = binaryReader.getDataView(recordHeader.byteLength);
                const geometry = parseRecord(recordView, options);
                result.geometries.push(geometry);
                result.currentIndex++;
                result.progress.rows = result.currentIndex - 1;
              }
            }
            if (binaryReader.ended) {
              state = STATE.END;
            }
            return state;
          default:
            state = STATE.ERROR;
            result.error = `illegal parser state ${state}`;
            return state;
        }
      } catch (error) {
        state = STATE.ERROR;
        result.error = `SHP parsing failed: ${error?.message}`;
        return state;
      }
    }
  }

  // src/shp-loader.ts
  var VERSION = true ? "3.1.6" : "latest";
  var SHP_MAGIC_NUMBER2 = [0, 0, 39, 10];
  var SHPWorkerLoader = {
    name: "SHP",
    id: "shp",
    module: "shapefile",
    version: VERSION,
    worker: true,
    category: "geometry",
    extensions: ["shp"],
    mimeTypes: ["application/octet-stream"],
    tests: [new Uint8Array(SHP_MAGIC_NUMBER2).buffer],
    options: {
      shp: {
        _maxDimensions: 4
      }
    }
  };
  var SHPLoader = {
    ...SHPWorkerLoader,
    parse: async (arrayBuffer, options) => parseSHP(arrayBuffer, options),
    parseSync: parseSHP,
    parseInBatches: parseSHPInBatches
  };

  // ../worker-utils/src/lib/worker-utils/get-transfer-list.ts
  function getTransferList(object, recursive = true, transfers) {
    const transfersSet = transfers || new Set();
    if (!object) {
    } else if (isTransferable(object)) {
      transfersSet.add(object);
    } else if (isTransferable(object.buffer)) {
      transfersSet.add(object.buffer);
    } else if (ArrayBuffer.isView(object)) {
    } else if (recursive && typeof object === "object") {
      for (const key in object) {
        getTransferList(object[key], recursive, transfersSet);
      }
    }
    return transfers === void 0 ? Array.from(transfersSet) : [];
  }
  function isTransferable(object) {
    if (!object) {
      return false;
    }
    if (object instanceof ArrayBuffer) {
      return true;
    }
    if (typeof MessagePort !== "undefined" && object instanceof MessagePort) {
      return true;
    }
    if (typeof ImageBitmap !== "undefined" && object instanceof ImageBitmap) {
      return true;
    }
    if (typeof OffscreenCanvas !== "undefined" && object instanceof OffscreenCanvas) {
      return true;
    }
    return false;
  }

  // ../worker-utils/src/lib/worker-farm/worker-body.ts
  var onMessageWrapperMap = new Map();
  var WorkerBody = class {
    static set onmessage(onMessage) {
      self.onmessage = (message) => {
        if (!isKnownMessage(message)) {
          return;
        }
        const { type, payload } = message.data;
        onMessage(type, payload);
      };
    }
    static addEventListener(onMessage) {
      let onMessageWrapper = onMessageWrapperMap.get(onMessage);
      if (!onMessageWrapper) {
        onMessageWrapper = (message) => {
          if (!isKnownMessage(message)) {
            return;
          }
          const { type, payload } = message.data;
          onMessage(type, payload);
        };
      }
      self.addEventListener("message", onMessageWrapper);
    }
    static removeEventListener(onMessage) {
      const onMessageWrapper = onMessageWrapperMap.get(onMessage);
      onMessageWrapperMap.delete(onMessage);
      self.removeEventListener("message", onMessageWrapper);
    }
    static postMessage(type, payload) {
      if (self) {
        const data = { source: "loaders.gl", type, payload };
        const transferList = getTransferList(payload);
        self.postMessage(data, transferList);
      }
    }
  };
  function isKnownMessage(message) {
    const { type, data } = message;
    return type === "message" && data && typeof data.source === "string" && data.source.startsWith("loaders.gl");
  }

  // ../loader-utils/src/lib/worker-loader-utils/create-loader-worker.ts
  var requestId = 0;
  function createLoaderWorker(loader) {
    if (typeof self === "undefined") {
      return;
    }
    WorkerBody.onmessage = async (type, payload) => {
      switch (type) {
        case "process":
          try {
            const { input, options = {} } = payload;
            const result = await parseData({
              loader,
              arrayBuffer: input,
              options,
              context: {
                parse: parseOnMainThread
              }
            });
            WorkerBody.postMessage("done", { result });
          } catch (error) {
            const message = error instanceof Error ? error.message : "";
            WorkerBody.postMessage("error", { error: message });
          }
          break;
        default:
      }
    };
  }
  function parseOnMainThread(arrayBuffer, options) {
    return new Promise((resolve, reject) => {
      const id = requestId++;
      const onMessage = (type, payload2) => {
        if (payload2.id !== id) {
          return;
        }
        switch (type) {
          case "done":
            WorkerBody.removeEventListener(onMessage);
            resolve(payload2.result);
            break;
          case "error":
            WorkerBody.removeEventListener(onMessage);
            reject(payload2.error);
            break;
          default:
        }
      };
      WorkerBody.addEventListener(onMessage);
      const payload = { id, input: arrayBuffer, options };
      WorkerBody.postMessage("process", payload);
    });
  }
  async function parseData({ loader, arrayBuffer, options, context }) {
    let data;
    let parser;
    if (loader.parseSync || loader.parse) {
      data = arrayBuffer;
      parser = loader.parseSync || loader.parse;
    } else if (loader.parseTextSync) {
      const textDecoder = new TextDecoder();
      data = textDecoder.decode(arrayBuffer);
      parser = loader.parseTextSync;
    } else {
      throw new Error(`Could not load data with ${loader.name} loader`);
    }
    options = {
      ...options,
      modules: loader && loader.options && loader.options.modules || {},
      worker: false
    };
    return await parser(data, { ...options }, context, loader);
  }

  // src/workers/shp-worker.ts
  createLoaderWorker(SHPLoader);
})();
