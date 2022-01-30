import type { SHXOutput } from './parse-shx';
import type { SHPHeader } from './parse-shp-header';
import type { LoaderContext } from '@loaders.gl/loader-utils';
interface ShapefileOutput {
    encoding?: string;
    prj?: string;
    shx?: SHXOutput;
    header: SHPHeader;
    data: object[];
}
/**
 * Parsing of file in batches
 *
 * @param asyncIterator
 * @param options
 * @param context
 */
export declare function parseShapefileInBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options?: any, context?: LoaderContext): AsyncIterable<ShapefileOutput>;
/**
 * Parse shapefile
 *
 * @param arrayBuffer
 * @param options
 * @param context
 * @returns output of shapefile
 */
export declare function parseShapefile(arrayBuffer: ArrayBuffer, options?: {
    [key: string]: any;
}, context?: LoaderContext): Promise<ShapefileOutput>;
/**
 *
 * @param options
 * @param context
 * @returns Promise
 */
export declare function loadShapefileSidecarFiles(options?: object, context?: LoaderContext): Promise<{
    shx?: SHXOutput;
    cpg?: string;
    prj?: string;
}>;
/**
 * Replace the extension at the end of a path.
 *
 * Matches the case of new extension with the case of the original file extension,
 * to increase the chance of finding files without firing off a request storm looking for various case combinations
 *
 * NOTE: Extensions can be both lower and uppercase
 * per spec, extensions should be lower case, but that doesn't mean they always are. See:
 * calvinmetcalf/shapefile-js#64, mapserver/mapserver#4712
 * https://trac.osgeo.org/mapserver/ticket/166
 */
export declare function replaceExtension(url: string, newExtension: string): string;
export {};
//# sourceMappingURL=parse-shapefile.d.ts.map