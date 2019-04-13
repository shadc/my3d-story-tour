import { useState, useEffect } from 'react';
import { loadModules } from '@esri/react-arcgis';
import { Extent } from 'esri/geometry';
import FeatureSet from 'esri/tasks/support/FeatureSet';


interface IProps{
 view: any,
 map: any,
 gist: string,
 setTour: any
}


const RouteLayer = (props : IProps) => {
    const [layers, setLayers] = useState();

    useEffect(() => {

        loadModules(["esri/layers/GeoJSONLayer", "esri/layers/GraphicsLayer", "esri/Graphic"]).
            then(([GeoJSONLayer, GraphicsLayer, Graphic]) => {

            //-- Create Layers
            const routeLayer = new GeoJSONLayer({
                url: props.gist,
                geometryType: "polyline",
                renderer: {
                    type: "simple",  // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "simple-line",  // autocasts as new SimpleLineSymbol()
                        color: [0, 255, 255, .75],
                        width: 1,
                        style: "solid"
                    }
                },
            });

            const picsLayer = new GeoJSONLayer({
                 url: props.gist,
                 geometryType: "point",
                 definitionExpression: "Pic is not NULL",
                // ----------  NOT WORKING ----------------------------------------------
                //  renderer: {
                //     type: "simple",  // autocasts as new SimpleRenderer()
                //     symbol: {
                //         type: "picture-marker",  // autocasts as new SimpleMarkerSymbol()
                //         url: "../camera-64x64.png",
                //         width: "20px",
                //         height: "20px"
                //     }
                // }
                renderer: {
                    type: "simple",  // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        size: 6,
                        color: [255, 0, 0, .25],
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: [255, 0, 0, 1],
                            width: "1px"
                        }
                    }
                },


            })

            const poiLayer = new GeoJSONLayer({
                url: props.gist,
                geometryType: "point",
                definitionExpression: "Pic is NULL",
                renderer: {
                    type: "simple",  // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        size: 10,
                        color: [227, 139, 79, .25],
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: [227, 139, 79, 1],
                            width: "1px"
                        }
                    }
                },
                labelingInfo: [{
                    // When using callouts on labels, "above-center" is the only allowed position
                    labelPlacement: "above-center",
                    labelExpressionInfo: {
                        value: "{LABEL}"
                    },
                    symbol: {
                        type: "label-3d", // autocasts as new LabelSymbol3D()
                        symbolLayers: [{
                            type: "text", // autocasts as new TextSymbol3DLayer()
                            material: {
                                color: "white"
                            },
                            halo: {
                                color: [0, 0, 139, .75],
                                size: "1px",
                            },
                            size: 10
                        }],
                        // Labels need a small vertical offset that will be used by the callout
                        verticalOffset: {
                            screenLength: 50,
                            maxWorldLength: 1000,
                            minWorldLength: 10
                        },
                        // The callout has to have a defined type (currently only line is possible)
                        // The size, the color and the border color can be customized
                        callout: {
                            type: "line", // autocasts as new LineCallout3D()
                            size: 0.2,
                            color: [0, 0, 0],
                            border: {
                                color: [255, 255, 255, 0.7]
                            }
                        }
                    }
                }]
            });


            // GRAPHICS FOR ANIMATIONS
            const annimationGraphicsLayer = new GraphicsLayer();
            const currentElevationInfo = {
                mode: "relative-to-ground",
                offset: 10,
                unit: "feet"
            };
            annimationGraphicsLayer.elevationInfo = currentElevationInfo;
            props.map.add(annimationGraphicsLayer);


            let markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [0, 255, 255, .25],
                size:10,
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [0, 255, 255, 1],
                    width: "1px"
                }
            };

            //-- Set Extent to the routeLayer.
            routeLayer.when(() => {
                 const query = routeLayer.createQuery({where : "OBJECTID = 1"});
                 routeLayer.queryFeatures(query).then((response : FeatureSet) =>{
                     const [x, y] = response.features[0].geometry.toJSON().paths[0][0];
                     const point = {type:"point", x, y}
                     
                     const pointGraphic = new Graphic({
                         geometry: point,
                         symbol: markerSymbol
                     });
                     annimationGraphicsLayer.add(pointGraphic);
                     props.setTour(routeLayer, picsLayer, props.view, pointGraphic);
                 });

                routeLayer.queryExtent().then((response : Extent) =>{
                    props.view.goTo(response.extent.expand(2))
                })
            })

            setLayers([[routeLayer, picsLayer, poiLayer]]);
            props.map.addMany([routeLayer, picsLayer, poiLayer]);

        }).catch((err) => console.error(err));

        return function cleanup() {
            props.map.removeMany(layers);
        };
    }, []);

    return null;

}

export default RouteLayer;