import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import { parseShapefile, parseShapefileInBatches } from './lib/parsers/parse-shapefile';
/**
 * Shapefile loader
 * @note Shapefile is multifile format and requires providing additional files
 */
export declare const ShapefileLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    category: string;
    extensions: string[];
    mimeTypes: string[];
    tests: ArrayBufferLike[];
    options: {
        shapefile: {};
        shp: {
            _maxDimensions: number;
        };
    };
    parse: typeof parseShapefile;
    parseInBatches: typeof parseShapefileInBatches;
};
export declare const _typecheckShapefileLoader: LoaderWithParser;
//# sourceMappingURL=shapefile-loader.d.ts.map