import { binaryToGeometry, transformGeoJsonCoords } from '@loaders.gl/gis';
import { Proj4Projection } from '@math.gl/proj4';
import { parseShx } from './parse-shx';
import { zipBatchIterators } from '../streaming/zip-batch-iterators';
import { SHPLoader } from '../../shp-loader';
import { DBFLoader } from '../../dbf-loader';
export async function* parseShapefileInBatches(asyncIterator, options, context) {
  const {
    reproject = false,
    _targetCrs = 'WGS84'
  } = (options === null || options === void 0 ? void 0 : options.gis) || {};
  const {
    shx,
    cpg,
    prj
  } = await loadShapefileSidecarFiles(options, context);
  const shapeIterable = await context.parseInBatches(asyncIterator, SHPLoader, options);
  let propertyIterable;
  const dbfResponse = await context.fetch(replaceExtension((context === null || context === void 0 ? void 0 : context.url) || '', 'dbf'));

  if (dbfResponse.ok) {
    propertyIterable = await context.parseInBatches(dbfResponse, DBFLoader, { ...options,
      dbf: {
        encoding: cpg || 'latin1'
      }
    });
  }

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
    iterator = zipBatchIterators(shapeIterable, propertyIterable);
  } else {
    iterator = shapeIterable;
  }

  for await (const item of iterator) {
    let geometries;
    let properties;

    if (!propertyIterable) {
      geometries = item;
    } else {
      [geometries, properties] = item;
    }

    const geojsonGeometries = parseGeometries(geometries);
    let features = joinProperties(geojsonGeometries, properties);

    if (reproject) {
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
export async function parseShapefile(arrayBuffer, options, context) {
  const {
    reproject = false,
    _targetCrs = 'WGS84'
  } = (options === null || options === void 0 ? void 0 : options.gis) || {};
  const {
    shx,
    cpg,
    prj
  } = await loadShapefileSidecarFiles(options, context);
  const {
    header,
    geometries
  } = await context.parse(arrayBuffer, SHPLoader, options);
  const geojsonGeometries = parseGeometries(geometries);
  let properties = [];
  const dbfResponse = await context.fetch(replaceExtension(context.url, 'dbf'));

  if (dbfResponse.ok) {
    properties = await context.parse(dbfResponse, DBFLoader, {
      dbf: {
        encoding: cpg || 'latin1'
      }
    });
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

function parseGeometries(geometries) {
  const geojsonGeometries = [];

  for (const geom of geometries) {
    geojsonGeometries.push(binaryToGeometry(geom));
  }

  return geojsonGeometries;
}

function joinProperties(geometries, properties) {
  const features = [];

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i];
    const feature = {
      type: 'Feature',
      geometry,
      properties: properties && properties[i] || {}
    };
    features.push(feature);
  }

  return features;
}

function reprojectFeatures(features, sourceCrs, targetCrs) {
  if (!sourceCrs && !targetCrs) {
    return features;
  }

  const projection = new Proj4Projection({
    from: sourceCrs || 'WGS84',
    to: targetCrs || 'WGS84'
  });
  return transformGeoJsonCoords(features, coord => projection.project(coord));
}

export async function loadShapefileSidecarFiles(options, context) {
  const {
    url,
    fetch
  } = context;
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
    shx = parseShx(arrayBuffer);
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
export function replaceExtension(url, newExtension) {
  const baseName = basename(url);
  const extension = extname(url);
  const isUpperCase = extension === extension.toUpperCase();

  if (isUpperCase) {
    newExtension = newExtension.toUpperCase();
  }

  return "".concat(baseName, ".").concat(newExtension);
}

function basename(url) {
  const extIndex = url && url.lastIndexOf('.');

  if (typeof extIndex === 'number') {
    return extIndex >= 0 ? url.substr(0, extIndex) : '';
  }

  return extIndex;
}

function extname(url) {
  const extIndex = url && url.lastIndexOf('.');

  if (typeof extIndex === 'number') {
    return extIndex >= 0 ? url.substr(extIndex + 1) : '';
  }

  return extIndex;
}
//# sourceMappingURL=parse-shapefile.js.map