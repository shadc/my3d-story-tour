import { along, bearing, length, lineString, nearestPointOnLine, point as turfPoint } from "@turf/turf";
import { Point as EsriPoint, Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import FeatureSet from "esri/tasks/support/FeatureSet";

const MapUtils = {
    getGraphics: async (routeLayer: GeoJSONLayer, i: number) => {
        const query = routeLayer.createQuery();
        query.where = "OBJECTID = " + (i);
        return (await routeLayer.queryFeatures(query)).features as Graphic[];
    },
    getHeading: (point1: number[], point2: number[]) => {
        const b = bearing(turfPoint([point1[0], point1[1]]), turfPoint([point2[0], point2[1]]));
        return (b < 0) ? 360 + b : b;
    },
    getPicRouteIndex: async (routeCoords: [[]], route: string, picsLayer: GeoJSONLayer) => {
        const query = picsLayer.createQuery();
        query.where = "Route = '" + route + "'";
        const featureSet: FeatureSet = await picsLayer.queryFeatures(query);
        const line = lineString(routeCoords);
        return featureSet.features.map((feature) => {
            const esriPt = feature.geometry as EsriPoint;
            const turfPt = turfPoint([esriPt.longitude, esriPt.latitude]);
            const snapped = nearestPointOnLine(line, turfPt, { units: "meters" });
            return snapped.properties.index as number;
        });
    },
    getRouteCoords: (polyline: Polyline, splits: number) => {
        // Interpolate Polyline and create array of points along it's route.
        const routeCoords = [];
        const line = lineString(polyline.paths[0]);
        const routeLength = length(line, { units: "meters" }) * 3.28084;
        for (let i = 0; i <= (routeLength / splits); i++) {
            const coord: any = along(line, (i * (splits * 0.3048)), { units: "meters" });
            routeCoords.push([coord.geometry.coordinates[0], coord.geometry.coordinates[1]]);
        }
        return routeCoords;
    },
    getScales: (initScale: number[]) => {
        const tempScales = initScale;
        for (let i = 0; i < 19; i++) {
            const thisScale = tempScales[0];
            const scaleVal = (thisScale * ((thisScale / 100) + 1.03));
            tempScales.unshift(scaleVal);
        }
        return tempScales;
    },
    getSplit: async (routeLayer: GeoJSONLayer) => {
        const featureSet: FeatureSet = await routeLayer.queryFeatures();
        return Math.min.apply(null, featureSet.features.map((feature) => {
            const polygon = feature.geometry as Polyline;
            const line = lineString(polygon.paths[0]);
            const distance = length(line, { units: "meters" }) * 3.28084;
            const d = Math.floor(distance / 400);
            if (d <= 5) { return 5; }
            return d;
        }));
    },
    getUrlVars: (param: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get(param);
        if (p && p.toLowerCase() === "yes") { return "true"; }
        if (p && p.toLowerCase() === "no") { return "false"; }
        if (p) { return p; }
        return "false";
    },

};

export default MapUtils;
