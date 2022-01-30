"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShx = void 0;
const parse_shp_header_1 = require("./parse-shp-header");
const SHX_HEADER_SIZE = 100;
const BIG_ENDIAN = false;
/**
 * @param arrayBuffer
 * @returns SHXOutput
 */
function parseShx(arrayBuffer) {
    // SHX header is identical to SHP Header
    const headerView = new DataView(arrayBuffer, 0, SHX_HEADER_SIZE);
    const header = (0, parse_shp_header_1.parseSHPHeader)(headerView);
    const contentLength = header.length - SHX_HEADER_SIZE;
    const contentView = new DataView(arrayBuffer, SHX_HEADER_SIZE, contentLength);
    const offsets = new Int32Array(contentLength);
    const lengths = new Int32Array(contentLength);
    for (let i = 0; i < contentLength / 8; i++) {
        offsets[i] = contentView.getInt32(i * 8, BIG_ENDIAN);
        lengths[i] = contentView.getInt32(i * 8 + 4, BIG_ENDIAN);
    }
    return {
        offsets,
        lengths
    };
}
exports.parseShx = parseShx;
