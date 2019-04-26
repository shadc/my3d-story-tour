import { length, lineString, along, point as turfPoint, nearestPointOnLine } from '@turf/turf';
import { Polyline, Point as EsriPoint } from 'esri/geometry';
import FeatureSet from 'esri/tasks/support/FeatureSet';
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import Graphic from 'esri/Graphic'

 
const MapUtils = {
  getSplit: async (routeLayer : GeoJSONLayer) => {
    const featureSet : FeatureSet = await routeLayer.queryFeatures();
    return await Math.min.apply(null, featureSet.features.map(feature => {
      const polygon = feature.geometry as Polyline;
      const line = lineString(polygon.paths[0])
      const distance = length(line, { units: 'meters' }) * 3.28084;
      const d = Math.floor(distance / 300); 
      if (d <= 5) return 5;
      return d;
    }));
  },
  getScales: (initScale : number[]) => {
    const tempScales = initScale;
    for (let i = 0; i < 19; i++) {
      const thisScale = tempScales[0];
      const scaleVal = (thisScale * ((thisScale / 100) + 1.03))
      tempScales.unshift(scaleVal);
    }
    return tempScales;
  },
  getRouteCoords:(polyline : Polyline, splits: number) => {
    //-- Interpolate Polyline and create array of points along it's route. 
    const routeCoords = [];
    const line = lineString(polyline.paths[0]);
    const routeLength = length(line, { units: 'meters' }) * 3.28084;
    for (let i = 0; i <= (routeLength / splits); i++) {
         const coord : any = along(line, (i * (splits * 0.3048)), { units: 'meters' });
         routeCoords.push([coord.geometry.coordinates[0], coord.geometry.coordinates[1]])
    }
    return routeCoords;
  },
  getGraphics: async (routeLayer : GeoJSONLayer, i : number) => {
    const query = routeLayer.createQuery();
    query.where = "OBJECTID = " + (i);
    return (await routeLayer.queryFeatures(query)).features as Graphic[];
  },

  getPicRouteIndex: async (routeCoords : [[]], route : string,  picsLayer: GeoJSONLayer) => {
    const query = picsLayer.createQuery();
    query.where = "Route = '" + route + "'";
    const featureSet : FeatureSet = await picsLayer.queryFeatures(query);
    const line = lineString(routeCoords);
    return featureSet.features.map(feature => {
      const esriPt = feature.geometry as EsriPoint;
      let turfPt = turfPoint([esriPt.longitude, esriPt.latitude]);
      let snapped = nearestPointOnLine(line, turfPt, {units: 'meters'});
      return snapped.properties.index as number;
    });
  },

  getPics: async (picsLayer: GeoJSONLayer) => {
    const featureSet : FeatureSet = await picsLayer.queryFeatures();
    return featureSet.features.map(feature => {
      return null;
    });
  }


};


export default MapUtils;