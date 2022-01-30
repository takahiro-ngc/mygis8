"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseRecord = parseRecord;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var LITTLE_ENDIAN = true;

function parseRecord(view, options) {
  var _ref = (options === null || options === void 0 ? void 0 : options.shp) || {},
      _maxDimensions = _ref._maxDimensions;

  var offset = 0;
  var type = view.getInt32(offset, LITTLE_ENDIAN);
  offset += Int32Array.BYTES_PER_ELEMENT;

  switch (type) {
    case 0:
      return parseNull();

    case 1:
      return parsePoint(view, offset, Math.min(2, _maxDimensions));

    case 3:
      return parsePoly(view, offset, Math.min(2, _maxDimensions), 'LineString');

    case 5:
      return parsePoly(view, offset, Math.min(2, _maxDimensions), 'Polygon');

    case 8:
      return parseMultiPoint(view, offset, Math.min(2, _maxDimensions));

    case 11:
      return parsePoint(view, offset, Math.min(4, _maxDimensions));

    case 13:
      return parsePoly(view, offset, Math.min(4, _maxDimensions), 'LineString');

    case 15:
      return parsePoly(view, offset, Math.min(4, _maxDimensions), 'Polygon');

    case 18:
      return parseMultiPoint(view, offset, Math.min(4, _maxDimensions));

    case 21:
      return parsePoint(view, offset, Math.min(3, _maxDimensions));

    case 23:
      return parsePoly(view, offset, Math.min(3, _maxDimensions), 'LineString');

    case 25:
      return parsePoly(view, offset, Math.min(3, _maxDimensions), 'Polygon');

    case 28:
      return parseMultiPoint(view, offset, Math.min(3, _maxDimensions));

    default:
      throw new Error("unsupported shape type: ".concat(type));
  }
}

function parseNull() {
  return null;
}

function parsePoint(view, offset, dim) {
  var positions;

  var _parsePositions = parsePositions(view, offset, 1, dim);

  var _parsePositions2 = (0, _slicedToArray2.default)(_parsePositions, 2);

  positions = _parsePositions2[0];
  offset = _parsePositions2[1];
  return {
    positions: {
      value: positions,
      size: dim
    },
    type: 'Point'
  };
}

function parseMultiPoint(view, offset, dim) {
  offset += 4 * Float64Array.BYTES_PER_ELEMENT;
  var nPoints = view.getInt32(offset, LITTLE_ENDIAN);
  offset += Int32Array.BYTES_PER_ELEMENT;
  var xyPositions = null;
  var mPositions = null;
  var zPositions = null;

  var _parsePositions3 = parsePositions(view, offset, nPoints, 2);

  var _parsePositions4 = (0, _slicedToArray2.default)(_parsePositions3, 2);

  xyPositions = _parsePositions4[0];
  offset = _parsePositions4[1];

  if (dim === 4) {
    offset += 2 * Float64Array.BYTES_PER_ELEMENT;

    var _parsePositions5 = parsePositions(view, offset, nPoints, 1);

    var _parsePositions6 = (0, _slicedToArray2.default)(_parsePositions5, 2);

    zPositions = _parsePositions6[0];
    offset = _parsePositions6[1];
  }

  if (dim >= 3) {
    offset += 2 * Float64Array.BYTES_PER_ELEMENT;

    var _parsePositions7 = parsePositions(view, offset, nPoints, 1);

    var _parsePositions8 = (0, _slicedToArray2.default)(_parsePositions7, 2);

    mPositions = _parsePositions8[0];
    offset = _parsePositions8[1];
  }

  var positions = concatPositions(xyPositions, mPositions, zPositions);
  return {
    positions: {
      value: positions,
      size: dim
    },
    type: 'Point'
  };
}

function parsePoly(view, offset, dim, type) {
  offset += 4 * Float64Array.BYTES_PER_ELEMENT;
  var nParts = view.getInt32(offset, LITTLE_ENDIAN);
  offset += Int32Array.BYTES_PER_ELEMENT;
  var nPoints = view.getInt32(offset, LITTLE_ENDIAN);
  offset += Int32Array.BYTES_PER_ELEMENT;
  var bufferOffset = view.byteOffset + offset;
  var bufferLength = nParts * Int32Array.BYTES_PER_ELEMENT;
  var ringIndices = new Int32Array(nParts + 1);
  ringIndices.set(new Int32Array(view.buffer.slice(bufferOffset, bufferOffset + bufferLength)));
  ringIndices[nParts] = nPoints;
  offset += nParts * Int32Array.BYTES_PER_ELEMENT;
  var xyPositions = null;
  var mPositions = null;
  var zPositions = null;

  var _parsePositions9 = parsePositions(view, offset, nPoints, 2);

  var _parsePositions10 = (0, _slicedToArray2.default)(_parsePositions9, 2);

  xyPositions = _parsePositions10[0];
  offset = _parsePositions10[1];

  if (dim === 4) {
    offset += 2 * Float64Array.BYTES_PER_ELEMENT;

    var _parsePositions11 = parsePositions(view, offset, nPoints, 1);

    var _parsePositions12 = (0, _slicedToArray2.default)(_parsePositions11, 2);

    zPositions = _parsePositions12[0];
    offset = _parsePositions12[1];
  }

  if (dim >= 3) {
    offset += 2 * Float64Array.BYTES_PER_ELEMENT;

    var _parsePositions13 = parsePositions(view, offset, nPoints, 1);

    var _parsePositions14 = (0, _slicedToArray2.default)(_parsePositions13, 2);

    mPositions = _parsePositions14[0];
    offset = _parsePositions14[1];
  }

  var positions = concatPositions(xyPositions, mPositions, zPositions);

  if (type === 'LineString') {
    return {
      type: type,
      positions: {
        value: positions,
        size: dim
      },
      pathIndices: {
        value: ringIndices,
        size: 1
      }
    };
  }

  var polygonIndices = [];

  for (var i = 1; i < ringIndices.length; i++) {
    var startRingIndex = ringIndices[i - 1];
    var endRingIndex = ringIndices[i];
    var ring = xyPositions.subarray(startRingIndex * 2, endRingIndex * 2);
    var sign = getWindingDirection(ring);

    if (sign > 0) {
      polygonIndices.push(startRingIndex);
    }
  }

  polygonIndices.push(nPoints);
  return {
    type: type,
    positions: {
      value: positions,
      size: dim
    },
    primitivePolygonIndices: {
      value: ringIndices,
      size: 1
    },
    polygonIndices: {
      value: new Uint32Array(polygonIndices),
      size: 1
    }
  };
}

function parsePositions(view, offset, nPoints, dim) {
  var bufferOffset = view.byteOffset + offset;
  var bufferLength = nPoints * dim * Float64Array.BYTES_PER_ELEMENT;
  return [new Float64Array(view.buffer.slice(bufferOffset, bufferOffset + bufferLength)), offset + bufferLength];
}

function concatPositions(xyPositions, mPositions, zPositions) {
  if (!(mPositions || zPositions)) {
    return xyPositions;
  }

  var arrayLength = xyPositions.length;
  var nDim = 2;

  if (zPositions && zPositions.length) {
    arrayLength += zPositions.length;
    nDim++;
  }

  if (mPositions && mPositions.length) {
    arrayLength += mPositions.length;
    nDim++;
  }

  var positions = new Float64Array(arrayLength);

  for (var i = 0; i < xyPositions.length / 2; i++) {
    positions[nDim * i] = xyPositions[i * 2];
    positions[nDim * i + 1] = xyPositions[i * 2 + 1];
  }

  if (zPositions && zPositions.length) {
    for (var _i = 0; _i < zPositions.length; _i++) {
      positions[nDim * _i + 2] = zPositions[_i];
    }
  }

  if (mPositions && mPositions.length) {
    for (var _i2 = 0; _i2 < mPositions.length; _i2++) {
      positions[nDim * _i2 + (nDim - 1)] = mPositions[_i2];
    }
  }

  return positions;
}

function getWindingDirection(positions) {
  return Math.sign(getSignedArea(positions));
}

function getSignedArea(positions) {
  var area = 0;
  var nCoords = positions.length / 2 - 1;

  for (var i = 0; i < nCoords; i++) {
    area += (positions[i * 2] + positions[(i + 1) * 2]) * (positions[i * 2 + 1] - positions[(i + 1) * 2 + 1]);
  }

  return area / 2;
}
//# sourceMappingURL=parse-shp-geometry.js.map