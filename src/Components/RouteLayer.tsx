import { loadModules } from "esri-loader";
import { useEffect } from "react";

interface IProps {
    view?: __esri.SceneView;
    map?: __esri.Map;
    gist: string;
    setTour: (routeLayer: __esri.GeoJSONLayer, picsLayer: __esri.GeoJSONLayer, view: __esri.SceneView, pointGraphic: __esri.Graphic) => Promise<void>;
}

const RouteLayer = (props: IProps) => {
    const { map, view, gist, setTour } = props;

    useEffect(() => {
        if (!map || !view) {
            return;
        }

        let layers: __esri.Layer[] = [];
        let annimationGraphicsLayer: __esri.GraphicsLayer | undefined;

        loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer", "esri/Graphic"]).
            then(([GeoJSONLayer, GraphicsLayer, Graphic]) => {

                // -- Create Layers
                const routeLayer = new GeoJSONLayer({
                    geometryType: "polyline",
                    renderer: {
                        symbol: {
                            color: [0, 255, 255, .75],
                            style: "solid",
                            type: "simple-line",  // autocasts as new SimpleLineSymbol()
                            width: 1,
                        },
                        type: "simple",  // autocasts as new SimpleRenderer()
                    },
                    url: gist,
                });

                const picsLayer = new GeoJSONLayer({
                    definitionExpression: "Pic is not NULL",
                    geometryType: "point",
                    // ----------  Only works with full path, due to webpack image encoding ---------------------------
                    renderer: {
                        symbol: {
                            height: "20px",
                            type: "picture-marker",  // autocasts as new SimpleMarkerSymbol()
                            url: "http://shadc.github.io/presentations/images/camera-64x64.png",
                            width: "20px",
                        },
                        type: "simple",  // autocasts as new SimpleRenderer()
                    },
                    url: gist,
                    // renderer: {
                    //     type: "simple",  // autocasts as new SimpleRenderer()
                    //     symbol: {
                    //         type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    //         size: 6,
                    //         color: [255, 0, 0, .25],
                    //         outline: {  // autocasts as new SimpleLineSymbol()
                    //             color: [255, 0, 0, 1],
                    //             width: "1px"
                    //         }
                    //     }
                    // },
                });

                const poiLayer = new GeoJSONLayer({
                    definitionExpression: "Pic is NULL",
                    geometryType: "point",
                    labelingInfo: [{
                        labelExpressionInfo: {
                            value: "{LABEL}",
                        },
                        // When using callouts on labels, "above-center" is the only allowed position
                        labelPlacement: "above-center",
                        symbol: {
                            // The callout has to have a defined type (currently only line is possible)
                            // The size, the color and the border color can be customized
                            callout: {
                                border: {
                                    color: [255, 255, 255, 0.7],
                                },
                                color: [0, 0, 0],
                                size: 0.2,
                                type: "line", // autocasts as new LineCallout3D()
                            },
                            symbolLayers: [{
                                halo: {
                                    color: [0, 0, 139, .75],
                                    size: "1px",
                                },
                                material: {
                                    color: "white",
                                },
                                size: 10,
                                type: "text", // autocasts as new TextSymbol3DLayer()
                            }],
                            type: "label-3d", // autocasts as new LabelSymbol3D()
                            // Labels need a small vertical offset that will be used by the callout
                            verticalOffset: {
                                maxWorldLength: 1000,
                                minWorldLength: 10,
                                screenLength: 50,
                            },
                        },
                    }],
                    renderer: {
                        symbol: {
                            color: [227, 139, 79, .25],
                            outline: {  // autocasts as new SimpleLineSymbol()
                                color: [227, 139, 79, 1],
                                width: "1px",
                            },
                            size: 10,
                            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        },
                        type: "simple",  // autocasts as new SimpleRenderer()
                    },
                    url: gist,
                });

                // GRAPHICS FOR ANIMATIONS
                const animationGraphicsLayer = new GraphicsLayer();
                annimationGraphicsLayer = animationGraphicsLayer;
                const currentElevationInfo: __esri.GraphicsLayerElevationInfo = {
                    mode: "relative-to-ground",
                    offset: 10,
                    unit: "feet",
                };
                animationGraphicsLayer.elevationInfo = currentElevationInfo;
                map.add(animationGraphicsLayer);

                const markerSymbol = {
                    color: [0, 255, 255, .25],
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [0, 255, 255, 1],
                        width: "1px",
                    },
                    size: 10,
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                };

                // -- Set Extent to the routeLayer.
                routeLayer.when(() => {
                    const query = routeLayer.createQuery({ where: "OBJECTID = 1" });
                    routeLayer.queryFeatures(query).then((response: __esri.FeatureSet) => {
                        const [x, y] = response.features[0].geometry.toJSON().paths[0][0];
                        const point = { type: "point", x, y };

                        const pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                        });
                        animationGraphicsLayer.add(pointGraphic);
                        setTour(routeLayer as __esri.GeoJSONLayer, picsLayer as __esri.GeoJSONLayer, view, pointGraphic);
                    });
                });

                layers = [routeLayer, picsLayer, poiLayer];
                map.addMany(layers);

            }).catch((err: any) => console.error(err));

        return function cleanup() {
            map.removeMany(layers);
            if (annimationGraphicsLayer) {
                map.remove(annimationGraphicsLayer);
            }
        };
    }, [gist, map, setTour, view]);

    return null;

};

export default RouteLayer;
