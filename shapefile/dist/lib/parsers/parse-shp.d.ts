import type { BinaryGeometry } from '@loaders.gl/schema';
export declare function parseSHP(arrayBuffer: ArrayBuffer, options?: object): BinaryGeometry[];
/**
 * @param asyncIterator
 * @param options
 * @returns
 */
export declare function parseSHPInBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options?: object): AsyncIterable<BinaryGeometry | object>;
//# sourceMappingURL=parse-shp.d.ts.map