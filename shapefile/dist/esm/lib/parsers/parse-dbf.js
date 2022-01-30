import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Schema, Field, Bool, Utf8, Float64, TimestampMillisecond } from '@loaders.gl/schema';
import BinaryChunkReader from '../streaming/binary-chunk-reader';
const LITTLE_ENDIAN = true;
const DBF_HEADER_SIZE = 32;
var STATE;

(function (STATE) {
  STATE[STATE["START"] = 0] = "START";
  STATE[STATE["FIELD_DESCRIPTORS"] = 1] = "FIELD_DESCRIPTORS";
  STATE[STATE["FIELD_PROPERTIES"] = 2] = "FIELD_PROPERTIES";
  STATE[STATE["END"] = 3] = "END";
  STATE[STATE["ERROR"] = 4] = "ERROR";
})(STATE || (STATE = {}));

class DBFParser {
  constructor(options) {
    _defineProperty(this, "binaryReader", new BinaryChunkReader());

    _defineProperty(this, "textDecoder", void 0);

    _defineProperty(this, "state", STATE.START);

    _defineProperty(this, "result", {
      data: []
    });

    this.textDecoder = new TextDecoder(options.encoding);
  }

  write(arrayBuffer) {
    this.binaryReader.write(arrayBuffer);
    this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
  }

  end() {
    this.binaryReader.end();
    this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);

    if (this.state !== STATE.END) {
      this.state = STATE.ERROR;
      this.result.error = 'DBF incomplete file';
    }
  }

}

export function parseDBF(arrayBuffer, options = {}) {
  const loaderOptions = options.dbf || {};
  const {
    encoding
  } = loaderOptions;
  const dbfParser = new DBFParser({
    encoding
  });
  dbfParser.write(arrayBuffer);
  dbfParser.end();
  const {
    data,
    schema
  } = dbfParser.result;

  switch (options.tables && options.tables.format) {
    case 'table':
      return {
        schema,
        rows: data
      };

    case 'rows':
    default:
      return data;
  }
}
export async function* parseDBFInBatches(asyncIterator, options = {}) {
  const loaderOptions = options.dbf || {};
  const {
    encoding
  } = loaderOptions;
  const parser = new DBFParser({
    encoding
  });
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
        case STATE.ERROR:
        case STATE.END:
          return state;

        case STATE.START:
          const dataView = binaryReader.getDataView(DBF_HEADER_SIZE, 'DBF header');

          if (!dataView) {
            return state;
          }

          result.dbfHeader = parseDBFHeader(dataView);
          result.progress = {
            bytesUsed: 0,
            rowsTotal: result.dbfHeader.nRecords,
            rows: 0
          };
          state = STATE.FIELD_DESCRIPTORS;
          break;

        case STATE.FIELD_DESCRIPTORS:
          const fieldDescriptorView = binaryReader.getDataView(result.dbfHeader.headerLength - DBF_HEADER_SIZE, 'DBF field descriptors');

          if (!fieldDescriptorView) {
            return state;
          }

          result.dbfFields = parseFieldDescriptors(fieldDescriptorView, textDecoder);
          result.schema = new Schema(result.dbfFields.map(dbfField => makeField(dbfField)));
          state = STATE.FIELD_PROPERTIES;
          binaryReader.skip(1);
          break;

        case STATE.FIELD_PROPERTIES:
          const {
            recordLength = 0,
            nRecords = 0
          } = (result === null || result === void 0 ? void 0 : result.dbfHeader) || {};

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

          state = STATE.END;
          break;

        default:
          state = STATE.ERROR;
          result.error = "illegal parser state ".concat(state);
          return state;
      }
    } catch (error) {
      state = STATE.ERROR;
      result.error = "DBF parsing failed: ".concat(error.message);
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
    const name = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, 11)).replace(/\u0000/g, '');
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
    case 'B':
      return parseNumber(text);

    case 'C':
      return parseCharacter(text);

    case 'F':
      return parseNumber(text);

    case 'N':
      return parseNumber(text);

    case 'O':
      return parseNumber(text);

    case 'D':
      return parseDate(text);

    case 'L':
      return parseBoolean(text);

    default:
      throw new Error('Unsupported data type');
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

function makeField({
  name,
  dataType,
  fieldLength,
  decimal
}) {
  switch (dataType) {
    case 'B':
      return new Field(name, new Float64(), true);

    case 'C':
      return new Field(name, new Utf8(), true);

    case 'F':
      return new Field(name, new Float64(), true);

    case 'N':
      return new Field(name, new Float64(), true);

    case 'O':
      return new Field(name, new Float64(), true);

    case 'D':
      return new Field(name, new TimestampMillisecond(), true);

    case 'L':
      return new Field(name, new Bool(), true);

    default:
      throw new Error('Unsupported data type');
  }
}
//# sourceMappingURL=parse-dbf.js.map