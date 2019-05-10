import { Map, Scene } from "@esri/react-arcgis";
import { Extent, Polyline } from "esri/geometry";
import Graphic from "esri/Graphic";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import React, { useState } from "react";
import "./App.css";

import Basemaps from "./Components/Basemaps";
import Header from "./Components/Header";
import MapUtils from "./Components/MapUtils";
import RouteLayer from "./Components/RouteLayer";
import RoutePicture from "./Components/RoutePicture";
import Slider from "./Components/Slider";

interface ITour {
    map: any;
    routeLayer: GeoJSONLayer;
    picsLayer: GeoJSONLayer;
    splits: number;
    scales: number[];
    pointGraphic: Graphic;
    routeCoords: any;
    picIndexes: number[];
    routeNum: number;
    coordNum: number;
}

// tslint:disable-next-line: no-object-literal-type-assertion
const tour = {} as ITour;

const gist = "https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/4495bf6e4194adb1ce215c032c93c1fc8273e32a/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson";
let interval = 0;
let sliderNum = 10;
let sliderChanged = false;

const App = () => {
    const [title, setTitle] = useState();
    const [caption, setCaption] = useState("");
    const [pics, setPics] = useState([] as Graphic[]);
    const [picAction, setPicAction] = useState();

    const droneView = MapUtils.getUrlVars("droneView") === "true" ? true : false;
    const hidePhotos = MapUtils.getUrlVars("hidePhotos") === "true" ? true : false;
    const geoJson = MapUtils.getUrlVars("geoJson") === "false" ? gist : MapUtils.getUrlVars("geoJson");

    const onStartTourClick = async () => {
        tour.routeNum = 1; // 1 base;
        tour.coordNum = 0; // 0 base;
        startRoute();
    };

    const startRoute = async () => {
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

        if (droneView) {
            interval = window.setInterval(startRouteInterval, intTime(sliderNum));
        } else {
            tour.map.goTo(featGeom).then(() => {
                interval = window.setInterval(startRouteInterval, intTime(sliderNum));
            });
        }
    };

    let picIndex: number = 1;
    const startRouteInterval = () => {

        // -- Move to the next route if at the end of the interval
        if (tour.coordNum > (tour.routeCoords.length - 1)) {
            clearInterval(interval);
            tour.coordNum = 0;
            tour.routeNum++;
            setTimeout(() => { startRoute(); }, 1000);
            return;
        }

        if (sliderChanged) {
            clearInterval(interval);
            interval = window.setInterval(startRouteInterval, intTime(sliderNum));
            sliderChanged = false;
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
        if (!hidePhotos && tour.picIndexes.includes(tour.coordNum)) {
            clearInterval(interval);
            setPicAction([picIndex, "active"]);
            setTimeout(() => {
                setPicAction([picIndex, "deactive"]);
                setTimeout(() => {
                    interval = window.setInterval(startRouteInterval, intTime(sliderNum));
                    picIndex++;
                }, 1000);
            }, 4000);
        }
        tour.coordNum++;
    };

    const setTour = async (routeLayer: GeoJSONLayer, picsLayer: GeoJSONLayer, map: any, pointGraphic: Graphic) => {
        tour.routeLayer = routeLayer;
        tour.picsLayer = picsLayer;
        tour.map = map;
        tour.pointGraphic = pointGraphic;
        tour.routeNum = 1; // 1 base;
        tour.coordNum = 0; // 0 base;
        tour.scales = MapUtils.getScales([4]);
        tour.splits = await MapUtils.getSplit(routeLayer); // .then(result => tour.splits = result);

        routeLayer.queryExtent().then((response: Extent) => {
            tour.map.goTo(response.extent.expand(2), { easing: "in-out-expo" });
        });

        setPics(((await picsLayer.queryFeatures()).features as Graphic[]));
        const filename = decodeURI(decodeURI(geoJson.substring(geoJson.lastIndexOf("/") + 1)));
        setTitle(filename.substr(0, filename.lastIndexOf(".")) || filename);
    };

    const scales = [4]; // Start at 4 because it's the minimum milliseconds HTML 5 setinterval spec will go.
    for (let i = 0; i < 19; i++) {
        const ts = scales[0];
        const scaleVal = (ts * ((ts / 100) + 1.03));
        scales.unshift(scaleVal);
    }

    const intTime = (val: number) => {
        return scales[val - 1];
    };

    const sliderChange = (num: any) => {
        sliderNum = num;
        sliderChanged = true;
    };

    const loaderOptions = { url: "https://js.arcgis.com/4.11" };
    return (
        <>
            <Header caption={caption} title={title} onClick={onStartTourClick} />

            <Scene
                loaderOptions={loaderOptions}
                className="mapcontainer"
                mapProperties={{ ground: "world-elevation" }} // basemap: 'satellite',
                viewProperties={{
                    // center: [-121.6788, 44.0033],
                    zoom: 2,
                }}
            >
                <Slider handleChange={sliderChange} initSliderVal={sliderNum} />
                <RouteLayer view={Scene} map={Map} gist={geoJson} setTour={setTour} />
                <Basemaps view={Scene} map={Map} />
            </Scene>

            {<ul>
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
