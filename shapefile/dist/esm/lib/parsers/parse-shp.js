import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import BinaryChunkReader from '../streaming/binary-chunk-reader';
import { parseSHPHeader } from './parse-shp-header';
import { parseRecord } from './parse-shp-geometry';
const LITTLE_ENDIAN = true;
const BIG_ENDIAN = false;
const SHP_HEADER_SIZE = 100;
const SHP_RECORD_HEADER_SIZE = 12;
const STATE = {
  EXPECTING_HEADER: 0,
  EXPECTING_RECORD: 1,
  END: 2,
  ERROR: 3
};

class SHPParser {
  constructor(options) {
    _defineProperty(this, "options", {});

    _defineProperty(this, "binaryReader", new BinaryChunkReader({
      maxRewindBytes: SHP_RECORD_HEADER_SIZE
    }));

    _defineProperty(this, "state", STATE.EXPECTING_HEADER);

    _defineProperty(this, "result", {
      geometries: []
    });

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
      this.result.error = 'SHP incomplete file';
    }
  }

}

export function parseSHP(arrayBuffer, options) {
  const shpParser = new SHPParser(options);
  shpParser.write(arrayBuffer);
  shpParser.end();
  return shpParser.result;
}
export async function* parseSHPInBatches(asyncIterator, options) {
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
              recordNumber: recordHeaderView.getInt32(0, BIG_ENDIAN),
              byteLength: recordHeaderView.getInt32(4, BIG_ENDIAN) * 2,
              type: recordHeaderView.getInt32(8, LITTLE_ENDIAN)
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
          result.error = "illegal parser state ".concat(state);
          return state;
      }
    } catch (error) {
      state = STATE.ERROR;
      result.error = "SHP parsing failed: ".concat(error === null || error === void 0 ? void 0 : error.message);
      return state;
    }
  }
}
//# sourceMappingURL=parse-shp.js.map