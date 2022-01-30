export interface SHPHeader {
    /** SHP Magic number */
    magic: number;
    /** Number of bytes in file */
    length: number;
    version: number;
    type: number;
    bbox: {
        minX: number;
        minY: number;
        minZ: number;
        minM: number;
        maxX: number;
        maxY: number;
        maxZ: number;
        maxM: number;
    };
}
/**
 * Extract the binary header
 * Note: Also used by SHX
 * @param headerView
 * @returns SHPHeader
 */
export declare function parseSHPHeader(headerView: DataView): SHPHeader;
//# sourceMappingURL=parse-shp-header.d.ts.map