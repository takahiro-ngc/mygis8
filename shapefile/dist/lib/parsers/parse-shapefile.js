"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceExtension = exports.loadShapefileSidecarFiles = exports.parseShapefile = exports.parseShapefileInBatches = void 0;
const gis_1 = require("@loaders.gl/gis");
const proj4_1 = require("@math.gl/proj4");
const parse_shx_1 = require("./parse-shx");
const zip_batch_iterators_1 = require("../streaming/zip-batch-iterators");
const shp_loader_1 = require("../../shp-loader");
const dbf_loader_1 = require("../../dbf-loader");
/**
 * Parsing of file in batches
 *
 * @param asyncIterator
 * @param options
 * @param context
 */
// eslint-disable-next-line max-statements, complexity
async function* parseShapefileInBatches(asyncIterator, options, context) {
    const { reproject = false, _targetCrs = 'WGS84' } = options?.gis || {};
    const { shx, cpg, prj } = await loadShapefileSidecarFiles(options, context);
    // parse geometries
    // @ts-ignore context must be defined
    const shapeIterable = await context.parseInBatches(asyncIterator, shp_loader_1.SHPLoader, options);
    // parse properties
    let propertyIterable;
    // @ts-ignore context must be defined
    const dbfResponse = await context.fetch(replaceExtension(context?.url || '', 'dbf'));
    if (dbfResponse.ok) {
        // @ts-ignore context must be defined
        propertyIterable = await context.parseInBatches(dbfResponse, dbf_loader_1.DBFLoader, {
            ...options,
            dbf: { encoding: cpg || 'latin1' }
        });
    }
    // When `options.metadata` is `true`, there's an extra initial `metadata`
    // object before the iterator starts. zipBatchIterators expects to receive
    // batches of Array objects, and will fail with non-iterable batches, so it's
    // important to skip over the first batch.
    let shapeHeader = (await shapeIterable.next()).value;
    if (shapeHeader && shapeHeader.batchType === 'metadata') {
        shapeHeader = (await shapeIterable.next()).value;
    }
    let dbfHeader = {};
    if (propertyIterable) {
        dbfHeader = (await propertyIterable.next()).value;
        if (dbfHeader && dbfHeader.batchType === 'metadata') {
            dbfHeader = (await propertyIterable.next()).value;
        }
    }
    let iterator;
    if (propertyIterable) {
        iterator = (0, zip_batch_iterators_1.zipBatchIterators)(shapeIterable, propertyIterable);
    }
    else {
        iterator = shapeIterable;
    }
    for await (const item of iterator) {
        let geometries;
        let properties;
        if (!propertyIterable) {
            geometries = item;
        }
        else {
            [geometries, properties] = item;
        }
        const geojsonGeometries = parseGeometries(geometries);
        let features = joinProperties(geojsonGeometries, properties);
        if (reproject) {
            // @ts-ignore
            features = reprojectFeatures(features, prj, _targetCrs);
        }
        yield {
            encoding: cpg,
            prj,
            shx,
            header: shapeHeader,
            data: features
        };
    }
}
exports.parseShapefileInBatches = parseShapefileInBatches;
/**
 * Parse shapefile
 *
 * @param arrayBuffer
 * @param options
 * @param context
 * @returns output of shapefile
 */
async function parseShapefile(arrayBuffer, options, context) {
    const { reproject = false, _targetCrs = 'WGS84' } = options?.gis || {};
    const { shx, cpg, prj } = await loadShapefileSidecarFiles(options, context);
    // parse geometries
    // @ts-ignore context must be defined
    const { header, geometries } = await context.parse(arrayBuffer, shp_loader_1.SHPLoader, options); // {shp: shx}
    const geojsonGeometries = parseGeometries(geometries);
    // parse properties
    let properties = [];
    // @ts-ignore context must be defined
    const dbfResponse = await context.fetch(replaceExtension(context.url, 'dbf'));
    if (dbfResponse.ok) {
        // @ts-ignore context must be defined
        properties = await context.parse(dbfResponse, dbf_loader_1.DBFLoader, { dbf: { encoding: cpg || 'latin1' } });
    }
    let features = joinProperties(geojsonGeometries, properties);
    if (reproject) {
        features = reprojectFeatures(features, prj, _targetCrs);
    }
    return {
        encoding: cpg,
        prj,
        shx,
        header,
        data: features
    };
}
exports.parseShapefile = parseShapefile;
/**
 * Parse geometries
 *
 * @param geometries
 * @returns geometries as an array
 */
function parseGeometries(geometries) {
    const geojsonGeometries = [];
    for (const geom of geometries) {
        geojsonGeometries.push((0, gis_1.binaryToGeometry)(geom));
    }
    return geojsonGeometries;
}
/**
 * Join properties and geometries into features
 *
 * @param geometries [description]
 * @param  properties [description]
 * @return [description]
 */
function joinProperties(geometries, properties) {
    const features = [];
    for (let i = 0; i < geometries.length; i++) {
        const geometry = geometries[i];
        const feature = {
            type: 'Feature',
            geometry,
            // properties can be undefined if dbfResponse above was empty
            properties: (properties && properties[i]) || {}
        };
        features.push(feature);
    }
    return features;
}
/**
 * Reproject GeoJSON features to output CRS
 *
 * @param features parsed GeoJSON features
 * @param sourceCrs source coordinate reference system
 * @param targetCrs †arget coordinate reference system
 * @return Reprojected Features
 */
function reprojectFeatures(features, sourceCrs, targetCrs) {
    if (!sourceCrs && !targetCrs) {
        return features;
    }
    const projection = new proj4_1.Proj4Projection({ from: sourceCrs || 'WGS84', to: targetCrs || 'WGS84' });
    return (0, gis_1.transformGeoJsonCoords)(features, (coord) => projection.project(coord));
}
/**
 *
 * @param options
 * @param context
 * @returns Promise
 */
// eslint-disable-next-line max-statements
async function loadShapefileSidecarFiles(options, context) {
    // Attempt a parallel load of the small sidecar files
    // @ts-ignore context must be defined
    const { url, fetch } = context;
    const shxPromise = fetch(replaceExtension(url, 'shx'));
    const cpgPromise = fetch(replaceExtension(url, 'cpg'));
    const prjPromise = fetch(replaceExtension(url, 'prj'));
    await Promise.all([shxPromise, cpgPromise, prjPromise]);
    let shx;
    let cpg;
    let prj;
    const shxResponse = await shxPromise;
    if (shxResponse.ok) {
        const arrayBuffer = await shxResponse.arrayBuffer();
        shx = (0, parse_shx_1.parseShx)(arrayBuffer);
    }
    const cpgResponse = await cpgPromise;
    if (cpgResponse.ok) {
        cpg = await cpgResponse.text();
    }
    const prjResponse = await prjPromise;
    if (prjResponse.ok) {
        prj = await prjResponse.text();
    }
    return {
        shx,
        cpg,
        prj
    };
}
exports.loadShapefileSidecarFiles = loadShapefileSidecarFiles;
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
function replaceExtension(url, newExtension) {
    const baseName = basename(url);
    const extension = extname(url);
    const isUpperCase = extension === extension.toUpperCase();
    if (isUpperCase) {
        newExtension = newExtension.toUpperCase();
    }
    return `${baseName}.${newExtension}`;
}
exports.replaceExtension = replaceExtension;
// NOTE - this gives the entire path minus extension (i.e. NOT same as path.basename)
/**
 * @param url
 * @returns string
 */
function basename(url) {
    const extIndex = url && url.lastIndexOf('.');
    if (typeof extIndex === 'number') {
        return extIndex >= 0 ? url.substr(0, extIndex) : '';
    }
    return extIndex;
}
/**
 * @param url
 * @returns string
 */
function extname(url) {
    const extIndex = url && url.lastIndexOf('.');
    if (typeof extIndex === 'number') {
        return extIndex >= 0 ? url.substr(extIndex + 1) : '';
    }
    return extIndex;
}
