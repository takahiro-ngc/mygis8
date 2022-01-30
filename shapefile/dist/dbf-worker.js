(() => {
  // ../schema/src/lib/utils/assert.ts
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "loader assertion failed.");
    }
  }

  // ../schema/src/lib/schema/impl/schema.ts
  var Schema = class {
    constructor(fields, metadata) {
      assert(Array.isArray(fields));
      checkNames(fields);
      this.fields = fields;
      this.metadata = metadata || new Map();
    }
    compareTo(other) {
      if (this.metadata !== other.metadata) {
        return false;
      }
      if (this.fields.length !== other.fields.length) {
        return false;
      }
      for (let i = 0; i < this.fields.length; ++i) {
        if (!this.fields[i].compareTo(other.fields[i])) {
          return false;
        }
      }
      return true;
    }
    select(...columnNames) {
      const nameMap = Object.create(null);
      for (const name of columnNames) {
        nameMap[name] = true;
      }
      const selectedFields = this.fields.filter((field) => nameMap[field.name]);
      return new Schema(selectedFields, this.metadata);
    }
    selectAt(...columnIndices) {
      const selectedFields = columnIndices.map((index) => this.fields[index]).filter(Boolean);
      return new Schema(selectedFields, this.metadata);
    }
    assign(schemaOrFields) {
      let fields;
      let metadata = this.metadata;
      if (schemaOrFields instanceof Schema) {
        const otherSchema = schemaOrFields;
        fields = otherSchema.fields;
        metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherSchema.metadata);
      } else {
        fields = schemaOrFields;
      }
      const fieldMap = Object.create(null);
      for (const field of this.fields) {
        fieldMap[field.name] = field;
      }
      for (const field of fields) {
        fieldMap[field.name] = field;
      }
      const mergedFields = Object.values(fieldMap);
      return new Schema(mergedFields, metadata);
    }
  };
  function checkNames(fields) {
    const usedNames = {};
    for (const field of fields) {
      if (usedNames[field.name]) {
        console.warn("Schema: duplicated field name", field.name, field);
      }
      usedNames[field.name] = true;
    }
  }
  function mergeMaps(m1, m2) {
    return new Map([...m1 || new Map(), ...m2 || new Map()]);
  }

  // ../schema/src/lib/schema/impl/field.ts
  var Field = class {
    constructor(name, type, nullable = false, metadata = new Map()) {
      this.name = name;
      this.type = type;
      this.nullable = nullable;
      this.metadata = metadata;
    }
    get typeId() {
      return this.type && this.type.typeId;
    }
    clone() {
      return new Field(this.name, this.type, this.nullable, this.metadata);
    }
    compareTo(other) {
      return this.name === other.name && this.type === other.type && this.nullable === other.nullable && this.metadata === other.metadata;
    }
    toString() {
      return `${this.type}${this.nullable ? ", nullable" : ""}${this.metadata ? `, metadata: ${this.metadata}` : ""}`;
    }
  };

  // ../schema/src/lib/schema/impl/enum.ts
  var Type;
  (function(Type2) {
    Type2[Type2["NONE"] = 0] = "NONE";
    Type2[Type2["Null"] = 1] = "Null";
    Type2[Type2["Int"] = 2] = "Int";
    Type2[Type2["Float"] = 3] = "Float";
    Type2[Type2["Binary"] = 4] = "Binary";
    Type2[Type2["Utf8"] = 5] = "Utf8";
    Type2[Type2["Bool"] = 6] = "Bool";
    Type2[Type2["Decimal"] = 7] = "Decimal";
    Type2[Type2["Date"] = 8] = "Date";
    Type2[Type2["Time"] = 9] = "Time";
    Type2[Type2["Timestamp"] = 10] = "Timestamp";
    Type2[Type2["Interval"] = 11] = "Interval";
    Type2[Type2["List"] = 12] = "List";
    Type2[Type2["Struct"] = 13] = "Struct";
    Type2[Type2["Union"] = 14] = "Union";
    Type2[Type2["FixedSizeBinary"] = 15] = "FixedSizeBinary";
    Type2[Type2["FixedSizeList"] = 16] = "FixedSizeList";
    Type2[Type2["Map"] = 17] = "Map";
    Type2[Type2["Dictionary"] = -1] = "Dictionary";
    Type2[Type2["Int8"] = -2] = "Int8";
    Type2[Type2["Int16"] = -3] = "Int16";
    Type2[Type2["Int32"] = -4] = "Int32";
    Type2[Type2["Int64"] = -5] = "Int64";
    Type2[Type2["Uint8"] = -6] = "Uint8";
    Type2[Type2["Uint16"] = -7] = "Uint16";
    Type2[Type2["Uint32"] = -8] = "Uint32";
    Type2[Type2["Uint64"] = -9] = "Uint64";
    Type2[Type2["Float16"] = -10] = "Float16";
    Type2[Type2["Float32"] = -11] = "Float32";
    Type2[Type2["Float64"] = -12] = "Float64";
    Type2[Type2["DateDay"] = -13] = "DateDay";
    Type2[Type2["DateMillisecond"] = -14] = "DateMillisecond";
    Type2[Type2["TimestampSecond"] = -15] = "TimestampSecond";
    Type2[Type2["TimestampMillisecond"] = -16] = "TimestampMillisecond";
    Type2[Type2["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
    Type2[Type2["TimestampNanosecond"] = -18] = "TimestampNanosecond";
    Type2[Type2["TimeSecond"] = -19] = "TimeSecond";
    Type2[Type2["TimeMillisecond"] = -20] = "TimeMillisecond";
    Type2[Type2["TimeMicrosecond"] = -21] = "TimeMicrosecond";
    Type2[Type2["TimeNanosecond"] = -22] = "TimeNanosecond";
    Type2[Type2["DenseUnion"] = -23] = "DenseUnion";
    Type2[Type2["SparseUnion"] = -24] = "SparseUnion";
    Type2[Type2["IntervalDayTime"] = -25] = "IntervalDayTime";
    Type2[Type2["IntervalYearMonth"] = -26] = "IntervalYearMonth";
  })(Type || (Type = {}));

  // ../schema/src/lib/schema/impl/type.ts
  var DataType = class {
    static isNull(x) {
      return x && x.typeId === Type.Null;
    }
    static isInt(x) {
      return x && x.typeId === Type.Int;
    }
    static isFloat(x) {
      return x && x.typeId === Type.Float;
    }
    static isBinary(x) {
      return x && x.typeId === Type.Binary;
    }
    static isUtf8(x) {
      return x && x.typeId === Type.Utf8;
    }
    static isBool(x) {
      return x && x.typeId === Type.Bool;
    }
    static isDecimal(x) {
      return x && x.typeId === Type.Decimal;
    }
    static isDate(x) {
      return x && x.typeId === Type.Date;
    }
    static isTime(x) {
      return x && x.typeId === Type.Time;
    }
    static isTimestamp(x) {
      return x && x.typeId === Type.Timestamp;
    }
    static isInterval(x) {
      return x && x.typeId === Type.Interval;
    }
    static isList(x) {
      return x && x.typeId === Type.List;
    }
    static isStruct(x) {
      return x && x.typeId === Type.Struct;
    }
    static isUnion(x) {
      return x && x.typeId === Type.Union;
    }
    static isFixedSizeBinary(x) {
      return x && x.typeId === Type.FixedSizeBinary;
    }
    static isFixedSizeList(x) {
      return x && x.typeId === Type.FixedSizeList;
    }
    static isMap(x) {
      return x && x.typeId === Type.Map;
    }
    static isDictionary(x) {
      return x && x.typeId === Type.Dictionary;
    }
    get typeId() {
      return Type.NONE;
    }
    compareTo(other) {
      return this === other;
    }
  };
  var Null = class extends DataType {
    get typeId() {
      return Type.Null;
    }
    get [Symbol.toStringTag]() {
      return "Null";
    }
    toString() {
      return "Null";
    }
  };
  var Bool = class extends DataType {
    get typeId() {
      return Type.Bool;
    }
    get [Symbol.toStringTag]() {
      return "Bool";
    }
    toString() {
      return "Bool";
    }
  };
  var Int = class extends DataType {
    constructor(isSigned, bitWidth) {
      super();
      this.isSigned = isSigned;
      this.bitWidth = bitWidth;
    }
    get typeId() {
      return Type.Int;
    }
    get [Symbol.toStringTag]() {
      return "Int";
    }
    toString() {
      return `${this.isSigned ? "I" : "Ui"}nt${this.bitWidth}`;
    }
  };
  var Precision = {
    HALF: 16,
    SINGLE: 32,
    DOUBLE: 64
  };
  var Float = class extends DataType {
    constructor(precision) {
      super();
      this.precision = precision;
    }
    get typeId() {
      return Type.Float;
    }
    get [Symbol.toStringTag]() {
      return "Float";
    }
    toString() {
      return `Float${this.precision}`;
    }
  };
  var Float64 = class extends Float {
    constructor() {
      super(Precision.DOUBLE);
    }
  };
  var Binary = class extends DataType {
    constructor() {
      super();
    }
    get typeId() {
      return Type.Binary;
    }
    toString() {
      return "Binary";
    }
    get [Symbol.toStringTag]() {
      return "Binary";
    }
  };
  var Utf8 = class extends DataType {
    get typeId() {
      return Type.Utf8;
    }
    get [Symbol.toStringTag]() {
      return "Utf8";
    }
    toString() {
      return "Utf8";
    }
  };
  var DateUnit = {
    DAY: 0,
    MILLISECOND: 1
  };
  var Date2 = class extends DataType {
    constructor(unit) {
      super();
      this.unit = unit;
    }
    get typeId() {
      return Type.Date;
    }
    get [Symbol.toStringTag]() {
      return "Date";
    }
    toString() {
      return `Date${(this.unit + 1) * 32}<${DateUnit[this.unit]}>`;
    }
  };
  var TimeUnit = {
    SECOND: 1,
    MILLISECOND: 1e3,
    MICROSECOND: 1e6,
    NANOSECOND: 1e9
  };
  var Time = class extends DataType {
    constructor(unit, bitWidth) {
      super();
      this.unit = unit;
      this.bitWidth = bitWidth;
    }
    get typeId() {
      return Type.Time;
    }
    toString() {
      return `Time${this.bitWidth}<${TimeUnit[this.unit]}>`;
    }
    get [Symbol.toStringTag]() {
      return "Time";
    }
  };
  var Timestamp = class extends DataType {
    constructor(unit, timezone = null) {
      super();
      this.unit = unit;
      this.timezone = timezone;
    }
    get typeId() {
      return Type.Timestamp;
    }
    get [Symbol.toStringTag]() {
      return "Timestamp";
    }
    toString() {
      return `Timestamp<${TimeUnit[this.unit]}${this.timezone ? `, ${this.timezone}` : ""}>`;
    }
  };
  var TimestampMillisecond = class extends Timestamp {
    constructor(timezone = null) {
      super(TimeUnit.MILLISECOND, timezone);
    }
  };
  var IntervalUnit = {
    DAY_TIME: 0,
    YEAR_MONTH: 1
  };
  var Interval = class extends DataType {
    constructor(unit) {
      super();
      this.unit = unit;
    }
    get typeId() {
      return Type.Interval;
    }
    get [Symbol.toStringTag]() {
      return "Interval";
    }
    toString() {
      return `Interval<${IntervalUnit[this.unit]}>`;
    }
  };
  var FixedSizeList = class extends DataType {
    constructor(listSize, child) {
      super();
      this.listSize = listSize;
      this.children = [child];
    }
    get typeId() {
      return Type.FixedSizeList;
    }
    get valueType() {
      return this.children[0].type;
    }
    get valueField() {
      return this.children[0];
    }
    get [Symbol.toStringTag]() {
      return "FixedSizeList";
    }
    toString() {
      return `FixedSizeList[${this.listSize}]<${this.valueType}>`;
    }
  };
  var Struct = class extends DataType {
    constructor(children) {
      super();
      this.children = children;
    }
    get typeId() {
      return Type.Struct;
    }
    toString() {
      return `Struct<{${this.children.map((f) => `${f.name}:${f.type}`).join(", ")}}>`;
    }
    get [Symbol.toStringTag]() {
      return "Struct";
    }
  };

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

  // src/lib/parsers/parse-dbf.ts
  var LITTLE_ENDIAN = true;
  var DBF_HEADER_SIZE = 32;
  var STATE;
  (function(STATE2) {
    STATE2[STATE2["START"] = 0] = "START";
    STATE2[STATE2["FIELD_DESCRIPTORS"] = 1] = "FIELD_DESCRIPTORS";
    STATE2[STATE2["FIELD_PROPERTIES"] = 2] = "FIELD_PROPERTIES";
    STATE2[STATE2["END"] = 3] = "END";
    STATE2[STATE2["ERROR"] = 4] = "ERROR";
  })(STATE || (STATE = {}));
  var DBFParser = class {
    constructor(options) {
      this.binaryReader = new BinaryChunkReader();
      this.state = 0;
      this.result = {
        data: []
      };
      this.textDecoder = new TextDecoder(options.encoding);
    }
    write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
    }
    end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
      if (this.state !== 3) {
        this.state = 4;
        this.result.error = "DBF incomplete file";
      }
    }
  };
  function parseDBF(arrayBuffer, options = {}) {
    const loaderOptions = options.dbf || {};
    const { encoding } = loaderOptions;
    const dbfParser = new DBFParser({ encoding });
    dbfParser.write(arrayBuffer);
    dbfParser.end();
    const { data, schema } = dbfParser.result;
    switch (options.tables && options.tables.format) {
      case "table":
        return { schema, rows: data };
      case "rows":
      default:
        return data;
    }
  }
  async function* parseDBFInBatches(asyncIterator, options = {}) {
    const loaderOptions = options.dbf || {};
    const { encoding } = loaderOptions;
    const parser = new DBFParser({ encoding });
    let headerReturned = false;
    for await (const arrayBuffer of asyncIterator) {
      parser.write(arrayBuffer);
      if (!headerReturned && parser.result.dbfHeader) {
        headerReturned = true;
        yield parser.result.dbfHeader;
      }
      if (parser.result.data.length > 0) {
        yield parser.result.data;
        parser.result.data = [];
      }
    }
    parser.end();
    if (parser.result.data.length > 0) {
      yield parser.result.data;
    }
  }
  function parseState(state, result, binaryReader, textDecoder) {
    while (true) {
      try {
        switch (state) {
          case 4:
          case 3:
            return state;
          case 0:
            const dataView = binaryReader.getDataView(DBF_HEADER_SIZE, "DBF header");
            if (!dataView) {
              return state;
            }
            result.dbfHeader = parseDBFHeader(dataView);
            result.progress = {
              bytesUsed: 0,
              rowsTotal: result.dbfHeader.nRecords,
              rows: 0
            };
            state = 1;
            break;
          case 1:
            const fieldDescriptorView = binaryReader.getDataView(result.dbfHeader.headerLength - DBF_HEADER_SIZE, "DBF field descriptors");
            if (!fieldDescriptorView) {
              return state;
            }
            result.dbfFields = parseFieldDescriptors(fieldDescriptorView, textDecoder);
            result.schema = new Schema(result.dbfFields.map((dbfField) => makeField(dbfField)));
            state = 2;
            binaryReader.skip(1);
            break;
          case 2:
            const { recordLength = 0, nRecords = 0 } = result?.dbfHeader || {};
            while (result.data.length < nRecords) {
              const recordView = binaryReader.getDataView(recordLength - 1);
              if (!recordView) {
                return state;
              }
              binaryReader.skip(1);
              const row = parseRow(recordView, result.dbfFields, textDecoder);
              result.data.push(row);
              result.progress.rows = result.data.length;
            }
            state = 3;
            break;
          default:
            state = 4;
            result.error = `illegal parser state ${state}`;
            return state;
        }
      } catch (error) {
        state = 4;
        result.error = `DBF parsing failed: ${error.message}`;
        return state;
      }
    }
  }
  function parseDBFHeader(headerView) {
    return {
      year: headerView.getUint8(1) + 1900,
      month: headerView.getUint8(2),
      day: headerView.getUint8(3),
      nRecords: headerView.getUint32(4, LITTLE_ENDIAN),
      headerLength: headerView.getUint16(8, LITTLE_ENDIAN),
      recordLength: headerView.getUint16(10, LITTLE_ENDIAN),
      languageDriver: headerView.getUint8(29)
    };
  }
  function parseFieldDescriptors(view, textDecoder) {
    const nFields = (view.byteLength - 1) / 32;
    const fields = [];
    let offset = 0;
    for (let i = 0; i < nFields; i++) {
      const name = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, 11)).replace(/\u0000/g, "");
      fields.push({
        name,
        dataType: String.fromCharCode(view.getUint8(offset + 11)),
        fieldLength: view.getUint8(offset + 16),
        decimal: view.getUint8(offset + 17)
      });
      offset += 32;
    }
    return fields;
  }
  function parseRow(view, fields, textDecoder) {
    const out = {};
    let offset = 0;
    for (const field of fields) {
      const text = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, field.fieldLength));
      out[field.name] = parseField(text, field.dataType);
      offset += field.fieldLength;
    }
    return out;
  }
  function parseField(text, dataType) {
    switch (dataType) {
      case "B":
        return parseNumber(text);
      case "C":
        return parseCharacter(text);
      case "F":
        return parseNumber(text);
      case "N":
        return parseNumber(text);
      case "O":
        return parseNumber(text);
      case "D":
        return parseDate(text);
      case "L":
        return parseBoolean(text);
      default:
        throw new Error("Unsupported data type");
    }
  }
  function parseDate(str) {
    return Date.UTC(str.slice(0, 4), parseInt(str.slice(4, 6), 10) - 1, str.slice(6, 8));
  }
  function parseBoolean(value) {
    return /^[nf]$/i.test(value) ? false : /^[yt]$/i.test(value) ? true : null;
  }
  function parseNumber(text) {
    const number = parseFloat(text);
    return isNaN(number) ? null : number;
  }
  function parseCharacter(text) {
    return text.trim() || null;
  }
  function makeField({ name, dataType, fieldLength, decimal }) {
    switch (dataType) {
      case "B":
        return new Field(name, new Float64(), true);
      case "C":
        return new Field(name, new Utf8(), true);
      case "F":
        return new Field(name, new Float64(), true);
      case "N":
        return new Field(name, new Float64(), true);
      case "O":
        return new Field(name, new Float64(), true);
      case "D":
        return new Field(name, new TimestampMillisecond(), true);
      case "L":
        return new Field(name, new Bool(), true);
      default:
        throw new Error("Unsupported data type");
    }
  }

  // src/dbf-loader.ts
  var VERSION = true ? "3.1.6" : "latest";
  var DBFWorkerLoader = {
    name: "DBF",
    id: "dbf",
    module: "shapefile",
    version: VERSION,
    worker: true,
    category: "table",
    extensions: ["dbf"],
    mimeTypes: ["application/x-dbf"],
    options: {
      dbf: {
        encoding: "latin1"
      }
    }
  };
  var DBFLoader = {
    ...DBFWorkerLoader,
    parse: async (arrayBuffer, options) => parseDBF(arrayBuffer, options),
    parseSync: parseDBF,
    parseInBatches: parseDBFInBatches
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

  // src/workers/dbf-worker.ts
  createLoaderWorker(DBFLoader);
})();
