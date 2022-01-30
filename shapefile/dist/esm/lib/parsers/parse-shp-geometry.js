const LITTLE_ENDIAN = true;
export function parseRecord(view, options) {
  const {
    _maxDimensions
  } = (options === null || options === void 0 ? void 0 : options.shp) || {};
  let offset = 0;
  const type = view.getInt32(offset, LITTLE_ENDIAN);
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
  let positions;
  [positions, offset] = parsePositions(view, offset, 1, dim);
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
  const nPoints = view.getInt32(offset, LITTLE_ENDIAN);
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
    positions: {
      value: positions,
      size: dim
    },
    type: 'Point'
  };
}

function parsePoly(view, offset, dim, type) {
  offset += 4 * Float64Array.BYTES_PER_ELEMENT;
  const nParts = view.getInt32(offset, LITTLE_ENDIAN);
  offset += Int32Array.BYTES_PER_ELEMENT;
  const nPoints = view.getInt32(offset, LITTLE_ENDIAN);
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

  if (type === 'LineString') {
    return {
      type,
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
  const bufferOffset = view.byteOffset + offset;
  const bufferLength = nPoints * dim * Float64Array.BYTES_PER_ELEMENT;
  return [new Float64Array(view.buffer.slice(bufferOffset, bufferOffset + bufferLength)), offset + bufferLength];
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
//# sourceMappingURL=parse-shp-geometry.js.map