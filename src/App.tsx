import { Extent, Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import ArcGISScene from "./Components/ArcGISScene";
import Basemaps from "./Components/Basemaps";
import Header from "./Components/Header";
import MapUtils from "./Components/MapUtils";
import RouteLayer from "./Components/RouteLayer";
import RoutePicture from "./Components/RoutePicture";
import Slider from "./Components/Slider";

interface ITour {
    map: __esri.SceneView;
    routeLayer: GeoJSONLayer;
    picsLayer: GeoJSONLayer;
    splits: number;
    pointGraphic: Graphic;
    routeCoords: [number, number][];
    picIndexes: number[];
    routeNum: number;
    coordNum: number;
}

const gist = "https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/4495bf6e4194adb1ce215c032c93c1fc8273e32a/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson";
const defaultSliderValue = 10;

const App = () => {
    const [title, setTitle] = useState<string>("");
    const [caption, setCaption] = useState("");
    const [pics, setPics] = useState([] as Graphic[]);
    const [picAction, setPicAction] = useState<[number, string]>([0, ""]);
    const [awaitingPhotoAdvance, setAwaitingPhotoAdvance] = useState(false);

    const tourRef = useRef<ITour>({} as ITour);
    const intervalRef = useRef<number | null>(null);
    const sliderNumRef = useRef(defaultSliderValue);
    const sliderChangedRef = useRef(false);
    const picIndexRef = useRef(1);
    const picIndexSetRef = useRef<Set<number>>(new Set());
    const timeoutRefs = useRef<number[]>([]);
    const awaitingPhotoAdvanceRef = useRef(false);

    const droneView = useMemo(() => MapUtils.getUrlVars("droneView") === "true", []);
    const hidePhotos = useMemo(() => MapUtils.getUrlVars("hidePhotos") === "true", []);
    const geoJson = useMemo(() => {
        const geoJsonParam = MapUtils.getUrlVars("geoJson");
        return geoJsonParam === "false" ? gist : geoJsonParam;
    }, []);

    const scales = useMemo(() => {
        const sliderScales = [4]; // HTML5 setInterval minimum is effectively 4ms.
        for (let i = 0; i < 19; i++) {
            const ts = sliderScales[0];
            const scaleVal = ts * ((ts / 100) + 1.03);
            sliderScales.unshift(scaleVal);
        }
        return sliderScales;
    }, []);

    const stopInterval = () => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const scheduleTimeout = (callback: () => void, delay: number) => {
        const timeoutId = window.setTimeout(() => {
            timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId);
            callback();
        }, delay);
        timeoutRefs.current.push(timeoutId);
        return timeoutId;
    };

    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach((id) => window.clearTimeout(id));
        timeoutRefs.current = [];
    };

    const intTime = (val: number) => scales[val - 1];

    useEffect(() => {
        return () => {
            stopInterval();
            clearAllTimeouts();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!awaitingPhotoAdvanceRef.current || event.code !== "Space") {
                return;
            }

            event.preventDefault();
            awaitingPhotoAdvanceRef.current = false;
            setAwaitingPhotoAdvance(false);
            setPicAction([picIndexRef.current, "deactive"]);

            scheduleTimeout(() => {
                intervalRef.current = window.setInterval(startRouteInterval, intTime(sliderNumRef.current));
                picIndexRef.current++;
            }, 1000);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    const onStartTourClick = () => {
        const tour = tourRef.current;
        if (!tour.map || !tour.routeLayer || !tour.picsLayer || !tour.pointGraphic) {
            return;
        }
        stopInterval();
        clearAllTimeouts();
        awaitingPhotoAdvanceRef.current = false;
        setAwaitingPhotoAdvance(false);
        tour.routeNum = 1; // 1 base;
        tour.coordNum = 0; // 0 base;
        picIndexRef.current = 1;
        startRoute();
    };

    const startRoute = async () => {
        const tour = tourRef.current;
        if (!tour.map || !tour.routeLayer || !tour.picsLayer || !tour.pointGraphic) {
            return;
        }

        if (tour.map.graphics) { tour.map.graphics.removeAll(); }
        tour.routeLayer.definitionExpression = "OBJECTID < " + tour.routeNum;
        const graphics = await MapUtils.getGraphics(tour.routeLayer, tour.routeNum);

        if (!graphics.length) {
            setCaption("");
            return;
        }

        const featGeom = graphics[0].geometry as Polyline;
        tour.routeCoords = MapUtils.getRouteCoords(featGeom, tour.splits);
        setCaption(graphics[0].getAttribute("Caption"));

        tour.picIndexes = await MapUtils.getPicRouteIndex(tour.routeCoords, graphics[0].getAttribute("Route"), tour.picsLayer);
        picIndexSetRef.current = new Set(tour.picIndexes);

        if (droneView) {
            stopInterval();
            intervalRef.current = window.setInterval(startRouteInterval, intTime(sliderNumRef.current));
        } else {
            const resumeRouteInterval = () => {
                stopInterval();
                intervalRef.current = window.setInterval(startRouteInterval, intTime(sliderNumRef.current));
            };

            tour.map.goTo(featGeom)
                .then(() => {
                    resumeRouteInterval();
                })
                .catch((error: { name?: string; message?: string }) => {
                    const isInterruptedTransition = error.name === "AbortError"
                        || error.name === "CancelError"
                        || /abort|cancel/i.test(error.message || "");

                    if (!isInterruptedTransition) {
                        console.error(error);
                    }

                    resumeRouteInterval();
                });
        }
    };

    const startRouteInterval = () => {
        const tour = tourRef.current;
        if (!tour.routeCoords || !tour.map || !tour.pointGraphic) {
            return;
        }

        // -- Move to the next route if at the end of the interval
        if (tour.coordNum > (tour.routeCoords.length - 1)) {
            stopInterval();
            tour.coordNum = 0;
            tour.routeNum++;
            scheduleTimeout(() => { startRoute(); }, 1000);
            return;
        }

        if (sliderChangedRef.current) {
            stopInterval();
            intervalRef.current = window.setInterval(startRouteInterval, intTime(sliderNumRef.current));
            sliderChangedRef.current = false;
        }

        // -- Move the graphic
        const [longitude, latitude] = tour.routeCoords[tour.coordNum];
        const point: any = { type: "point", longitude, latitude };
        tour.pointGraphic.geometry = point;

        // -- Create Breadcrumb
        const graphic = tour.pointGraphic.clone();
        graphic.symbol.set("size", 1);
        graphic.geometry = point;
        tour.map.graphics.add(graphic);

        if (droneView && tour.coordNum % 2 && tour.map.stationary) {
            const point1 = (tour.coordNum > 10) ? tour.routeCoords[tour.coordNum - 10] : tour.routeCoords[tour.coordNum];
            const point2 = (tour.coordNum < tour.routeCoords.length - 10) ? tour.routeCoords[tour.coordNum + 10] : tour.routeCoords[tour.coordNum];
            const heading = MapUtils.getHeading(point1, point2);

            tour.map.goTo({
                center: [longitude, latitude],
                heading,
                tilt: (tour.map.camera.tilt > 1) ? tour.map.camera.tilt : 60,
                zoom: 16,
            },
                {
                    easing: "linear", // easing function to slow down when reaching the target
                    speedFactor: .9, // animation is 10 times slower than default
                },
            );
        }

        // -- Collide with picture???
        if (!hidePhotos && picIndexSetRef.current.has(tour.coordNum)) {
            stopInterval();
            setPicAction([picIndexRef.current, "active"]);
            awaitingPhotoAdvanceRef.current = true;
            setAwaitingPhotoAdvance(true);
        }
        tour.coordNum++;
    };

    const setTour = useCallback(async (routeLayer: GeoJSONLayer, picsLayer: GeoJSONLayer, map: __esri.SceneView, pointGraphic: Graphic) => {
        const tour = tourRef.current;
        tour.routeLayer = routeLayer;
        tour.picsLayer = picsLayer;
        tour.map = map;
        tour.pointGraphic = pointGraphic;
        tour.routeNum = 1; // 1 base;
        tour.coordNum = 0; // 0 base;
        tour.splits = await MapUtils.getSplit(routeLayer); // .then(result => tour.splits = result);

        routeLayer.queryExtent().then((response: Extent) => {
            tour.map.goTo(response.extent.expand(2), { easing: "in-out-expo" });
        });

        setPics(((await picsLayer.queryFeatures()).features as Graphic[]));
        const filename = decodeURI(decodeURI(geoJson.substring(geoJson.lastIndexOf("/") + 1)));
        setTitle(filename.substr(0, filename.lastIndexOf(".")) || filename);
    }, [geoJson]);

    const sliderChange = (num: number) => {
        sliderNumRef.current = num;
        sliderChangedRef.current = true;
    };

    const loaderOptions = useMemo(() => ({ url: "https://js.arcgis.com/4.11" }), []);
    const mapProperties = useMemo(() => ({
        ground: "world-elevation",
        basemap: "satellite",
    }), []);
    const viewProperties = useMemo(() => ({ zoom: 2 }), []);

    return (
        <>
            <Header caption={caption} title={title} onClick={onStartTourClick} />

            <ArcGISScene
                loaderOptions={loaderOptions}
                className="mapcontainer"
                mapProperties={mapProperties} // basemap: 'satellite',
                viewProperties={viewProperties}
            >
                <Slider handleChange={sliderChange} initSliderVal={defaultSliderValue} />
                <RouteLayer gist={geoJson} setTour={setTour} />
                <Basemaps />
            </ArcGISScene>

            {awaitingPhotoAdvance ? <div className="photo-continue-hint">Press Space to continue the tour</div> : null}

            {<ul style={{ pointerEvents: "none", margin: 0, padding: 0, listStyle: "none" }}>
                {pics.map((pic, index) =>
                    <RoutePicture
                        key={index}
                        height={(index === 0) ? 10 + "vh" : ((85 / pics.length) * (index) + 10) + "vh"}
                        id={index + 1}
                        picAction={picAction}
                        caption={pic.getAttribute("Caption")}
                        img={"https://shadc.github.io/presentations/" + pic.getAttribute("Pic")}
                    />,
                )}
            </ul>}

        </>
    );
};

export default App;
