import { loadModules } from "@esri/react-arcgis";
import FeatureSet from "esri/tasks/support/FeatureSet";
import { useEffect, useState } from "react";

interface IProps {
    view: any;
    map: any;
    gist: string;
    setTour: any;
}

const RouteLayer = (props: IProps) => {
    const [layers, setLayers] = useState();

    useEffect(() => {

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
                    url: props.gist,
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
                    url: props.gist,
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
                    url: props.gist,
                });

                // GRAPHICS FOR ANIMATIONS
                const annimationGraphicsLayer = new GraphicsLayer();
                const currentElevationInfo = {
                    mode: "relative-to-ground",
                    offset: 10,
                    unit: "feet",
                };
                annimationGraphicsLayer.elevationInfo = currentElevationInfo;
                props.map.add(annimationGraphicsLayer);

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
                    routeLayer.queryFeatures(query).then((response: FeatureSet) => {
                        const [x, y] = response.features[0].geometry.toJSON().paths[0][0];
                        const point = { type: "point", x, y };

                        const pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol,
                        });
                        annimationGraphicsLayer.add(pointGraphic);
                        props.setTour(routeLayer, picsLayer, props.view, pointGraphic);
                    });
                });

                setLayers([[routeLayer, picsLayer, poiLayer]]);
                props.map.addMany([routeLayer, picsLayer, poiLayer]);

            }).catch((err: any) => console.error(err));

        return function cleanup() {
            props.map.removeMany(layers);
        };
    }, []);

    return null;

};

export default RouteLayer;
