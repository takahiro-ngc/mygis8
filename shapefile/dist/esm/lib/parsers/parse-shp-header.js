const LITTLE_ENDIAN = true;
const BIG_ENDIAN = false;
const SHP_MAGIC_NUMBER = 0x0000270a;
export function parseSHPHeader(headerView) {
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
    console.error("SHP file: bad magic number ".concat(header.magic));
  }

  if (header.version !== 1000) {
    console.error("SHP file: bad version ".concat(header.version));
  }

  return header;
}
//# sourceMappingURL=parse-shp-header.js.map